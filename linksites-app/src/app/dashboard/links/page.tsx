import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { DashboardLinksEditor } from "@/components/dashboard/dashboard-links-editor";
import { getDashboardPageData } from "@/lib/dashboard";

type DashboardLinksPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardLinksPage({ searchParams }: DashboardLinksPageProps) {
  const data = await getDashboardPageData(await searchParams);

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
      currentPath="/dashboard/links"
      asideAnalytics={data.analytics}
    >
      <DashboardLinksEditor
        content={data.content.dashboard}
        profile={data.profile}
        usingMockData={data.usingMockData}
        redirectTo="/dashboard/links"
      />
    </DashboardFrame>
  );
}
