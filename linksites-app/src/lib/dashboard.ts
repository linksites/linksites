import { redirect } from "next/navigation";
import { appContent } from "@/data/app-content";
import { getProfileAnalytics } from "@/lib/analytics";
import { getAppBaseUrl } from "@/lib/app-url";
import { getServerLocale } from "@/lib/locale-server";
import { demoProfile } from "@/lib/mock-data";
import { getProfileOnboarding } from "@/lib/onboarding";
import { getNetworkProfiles } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentViewer } from "@/lib/viewer";

type DashboardFeedbackParams = {
  error?: string;
  message?: string;
};

function resolveFeedback(copy: Record<string, string>, value?: string) {
  if (!value) {
    return null;
  }

  return copy[value] ?? value;
}

export async function getDashboardPageData(
  searchParams?: DashboardFeedbackParams,
  options?: { networkLimit?: number; networkScope?: "all" | "following" | "recommended" },
) {
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

  const dashboardTitle = content.dashboard.title.replace("{name}", profile.displayName);
  const publishedDescription = content.dashboard.profilePublishedDescription.replace("{username}", profile.username);
  const publicProfileUrl = `${appBaseUrl}/u/${profile.username}`;
  const analytics = await getProfileAnalytics(profile.id);
  const onboarding = getProfileOnboarding(profile);
  const networkProfiles = await getNetworkProfiles({
    viewerProfileId: profile.id,
    excludeProfileId: profile.id,
    limit: options?.networkLimit ?? 6,
    scope: options?.networkScope ?? "all",
  });

  return {
    locale,
    content,
    viewer,
    usingMockData,
    profile,
    dashboardTitle,
    publishedDescription,
    publicProfileUrl,
    analytics,
    onboarding,
    networkProfiles,
    feedbackError: resolveFeedback(content.dashboard.feedback, searchParams?.error),
    feedbackMessage: resolveFeedback(content.dashboard.feedback, searchParams?.message),
  };
}
