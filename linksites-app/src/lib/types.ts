export type ThemeName = "midnight-grid" | "sunset-signal";

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
