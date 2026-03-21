import { NetworkDiscoverySection } from "@/components/network-discovery-section";
import { ProfilePreview } from "@/components/profile-preview";
import type { ProfileAnalyticsSummary } from "@/lib/analytics";
import type { AppLocale } from "@/lib/locale";
import type { ProfileWithLinks, PublicDirectoryProfile } from "@/lib/types";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";

type DashboardContextRailProps = {
  profile: ProfileWithLinks;
  locale: AppLocale;
  networkProfiles: PublicDirectoryProfile[];
  analytics?: ProfileAnalyticsSummary;
  analyticsContent?: DashboardCopy;
};

export function DashboardContextRail({
  profile,
  locale,
  networkProfiles,
  analytics,
  analyticsContent,
}: DashboardContextRailProps) {
  return (
    <section id="network" className="space-y-6">
      <div className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">Preview</div>
            <p className="mt-2 text-sm leading-6 text-white/62">
              Veja como sua pagina publica esta ficando em tempo real.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
            live
          </div>
        </div>
        <div className="flex justify-center">
          <ProfilePreview profile={profile} compact locale={locale} />
        </div>
      </div>

      {analytics && analyticsContent ? (
        <div className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-4">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{analyticsContent.analyticsLabel}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-xl font-semibold text-white">
            {analyticsContent.analyticsTitle}
          </h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[1.2rem] border border-white/8 bg-white/4 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/42">{analyticsContent.analyticsViewsLabel}</div>
              <p className="mt-2 text-lg font-semibold text-white">{analytics.totalViews}</p>
            </div>
            <div className="rounded-[1.2rem] border border-white/8 bg-white/4 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/42">{analyticsContent.analyticsVisitorsLabel}</div>
              <p className="mt-2 text-lg font-semibold text-white">{analytics.uniqueVisitors}</p>
            </div>
          </div>
        </div>
      ) : null}

      <NetworkDiscoverySection profiles={networkProfiles} locale={locale} variant="stack" />
    </section>
  );
}
