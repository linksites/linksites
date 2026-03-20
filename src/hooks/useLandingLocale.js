import { useEffect, useState } from "react";

const LOCALE_STORAGE_KEY = "linksites-locale";

function readStoredLocale() {
  try {
    return window.localStorage.getItem(LOCALE_STORAGE_KEY) ?? "ptBR";
  } catch {
    return "ptBR";
  }
}

export function useLandingLocale() {
  const [locale, setLocale] = useState(() => readStoredLocale());

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore storage issues and keep the selected locale in memory.
    }
  }, [locale]);

  return [locale, setLocale];
}
