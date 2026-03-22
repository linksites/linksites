import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { FriendRequestsPanel } from "@/components/friend-requests-panel";
import { NetworkActivityPanel } from "@/components/network-activity-panel";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SocialConnectionsPanel } from "@/components/social-connections-panel";
import { getDashboardPageData } from "@/lib/dashboard";
import {
  getFriendRequests,
  getFriends,
  getNetworkActivity,
  getNotifications,
  getSocialConnections,
  getUnreadNotificationsCount,
} from "@/lib/social";

export default async function DashboardNotificationsPage() {
  const data = await getDashboardPageData(undefined, { networkLimit: 6, networkScope: "recommended" });
  const [notifications, unreadCount, followers, following, activity, friendRequests, friends] = await Promise.all([
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
    getFriendRequests({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      limit: 6,
    }),
    getFriends({
      profileId: data.profile.id,
      viewerProfileId: data.profile.id,
      limit: 6,
    }),
  ]);
  const copy =
    data.locale === "ptBR"
      ? {
          followersTitle: "Seguidores recentes",
          followersDescription: "Perfis que passaram a acompanhar o que você publica e podem merecer que você siga de volta.",
          followersEmptyTitle: "Ainda sem seguidores recentes",
          followersEmptyDescription: "Quando novos perfis seguirem você, esta lista vai aparecer aqui.",
          followingTitle: "Perfis que você acompanha",
          followingDescription: "Sua base atual de conexões para voltar rápido a quem já faz parte da sua rede.",
          followingEmptyTitle: "Você ainda não acompanha ninguém",
          followingEmptyDescription: "Use a aba Rede para descobrir perfis e começar a construir sua curadoria.",
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
      <NotificationsPanel
        notifications={notifications}
        unreadCount={unreadCount}
        locale={data.locale}
        profileUsername={data.profile.username}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <FriendRequestsPanel items={friendRequests} locale={data.locale} />
        <SocialConnectionsPanel
          profiles={friends}
          locale={data.locale}
          title={data.locale === "ptBR" ? "Amigos aprovados" : "Approved friends"}
          description={
            data.locale === "ptBR"
              ? "Sua rede de amigos, pronta para conversas privadas nas próximas entregas."
              : "Your closest layer of the network, ready for private conversations in the next releases."
          }
          emptyTitle={data.locale === "ptBR" ? "Sem amigos aprovados ainda" : "No approved friends yet"}
          emptyDescription={
            data.locale === "ptBR"
              ? "Aceite pedidos ou envie amizades na aba Rede para começar esse grupo."
              : "Accept requests or send friendship invites in the Network tab to start this inner circle."
          }
        />
      </section>

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
