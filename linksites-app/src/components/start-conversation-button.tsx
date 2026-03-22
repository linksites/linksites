"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { AppLocale } from "@/lib/locale";

type StartConversationButtonProps = {
  targetProfileId: string;
  locale: AppLocale;
  className?: string;
};

export function StartConversationButton({
  targetProfileId,
  locale,
  className,
}: StartConversationButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authNextPath = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
  }, [pathname, searchParams]);
  const copy =
    locale === "ptBR"
      ? {
          label: "Mensagem",
          loading: "Abrindo conversa...",
          hint: "Preparando sua caixa de entrada privada.",
          failed: "Não foi possível abrir a conversa agora.",
          notFriends: "A conversa privada só está disponível entre amigos aprovados.",
          unauthorized: "Sua sessão expirou. Entre novamente para continuar.",
        }
      : {
          label: "Message",
          loading: "Opening conversation...",
          hint: "Preparing your private inbox.",
          failed: "We could not open this conversation right now.",
          notFriends: "Private chat is only available between approved friends.",
          unauthorized: "Your session expired. Sign in again to continue.",
        };

  useEffect(() => {
    router.prefetch("/dashboard/messages");
  }, [router]);

  async function handleOpenConversation() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/messages/conversations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetProfileId }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        roomId?: string;
        error?: string;
        debugMessage?: string | null;
      };

      if (!response.ok || !result.ok || !result.roomId) {
        if (result.debugMessage) {
          console.error("Detalhe da falha ao abrir conversa:", result.debugMessage);
        }

        if (result.error === "unauthorized") {
          setErrorMessage(copy.unauthorized);
          router.push(`/login?mode=signin&next=${encodeURIComponent(authNextPath)}`);
          return;
        }

        if (result.error === "not_friends") {
          setErrorMessage(copy.notFriends);
          return;
        }

        setErrorMessage(copy.failed);
        return;
      }

      router.push(`/dashboard/messages?room=${result.roomId}`);
    } catch (error) {
      console.error("Erro ao abrir conversa:", error);
      setErrorMessage(copy.failed);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={handleOpenConversation}
        disabled={isLoading}
        aria-busy={isLoading}
        className={clsx(
          "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-center text-sm font-medium leading-tight whitespace-normal text-cyan-100 transition disabled:cursor-wait disabled:opacity-50",
          isLoading && "border-cyan-300/28 bg-cyan-300/14",
          className,
        )}
      >
        <span className="inline-flex items-center gap-2">
          {isLoading ? <span className="h-2 w-2 rounded-full bg-cyan-100/90" /> : null}
          <span>{isLoading ? copy.loading : copy.label}</span>
        </span>
      </button>
      {isLoading ? <p className="text-xs text-cyan-100/70">{copy.hint}</p> : null}
      {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
    </div>
  );
}
