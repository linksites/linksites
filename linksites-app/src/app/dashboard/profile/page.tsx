import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { DashboardProfileForm } from "@/components/dashboard/dashboard-profile-form";
import { getDashboardPageData } from "@/lib/dashboard";

type DashboardProfilePageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardProfilePage({ searchParams }: DashboardProfilePageProps) {
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
      currentPath="/dashboard/profile"
      asideAnalytics={data.analytics}
    >
      <DashboardProfileForm
        content={data.content.dashboard}
        profile={data.profile}
        usingMockData={data.usingMockData}
        feedbackError={data.feedbackError}
        feedbackMessage={data.feedbackMessage}
        redirectTo="/dashboard/profile"
      />
    </DashboardFrame>
  );
}
