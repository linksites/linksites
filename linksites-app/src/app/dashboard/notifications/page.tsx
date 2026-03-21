import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { NetworkActivityPanel } from "@/components/network-activity-panel";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SocialConnectionsPanel } from "@/components/social-connections-panel";
import { getDashboardPageData } from "@/lib/dashboard";
import {
  getNetworkActivity,
  getNotifications,
  getSocialConnections,
  getUnreadNotificationsCount,
} from "@/lib/social";

export default async function DashboardNotificationsPage() {
  const data = await getDashboardPageData(undefined, { networkLimit: 6, networkScope: "recommended" });
  const [notifications, unreadCount, followers, following, activity] = await Promise.all([
    getNotifications({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      limit: 10,
    }),
    getUnreadNotificationsCount(data.profile.id),
    getSocialConnections({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      kind: "followers",
      limit: 6,
    }),
    getSocialConnections({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      kind: "following",
      limit: 6,
    }),
    getNetworkActivity({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      limit: 8,
    }),
  ]);
  const copy =
    data.locale === "ptBR"
      ? {
          followersTitle: "Seguidores recentes",
          followersDescription: "Perfis que passaram a acompanhar o que voce publica e podem merecer um follow de volta.",
          followersEmptyTitle: "Ainda sem seguidores recentes",
          followersEmptyDescription: "Quando novos perfis seguirem voce, esta lista vai aparecer aqui.",
          followingTitle: "Perfis que voce acompanha",
          followingDescription: "Sua base atual de conexoes para voltar rapido a quem ja faz parte da sua rede.",
          followingEmptyTitle: "Voce ainda nao acompanha ninguem",
          followingEmptyDescription: "Use a aba Rede para descobrir perfis e comecar a construir sua curadoria.",
        }
      : {
          followersTitle: "Recent followers",
          followersDescription: "Profiles that started following what you publish and may deserve a follow back.",
          followersEmptyTitle: "No recent followers yet",
          followersEmptyDescription: "When new profiles follow you, this list will show up here.",
          followingTitle: "Profiles you follow",
          followingDescription: "Your current base of connections so you can jump back to who already belongs to your network.",
          followingEmptyTitle: "You are not following anyone yet",
          followingEmptyDescription: "Use the Network tab to discover profiles and start building your curation.",
        };

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
      currentPath="/dashboard/notifications"
      asideAnalytics={data.analytics}
    >
      <NotificationsPanel notifications={notifications} unreadCount={unreadCount} locale={data.locale} />

      <section className="grid gap-6 xl:grid-cols-2">
        <SocialConnectionsPanel
          profiles={followers}
          locale={data.locale}
          title={copy.followersTitle}
          description={copy.followersDescription}
          emptyTitle={copy.followersEmptyTitle}
          emptyDescription={copy.followersEmptyDescription}
        />
        <SocialConnectionsPanel
          profiles={following}
          locale={data.locale}
          title={copy.followingTitle}
          description={copy.followingDescription}
          emptyTitle={copy.followingEmptyTitle}
          emptyDescription={copy.followingEmptyDescription}
        />
      </section>

      <NetworkActivityPanel items={activity} locale={data.locale} />
    </DashboardFrame>
  );
}
