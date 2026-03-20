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
  username: "linksitesapp",
  displayName: "LinkSites App",
  bio: "Perfil oficial da LinkSites App para apresentar a plataforma, direcionar contatos e mostrar como uma árvore de links profissional pode vender melhor a marca.",
  avatarUrl: null,
  themeSlug: "midnight-grid",
  isPublished: true,
  links: [
    {
      id: "1",
      title: "Falar no WhatsApp",
      url: "https://wa.me/5591982460001",
      position: 0,
      isActive: true,
    },
    {
      id: "2",
      title: "Ver landing oficial",
      url: "https://linksites.github.io/linksites/",
      position: 1,
      isActive: true,
    },
    {
      id: "3",
      title: "Conhecer os planos",
      url: "https://linksites.github.io/linksites/#planos",
      position: 2,
      isActive: true,
    },
  ],
};
