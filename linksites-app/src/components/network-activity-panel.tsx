import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/lib/locale";
import type { NetworkActivityItem } from "@/lib/types";

type NetworkActivityPanelProps = {
  items: NetworkActivityItem[];
  locale: AppLocale;
  title?: string;
  description?: string;
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
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function NetworkActivityPanel({ items, locale, title, description }: NetworkActivityPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Atividade",
          title: title ?? "Atividade recente da rede",
          description:
            description ?? "Um panorama leve do que está se movendo entre seguidores, perfis novos e conexões que valem revisita.",
          emptyTitle: "Sem atividade recente por enquanto",
          emptyDescription: "Conforme sua rede crescer, este painel vai destacar seguidores, reações e perfis frescos.",
          newFollower: "começou a seguir você.",
          postLike: "curtiu um dos seus posts.",
          newComment: "comentou em um dos seus posts.",
          newProfileFollowing: "está disponível na sua rede e vale uma nova visita.",
          newProfileRecommended: "entrou recentemente na rede e pode combinar com seu perfil.",
          openProfile: "Abrir perfil",
          genericProfile: "Um perfil da rede",
          unread: "novo",
        }
      : {
          label: "Activity",
          title: title ?? "Recent network activity",
          description:
            description ?? "A lightweight snapshot of movement across followers, fresh profiles, and connections worth revisiting.",
          emptyTitle: "No recent activity yet",
          emptyDescription: "As your network grows, this panel will highlight followers, reactions, and fresh profiles.",
          newFollower: "started following you.",
          postLike: "liked one of your posts.",
          newComment: "commented on one of your posts.",
          newProfileFollowing: "is now available inside your network and worth revisiting.",
          newProfileRecommended: "joined the network recently and may fit your profile.",
          openProfile: "Open profile",
          genericProfile: "A profile from the network",
          unread: "new",
        };

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{copy.title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{copy.description}</p>
      </div>

      {items.length ? (
        <div className="mt-5 grid gap-3">
          {items.map((item) => {
            const profileName = item.profile?.displayName ?? copy.genericProfile;
            const message =
              item.type === "new_follower"
                ? copy.newFollower
                : item.type === "post_like"
                  ? copy.postLike
                  : item.type === "new_comment"
                    ? copy.newComment
                    : item.source === "following"
                      ? copy.newProfileFollowing
                      : copy.newProfileRecommended;

            return (
              <article key={item.id} className="rounded-[1.3rem] border border-white/8 bg-white/4 p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                    {item.profile?.avatarUrl ? (
                      <Image
                        src={item.profile.avatarUrl}
                        alt={profileName}
                        fill
                        sizes="48px"
                        className="rounded-full object-cover object-center"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">{getInitials(profileName)}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm leading-6 text-white">
                        <span className="font-semibold">{profileName}</span> {message}
                      </p>
                      {item.read === false ? (
                        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
                          {copy.unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/40">
                      {formatTimestamp(item.createdAt, locale)}
                    </p>
                    {item.profile ? (
                      <Link
                        href={`/u/${item.profile.username}`}
                        className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/72 transition hover:border-white/16 hover:text-white"
                      >
                        {copy.openProfile}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{copy.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{copy.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
