import { SocialPostCard } from "@/components/social-post-card";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type SavedPostsPanelProps = {
  posts: SocialPost[];
  locale: AppLocale;
};

export function SavedPostsPanel({ posts, locale }: SavedPostsPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Salvos",
          title: "Posts que você guardou para revisitar",
          description: "Mantenha por perto os posts que mais chamaram sua atenção e volte a eles sem depender do feed.",
          emptyTitle: "Nenhum post salvo ainda",
          emptyDescription: "Quando você salvar um post da rede, ele aparece aqui para consulta rápida.",
        }
      : {
          label: "Saved",
          title: "Posts you kept to revisit",
          description: "Keep the posts that caught your attention close at hand and revisit them without relying on the feed.",
          emptyTitle: "No saved posts yet",
          emptyDescription: "As soon as you save a post from the network, it will appear here for quick access.",
        };

  return (
    <section className="dashboard-panel rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {posts.length ? (
        <div className="mt-6 grid gap-4">
          {posts.map((post) => (
            <SocialPostCard key={post.id} post={post} locale={locale} canComment />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{copy.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
