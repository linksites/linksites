"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";
import type { PendingCommentItem } from "@/lib/types";

type PendingCommentsPanelProps = {
  items: PendingCommentItem[];
  locale: AppLocale;
  mode?: "pending" | "approved";
};

export function PendingCommentsPanel({
  items,
  locale,
  mode = "pending",
}: PendingCommentsPanelProps) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = useMemo(
    () =>
      locale === "ptBR"
        ? {
            label: "Moderação",
            title: mode === "pending" ? "Comentários aguardando aprovação" : "Comentários aprovados",
            description:
              mode === "pending"
                ? "Aprove, rejeite ou remova o que entrar na fila antes de aparecer no perfil público."
                : "Remova comentários já aprovados quando quiser limpar o post ou ocultar alguma interação.",
            approve: "Aprovar",
            reject: "Rejeitar",
            remove: "Excluir",
            pendingEmptyTitle:
              mode === "pending" ? "Nenhum comentário pendente" : "Nenhum comentário aprovado",
            pendingEmptyDescription:
              mode === "pending"
                ? "Quando novos comentários chegarem, eles vão aparecer aqui para moderação."
                : "Quando comentários forem aprovados, eles vão aparecer aqui para remoção rápida.",
            fromPost: "No post",
            failed: "Não foi possível atualizar este comentário agora.",
          }
        : {
            label: "Moderation",
            title: mode === "pending" ? "Comments waiting for approval" : "Approved comments",
            description:
              mode === "pending"
                ? "Approve, reject, or remove what enters the queue before it appears on the public profile."
                : "Remove comments that were already approved whenever you want to clean up a post.",
            approve: "Approve",
            reject: "Reject",
            remove: "Delete",
            pendingEmptyTitle: mode === "pending" ? "No pending comments" : "No approved comments",
            pendingEmptyDescription:
              mode === "pending"
                ? "As new comments arrive, they will appear here for moderation."
                : "As comments get approved, they will show up here for quick removal.",
            fromPost: "On post",
            failed: "We could not update this comment right now.",
          },
    [locale, mode],
  );

  async function handleAction(commentId: string, action: "approve" | "reject" | "delete") {
    try {
      setBusyId(commentId);
      setErrorMessage(null);

      const response = await fetch("/api/posts/comments/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, action }),
      });
      const result = (await response.json()) as { ok?: boolean };

      if (!response.ok || !result.ok) {
        setErrorMessage(copy.failed);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao moderar comentario:", error);
      setErrorMessage(copy.failed);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="dashboard-panel rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {items.length ? (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                {copy.fromPost}: {item.postContentPreview}
              </div>
              <p className="mt-3 text-sm font-semibold text-white">
                {item.author?.displayName ?? "LinkSites"}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/80">{item.content}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {mode === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, "approve")}
                      disabled={busyId === item.id}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px disabled:opacity-60"
                    >
                      {copy.approve}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction(item.id, "reject")}
                      disabled={busyId === item.id}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-white/16 hover:text-white disabled:opacity-60"
                    >
                      {copy.reject}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleAction(item.id, "delete")}
                  disabled={busyId === item.id}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:-translate-y-px disabled:opacity-60"
                >
                  {copy.remove}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{copy.pendingEmptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{copy.pendingEmptyDescription}</p>
        </div>
      )}

      {errorMessage ? <p className="mt-4 text-sm text-rose-200">{errorMessage}</p> : null}
    </section>
  );
}
