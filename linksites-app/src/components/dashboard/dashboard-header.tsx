import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import type { AppLocale } from "@/lib/locale";
import type { DashboardCopy, SharedCopy } from "@/components/dashboard/dashboard-types";

type DashboardHeaderProps = {
  locale: AppLocale;
  sharedContent: SharedCopy;
  dashboardEyebrow: DashboardCopy["eyebrow"];
  dashboardTitle: string;
  dashboardDescription: DashboardCopy["description"];
};

export function DashboardHeader({
  locale,
  sharedContent,
  dashboardEyebrow,
  dashboardTitle,
  dashboardDescription,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-rise flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">{dashboardEyebrow}</p>
        <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
          {dashboardTitle}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">{dashboardDescription}</p>
      </div>

      <div className="flex items-center gap-3">
        <LanguageToggle
          locale={locale}
          label={sharedContent.languageLabel}
          locales={sharedContent.locales}
        />
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
        >
          {sharedContent.backHome}
        </Link>
        <form action="/auth/signout" method="post">
          <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px">
            {sharedContent.signOut}
          </button>
        </form>
      </div>
    </header>
  );
}
