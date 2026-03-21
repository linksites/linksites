import Link from "next/link";
import type { OnboardingSummary } from "@/lib/onboarding";
import type { ProfileWithLinks } from "@/lib/types";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";

type DashboardOverviewProps = {
  content: DashboardCopy;
  viewerEmail: string | null;
  sessionAuthenticated: boolean;
  usingMockData: boolean;
  profile: ProfileWithLinks;
  publishedDescription: string;
  publicProfileUrl: string;
  onboarding: OnboardingSummary;
};

export function DashboardOverview({
  content,
  viewerEmail,
  sessionAuthenticated,
  usingMockData,
  profile,
  publishedDescription,
  publicProfileUrl,
  onboarding,
}: DashboardOverviewProps) {
  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dashboard-panel dashboard-rise rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.sessionLabel}</div>
          <p className="mt-3 text-lg font-semibold text-white">
            {sessionAuthenticated ? content.sessionAuthenticated : content.sessionFallback}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/58">
            {viewerEmail ?? content.sessionFallbackDescription}
          </p>
        </div>

        <div className="dashboard-panel dashboard-rise rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.profileStatusLabel}</div>
          <p className="mt-3 text-lg font-semibold text-white">
            {profile.isPublished ? content.profilePublished : content.profileDraft}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/58">
            {profile.isPublished ? publishedDescription : content.profileDraftDescription}
          </p>
        </div>

        <div className="dashboard-panel dashboard-rise rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.unlockedLabel}</div>
          <p className="mt-3 text-lg font-semibold text-white">
            {profile.links.length} {content.unlockedSuffix}
          </p>
          <p className="mt-2 text-sm leading-7 text-white/58">{content.unlockedDescription}</p>
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="dashboard-panel dashboard-rise rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.onboardingLabel}</div>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                {content.onboardingTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">{content.onboardingDescription}</p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              {onboarding.completedCount}/{onboarding.totalCount} {content.onboardingCompletedLabel}
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
                {step.complete ? content.onboardingStepDone : content.onboardingStepPending}:{" "}
                {content.onboardingSteps[step.key]}
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-panel dashboard-rise rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.publicCardLabel}</div>
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                {content.publicCardTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/60">
                {profile.isPublished
                  ? content.publicCardDescriptionPublished
                  : content.publicCardDescriptionDraft}
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              {profile.isPublished ? content.publicCardPublished : content.publicCardDraft}
            </div>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
              {content.publicCardUrlLabel}
            </div>
            <p className="mt-3 break-all text-sm leading-7 text-white/70">{publicProfileUrl}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={publicProfileUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  profile.isPublished
                    ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-slate-950 hover:-translate-y-px"
                    : "pointer-events-none border border-white/10 bg-white/4 text-white/42"
                }`}
                aria-disabled={!profile.isPublished}
              >
                {content.publicCardOpen}
              </Link>
              <div className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-white/62">
                {usingMockData ? content.sessionFallback : content.identityLive}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
