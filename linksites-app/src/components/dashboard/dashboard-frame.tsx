import type { ReactNode } from "react";
import { DashboardContextRail } from "@/components/dashboard/dashboard-context-rail";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import type { AppLocale } from "@/lib/locale";
import type { OnboardingSummary } from "@/lib/onboarding";
import type { ProfileAnalyticsSummary } from "@/lib/analytics";
import type { ProfileWithLinks, PublicDirectoryProfile } from "@/lib/types";
import type { DashboardCopy, SharedCopy } from "@/components/dashboard/dashboard-types";

type DashboardFrameProps = {
  locale: AppLocale;
  sharedContent: SharedCopy;
  dashboardContent: DashboardCopy;
  dashboardTitle: string;
  profile: ProfileWithLinks;
  onboarding: OnboardingSummary;
  publicProfileUrl: string;
  usingMockData: boolean;
  networkProfiles: PublicDirectoryProfile[];
  currentPath: string;
  children: ReactNode;
  asideAnalytics?: ProfileAnalyticsSummary;
};

export function DashboardFrame({
  locale,
  sharedContent,
  dashboardContent,
  dashboardTitle,
  profile,
  onboarding,
  publicProfileUrl,
  usingMockData,
  networkProfiles,
  currentPath,
  children,
  asideAnalytics,
}: DashboardFrameProps) {
  return (
    <div className="page-shell min-h-screen">
      <main className="dashboard-shell mx-auto max-w-[1680px] px-4 py-8 sm:px-6 xl:px-10">
        <DashboardHeader
          locale={locale}
          sharedContent={sharedContent}
          dashboardEyebrow={dashboardContent.eyebrow}
          dashboardTitle={dashboardTitle}
          dashboardDescription={dashboardContent.description}
        />

        <DashboardShell
          sidebar={
            <DashboardSidebar
              content={dashboardContent}
              profile={profile}
              onboarding={onboarding}
              publicProfileUrl={publicProfileUrl}
              usingMockData={usingMockData}
              currentPath={currentPath}
            />
          }
          aside={
            <DashboardContextRail
              profile={profile}
              locale={locale}
              networkProfiles={networkProfiles}
              analytics={asideAnalytics}
              analyticsContent={dashboardContent}
            />
          }
        >
          {children}
        </DashboardShell>
      </main>
    </div>
  );
}
