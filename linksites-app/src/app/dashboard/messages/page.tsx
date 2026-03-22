import { ConversationThread } from "@/components/conversation-thread";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { MessagesRealtimeSync } from "@/components/messages-realtime-sync";
import { MessagesInboxPanel } from "@/components/messages-inbox-panel";
import { SocialConnectionsPanel } from "@/components/social-connections-panel";
import { getDashboardPageData } from "@/lib/dashboard";
import { getConversationThread, getInboxConversations } from "@/lib/messages";
import { getFriends } from "@/lib/social";

type DashboardMessagesPageProps = {
  searchParams: Promise<{
    room?: string;
  }>;
};

export default async function DashboardMessagesPage({ searchParams }: DashboardMessagesPageProps) {
  const params = await searchParams;
  const data = await getDashboardPageData(undefined, { networkLimit: 6, networkScope: "recommended" });
  const conversations = await getInboxConversations({
    profileId: data.profile.id,
  });
  const friends = await getFriends({
    profileId: data.profile.id,
    viewerProfileId: data.profile.id,
    limit: 8,
  });
  const requestedRoomId = params.room?.trim() || undefined;
  const activeRoomId = conversations.some((conversation) => conversation.id === requestedRoomId)
    ? requestedRoomId
    : conversations[0]?.id ?? undefined;
  const { conversation, messages } = activeRoomId
    ? await getConversationThread({
        profileId: data.profile.id,
        roomId: activeRoomId,
      })
    : { conversation: null, messages: [] };

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
      currentPath="/dashboard/messages"
      asideAnalytics={data.analytics}
    >
      <MessagesRealtimeSync
        profileId={data.profile.id}
        roomIds={conversations.map((conversation) => conversation.id)}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.5fr)]">
        <MessagesInboxPanel conversations={conversations} activeRoomId={activeRoomId} locale={data.locale} />
        <ConversationThread conversation={conversation} messages={messages} locale={data.locale} />
      </section>

      <SocialConnectionsPanel
        profiles={friends}
        locale={data.locale}
        title={data.locale === "ptBR" ? "Amigos prontos para conversar" : "Friends ready to chat"}
        description={
          data.locale === "ptBR"
            ? "Comece uma conversa privada com qualquer amizade aprovada sem sair desta área."
            : "Start a private conversation with any approved friendship without leaving this area."
        }
        emptyTitle={data.locale === "ptBR" ? "Nenhum amigo aprovado ainda" : "No approved friends yet"}
        emptyDescription={
          data.locale === "ptBR"
            ? "Aceite pedidos de amizade na Rede ou nas Notificações para liberar mensagens privadas."
            : "Accept friendship requests in Network or Notifications to unlock private messages."
        }
      />
    </DashboardFrame>
  );
}
