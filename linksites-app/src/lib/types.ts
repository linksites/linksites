export type ThemeName = "midnight-grid" | "sunset-signal";

export type DiscoveryReason = "following" | "trending" | "link_rich" | "complete" | "new";

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
  discoveryReason: DiscoveryReason;
  discoveryScore: number;
};

export type SocialNotificationType = "new_follower";

export type SocialNotification = {
  id: string;
  type: SocialNotificationType;
  read: boolean;
  createdAt: string;
  sender: PublicDirectoryProfile | null;
};

export type NetworkActivityType = "new_follower" | "new_profile";

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
  viewerHasReacted: boolean;
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
