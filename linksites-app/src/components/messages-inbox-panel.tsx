import Link from "next/link";
import type { AppLocale } from "@/lib/locale";
import type { DirectConversation } from "@/lib/types";

type MessagesInboxPanelProps = {
  conversations: DirectConversation[];
  activeRoomId?: string;
  locale: AppLocale;
};

function formatPreview(value: string | null, locale: AppLocale) {
  if (!value) {
    return locale === "ptBR" ? "Conversa pronta para começar." : "Conversation ready to start.";
  }

  const collapsed = value.replace(/\s+/g, " ").trim();
  const softened = collapsed
    .split(" ")
    .map((token) => (token.length > 24 ? `${token.slice(0, 24)}...` : token))
    .join(" ");

  return softened.length > 72 ? `${softened.slice(0, 69).trimEnd()}...` : softened;
}

function formatTimestamp(value: string | null, locale: AppLocale) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "ptBR" ? "pt-BR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function MessagesInboxPanel({
  conversations,
  activeRoomId,
  locale,
}: MessagesInboxPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Caixa de entrada",
          title: "Conversas privadas",
          description: "Aqui ficam as conversas abertas com amigos já aprovados na sua rede.",
          emptyTitle: "Nenhuma conversa ainda",
          emptyDescription: "Assim que você abrir uma conversa com um amigo, ela aparece aqui.",
          unread: "novas",
        }
      : {
          label: "Inbox",
          title: "Private conversations",
          description: "This is where conversations with approved friends in your network live.",
          emptyTitle: "No conversations yet",
          emptyDescription: "As soon as you open a conversation with a friend, it will appear here.",
          unread: "new",
        };

  const listLayoutClass =
    conversations.length <= 1 ? "flex min-h-[19rem] flex-col justify-center" : "grid gap-3";

  return (
    <section className="dashboard-panel flex h-full flex-col rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {conversations.length ? (
        <div className="mt-5 flex flex-1 flex-col rounded-[1.45rem] border border-white/7 bg-slate-950/12 p-3">
          <div className={listLayoutClass}>
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeRoomId;

              return (
                <Link
                  key={conversation.id}
                  href={`/dashboard/messages?room=${conversation.id}`}
                  className={`rounded-[1.3rem] border p-4 transition ${
                    isActive
                      ? "border-cyan-300/20 bg-cyan-300/10"
                      : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/5"
                  }`}
                >
                  <div className="flex min-h-[4.75rem] items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {conversation.otherParticipant?.displayName ?? "LinkSites"}
                      </p>
                      <p className="mt-1 truncate text-sm text-white/56">
                        {formatPreview(conversation.lastMessagePreview, locale)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2 text-right">
                      <span className="text-xs uppercase tracking-[0.18em] text-white/40">
                        {formatTimestamp(conversation.lastMessageAt ?? conversation.updatedAt, locale)}
                      </span>
                      {conversation.unreadCount ? (
                        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                          {conversation.unreadCount} {copy.unread}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{copy.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
