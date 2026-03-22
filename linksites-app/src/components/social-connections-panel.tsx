import Image from "next/image";
import Link from "next/link";
import { FriendRequestButton } from "@/components/friend-request-button";
import FollowButton from "@/components/FollowButton";
import { StartConversationButton } from "@/components/start-conversation-button";
import type { AppLocale } from "@/lib/locale";
import type { PublicDirectoryProfile } from "@/lib/types";

type SocialConnectionsPanelProps = {
  profiles: PublicDirectoryProfile[];
  locale: AppLocale;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SocialConnectionsPanel({
  profiles,
  locale,
  title,
  description,
  emptyTitle,
  emptyDescription,
}: SocialConnectionsPanelProps) {
  const copy =
    locale === "ptBR"
      ? {
          label: "Conexões",
          followers: "seguidores",
          links: "links",
          openProfile: "Ver perfil",
          friends: "Amigos",
        }
      : {
          label: "Connections",
          followers: "followers",
          links: "links",
          openProfile: "View profile",
          friends: "Friends",
        };

  return (
    <section className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.label}</div>
        <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
      </div>

      {profiles.length ? (
        <div className="mt-5 grid gap-3">
          {profiles.map((profile) => (
            <article key={profile.id} className="rounded-[1.3rem] border border-white/8 bg-white/4 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      fill
                      sizes="48px"
                      className="rounded-full object-cover object-center"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      {getInitials(profile.displayName)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-white">{profile.displayName}</h3>
                  <p className="mt-1 truncate text-sm text-white/60">@{profile.username}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {profile.followersCount} {copy.followers}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                      {profile.activeLinksCount} {copy.links}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex w-full max-w-[24rem] flex-col gap-3">
                <FollowButton
                  targetProfileId={profile.id}
                  initialIsFollowing={profile.isFollowing}
                  locale={locale}
                  className="min-h-11 w-full"
                />

                {profile.isFriend ? (
                  <>
                    <StartConversationButton
                      targetProfileId={profile.id}
                      locale={locale}
                      className="min-h-11 w-full"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex min-h-11 min-w-[6.25rem] items-center justify-center rounded-full border border-emerald-300/24 bg-emerald-300/12 px-4 py-2 text-sm font-medium text-emerald-100">
                        {copy.friends}
                      </span>
                      <Link
                        href={`/u/${profile.username}`}
                        className="inline-flex min-h-11 min-w-[5.75rem] items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
                      >
                        {copy.openProfile}
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <FriendRequestButton
                      targetProfileId={profile.id}
                      initialStatus={profile.friendshipStatus}
                      locale={locale}
                      className="min-h-11 w-full"
                    />
                    <Link
                      href={`/u/${profile.username}`}
                      className="inline-flex min-h-11 min-w-[5.75rem] items-center justify-center self-start rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
                    >
                      {copy.openProfile}
                    </Link>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
