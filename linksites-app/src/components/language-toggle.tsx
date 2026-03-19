"use client";

import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";
import { LOCALE_STORAGE_KEY } from "@/lib/locale";

type LanguageToggleProps = {
  locale: AppLocale;
  label: string;
  locales: Array<{
    value: AppLocale;
    label: string;
  }>;
};

export function LanguageToggle({ locale, label, locales }: LanguageToggleProps) {
  const router = useRouter();

  function handleChange(nextLocale: AppLocale) {
    document.cookie = `${LOCALE_STORAGE_KEY}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // Ignore local storage issues and keep the cookie as source of truth.
    }

    router.refresh();
  }

  return (
    <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60">
      <span>{label}</span>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value as AppLocale)}
        className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-white outline-none"
        aria-label={label}
      >
        {locales.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
