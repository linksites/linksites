import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { updateLinks, updateProfile } from "@/app/dashboard/actions";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfilePreview } from "@/components/profile-preview";
import { getProfileAnalytics } from "@/lib/analytics";
import { appContent } from "@/data/app-content";
import { getAppBaseUrl } from "@/lib/app-url";
import { getServerLocale } from "@/lib/locale-server";
import { themeCatalog } from "@/lib/mock-data";
import { demoProfile } from "@/lib/mock-data";
import { getProfileOnboarding } from "@/lib/onboarding";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentViewer } from "@/lib/viewer";

type DashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
          : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      }`}
    >
      {children}
    </div>
  );
}

function resolveFeedback(copy: Record<string, string>, value?: string) {
  if (!value) {
    return null;
  }

  return copy[value] ?? value;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const locale = await getServerLocale();
  const content = appContent[locale];
  const viewer = await getCurrentViewer();
  const usingMockData = !hasSupabaseEnv() || viewer.isMock;
  const appBaseUrl = await getAppBaseUrl();

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
    { label: content.dashboard.fields.displayName, name: "displayName", value: profile.displayName },
    { label: content.dashboard.fields.username, name: "username", value: profile.username },
  ];
  const newLinkSlots = 3;
  const dashboardTitle = content.dashboard.title.replace("{name}", profile.displayName);
  const publishedDescription = content.dashboard.profilePublishedDescription.replace("{username}", profile.username);
  const publicProfileUrl = `${appBaseUrl}/u/${profile.username}`;
  const analytics = await getProfileAnalytics(profile.id);
  const onboarding = getProfileOnboarding(profile);
  const analyticsCards = [
    {
      label: content.dashboard.analyticsViewsLabel,
      value: analytics.totalViews.toLocaleString(locale === "ptBR" ? "pt-BR" : "en-US"),
      helper: content.dashboard.analyticsRecentViewsLabel,
      helperValue: analytics.recentViews.toLocaleString(locale === "ptBR" ? "pt-BR" : "en-US"),
    },
    {
      label: content.dashboard.analyticsVisitorsLabel,
      value: analytics.uniqueVisitors.toLocaleString(locale === "ptBR" ? "pt-BR" : "en-US"),
      helper: content.dashboard.analyticsClicksLabel,
      helperValue: analytics.totalClicks.toLocaleString(locale === "ptBR" ? "pt-BR" : "en-US"),
    },
    {
      label: content.dashboard.analyticsTopLinkLabel,
      value: analytics.topLinkTitle ?? content.dashboard.analyticsTopLinkEmpty,
      helper: content.dashboard.analyticsClicksLabel,
      helperValue: analytics.topLinkClicks.toLocaleString(locale === "ptBR" ? "pt-BR" : "en-US"),
    },
  ];

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

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
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

            <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.analyticsLabel}</div>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                    {content.dashboard.analyticsTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">{content.dashboard.analyticsDescription}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                  {analytics.recentViews} / 7d
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {analyticsCards.map((card) => (
                  <div key={card.label} className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-white/42">{card.label}</div>
                    <p className="mt-3 text-lg font-semibold text-white">{card.value}</p>
                    <p className="mt-2 text-sm leading-7 text-white/58">
                      {card.helper}: {card.helperValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.onboardingLabel}</div>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                    {content.dashboard.onboardingTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-white/60">{content.dashboard.onboardingDescription}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                  {onboarding.completedCount}/{onboarding.totalCount} {content.dashboard.onboardingCompletedLabel}
                </div>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                  style={{ width: `${onboarding.progressPercent}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {onboarding.steps.map((step) => (
                  <div
                    key={step.key}
                    className={`rounded-[1.2rem] border px-4 py-3 text-sm ${
                      step.complete
                        ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                        : "border-white/8 bg-white/4 text-white/70"
                    }`}
                  >
                    {step.complete ? content.dashboard.onboardingStepDone : content.dashboard.onboardingStepPending}:{" "}
                    {content.dashboard.onboardingSteps[step.key]}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.dashboard.publicCardLabel}</div>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <h2 className="font-[var(--font-display)] text-2xl font-semibold text-white">
                    {content.dashboard.publicCardTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {profile.isPublished
                      ? content.dashboard.publicCardDescriptionPublished
                      : content.dashboard.publicCardDescriptionDraft}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                  {profile.isPublished ? content.dashboard.publicCardPublished : content.dashboard.publicCardDraft}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                  {content.dashboard.publicCardUrlLabel}
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    readOnly
                    value={publicProfileUrl}
                    className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                  />
                  <Link
                    href={publicProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                      profile.isPublished
                        ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-slate-950 hover:-translate-y-px"
                        : "cursor-not-allowed border border-white/10 bg-white/4 text-white/42 pointer-events-none"
                    }`}
                    aria-disabled={!profile.isPublished}
                  >
                    {content.dashboard.publicCardOpen}
                  </Link>
                </div>
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

              <p className="mt-4 text-sm leading-7 text-white/62">{content.dashboard.editorDescription}</p>

              <div className="mt-6 space-y-3">
                {params.error ? (
                  <Notice tone="error">{resolveFeedback(content.dashboard.feedback, params.error)}</Notice>
                ) : null}
                {params.message ? (
                  <Notice tone="info">{resolveFeedback(content.dashboard.feedback, params.message)}</Notice>
                ) : null}
                {usingMockData ? <Notice tone="info">{content.dashboard.mockReadonly}</Notice> : null}
              </div>

              <form action={updateProfile} className="mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {editorFields.map((field) => (
                    <label key={field.label} className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{field.label}</span>
                      <input
                        name={field.name}
                        defaultValue={field.value}
                        disabled={usingMockData}
                        className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                  ))}

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                      {content.dashboard.fields.theme}
                    </span>
                    <select
                      name="themeSlug"
                      defaultValue={profile.themeSlug}
                      disabled={usingMockData}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.keys(themeCatalog).map((themeSlug) => (
                        <option key={themeSlug} value={themeSlug} className="bg-slate-950 text-white">
                          {
                            content.dashboard.themeOptions[
                              themeSlug as keyof typeof content.dashboard.themeOptions
                            ]
                          }
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                      {content.dashboard.fields.visibility}
                    </span>
                    <select
                      name="isPublished"
                      defaultValue={String(profile.isPublished)}
                      disabled={usingMockData}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="false" className="bg-slate-950 text-white">
                        {content.dashboard.visibilityDraft}
                      </option>
                      <option value="true" className="bg-slate-950 text-white">
                        {content.dashboard.visibilityPublished}
                      </option>
                    </select>
                  </label>
                </div>

                <label className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.dashboard.fields.avatarUrl}
                  </span>
                  <input
                    name="avatarUrl"
                    defaultValue={profile.avatarUrl ?? ""}
                    disabled={usingMockData}
                    placeholder="https://..."
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <div className="mt-4 rounded-[1.4rem] border border-white/8 bg-white/3 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.dashboard.avatarUpload}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-white/58">{content.dashboard.avatarUploadHint}</p>
                  <input
                    name="avatarFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    disabled={usingMockData}
                    className="mt-4 block w-full text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-cyan-300/12 file:px-4 file:py-2 file:font-semibold file:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <label className="mt-4 flex items-center gap-2 text-sm text-white/68">
                    <input type="hidden" name="removeAvatar" value="false" />
                    <input
                      type="checkbox"
                      name="removeAvatar"
                      value="true"
                      disabled={usingMockData}
                      className="h-4 w-4 rounded border-white/20 bg-white/5"
                    />
                    <span>{content.dashboard.avatarRemove}</span>
                  </label>
                </div>

                <label className="mt-4 flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                    {content.dashboard.fields.bio}
                  </span>
                  <textarea
                    name="bio"
                    defaultValue={profile.bio}
                    rows={5}
                    disabled={usingMockData}
                    className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <button
                  disabled={usingMockData}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {content.dashboard.saveButton}
                </button>
              </form>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{content.dashboard.fields.links}</div>
                <p className="mt-3 text-sm leading-7 text-white/60">{content.dashboard.linksDescription}</p>

                <form action={updateLinks} className="mt-4 space-y-4">
                  {profile.links.length ? (
                    profile.links.map((link) => (
                      <div key={link.id} className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
                        <input type="hidden" name="existingLinkIds" value={link.id} />
                        <div className="grid gap-4 md:grid-cols-[1fr_1.4fr_110px]">
                          <label className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                              {content.dashboard.linkTitle}
                            </span>
                            <input
                              name={`title-${link.id}`}
                              defaultValue={link.title}
                              disabled={usingMockData}
                              className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          </label>
                          <label className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                              {content.dashboard.linkUrl}
                            </span>
                            <input
                              name={`url-${link.id}`}
                              defaultValue={link.url}
                              disabled={usingMockData}
                              className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          </label>
                          <label className="flex flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                              {content.dashboard.linkPosition}
                            </span>
                            <input
                              name={`position-${link.id}`}
                              type="number"
                              defaultValue={link.position}
                              disabled={usingMockData}
                              className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          </label>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/70">
                          <label className="flex items-center gap-2">
                            <input type="hidden" name={`isActive-${link.id}`} value="false" />
                            <input
                              type="checkbox"
                              name={`isActive-${link.id}`}
                              value="true"
                              defaultChecked={link.isActive}
                              disabled={usingMockData}
                              className="h-4 w-4 rounded border-white/20 bg-white/5"
                            />
                            <span>
                              {content.dashboard.linkStatus}:{" "}
                              {link.isActive ? content.dashboard.linkActive : content.dashboard.linkInactive}
                            </span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input type="hidden" name={`remove-${link.id}`} value="false" />
                            <input
                              type="checkbox"
                              name={`remove-${link.id}`}
                              value="true"
                              disabled={usingMockData}
                              className="h-4 w-4 rounded border-white/20 bg-white/5"
                            />
                            <span>{content.dashboard.linkRemove}</span>
                          </label>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-4 py-5 text-sm leading-7 text-white/58">
                      {content.dashboard.emptyLinks}
                    </div>
                  )}

                  <div className="rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                      {content.dashboard.linkNew}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/58">{content.dashboard.addLinkHint}</p>
                    <input type="hidden" name="newLinkSlots" value={String(newLinkSlots)} />
                    <div className="mt-4 space-y-4">
                      {Array.from({ length: newLinkSlots }).map((_, slotIndex) => (
                        <div key={`new-link-${slotIndex}`} className="grid gap-4 md:grid-cols-[1fr_1.4fr_110px]">
                          <input
                            name={`new-title-${slotIndex}`}
                            placeholder={content.dashboard.linkTitle}
                            disabled={usingMockData}
                            className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                          />
                          <input
                            name={`new-url-${slotIndex}`}
                            placeholder="https://"
                            disabled={usingMockData}
                            className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                          />
                          <input
                            name={`new-position-${slotIndex}`}
                            type="number"
                            defaultValue={profile.links.length + slotIndex}
                            disabled={usingMockData}
                            className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                          />
                          <label className="flex items-center gap-2 text-sm text-white/68 md:col-span-3">
                            <input type="hidden" name={`new-isActive-${slotIndex}`} value="false" />
                            <input
                              type="checkbox"
                              name={`new-isActive-${slotIndex}`}
                              value="true"
                              defaultChecked
                              disabled={usingMockData}
                              className="h-4 w-4 rounded border-white/20 bg-white/5"
                            />
                            <span>{content.dashboard.linkInactiveHint}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={usingMockData}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {content.dashboard.saveLinksButton}
                  </button>
                </form>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
                <p className="text-sm leading-7 text-white/62">{content.dashboard.nextStep}</p>
              </div>
            </div>
          </div>

          <div className="flex self-start justify-center lg:sticky lg:top-8 lg:justify-end">
            <ProfilePreview profile={profile} compact locale={locale} />
          </div>
        </section>
      </main>
    </div>
  );
}
