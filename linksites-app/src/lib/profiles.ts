import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DiscoveryReason, FriendshipStatus, ProfileWithLinks, PublicDirectoryProfile } from "@/lib/types";

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

type NetworkProfileRow = ProfileRow & {
  created_at: string;
  followers_count?: number | null;
};

function resolveDiscoveryReason({
  bio,
  avatarUrl,
  activeLinksCount,
  followersCount,
  isFollowing,
}: {
  bio: string;
  avatarUrl: string | null;
  activeLinksCount: number;
  followersCount: number;
  isFollowing: boolean;
}): DiscoveryReason {
  if (isFollowing) {
    return "following";
  }

  if (followersCount >= 10) {
    return "trending";
  }

  if (activeLinksCount >= 5) {
    return "link_rich";
  }

  if (avatarUrl || bio.trim().length >= 48) {
    return "complete";
  }

  return "new";
}

function resolveDiscoveryScore({
  bio,
  avatarUrl,
  activeLinksCount,
  followersCount,
  isFollowing,
}: {
  bio: string;
  avatarUrl: string | null;
  activeLinksCount: number;
  followersCount: number;
  isFollowing: boolean;
}) {
  let score = 0;

  score += Math.min(activeLinksCount, 6) * 5;
  score += Math.min(followersCount, 20) * 2;

  if (bio.trim().length >= 48) {
    score += 14;
  } else if (bio.trim().length >= 24) {
    score += 8;
  }

  if (avatarUrl) {
    score += 10;
  }

  if (isFollowing) {
    score += 12;
  }

  return score;
}

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
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("followers_count")
    .eq("id", profileId)
    .maybeSingle();

  if (!error && profile) {
    return profile.followers_count ?? 0;
  }

  const { count, error: fallbackError } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", profileId);

  if (fallbackError || typeof count !== "number") {
    return 0;
  }

  return count;
});

export async function getNetworkProfiles({
  viewerProfileId,
  excludeProfileId,
  limit = 6,
  scope = "all",
}: {
  viewerProfileId?: string;
  excludeProfileId?: string;
  limit?: number;
  scope?: "all" | "following" | "recommended";
}): Promise<PublicDirectoryProfile[]> {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const candidateLimit = Math.max(limit * 8, 32);
    const { data: followingRows } = viewerProfileId
      ? await supabase
          .from("follows")
          .select("followed_id")
          .eq("follower_id", viewerProfileId)
      : { data: null };
    const followingProfileIds = new Set((followingRows ?? []).map((follow) => follow.followed_id));
    const { data: friendshipRows } = viewerProfileId
      ? await supabase
          .from("friendships")
          .select("user_one_id, user_two_id")
          .or(`user_one_id.eq.${viewerProfileId},user_two_id.eq.${viewerProfileId}`)
      : { data: null };
    const { data: sentRequestRows } = viewerProfileId
      ? await supabase
          .from("friend_requests")
          .select("recipient_id")
          .eq("sender_id", viewerProfileId)
          .eq("status", "pending")
      : { data: null };
    const { data: receivedRequestRows } = viewerProfileId
      ? await supabase
          .from("friend_requests")
          .select("sender_id")
          .eq("recipient_id", viewerProfileId)
          .eq("status", "pending")
      : { data: null };
    const friendProfileIds = new Set<string>();
    const sentFriendRequestIds = new Set((sentRequestRows ?? []).map((request) => request.recipient_id));
    const receivedFriendRequestIds = new Set((receivedRequestRows ?? []).map((request) => request.sender_id));

    (friendshipRows ?? []).forEach((friendship) => {
      const friendId = friendship.user_one_id === viewerProfileId ? friendship.user_two_id : friendship.user_one_id;

      if (friendId) {
        friendProfileIds.add(friendId);
      }
    });

    if (scope === "following" && !followingProfileIds.size) {
      return [];
    }

    let query = supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme_slug, is_published, created_at, followers_count")
      .eq("is_published", true)
      .order("username", { ascending: true })
      .limit(scope === "following" ? Math.max(limit, followingProfileIds.size) : candidateLimit);

    if (scope === "following") {
      query = query.in("id", [...followingProfileIds]);
    } else if (excludeProfileId) {
      query = query.neq("id", excludeProfileId);
    }

    const initialResponse = await query;
    let profiles = (initialResponse.data ?? null) as NetworkProfileRow[] | null;
    let error = initialResponse.error;
    let useStoredFollowersCount = true;

    if (error) {
      useStoredFollowersCount = false;

      let fallbackQuery = supabase
        .from("profiles")
        .select("id, username, display_name, bio, avatar_url, theme_slug, is_published, created_at")
        .eq("is_published", true)
        .order("username", { ascending: true })
        .limit(scope === "following" ? Math.max(limit, followingProfileIds.size) : candidateLimit);

      if (scope === "following") {
        fallbackQuery = fallbackQuery.in("id", [...followingProfileIds]);
      } else if (excludeProfileId) {
        fallbackQuery = fallbackQuery.neq("id", excludeProfileId);
      }

      const fallbackResponse = await fallbackQuery;
      profiles = (fallbackResponse.data ?? null) as NetworkProfileRow[] | null;
      error = fallbackResponse.error;
    }

    if (error || !profiles?.length) {
      return [];
    }

    const profileIds = profiles.map((profile) => profile.id);
    const { data: links } = await supabase
      .from("links")
      .select("profile_id")
      .in("profile_id", profileIds)
      .eq("is_active", true);

    const linksCountByProfileId = new Map<string, number>();
    const followersCountByProfileId = new Map<string, number>();

    (links ?? []).forEach((link) => {
      linksCountByProfileId.set(link.profile_id, (linksCountByProfileId.get(link.profile_id) ?? 0) + 1);
    });

    if (!useStoredFollowersCount) {
      const { data: follows } = await supabase
        .from("follows")
        .select("followed_id")
        .in("followed_id", profileIds);

      (follows ?? []).forEach((follow) => {
        followersCountByProfileId.set(
          follow.followed_id,
          (followersCountByProfileId.get(follow.followed_id) ?? 0) + 1,
        );
      });
    }

    return (profiles as NetworkProfileRow[])
      .map((profile) => {
        const activeLinksCount = linksCountByProfileId.get(profile.id) ?? 0;
        const followersCount = useStoredFollowersCount
          ? profile.followers_count ?? 0
          : followersCountByProfileId.get(profile.id) ?? 0;
        const isFollowing = followingProfileIds.has(profile.id);
        const isFriend = friendProfileIds.has(profile.id);
        let friendshipStatus: FriendshipStatus = "none";

        if (isFriend) {
          friendshipStatus = "friends";
        } else if (receivedFriendRequestIds.has(profile.id)) {
          friendshipStatus = "request_received";
        } else if (sentFriendRequestIds.has(profile.id)) {
          friendshipStatus = "request_sent";
        }
        const discoveryReason = resolveDiscoveryReason({
          bio: profile.bio,
          avatarUrl: profile.avatar_url,
          activeLinksCount,
          followersCount,
          isFollowing,
        });
        const discoveryScore = resolveDiscoveryScore({
          bio: profile.bio,
          avatarUrl: profile.avatar_url,
          activeLinksCount,
          followersCount,
          isFollowing,
        });

        return {
          id: profile.id,
          username: profile.username,
          displayName: profile.display_name,
          bio: profile.bio,
          avatarUrl: profile.avatar_url,
          themeSlug: profile.theme_slug,
          createdAt: profile.created_at,
          activeLinksCount,
          followersCount,
          isFollowing,
          isFriend,
          friendshipStatus,
          discoveryReason,
          discoveryScore,
        };
      })
      .sort((left, right) => {
        if (right.discoveryScore !== left.discoveryScore) {
          return right.discoveryScore - left.discoveryScore;
        }

        if (right.followersCount !== left.followersCount) {
          return right.followersCount - left.followersCount;
        }

        return left.username.localeCompare(right.username);
      })
      .filter((profile) => {
        if (scope === "recommended") {
          return !profile.isFollowing;
        }

        if (scope === "following") {
          return profile.isFollowing;
        }

        return true;
      })
      .slice(0, limit);
}
