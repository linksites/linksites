import Image from "next/image";
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

function formatInboxDateParts(value: string | null, locale: AppLocale) {
  if (!value) {
    return { date: "", time: "" };
  }

  const date = new Date(value);
  const language = locale === "ptBR" ? "pt-BR" : "en-US";

  return {
    date: new Intl.DateTimeFormat(language, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date),
    time: new Intl.DateTimeFormat(language, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date),
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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

  const shouldScroll = conversations.length >= 4;
  const listClass =
    conversations.length === 1
      ? "grid min-h-[10.5rem] content-center gap-3"
      : shouldScroll
        ? "grid max-h-[21rem] gap-3 overflow-y-auto pr-1"
        : "grid gap-3";

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {conversations.length ? (
        <div className="mt-5 rounded-[1.45rem] border border-white/7 bg-slate-950/14 p-3">
          <div className={listClass}>
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeRoomId;
              const displayName = conversation.otherParticipant?.displayName ?? "LinkSites";
              const timestamp = formatInboxDateParts(
                conversation.lastMessageAt ?? conversation.updatedAt,
                locale,
              );

              return (
                <Link
                  key={conversation.id}
                  href={`/dashboard/messages?room=${conversation.id}`}
                  className={`w-full overflow-hidden rounded-[1.25rem] border px-4 py-3 transition duration-200 ${
                    isActive
                      ? "border-cyan-300/22 bg-cyan-300/10 shadow-[0_10px_30px_rgba(6,182,212,0.08)]"
                      : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/5"
                  }`}
                >
                  <div className="grid grid-cols-[auto_minmax(0,1fr)_5.4rem] items-center gap-3">
                    <div
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-semibold ${
                        isActive
                          ? "border-cyan-300/24 bg-cyan-300/12 text-cyan-100"
                          : "border-white/10 bg-slate-950 text-white"
                      }`}
                    >
                      {conversation.otherParticipant?.avatarUrl ? (
                        <Image
                          src={conversation.otherParticipant.avatarUrl}
                          alt={displayName}
                          fill
                          sizes="44px"
                          className="object-cover object-center"
                          unoptimized
                        />
                      ) : (
                        <span>{getInitials(displayName)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[0.95rem] font-semibold text-white">{displayName}</p>
                      <p className="mt-1 truncate text-[0.84rem] text-white/58">
                        {formatPreview(conversation.lastMessagePreview, locale)}
                      </p>
                    </div>

                    <div className="min-w-0 text-right">
                      <p className="truncate text-[11px] font-medium text-white/58">{timestamp.date}</p>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <span className="truncate text-[11px] text-white/42">{timestamp.time}</span>
                        {conversation.unreadCount ? (
                          <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-cyan-100">
                            {conversation.unreadCount}
                          </span>
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-white/10" />
                        )}
                      </div>
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
