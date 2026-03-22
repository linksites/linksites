"use client";

import { AuthModal } from "@/components/auth-modal";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type SocialPostCardProps = {
  post: SocialPost;
  locale: AppLocale;
  showAuthor?: boolean;
  showProfileLink?: boolean;
  canComment?: boolean;
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
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SocialPostCard({
  post,
  locale,
  showAuthor = true,
  showProfileLink = true,
  canComment = false,
}: SocialPostCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [reactionCount, setReactionCount] = useState(post.reactionCount);
  const [hasReacted, setHasReacted] = useState(post.viewerHasReacted);
  const [saveCount, setSaveCount] = useState(post.savedCount);
  const [hasSaved, setHasSaved] = useState(post.viewerHasSaved);
  const [isReacting, setIsReacting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [returnMessage, setReturnMessage] = useState<string | null>(null);
  const commentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const copy = useMemo(
    () =>
      locale === "ptBR"
        ? {
            like: "Curtir",
            liked: "Curtido",
            save: "Salvar",
            saved: "Salvo",
            comment: "Comentar",
            reactions: "curtidas",
            comments: "comentários",
            saves: "salvos",
            commentsTitle: "Comentários aprovados",
            commentPlaceholder: "Deixe um comentário curto. Ele vai entrar na fila de moderação.",
            commentSend: "Enviar comentário",
            commentHelper: "Comentários novos entram como pendentes até aprovação.",
            commentPending: "Comentário enviado para moderação.",
            openProfile: "Abrir perfil",
            signInToComment: "Comentar com sua conta",
            signUpToComment: "Criar conta para comentar",
            signInToCommentHint: "Entre ou crie sua conta para participar da conversa sem perder este post.",
            signInModalTitle: "Entre para comentar neste post",
            signInModalDescription: "Escolha como você quer continuar. Depois do acesso, você volta para este mesmo post pronto para comentar.",
            signInModalSignInDescription: "Já tem conta? Entre e continue a conversa agora.",
            signInModalSignUpDescription: "Novo por aqui? Crie sua conta e participe da rede.",
            signInModalHelper: "Seu retorno acontece no mesmo perfil, no ponto exato do comentário.",
            authModalCloseLabel: "Fechar",
            authModalSignInEyebrow: "Conta existente",
            authModalSignUpEyebrow: "Novo na rede",
            commentReady: "Sua sessão foi restaurada. O campo de comentário está pronto para você.",
            reactionFailed: "Não foi possível atualizar a curtida agora.",
            saveFailed: "Não foi possível atualizar os salvos agora.",
            commentFailed: "Não foi possível enviar o comentário agora.",
            working: "Enviando...",
          }
        : {
            like: "Like",
            liked: "Liked",
            save: "Save",
            saved: "Saved",
            comment: "Comment",
            reactions: "likes",
            comments: "comments",
            saves: "saves",
            commentsTitle: "Approved comments",
            commentPlaceholder: "Leave a short comment. It will go into the moderation queue.",
            commentSend: "Send comment",
            commentHelper: "New comments stay pending until approved.",
            commentPending: "Comment sent for moderation.",
            openProfile: "Open profile",
            signInToComment: "Sign in to comment",
            signUpToComment: "Create account to comment",
            signInToCommentHint: "Sign in or create an account to join the conversation without losing this post.",
            signInModalTitle: "Sign in to comment on this post",
            signInModalDescription: "Choose how you want to continue. After access, you will come back to this same post ready to comment.",
            signInModalSignInDescription: "Already have an account? Sign in and keep the conversation going.",
            signInModalSignUpDescription: "New here? Create your account and join the network.",
            signInModalHelper: "You will return to the same profile at the exact comment spot.",
            authModalCloseLabel: "Close",
            authModalSignInEyebrow: "Existing account",
            authModalSignUpEyebrow: "New here",
            commentReady: "Your session is ready. The comment field is focused for you.",
            reactionFailed: "We could not update the like right now.",
            saveFailed: "We could not update saved posts right now.",
            commentFailed: "We could not send the comment right now.",
            working: "Sending...",
          },
    [locale],
  );
  const postHash = `#post-${post.id}`;
  const authNextPath = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}${params.toString() ? `?${params.toString()}` : ""}${postHash}`;
  }, [pathname, postHash, searchParams]);
  const signInHref = `/login?mode=signin&next=${encodeURIComponent(authNextPath)}`;
  const signUpHref = `/login?mode=signup&next=${encodeURIComponent(authNextPath)}`;

  useEffect(() => {
    if (!canComment || typeof window === "undefined") {
      return;
    }

    if (window.location.hash !== postHash) {
      return;
    }

    commentTextareaRef.current?.focus();
    setReturnMessage(copy.commentReady);

    const timeoutId = window.setTimeout(() => {
      setReturnMessage(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [canComment, copy.commentReady, postHash]);

  async function handleReaction() {
    if (!canComment) {
      setAuthModalOpen(true);
      return;
    }

    try {
      setIsReacting(true);
      setErrorMessage(null);
      const response = await fetch("/api/posts/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reacted?: boolean;
        reactionCount?: number;
      };

      if (!response.ok || !result.ok || typeof result.reacted !== "boolean") {
        setErrorMessage(copy.reactionFailed);
        return;
      }

      setHasReacted(result.reacted);
      setReactionCount(result.reactionCount ?? 0);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao reagir ao post:", error);
      setErrorMessage(copy.reactionFailed);
    } finally {
      setIsReacting(false);
    }
  }

  async function handleSave() {
    if (!canComment) {
      setAuthModalOpen(true);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);
      const response = await fetch("/api/posts/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        saved?: boolean;
        savedCount?: number;
      };

      if (!response.ok || !result.ok || typeof result.saved !== "boolean") {
        setErrorMessage(copy.saveFailed);
        return;
      }

      setHasSaved(result.saved);
      setSaveCount(result.savedCount ?? 0);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao salvar o post:", error);
      setErrorMessage(copy.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsCommenting(true);
      setErrorMessage(null);
      setFeedbackMessage(null);

      const response = await fetch("/api/posts/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
          content: commentText,
        }),
      });
      const result = (await response.json()) as { ok?: boolean };

      if (!response.ok || !result.ok) {
        setErrorMessage(copy.commentFailed);
        return;
      }

      setCommentText("");
      setFeedbackMessage(copy.commentPending);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Erro ao comentar no post:", error);
      setErrorMessage(copy.commentFailed);
    } finally {
      setIsCommenting(false);
    }
  }

  return (
    <article
      id={`post-${post.id}`}
      className={clsx(
        "rounded-[1.5rem] border bg-white/4 p-5 transition",
        returnMessage ? "border-cyan-300/24 shadow-[0_0_0_1px_rgba(103,232,249,0.1)]" : "border-white/8",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {showAuthor && post.author ? (
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                {post.author.avatarUrl ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.displayName}
                    fill
                    sizes="48px"
                    className="rounded-full object-cover object-center"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    {getInitials(post.author.displayName)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-white">{post.author.displayName}</h3>
                  <span className="text-sm text-white/44">@{post.author.username}</span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                  {formatTimestamp(post.createdAt, locale)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs uppercase tracking-[0.18em] text-white/40">
              {formatTimestamp(post.createdAt, locale)}
            </div>
          )}

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/82">{post.content}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReaction}
              disabled={isReacting}
              className={clsx(
                "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition disabled:opacity-60",
                hasReacted
                  ? "border-cyan-300/24 bg-cyan-300/12 text-cyan-100"
                  : "border-white/10 bg-white/4 text-white/70 hover:border-white/16 hover:text-white",
              )}
            >
              {hasReacted ? copy.liked : copy.like}
            </button>
            <div className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-white/64">
              {reactionCount} {copy.reactions}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={clsx(
                "inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition disabled:opacity-60",
                hasSaved
                  ? "border-cyan-300/24 bg-cyan-300/12 text-cyan-100"
                  : "border-white/10 bg-white/4 text-white/70 hover:border-white/16 hover:text-white",
              )}
            >
              {hasSaved ? copy.saved : copy.save}
            </button>
            <div className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-white/64">
              {saveCount} {copy.saves}
            </div>
            <div className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-white/64">
              {post.commentCount} {copy.comments}
            </div>
            {post.author && showProfileLink ? (
              <Link
                href={`/u/${post.author.username}`}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
              >
                {copy.openProfile}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {post.comments.length ? (
        <div className="mt-5 rounded-[1.3rem] border border-white/8 bg-white/3 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/42">{copy.commentsTitle}</div>
          <div className="mt-3 grid gap-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="rounded-[1rem] border border-white/8 bg-white/4 p-3">
                <p className="text-sm font-semibold text-white">
                  {comment.author?.displayName ?? "LinkSites"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white/74">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        {canComment ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <label className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/42">{copy.comment}</span>
              <textarea
                ref={commentTextareaRef}
                rows={3}
                maxLength={500}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={copy.commentPlaceholder}
                className={clsx(
                  "rounded-2xl border bg-white/4 px-4 py-3 text-sm text-white outline-none transition",
                  returnMessage ? "border-cyan-300/24" : "border-white/10",
                )}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isCommenting || !commentText.trim()}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-white/16 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCommenting ? copy.working : copy.commentSend}
              </button>
              <div className="text-sm text-white/48">{copy.commentHelper}</div>
            </div>
          </form>
        ) : (
          <div className="rounded-[1.3rem] border border-cyan-300/18 bg-cyan-300/8 p-4">
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cyan-300/28 bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px hover:bg-cyan-200"
            >
              {copy.signInToComment}
            </button>
            <Link
              href={signUpHref}
              className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/18 hover:text-cyan-100"
            >
              {copy.signUpToComment}
            </Link>
            <p className="mt-3 text-sm text-cyan-50/72">{copy.signInToCommentHint}</p>
          </div>
        )}
      </div>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title={copy.signInModalTitle}
        description={copy.signInModalDescription}
        closeLabel={copy.authModalCloseLabel}
        signInEyebrow={copy.authModalSignInEyebrow}
        signInLabel={copy.signInToComment}
        signInDescription={copy.signInModalSignInDescription}
        signInHref={signInHref}
        signUpEyebrow={copy.authModalSignUpEyebrow}
        signUpLabel={copy.signUpToComment}
        signUpDescription={copy.signInModalSignUpDescription}
        signUpHref={signUpHref}
        helper={copy.signInModalHelper}
      />

      {returnMessage ? <p className="mt-4 text-sm text-cyan-100">{returnMessage}</p> : null}
      {feedbackMessage ? <p className="mt-4 text-sm text-cyan-100">{feedbackMessage}</p> : null}
      {errorMessage ? <p className="mt-4 text-sm text-rose-200">{errorMessage}</p> : null}
    </article>
  );
}
