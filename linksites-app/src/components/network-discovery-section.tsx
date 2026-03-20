import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/lib/locale";
import type { PublicDirectoryProfile } from "@/lib/types";
import { appContent } from "@/data/app-content";

type NetworkDiscoverySectionProps = {
  profiles: PublicDirectoryProfile[];
  locale?: AppLocale;
  variant?: "grid" | "stack";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function NetworkDiscoverySection({
  profiles,
  locale = "ptBR",
  variant = "grid",
}: NetworkDiscoverySectionProps) {
  const content = appContent[locale].dashboard.discovery;
  const gridClassName =
    variant === "stack"
      ? "mt-5 grid gap-4"
      : "mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="dashboard-panel dashboard-rise rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.label}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {content.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{content.description}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
          {profiles.length} {profiles.length === 1 ? content.profileSingular : content.profilePlural}
        </div>
      </div>

      {profiles.length ? (
        <div className={gridClassName}>
          {profiles.map((profile) => (
            <article
              key={profile.id}
              className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/18 hover:bg-white/6"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 bg-slate-950 text-sm font-semibold text-white">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      fill
                      sizes="56px"
                      className="scale-[1.08] rounded-full object-cover object-center"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      {getInitials(profile.displayName)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-white">{profile.displayName}</h3>
                  <p className="mt-1 truncate text-sm text-white/60">@{profile.username}</p>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-white/64">
                {profile.bio || content.emptyBio}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
                  {profile.followersCount} {profile.followersCount === 1 ? content.followerSingular : content.followerPlural}
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
                  {profile.activeLinksCount} {profile.activeLinksCount === 1 ? content.linkSingular : content.linkPlural}
                </div>
              </div>

              <Link
                href={`/u/${profile.username}`}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
              >
                {content.openProfile}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{content.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{content.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
