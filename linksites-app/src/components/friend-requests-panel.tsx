import Image from "next/image";
import { FriendRequestActions } from "@/components/friend-request-actions";
import type { FriendRequestItem } from "@/lib/types";
import type { AppLocale } from "@/lib/locale";

type FriendRequestsPanelProps = {
  items: FriendRequestItem[];
  locale: AppLocale;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function FriendRequestsPanel({ items, locale }: FriendRequestsPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Amizades",
          title: "Pedidos recebidos",
          description: "Aprove quem pode entrar na sua rede privada antes de liberar mensagens diretas.",
          emptyTitle: "Nenhum pedido pendente",
          emptyDescription: "Quando alguém solicitar amizade, o pedido aparece aqui para você responder.",
        }
      : {
          label: "Friendships",
          title: "Incoming requests",
          description: "Approve who can enter your private layer before direct messages are unlocked.",
          emptyTitle: "No pending requests",
          emptyDescription: "As soon as someone sends a friend request, it will appear here for you to answer.",
        };

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {items.length ? (
        <div className="mt-5 grid gap-3">
          {items.map((item) => {
            const senderName = item.sender?.displayName ?? "LinkSites";

            return (
              <article key={item.id} className="rounded-[1.3rem] border border-white/8 bg-white/4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                      {item.sender?.avatarUrl ? (
                        <Image
                          src={item.sender.avatarUrl}
                          alt={senderName}
                          fill
                          sizes="48px"
                          className="rounded-full object-cover object-center"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center">{getInitials(senderName)}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white">{senderName}</h3>
                      <p className="mt-1 truncate text-sm text-white/60">@{item.sender?.username ?? "linksites"}</p>
                    </div>
                  </div>

                  <FriendRequestActions requestId={item.id} locale={locale} />
                </div>
              </article>
            );
          })}
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
