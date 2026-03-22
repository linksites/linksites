"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";
import type { SocialNotification } from "@/lib/types";

type NotificationsPanelProps = {
  notifications: SocialNotification[];
  unreadCount: number;
  locale: AppLocale;
  profileUsername?: string;
  title?: string;
  description?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTimestamp(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === "ptBR" ? "pt-BR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function NotificationsPanel({
  notifications,
  unreadCount,
  locale,
  profileUsername,
  title,
  description,
}: NotificationsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const copy = useMemo(
    () =>
      locale === "ptBR"
        ? {
            label: "Notificações",
            title: title ?? "Movimento da sua rede",
            description:
              description ?? "Acompanhe novos seguidores e limpe a fila quando quiser manter o painel em dia.",
            unread: "não lidas",
            markAllRead: "Marcar tudo como lido",
            working: "Atualizando...",
            emptyTitle: "Nenhuma notificação ainda",
            emptyDescription: "Quando sua rede reagir aos seus posts ou seguir seu perfil, esta área vai registrar esse movimento aqui.",
            followerText: "começou a seguir você.",
            likeText: "curtiu um dos seus posts.",
            commentText: "comentou em um dos seus posts.",
            openProfile: "Abrir perfil",
            openPost: "Abrir post",
            genericSender: "Um perfil da rede",
            updateFailed: "Não foi possível atualizar as notificações agora.",
          }
        : {
            label: "Notifications",
            title: title ?? "Movement in your network",
            description:
              description ?? "Track new followers and clear the queue whenever you want to keep this panel tidy.",
            unread: "unread",
            markAllRead: "Mark all as read",
            working: "Updating...",
            emptyTitle: "No notifications yet",
            emptyDescription: "As your network reacts to your posts or follows your profile, this area will capture the movement here.",
            followerText: "started following you.",
            likeText: "liked one of your posts.",
            commentText: "commented on one of your posts.",
            openProfile: "Open profile",
            openPost: "Open post",
            genericSender: "A profile from the network",
            updateFailed: "We could not update notifications right now.",
          },
    [description, locale, title],
  );

  async function handleMarkAllAsRead() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAll: true }),
      });

      const result = (await response.json()) as { ok?: boolean };

      if (!response.ok || !result.ok) {
        setErrorMessage(copy.updateFailed);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao atualizar notificacoes:", error);
      setErrorMessage(copy.updateFailed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100">
            {unreadCount} {copy.unread}
          </div>
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={!unreadCount || isLoading}
            className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-white/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? copy.working : copy.markAllRead}
          </button>
        </div>
      </div>

      {notifications.length ? (
        <div className="mt-5 grid gap-3">
          {notifications.map((notification) => {
            const senderName = notification.sender?.displayName ?? copy.genericSender;
            const messageText =
              notification.type === "post_like"
                ? copy.likeText
                : notification.type === "new_comment"
                  ? copy.commentText
                  : copy.followerText;
            const postHref =
              notification.entityId && profileUsername ? `/u/${profileUsername}#post-${notification.entityId}` : null;

            return (
              <article
                key={notification.id}
                className={`rounded-[1.3rem] border p-4 ${
                  notification.read ? "border-white/8 bg-white/4" : "border-cyan-300/18 bg-cyan-300/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                    {notification.sender?.avatarUrl ? (
                      <Image
                        src={notification.sender.avatarUrl}
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

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm leading-6 text-white">
                        <span className="font-semibold">{senderName}</span> {messageText}
                      </p>
                      {!notification.read ? (
                        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                          {copy.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                      {formatTimestamp(notification.createdAt, locale)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {notification.sender ? (
                        <Link
                          href={`/u/${notification.sender.username}`}
                          className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/72 transition hover:border-white/16 hover:text-white"
                        >
                          {copy.openProfile}
                        </Link>
                      ) : null}
                      {postHref ? (
                        <Link
                          href={postHref}
                          className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 transition hover:-translate-y-px"
                        >
                          {copy.openPost}
                        </Link>
                      ) : null}
                    </div>
                  </div>
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

      {errorMessage ? <p className="mt-4 text-sm text-rose-200">{errorMessage}</p> : null}
    </section>
  );
}
