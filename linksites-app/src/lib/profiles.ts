import { cache } from "react";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProfileWithLinks } from "@/lib/types";

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

function mapProfile(profile: ProfileRow, links: LinkRow[]): ProfileWithLinks {
  return {
    id: profile.id,
    username: profile.username,
    displayName: profile.display_name,
    bio: profile.bio,
    avatarUrl: profile.avatar_url,
    themeSlug: profile.theme_slug,
    isPublished: profile.is_published,
    links: links
      .filter((link) => link.is_active)
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
    return mapProfile(profile as ProfileRow, []);
  }

  return mapProfile(profile as ProfileRow, (links ?? []) as LinkRow[]);
});
