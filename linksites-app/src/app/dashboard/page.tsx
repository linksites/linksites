import Link from "next/link";
import { redirect } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfilePreview } from "@/components/profile-preview";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentViewer } from "@/lib/viewer";

export default async function DashboardPage() {
  const locale = await getServerLocale();
  const content = appContent[locale];
  const viewer = await getCurrentViewer();
  const usingMockData = !hasSupabaseEnv() || viewer.isMock;

  if (!usingMockData && !viewer.user) {
    redirect("/login?message=sign_in_required");
  }

  const profile =
    viewer.profile ??
    (usingMockData
      ? demoProfile
      : {
          id: "pending-profile",
          username: viewer.user?.email?.split("@")[0] ?? "new-user",
          displayName: viewer.user?.email?.split("@")[0] ?? content.dashboard.pendingProfileName,
          bio: content.dashboard.pendingProfileBio,
          avatarUrl: null,
          themeSlug: "midnight-grid" as const,
          isPublished: false,
          links: [],
        });
  const editorFields = [
    { label: content.dashboard.fields.displayName, value: profile.displayName },
    { label: content.dashboard.fields.username, value: profile.username },
    { label: content.dashboard.fields.bio, value: profile.bio },
  ];
  const dashboardTitle = content.dashboard.title.replace("{name}", profile.displayName);
  const publishedDescription = content.dashboard.profilePublishedDescription.replace("{username}", profile.username);

  return (
    <div className="page-shell min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">{content.dashboard.eyebrow}</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
              {dashboardTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">{content.dashboard.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle
              locale={locale}
              label={content.shared.languageLabel}
              locales={content.shared.locales}
            />
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
            >
              {content.shared.backHome}
            </Link>
            <form action="/auth/signout" method="post">
              <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px">
                {content.shared.signOut}
              </button>
            </form>
          </div>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.sessionLabel}</div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {viewer.user ? content.dashboard.sessionAuthenticated : content.dashboard.sessionFallback}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  {viewer.user?.email ?? content.dashboard.sessionFallbackDescription}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.profileStatusLabel}</div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {profile.isPublished ? content.dashboard.profilePublished : content.dashboard.profileDraft}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  {profile.isPublished ? publishedDescription : content.dashboard.profileDraftDescription}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.unlockedLabel}</div>
                <p className="mt-3 text-lg font-semibold text-white">
                  {profile.links.length} {content.dashboard.unlockedSuffix}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/58">{content.dashboard.unlockedDescription}</p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.identityLabel}</div>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                    {content.dashboard.identityTitle}
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                  {usingMockData ? content.dashboard.identityFallback : content.dashboard.identityLive}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {editorFields.map((field) => (
                  <label key={field.label} className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{field.label}</span>
                    <input
                      readOnly
                      value={field.value}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{content.dashboard.fields.links}</div>
                <div className="mt-4 space-y-3">
                  {profile.links.length ? (
                    profile.links.map((link, index) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {index + 1}. {link.title}
                          </p>
                          <p className="mt-1 text-xs text-white/54">{link.url}</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                          {link.isActive ? content.dashboard.linkActive : content.dashboard.linkInactive}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-4 py-5 text-sm leading-7 text-white/58">
                      {content.dashboard.emptyLinks}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
                <p className="text-sm leading-7 text-white/62">{content.dashboard.nextStep}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfilePreview profile={profile} compact locale={locale} />
          </div>
        </section>
      </main>
    </div>
  );
}
