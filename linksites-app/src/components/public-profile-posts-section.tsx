import { SocialPostCard } from "@/components/social-post-card";
import type { AppLocale } from "@/lib/locale";
import type { SocialPost } from "@/lib/types";

type PublicProfilePostsSectionProps = {
  posts: SocialPost[];
  locale: AppLocale;
  canComment?: boolean;
};

export function PublicProfilePostsSection({
  posts,
  locale,
  canComment = false,
}: PublicProfilePostsSectionProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Atualizações",
          title: "Posts recentes",
          description: "Uma camada curta de contexto para mostrar novidades, lançamentos e movimentos por trás dos links.",
        }
      : {
          label: "Updates",
          title: "Recent posts",
          description: "A short context layer to show launches, quick notes, and movement behind the links.",
        };

  if (!posts.length) {
    return null;
  }

  return (
    <section className="w-full max-w-3xl rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      <div className="mt-6 grid gap-4">
        {posts.map((post) => (
          <SocialPostCard
            key={post.id}
            post={post}
            locale={locale}
            showAuthor={false}
            showProfileLink={false}
            canComment={canComment}
          />
        ))}
      </div>
    </section>
  );
}
