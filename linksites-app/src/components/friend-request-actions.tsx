"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";

type FriendRequestActionsProps = {
  requestId: string;
  locale: AppLocale;
};

export function FriendRequestActions({ requestId, locale }: FriendRequestActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === "ptBR"
      ? {
          accept: "Aceitar",
          reject: "Recusar",
          loading: "Aguarde...",
          failed: "Não foi possível responder ao pedido agora.",
        }
      : {
          accept: "Accept",
          reject: "Reject",
          loading: "Working...",
          failed: "We could not answer this request right now.",
        };

  async function handleAction(action: "accept" | "reject") {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/friends/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, action }),
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
      console.error("Erro ao responder pedido de amizade:", error);
      setErrorMessage(copy.failed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleAction("accept")}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-300/24 bg-emerald-300/12 px-4 py-2 text-sm font-medium text-emerald-100 transition disabled:opacity-50"
        >
          {isLoading ? copy.loading : copy.accept}
        </button>
        <button
          type="button"
          onClick={() => handleAction("reject")}
          disabled={isLoading}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition disabled:opacity-50"
        >
          {copy.reject}
        </button>
      </div>
      {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
    </div>
  );
}
