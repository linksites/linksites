import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { DashboardPostsPanel } from "@/components/dashboard/dashboard-posts-panel";
import { PendingCommentsPanel } from "@/components/pending-comments-panel";
import { getDashboardPageData } from "@/lib/dashboard";
import { getPendingCommentsForProfile, getProfilePosts } from "@/lib/social";

type DashboardPostsPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardPostsPage({ searchParams }: DashboardPostsPageProps) {
  const data = await getDashboardPageData(await searchParams);
  const posts = await getProfilePosts({
    profileId: data.profile.id,
    viewerProfileId: data.profile.id,
    limit: 12,
  });
  const pendingComments = await getPendingCommentsForProfile({
    profileId: data.profile.id,
    viewerProfileId: data.profile.id,
    limit: 12,
  });

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
      currentPath="/dashboard/posts"
      asideAnalytics={data.analytics}
    >
      <DashboardPostsPanel
        locale={data.locale}
        posts={posts}
        usingMockData={data.usingMockData}
        feedbackError={data.feedbackError}
        feedbackMessage={data.feedbackMessage}
        redirectTo="/dashboard/posts"
      />

      <PendingCommentsPanel items={pendingComments} locale={data.locale} />
    </DashboardFrame>
  );
}
