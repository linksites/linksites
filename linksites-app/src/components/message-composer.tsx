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
          failed: "Não foi possível enviar esta mensagem agora.",
        }
      : {
          placeholder: "Write a short, direct private message.",
          send: "Send message",
          loading: "Sending...",
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
      const result = (await response.json()) as { ok?: boolean };

      if (!response.ok || !result.ok) {
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
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <textarea
        ref={textareaRef}
        rows={3}
        value={content}
        maxLength={1000}
        onChange={(event) => setContent(event.target.value)}
        placeholder={copy.placeholder}
        className="min-h-[7rem] w-full resize-none rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm leading-7 text-white outline-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/28 bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition disabled:opacity-50"
        >
          {isLoading ? copy.loading : copy.send}
        </button>
        {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
      </div>
    </form>
  );
}
