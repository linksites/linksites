export type AppLocale = "ptBR" | "en";

export const LOCALE_STORAGE_KEY = "linksites-locale";

export function normalizeLocale(value?: string | null): AppLocale {
  return value === "en" ? "en" : "ptBR";
}
