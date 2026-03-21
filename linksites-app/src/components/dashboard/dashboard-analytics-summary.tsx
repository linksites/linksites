import type { ProfileAnalyticsSummary } from "@/lib/analytics";
import type { AppLocale } from "@/lib/locale";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";

type DashboardAnalyticsSummaryProps = {
  content: DashboardCopy;
  analytics: ProfileAnalyticsSummary;
  locale: AppLocale;
};

export function DashboardAnalyticsSummary({
  content,
  analytics,
  locale,
}: DashboardAnalyticsSummaryProps) {
  const normalizedLocale = locale === "ptBR" ? "pt-BR" : "en-US";
  const analyticsCards = [
    {
      label: content.analyticsViewsLabel,
      value: analytics.totalViews.toLocaleString(normalizedLocale),
      helper: content.analyticsRecentViewsLabel,
      helperValue: analytics.recentViews.toLocaleString(normalizedLocale),
    },
    {
      label: content.analyticsVisitorsLabel,
      value: analytics.uniqueVisitors.toLocaleString(normalizedLocale),
      helper: content.analyticsClicksLabel,
      helperValue: analytics.totalClicks.toLocaleString(normalizedLocale),
    },
    {
      label: content.analyticsTopLinkLabel,
      value: analytics.topLinkTitle ?? content.analyticsTopLinkEmpty,
      helper: content.analyticsClicksLabel,
      helperValue: analytics.topLinkClicks.toLocaleString(normalizedLocale),
    },
  ];

  return (
    <section
      id="analytics"
      className="dashboard-panel dashboard-rise scroll-mt-24 rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.analyticsLabel}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {content.analyticsTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{content.analyticsDescription}</p>
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
    </section>
  );
}
