"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type SocialPostCardProps = {
  post: SocialPost;
  locale: AppLocale;
  showAuthor?: boolean;
  canComment?: boolean;
  authPromptHref?: string;
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
  canComment = false,
  authPromptHref = "/login?message=sign_in_required",
}: SocialPostCardProps) {
  const router = useRouter();
  const [reactionCount, setReactionCount] = useState(post.reactionCount);
  const [hasReacted, setHasReacted] = useState(post.viewerHasReacted);
  const [isReacting, setIsReacting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const copy = useMemo(
    () =>
      locale === "ptBR"
        ? {
            like: "Curtir",
            liked: "Curtido",
            comment: "Comentar",
            reactions: "curtidas",
            comments: "comentarios",
            commentsTitle: "Comentarios aprovados",
            commentPlaceholder: "Deixe um comentario curto. Ele vai entrar na fila de moderacao.",
            commentSend: "Enviar comentario",
            commentHelper: "Comentarios novos entram como pendentes ate aprovacao.",
            commentPending: "Comentario enviado para moderacao.",
            openProfile: "Abrir perfil",
            signInToComment: "Entre para comentar",
            reactionFailed: "Nao foi possivel atualizar a curtida agora.",
            commentFailed: "Nao foi possivel enviar o comentario agora.",
            working: "Enviando...",
          }
        : {
            like: "Like",
            liked: "Liked",
            comment: "Comment",
            reactions: "likes",
            comments: "comments",
            commentsTitle: "Approved comments",
            commentPlaceholder: "Leave a short comment. It will go into the moderation queue.",
            commentSend: "Send comment",
            commentHelper: "New comments stay pending until approved.",
            commentPending: "Comment sent for moderation.",
            openProfile: "Open profile",
            signInToComment: "Sign in to comment",
            reactionFailed: "We could not update the like right now.",
            commentFailed: "We could not send the comment right now.",
            working: "Sending...",
          },
    [locale],
  );

  async function handleReaction() {
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
    <article className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
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
            <div className="rounded-full border border-white/10 bg-white/4 px-3 py-2 text-xs text-white/64">
              {post.commentCount} {copy.comments}
            </div>
            {post.author ? (
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
                rows={3}
                maxLength={500}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={copy.commentPlaceholder}
                className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none"
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
          <Link
            href={authPromptHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-white/16 hover:text-white"
          >
            {copy.signInToComment}
          </Link>
        )}
      </div>

      {feedbackMessage ? <p className="mt-4 text-sm text-cyan-100">{feedbackMessage}</p> : null}
      {errorMessage ? <p className="mt-4 text-sm text-rose-200">{errorMessage}</p> : null}
    </article>
  );
}
