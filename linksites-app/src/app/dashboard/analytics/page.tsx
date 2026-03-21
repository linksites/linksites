import { DashboardAnalyticsSummary } from "@/components/dashboard/dashboard-analytics-summary";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { getDashboardPageData } from "@/lib/dashboard";

export default async function DashboardAnalyticsPage() {
  const data = await getDashboardPageData();

  return (
    <DashboardFrame
      locale={data.locale}
      sharedContent={data.content.shared}
      dashboardContent={data.content.dashboard}
      dashboardTitle={data.dashboardTitle}
      profile={data.profile}
      onboarding={data.onboarding}
      publicProfileUrl={data.publicProfileUrl}
      usingMockData={data.usingMockData}
      networkProfiles={data.networkProfiles}
      currentPath="/dashboard/analytics"
      asideAnalytics={data.analytics}
    >
      <DashboardAnalyticsSummary
        content={data.content.dashboard}
        analytics={data.analytics}
        locale={data.locale}
      />
    </DashboardFrame>
  );
}
