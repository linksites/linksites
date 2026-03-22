"use client";

import { useEffect } from "react";
import { MessageComposer } from "@/components/message-composer";
import type { AppLocale } from "@/lib/locale";
import type { DirectConversation, DirectMessage } from "@/lib/types";

type ConversationThreadProps = {
  conversation: DirectConversation | null;
  messages: DirectMessage[];
  locale: AppLocale;
};

function formatTimestamp(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === "ptBR" ? "pt-BR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ConversationThread({
  conversation,
  messages,
  locale,
}: ConversationThreadProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Conversa",
          title: "Selecione um amigo para conversar",
          description: "As mensagens privadas vao aparecer aqui quando voce abrir uma conversa.",
          emptyTitle: "Nenhuma conversa aberta",
          emptyDescription: "Use os botoes de mensagem nas amizades aprovadas para iniciar um chat privado.",
          ready: "Conversa pronta para comecar",
        }
      : {
          label: "Conversation",
          title: "Select a friend to chat",
          description: "Private messages will appear here once you open a conversation.",
          emptyTitle: "No conversation open",
          emptyDescription: "Use the message buttons on approved friendships to start a private chat.",
          ready: "Conversation ready to start",
        };

  useEffect(() => {
    if (!conversation) {
      return;
    }

    void fetch("/api/messages/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId: conversation.id }),
    });
  }, [conversation]);

  if (!conversation) {
    return (
      <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.emptyTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.emptyDescription}</p>
      </section>
    );
  }

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
      <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
        {conversation.otherParticipant?.displayName ?? copy.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>

      <div className="mx-auto mt-5 flex w-full max-w-[42rem] flex-col gap-4 rounded-[1.45rem] border border-white/7 bg-slate-950/12 p-3 sm:p-4">
        <div className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto px-1">
          {messages.length ? (
            messages.map((message) => (
              <article
                key={message.id}
                className={`w-fit max-w-[82%] min-w-0 overflow-hidden rounded-[1.3rem] border p-4 shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${
                  message.isOwnMessage
                    ? "ml-auto border-cyan-300/18 bg-cyan-300/10"
                    : "border-white/8 bg-white/4"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-white/82 [overflow-wrap:anywhere]">
                    {message.content}
                  </p>
                  <div
                    className={`flex items-center text-xs uppercase tracking-[0.18em] text-white/40 ${
                      message.isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span>{formatTimestamp(message.createdAt, locale)}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.3rem] border border-dashed border-white/12 bg-white/3 px-5 py-6 text-center">
              <p className="text-sm font-semibold text-white">{copy.ready}</p>
            </div>
          )}
        </div>

        <MessageComposer roomId={conversation.id} locale={locale} />
      </div>
    </section>
  );
}
