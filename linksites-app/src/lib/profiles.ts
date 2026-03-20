import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileWithLinks, PublicDirectoryProfile } from "@/lib/types";

type ProfileRow = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  theme_slug: ProfileWithLinks["themeSlug"];
  is_published: boolean;
};

type LinkRow = {
  id: string;
  title: string;
  url: string;
  position: number;
  is_active: boolean;
};

function mapProfile(profile: ProfileRow, links: LinkRow[], options?: { onlyActive?: boolean }): ProfileWithLinks {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    themeSlug: profile.theme_slug,
    isPublished: profile.is_published,
    links: links
      .filter((link) => (options?.onlyActive ? link.is_active : true))
      .sort((left, right) => left.position - right.position)
      .map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        position: link.position,
        isActive: link.is_active,
      })),
  };
}

export function normalizeUsernameInput(value: string) {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalized) {
    return "creator";
  }

  if (normalized.length >= 3) {
    return normalized.slice(0, 32).replace(/-+$/g, "") || "creator";
  }

  return `${normalized}${"creator".slice(0, 3 - normalized.length)}`;
}

function buildDisplayName(user: User) {
  const metadataName =
    typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null;

  if (metadataName?.trim()) {
    return metadataName.trim();
  }

  const emailName = user.email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();

  if (emailName) {
    return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "New creator";
}

export async function ensureProfileForUser(user: User): Promise<ProfileWithLinks | null> {
  if (!hasSupabaseEnv()) {
    return demoProfile;
  }

  const existingProfile = await getProfileByUserId(user.id);

  if (existingProfile) {
    return existingProfile;
  }

  const supabase = await createSupabaseServerClient();
  const baseUsername = normalizeUsernameInput(
    user.user_metadata?.username ||
      user.user_metadata?.user_name ||
      user.email?.split("@")[0] ||
      user.id.slice(0, 8),
  );
  const displayName = buildDisplayName(user);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const suffix = attempt === 0 ? "" : `-${attempt + 1}`;
    const candidateUsername = `${baseUsername.slice(0, 32 - suffix.length)}${suffix}`;
    const { error } = await supabase.from("profiles").insert({
      user_id: user.id,
      username: candidateUsername,
      display_name: displayName,
      bio: "",
    });

    if (!error) {
      return getProfileByUserId(user.id);
    }

    if (error.code === "23505") {
      const profileAfterConflict = await getProfileByUserId(user.id);

      if (profileAfterConflict) {
        return profileAfterConflict;
      }

      continue;
    }

    return null;
  }

  return getProfileByUserId(user.id);
}

export const getProfileByUserId = cache(async (userId: string): Promise<ProfileWithLinks | null> => {
  if (!hasSupabaseEnv()) {
    return demoProfile;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme_slug, is_published")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, url, position, is_active")
    .eq("profile_id", profile.id)
    .order("position", { ascending: true });

  if (linksError) {
    return mapProfile(profile as ProfileRow, []);
  }

  return mapProfile(profile as ProfileRow, (links ?? []) as LinkRow[]);
});

export const getPublicProfileByUsername = cache(async (username: string): Promise<ProfileWithLinks | null> => {
  if (!hasSupabaseEnv()) {
    return username === demoProfile.username ? demoProfile : null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme_slug, is_published")
    .eq("username", username)
    .eq("is_published", true)
    .maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, title, url, position, is_active")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (linksError) {
    return mapProfile(profile as ProfileRow, [], { onlyActive: true });
  }

  return mapProfile(profile as ProfileRow, (links ?? []) as LinkRow[], { onlyActive: true });
});

export const getFollowerCountByProfileId = cache(async (profileId: string): Promise<number> => {
  if (!hasSupabaseEnv()) {
    return 0;
  }

  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", profileId);

  if (error || typeof count !== "number") {
    return 0;
  }

  return count;
});

export const getNetworkProfiles = cache(
  async (excludeProfileId?: string, limit = 6): Promise<PublicDirectoryProfile[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme_slug, is_published")
      .eq("is_published", true)
      .order("username", { ascending: true })
      .limit(limit);

    if (excludeProfileId) {
      query = query.neq("id", excludeProfileId);
    }

    const { data: profiles, error } = await query;

    if (error || !profiles?.length) {
      return [];
    }

    const profileIds = profiles.map((profile) => profile.id);
    const [{ data: links }, { data: follows }] = await Promise.all([
      supabase
        .from("links")
        .select("profile_id")
        .in("profile_id", profileIds)
        .eq("is_active", true),
      supabase.from("follows").select("followed_id").in("followed_id", profileIds),
    ]);

    const linksCountByProfileId = new Map<string, number>();
    const followersCountByProfileId = new Map<string, number>();

    (links ?? []).forEach((link) => {
      linksCountByProfileId.set(link.profile_id, (linksCountByProfileId.get(link.profile_id) ?? 0) + 1);
    });

    (follows ?? []).forEach((follow) => {
      followersCountByProfileId.set(
        follow.followed_id,
        (followersCountByProfileId.get(follow.followed_id) ?? 0) + 1,
      );
    });

    return profiles.map((profile) => ({
      id: profile.id,
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      avatarUrl: profile.avatar_url,
      themeSlug: profile.theme_slug,
      activeLinksCount: linksCountByProfileId.get(profile.id) ?? 0,
      followersCount: followersCountByProfileId.get(profile.id) ?? 0,
    }));
  },
);
