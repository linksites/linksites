import { SocialPostCard } from "@/components/social-post-card";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type FollowingPostsFeedPanelProps = {
  posts: SocialPost[];
  locale: AppLocale;
};

export function FollowingPostsFeedPanel({ posts, locale }: FollowingPostsFeedPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Feed",
          title: "Atividade dos perfis que voce segue",
          description: "Um feed leve para acompanhar quem publicou algo novo sem sair da camada de descoberta.",
          emptyTitle: "Nenhum post recente dos perfis seguidos",
          emptyDescription: "Quando os perfis da sua rede publicarem atualizacoes, elas vao aparecer aqui.",
        }
      : {
          label: "Feed",
          title: "Activity from profiles you follow",
          description: "A lightweight feed to keep up with fresh updates without leaving the discovery layer.",
          emptyTitle: "No recent posts from followed profiles",
          emptyDescription: "As profiles in your network publish updates, they will show up here.",
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
