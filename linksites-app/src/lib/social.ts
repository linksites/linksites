import { cache } from "react";
import { getNetworkProfiles } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DiscoveryReason,
  NetworkActivityItem,
  PendingCommentItem,
  ProfileWithLinks,
  PublicDirectoryProfile,
  SocialComment,
  SocialNotification,
  SocialPost,
} from "@/lib/types";

type SocialProfileRow = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  theme_slug: ProfileWithLinks["themeSlug"];
  created_at: string;
  followers_count?: number | null;
};

type NotificationRow = {
  id: string;
  sender_id: string | null;
  type: "new_follower";
  read: boolean;
  created_at: string;
};

type PostRow = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type ReactionRow = {
  post_id: string;
  user_id: string;
  type: string;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
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

async function hydrateDirectoryProfilesByIds({
  profileIds,
  viewerProfileId,
}: {
  profileIds: string[];
  viewerProfileId?: string;
}): Promise<PublicDirectoryProfile[]> {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const uniqueProfileIds = [...new Set(profileIds.filter(Boolean))];

  if (!uniqueProfileIds.length) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const initialResponse = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, theme_slug, created_at, followers_count")
    .in("id", uniqueProfileIds);

  let profiles = (initialResponse.data ?? null) as SocialProfileRow[] | null;
  let error = initialResponse.error;
  let useStoredFollowersCount = true;

  if (error) {
    useStoredFollowersCount = false;

    const fallbackResponse = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, theme_slug, created_at")
      .in("id", uniqueProfileIds);

    profiles = (fallbackResponse.data ?? null) as SocialProfileRow[] | null;
    error = fallbackResponse.error;
  }

  if (error || !profiles?.length) {
    return [];
  }

  const { data: links } = await supabase
    .from("links")
    .select("profile_id")
    .in("profile_id", uniqueProfileIds)
    .eq("is_active", true);

  const linksCountByProfileId = new Map<string, number>();
  const followersCountByProfileId = new Map<string, number>();
  const isFollowingByProfileId = new Set<string>();

  (links ?? []).forEach((link) => {
    linksCountByProfileId.set(link.profile_id, (linksCountByProfileId.get(link.profile_id) ?? 0) + 1);
  });

  if (!useStoredFollowersCount) {
    const { data: follows } = await supabase
      .from("follows")
      .select("followed_id")
      .in("followed_id", uniqueProfileIds);

    (follows ?? []).forEach((follow) => {
      followersCountByProfileId.set(
        follow.followed_id,
        (followersCountByProfileId.get(follow.followed_id) ?? 0) + 1,
      );
    });
  }

  if (viewerProfileId) {
    const { data: followingRows } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", viewerProfileId)
      .in("followed_id", uniqueProfileIds);

    (followingRows ?? []).forEach((follow) => {
      isFollowingByProfileId.add(follow.followed_id);
    });
  }

  return profiles
    .map((profile) => {
      const activeLinksCount = linksCountByProfileId.get(profile.id) ?? 0;
      const followersCount = useStoredFollowersCount
        ? profile.followers_count ?? 0
        : followersCountByProfileId.get(profile.id) ?? 0;
      const isFollowing = isFollowingByProfileId.has(profile.id);
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
        discoveryReason,
        discoveryScore,
      };
    })
    .sort((left, right) => {
      if (right.followersCount !== left.followersCount) {
        return right.followersCount - left.followersCount;
      }

      if (right.activeLinksCount !== left.activeLinksCount) {
        return right.activeLinksCount - left.activeLinksCount;
      }

      return left.username.localeCompare(right.username);
    });
}

async function enrichPosts({
  posts,
  viewerProfileId,
}: {
  posts: PostRow[];
  viewerProfileId?: string;
}): Promise<SocialPost[]> {
  if (!hasSupabaseEnv() || !posts.length) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const postIds = posts.map((post) => post.id);
  const authorIds = posts.map((post) => post.user_id);
  const [authors, reactionsResponse, commentsResponse] = await Promise.all([
    hydrateDirectoryProfilesByIds({
      profileIds: authorIds,
      viewerProfileId,
    }),
    supabase.from("reactions").select("post_id, user_id, type").in("post_id", postIds).eq("type", "like"),
    supabase
      .from("comments")
      .select("id, post_id, user_id, content, status, created_at")
      .in("post_id", postIds)
      .eq("status", "approved")
      .order("created_at", { ascending: false }),
  ]);

  const authorsById = new Map(authors.map((profile) => [profile.id, profile]));
  const reactions = (reactionsResponse.data ?? []) as ReactionRow[];
  const comments = (commentsResponse.data ?? []) as CommentRow[];
  const reactionCountByPostId = new Map<string, number>();
  const viewerReactedPostIds = new Set<string>();
  const commentCountByPostId = new Map<string, number>();
  const approvedCommentsByPostId = new Map<string, CommentRow[]>();
  const commentAuthors = await hydrateDirectoryProfilesByIds({
    profileIds: comments.map((comment) => comment.user_id),
    viewerProfileId,
  });
  const commentAuthorsById = new Map(commentAuthors.map((profile) => [profile.id, profile]));

  reactions.forEach((reaction) => {
    reactionCountByPostId.set(reaction.post_id, (reactionCountByPostId.get(reaction.post_id) ?? 0) + 1);

    if (viewerProfileId && reaction.user_id === viewerProfileId) {
      viewerReactedPostIds.add(reaction.post_id);
    }
  });

  comments.forEach((comment) => {
    commentCountByPostId.set(comment.post_id, (commentCountByPostId.get(comment.post_id) ?? 0) + 1);
    approvedCommentsByPostId.set(comment.post_id, [...(approvedCommentsByPostId.get(comment.post_id) ?? []), comment]);
  });

  return posts.map((post) => {
    const postComments: SocialComment[] = (approvedCommentsByPostId.get(post.id) ?? []).slice(0, 3).map((comment) => ({
      id: comment.id,
      content: comment.content,
      status: comment.status,
      createdAt: comment.created_at,
      author: commentAuthorsById.get(comment.user_id) ?? null,
    }));

    return {
      id: post.id,
      content: post.content,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: authorsById.get(post.user_id) ?? null,
      reactionCount: reactionCountByPostId.get(post.id) ?? 0,
      commentCount: commentCountByPostId.get(post.id) ?? 0,
      viewerHasReacted: viewerReactedPostIds.has(post.id),
      comments: postComments,
    };
  });
}

export const getSocialConnections = cache(
  async ({
    profileId,
    viewerProfileId,
    kind,
    limit = 6,
  }: {
    profileId: string;
    viewerProfileId?: string;
    kind: "followers" | "following";
    limit?: number;
  }): Promise<PublicDirectoryProfile[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    let relatedProfileIds: string[] = [];

    if (kind === "followers") {
      const { data: followRows, error } = await supabase
        .from("follows")
        .select("follower_id")
        .eq("followed_id", profileId);

      if (error || !followRows?.length) {
        return [];
      }

      relatedProfileIds = followRows.map((follow) => follow.follower_id);
    } else {
      const { data: followRows, error } = await supabase
        .from("follows")
        .select("followed_id")
        .eq("follower_id", profileId);

      if (error || !followRows?.length) {
        return [];
      }

      relatedProfileIds = followRows.map((follow) => follow.followed_id);
    }

    const profiles = await hydrateDirectoryProfilesByIds({
      profileIds: relatedProfileIds,
      viewerProfileId,
    });

    return profiles.slice(0, limit);
  },
);

export const getNotifications = cache(
  async ({
    profileId,
    viewerProfileId,
    limit = 8,
  }: {
    profileId: string;
    viewerProfileId?: string;
    limit?: number;
  }): Promise<SocialNotification[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data: rows, error } = await supabase
      .from("notifications")
      .select("id, sender_id, type, read, created_at")
      .eq("recipient_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !rows?.length) {
      return [];
    }

    const senderIds = rows
      .map((row) => row.sender_id)
      .filter((senderId): senderId is string => Boolean(senderId));
    const senders = await hydrateDirectoryProfilesByIds({
      profileIds: senderIds,
      viewerProfileId,
    });
    const sendersById = new Map(senders.map((profile) => [profile.id, profile]));

    return (rows as NotificationRow[]).map((notification) => ({
      id: notification.id,
      type: notification.type,
      read: notification.read,
      createdAt: notification.created_at,
      sender: notification.sender_id ? sendersById.get(notification.sender_id) ?? null : null,
    }));
  },
);

export const getUnreadNotificationsCount = cache(async (profileId: string): Promise<number> => {
  if (!hasSupabaseEnv()) {
    return 0;
  }

  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", profileId)
    .eq("read", false);

  if (error || typeof count !== "number") {
    return 0;
  }

  return count;
});

export const getProfilePosts = cache(
  async ({
    profileId,
    viewerProfileId,
    limit = 8,
  }: {
    profileId: string;
    viewerProfileId?: string;
    limit?: number;
  }): Promise<SocialPost[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data: rows, error } = await supabase
      .from("posts")
      .select("id, user_id, content, created_at, updated_at")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !rows?.length) {
      return [];
    }

    return enrichPosts({
      posts: rows as PostRow[],
      viewerProfileId,
    });
  },
);

export const getFollowingPostsFeed = cache(
  async ({
    profileId,
    viewerProfileId,
    limit = 12,
  }: {
    profileId: string;
    viewerProfileId?: string;
    limit?: number;
  }): Promise<SocialPost[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data: followRows, error: followsError } = await supabase
      .from("follows")
      .select("followed_id")
      .eq("follower_id", profileId);

    if (followsError || !followRows?.length) {
      return [];
    }

    const followedIds = followRows.map((follow) => follow.followed_id);
    const { data: rows, error } = await supabase
      .from("posts")
      .select("id, user_id, content, created_at, updated_at")
      .in("user_id", followedIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !rows?.length) {
      return [];
    }

    return (await enrichPosts({
      posts: rows as PostRow[],
      viewerProfileId,
    })).filter((post) => post.author);
  },
);

export const getPendingCommentsForProfile = cache(
  async ({
    profileId,
    viewerProfileId,
    limit = 12,
  }: {
    profileId: string;
    viewerProfileId?: string;
    limit?: number;
  }): Promise<PendingCommentItem[]> => {
    if (!hasSupabaseEnv()) {
      return [];
    }

    const supabase = await createSupabaseServerClient();
    const { data: postRows, error: postsError } = await supabase
      .from("posts")
      .select("id, content")
      .eq("user_id", profileId);

    if (postsError || !postRows?.length) {
      return [];
    }

    const postIds = postRows.map((post) => post.id);
    const postPreviewById = new Map(
      postRows.map((post) => [post.id, post.content.length > 96 ? `${post.content.slice(0, 96)}...` : post.content]),
    );
    const { data: commentRows, error } = await supabase
      .from("comments")
      .select("id, post_id, user_id, content, status, created_at")
      .in("post_id", postIds)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !commentRows?.length) {
      return [];
    }

    const authors = await hydrateDirectoryProfilesByIds({
      profileIds: commentRows.map((comment) => comment.user_id),
      viewerProfileId,
    });
    const authorsById = new Map(authors.map((profile) => [profile.id, profile]));

    return (commentRows as CommentRow[]).map((comment) => ({
      id: comment.id,
      content: comment.content,
      status: comment.status,
      createdAt: comment.created_at,
      author: authorsById.get(comment.user_id) ?? null,
      postId: comment.post_id,
      postContentPreview: postPreviewById.get(comment.post_id) ?? "",
    }));
  },
);

export const getNetworkActivity = cache(
  async ({
    profileId,
    viewerProfileId,
    limit = 8,
  }: {
    profileId: string;
    viewerProfileId?: string;
    limit?: number;
  }): Promise<NetworkActivityItem[]> => {
    const [notifications, followingProfiles, recommendedProfiles] = await Promise.all([
      getNotifications({ profileId, viewerProfileId, limit }),
      getSocialConnections({ profileId, viewerProfileId, kind: "following", limit }),
      getNetworkProfiles({
        viewerProfileId,
        excludeProfileId: profileId,
        limit,
        scope: "recommended",
      }),
    ]);

    return [
      ...notifications.map((notification) => ({
        id: `notification-${notification.id}`,
        type: "new_follower" as const,
        createdAt: notification.createdAt,
        profile: notification.sender,
        read: notification.read,
      })),
      ...followingProfiles.map((profile) => ({
        id: `following-profile-${profile.id}`,
        type: "new_profile" as const,
        createdAt: profile.createdAt,
        profile,
        source: "following" as const,
      })),
      ...recommendedProfiles.map((profile) => ({
        id: `recommended-profile-${profile.id}`,
        type: "new_profile" as const,
        createdAt: profile.createdAt,
        profile,
        source: "recommended" as const,
      })),
    ]
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  },
);
