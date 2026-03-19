import Link from "next/link";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfilePreview } from "@/components/profile-preview";
import { SectionHeading } from "@/components/section-heading";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentViewer } from "@/lib/viewer";

export default async function Home() {
  const envReady = hasSupabaseEnv();
  const locale = await getServerLocale();
  const content = appContent[locale];
  const viewer = await getCurrentViewer();

  return (
    <div className="page-shell">
      <main className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/8 pb-5">
          <div>
            <div className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-white">
              Link<span className="text-[var(--accent)]">Sites</span> App
            </div>
            <p className="mt-2 text-sm text-white/56">{content.home.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle
              locale={locale}
              label={content.shared.languageLabel}
              locales={content.shared.locales}
            />
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/56">
              {envReady ? content.shared.connected : content.shared.mockMode}
            </div>
            {viewer.user ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/24 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
              >
                {content.shared.continueDashboard}
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/5 px-5 py-2 text-sm font-medium text-white/80 transition hover:border-cyan-300/24 hover:text-cyan-100"
              >
                {content.shared.signIn}
              </Link>
            )}
          </div>
        </header>

        <section className="grid flex-1 gap-14 pb-16 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">{content.home.eyebrow}</div>
            <h1 className="mt-6 font-[var(--font-display)] text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl">
              {content.home.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              {content.home.description}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={viewer.user ? "/dashboard" : "/login"}
                className="inline-flex min-h-13 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px"
              >
                {viewer.user ? content.shared.continueDashboard : content.home.primaryCta}
              </Link>
              <Link
                href="/u/demo"
                className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/12 bg-white/4 px-6 py-3 text-sm font-medium text-white/86 transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
              >
                {content.home.secondaryCta}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {content.home.features.map((item) => (
                <article key={item.title} className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5">
                  <h2 className="font-[var(--font-display)] text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfilePreview profile={viewer.profile ?? demoProfile} locale={locale} />
          </div>
        </section>

        <section className="grid gap-10 rounded-[2rem] border border-white/8 bg-[var(--panel)] p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionHeading
            eyebrow={content.home.roadmapEyebrow}
            title={content.home.roadmapTitle}
            description={content.home.roadmapDescription}
          />
          <div className="grid gap-4">
            {content.home.milestones.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-[var(--accent)]">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-base font-semibold text-white">{item}</p>
                  <p className="mt-2 text-sm leading-7 text-white/62">
                    {content.home.roadmapFootnote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
