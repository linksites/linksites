import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";

export default async function NotFound() {
  const locale = await getServerLocale();
  const content = appContent[locale];

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[2rem] border border-white/8 bg-[var(--panel)] p-8 text-center">
        <div className="mb-6 flex justify-end">
          <LanguageToggle
            locale={locale}
            label={content.shared.languageLabel}
            locales={content.shared.locales}
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">404</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
          {content.notFound.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/64">{content.notFound.description}</p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950"
        >
          {content.notFound.cta}
        </Link>
      </div>
    </div>
  );
}
