export type ThemeName = "midnight-grid" | "sunset-signal";

export type DiscoveryReason = "following" | "trending" | "link_rich" | "complete" | "new";
export type FriendshipStatus = "none" | "request_sent" | "request_received" | "friends";

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
};

export type ProfileRecord = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  themeSlug: ThemeName;
  isPublished: boolean;
};

export type ProfileWithLinks = ProfileRecord & {
  links: LinkItem[];
};

export type PublicDirectoryProfile = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  themeSlug: ThemeName;
  createdAt: string;
  activeLinksCount: number;
  followersCount: number;
  isFollowing: boolean;
  isFriend: boolean;
  friendshipStatus: FriendshipStatus;
  discoveryReason: DiscoveryReason;
  discoveryScore: number;
};

export type SocialNotificationType = "new_follower" | "post_like" | "new_comment";

export type SocialNotification = {
  id: string;
  type: SocialNotificationType;
  read: boolean;
  createdAt: string;
  entityId: string | null;
  sender: PublicDirectoryProfile | null;
};

export type NetworkActivityType = "new_follower" | "post_like" | "new_comment" | "new_profile";

export type NetworkActivityItem = {
  id: string;
  type: NetworkActivityType;
  createdAt: string;
  profile: PublicDirectoryProfile | null;
  read?: boolean;
  source?: "following" | "recommended";
};

export type SocialPost = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PublicDirectoryProfile | null;
  reactionCount: number;
  commentCount: number;
  savedCount: number;
  viewerHasReacted: boolean;
  viewerHasSaved: boolean;
  comments: SocialComment[];
};

export type SocialCommentStatus = "pending" | "approved" | "rejected";

export type SocialComment = {
  id: string;
  content: string;
  status: SocialCommentStatus;
  createdAt: string;
  author: PublicDirectoryProfile | null;
};

export type PendingCommentItem = {
  id: string;
  content: string;
  status: SocialCommentStatus;
  createdAt: string;
  author: PublicDirectoryProfile | null;
  postId: string;
  postContentPreview: string;
};

export type FriendRequestItem = {
  id: string;
  createdAt: string;
  sender: PublicDirectoryProfile | null;
};

export type DirectConversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  otherParticipant: PublicDirectoryProfile | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
};

export type DirectMessage = {
  id: string;
  content: string;
  createdAt: string;
  isOwnMessage: boolean;
  sender: PublicDirectoryProfile | null;
};

export type DirectConversationOpenFailureReason =
  | "not_friends"
  | "room_create_failed";

export type DirectConversationOpenResult =
  | {
      ok: true;
      roomId: string;
    }
  | {
      ok: false;
      reason: DirectConversationOpenFailureReason;
      debugMessage?: string;
    };
