import type { ReactNode } from "react";
import { createPost, deletePost } from "@/app/dashboard/actions";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type DashboardPostsPanelProps = {
  locale: AppLocale;
  posts: SocialPost[];
  usingMockData: boolean;
  feedbackError: string | null;
  feedbackMessage: string | null;
  redirectTo?: string;
};

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
          : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      }`}
    >
      {children}
    </div>
  );
}

function formatTimestamp(value: string, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale === "ptBR" ? "pt-BR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DashboardPostsPanel({
  locale,
  posts,
  usingMockData,
  feedbackError,
  feedbackMessage,
  redirectTo = "/dashboard/posts",
}: DashboardPostsPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Posts",
          title: "Posts curtos para movimentar sua rede",
          description:
            "Publique atualizações rápidas para aparecer no seu perfil público e alimentar a atividade dos perfis que seguem você.",
          cta: "Publicar post",
          placeholder: "Escreva uma atualização curta, uma novidade, um convite ou um contexto rápido para seus links.",
          helper: "Até 280 caracteres por post.",
          emptyTitle: "Você ainda não publicou nenhum post",
          emptyDescription: "Seu primeiro post já ajuda o perfil público a parecer vivo e alimenta o feed da sua rede.",
          delete: "Remover",
          likes: "curtidas",
          comments: "comentários",
          saves: "salvos",
          mockReadonly: "O modo mock não salva posts reais. Conecte o Supabase para publicar no banco.",
        }
      : {
          label: "Posts",
          title: "Short posts to move your network",
          description:
            "Publish quick updates to appear on your public profile and feed activity for the profiles following you.",
          cta: "Publish post",
          placeholder: "Write a short update, a launch, an invitation, or a quick piece of context for your links.",
          helper: "Up to 280 characters per post.",
          emptyTitle: "You have not published any posts yet",
          emptyDescription: "Your first post already makes the public profile feel alive and unlocks the feed layer in the network.",
          delete: "Remove",
          likes: "likes",
          comments: "comments",
          saves: "saves",
          mockReadonly: "Mock mode does not save real posts. Connect Supabase to publish to the database.",
        };

  return (
    <section className="dashboard-panel dashboard-rise rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
          {posts.length} posts
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {feedbackError ? <Notice tone="error">{feedbackError}</Notice> : null}
        {feedbackMessage ? <Notice tone="info">{feedbackMessage}</Notice> : null}
        {usingMockData ? <Notice tone="info">{copy.mockReadonly}</Notice> : null}
      </div>

      <form action={createPost} className="mt-6">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{copy.label}</span>
          <textarea
            name="content"
            rows={4}
            maxLength={280}
            disabled={usingMockData}
            placeholder={copy.placeholder}
            className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <div className="mt-3 text-sm text-white/50">{copy.helper}</div>
        <button
          disabled={usingMockData}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {copy.cta}
        </button>
      </form>

      {posts.length ? (
        <div className="mt-8 grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/42">
                    {formatTimestamp(post.createdAt, locale)}
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/82">{post.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {post.reactionCount} {copy.likes}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {post.commentCount} {copy.comments}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {post.savedCount} {copy.saves}
                    </div>
                  </div>
                </div>

                <form action={deletePost}>
                  <input type="hidden" name="redirectTo" value={redirectTo} />
                  <input type="hidden" name="postId" value={post.id} />
                  <button
                    disabled={usingMockData}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-medium text-white/72 transition hover:border-rose-300/24 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {copy.delete}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{copy.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
