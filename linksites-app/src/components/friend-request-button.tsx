"use client";

import clsx from "clsx";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";
import type { FriendshipStatus } from "@/lib/types";

type FriendRequestButtonProps = {
  targetProfileId: string;
  initialStatus: FriendshipStatus;
  locale: AppLocale;
  className?: string;
  onStatusChange?: (nextStatus: FriendshipStatus) => void;
};

export function FriendRequestButton({
  targetProfileId,
  initialStatus,
  locale,
  className,
  onStatusChange,
}: FriendRequestButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy =
    locale === "ptBR"
      ? {
          add: "Adicionar amigo",
          cancel: "Cancelar pedido",
          received: "Pedido recebido",
          friends: "Amigos",
          remove: "Remover amizade",
          loading: "Aguarde...",
          updateFailed: "Não foi possível atualizar a amizade agora.",
          signInRequired: "Entre para enviar pedidos de amizade.",
        }
      : {
          add: "Add friend",
          cancel: "Cancel request",
          received: "Request received",
          friends: "Friends",
          remove: "Remove friend",
          loading: "Working...",
          updateFailed: "We could not update friendship right now.",
          signInRequired: "Sign in to send friend requests.",
        };

  async function handleAction() {
    const config =
      status === "friends"
        ? { url: "/api/friends/remove", body: { targetProfileId }, nextStatus: "none" as const }
        : status === "request_sent"
          ? { url: "/api/friends/request", body: { targetProfileId, action: "cancel" }, nextStatus: "none" as const }
          : status === "request_received"
            ? { url: "/dashboard/notifications", body: null, nextStatus: status }
            : { url: "/api/friends/request", body: { targetProfileId, action: "send" }, nextStatus: "request_sent" as const };

    if (status === "request_received") {
      router.push(config.url);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config.body),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        status?: FriendshipStatus;
      };

      if (!response.ok || !result.ok) {
        if (result.error === "unauthorized") {
          setErrorMessage(copy.signInRequired);
          return;
        }

        setErrorMessage(copy.updateFailed);
        return;
      }

      const nextStatus = result.status ?? config.nextStatus;
      setStatus(nextStatus);
      onStatusChange?.(nextStatus);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao atualizar amizade:", error);
      setErrorMessage(copy.updateFailed);
    } finally {
      setIsLoading(false);
    }
  }

  const label =
    status === "friends"
      ? copy.remove
      : status === "request_sent"
        ? copy.cancel
        : status === "request_received"
          ? copy.received
          : copy.add;

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={handleAction}
        disabled={isLoading}
        className={clsx(
          "inline-flex min-h-11 w-full items-center justify-center rounded-full border px-4 py-2 text-center text-sm font-medium leading-tight whitespace-normal transition disabled:opacity-50",
          status === "friends"
            ? "border-amber-300/24 bg-amber-300/12 text-amber-100"
            : status === "request_sent"
              ? "border-white/10 bg-white/4 text-white/72"
              : status === "request_received"
                ? "border-cyan-300/24 bg-cyan-300/12 text-cyan-100"
                : "border-emerald-300/22 bg-emerald-300/12 text-emerald-100",
          className,
        )}
      >
        {isLoading ? copy.loading : label}
      </button>
      {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
    </div>
  );
}
