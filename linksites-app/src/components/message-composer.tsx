"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";

type MessageComposerProps = {
  roomId: string;
  locale: AppLocale;
};

export function MessageComposer({ roomId, locale }: MessageComposerProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === "ptBR"
      ? {
          placeholder: "Escreva uma mensagem privada curta e direta.",
          send: "Enviar mensagem",
          loading: "Enviando...",
          tooLong: "A mensagem precisa ter no máximo 1000 caracteres.",
          unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
          failed: "Não foi possível enviar esta mensagem agora.",
        }
      : {
          placeholder: "Write a short, direct private message.",
          send: "Send message",
          loading: "Sending...",
          tooLong: "Messages must be 1000 characters or less.",
          unauthorized: "Your session expired. Sign in again to continue.",
          failed: "We could not send this message right now.",
        };

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, 220);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > 220 ? "auto" : "hidden";
  }, [content]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          content,
        }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        if (result.error === "message_too_long") {
          setErrorMessage(copy.tooLong);
          return;
        }

        if (result.error === "unauthorized") {
          setErrorMessage(copy.unauthorized);
          return;
        }

        setErrorMessage(copy.failed);
        return;
      }

      setContent("");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setErrorMessage(copy.failed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-[1.2rem] border border-white/8 bg-[var(--panel)]/55 p-3 sm:p-4">
      <textarea
        ref={textareaRef}
        rows={3}
        value={content}
        maxLength={1000}
        onChange={(event) => setContent(event.target.value)}
        placeholder={copy.placeholder}
        className="min-h-[7rem] w-full resize-none rounded-[1.1rem] border border-white/10 bg-white/4 px-4 py-3 text-sm leading-7 text-white outline-none whitespace-pre-wrap break-words transition focus:border-cyan-300/26 focus:bg-white/5 [overflow-wrap:anywhere]"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cyan-300/28 bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50 sm:w-auto sm:min-w-[11rem]"
        >
          {isLoading ? copy.loading : copy.send}
        </button>
        {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
      </div>
    </form>
  );
}
