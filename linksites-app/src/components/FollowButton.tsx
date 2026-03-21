"use client";

import clsx from "clsx";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";

interface FollowButtonProps {
  targetProfileId: string;
  initialIsFollowing: boolean;
  onFollowChange?: (nextState: { isFollowing: boolean; followersCount: number | null }) => void;
  locale?: AppLocale;
  className?: string;
}

export default function FollowButton({
  targetProfileId,
  initialIsFollowing,
  onFollowChange,
  locale = "ptBR",
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const copy =
    locale === "ptBR"
      ? {
          follow: "Seguir",
          following: "Seguindo",
          loading: "Aguarde...",
          signInRequired: "Entre para seguir perfis.",
          missingProfile: "Nao foi possivel localizar seu perfil.",
          updateFailed: "Nao foi possivel atualizar esse follow agora.",
        }
      : {
          follow: "Follow",
          following: "Following",
          loading: "Working...",
          signInRequired: "Sign in to follow profiles.",
          missingProfile: "We could not find your profile.",
          updateFailed: "We could not update this follow right now.",
        };

  const handleToggleFollow = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const nextAction = isFollowing ? "unfollow" : "follow";
      const response = await fetch("/api/network/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetProfileId,
          action: nextAction,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        following?: boolean;
        followersCount?: number | null;
      };

      if (!response.ok || !result.ok || typeof result.following !== "boolean") {
        if (result.error === "unauthorized") {
          setErrorMessage(copy.signInRequired);
          return;
        }

        if (result.error === "profile_not_found") {
          setErrorMessage(copy.missingProfile);
          return;
        }

        setErrorMessage(copy.updateFailed);
        return;
      }

      setIsFollowing(result.following);
      onFollowChange?.({
        isFollowing: result.following,
        followersCount: result.followersCount ?? null,
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao alterar follow:", error);
      setErrorMessage(copy.updateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleToggleFollow}
        disabled={isLoading}
        className={clsx(
          "rounded-full px-4 py-2 font-medium transition-colors disabled:opacity-50",
          isFollowing
            ? "border border-[var(--muted)] bg-[var(--muted)] text-[var(--text)] hover:bg-opacity-80"
            : "bg-[var(--accent)] text-black hover:bg-opacity-90",
          className,
        )}
      >
        {isLoading ? copy.loading : isFollowing ? copy.following : copy.follow}
      </button>
      {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
    </div>
  );
}
