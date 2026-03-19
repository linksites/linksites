import type { ProfileWithLinks, ThemeName } from "@/lib/types";

export const themeCatalog: Record<
  ThemeName,
  { background: string; panel: string; text: string; muted: string; accent: string }
> = {
  "midnight-grid": {
    background: "linear-gradient(180deg, #06111f 0%, #0a1830 100%)",
    panel: "rgba(9, 20, 38, 0.84)",
    text: "#eff7ff",
    muted: "rgba(239, 247, 255, 0.68)",
    accent: "#67f7ef",
  },
  "sunset-signal": {
    background: "linear-gradient(180deg, #140c12 0%, #2b1024 100%)",
    panel: "rgba(35, 13, 29, 0.84)",
    text: "#fff6f8",
    muted: "rgba(255, 246, 248, 0.68)",
    accent: "#ff7d66",
  },
};

export const demoProfile: ProfileWithLinks = {
  id: "demo-profile",
  username: "demo",
  displayName: "Sergio Rodrigues",
  bio: "Creator page MVP for LinkSites. A premium link-in-bio page with stronger branding, direct CTAs, and room to grow into a full mini site.",
  avatarUrl: null,
  themeSlug: "midnight-grid",
  isPublished: true,
  links: [
    {
      id: "1",
      title: "Book a discovery call",
      url: "https://wa.me/5591982460001",
      position: 0,
      isActive: true,
    },
    {
      id: "2",
      title: "View a client demo",
      url: "https://linksites.github.io/linksites/",
      position: 1,
      isActive: true,
    },
    {
      id: "3",
      title: "Explore premium plans",
      url: "https://linksites.github.io/linksites/#planos",
      position: 2,
      isActive: true,
    },
  ],
};
