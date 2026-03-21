"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FollowButton from "@/components/FollowButton";
import { appContent } from "@/data/app-content";
import type { AppLocale } from "@/lib/locale";
import type { DiscoveryReason, PublicDirectoryProfile } from "@/lib/types";

type NetworkProfileCardProps = {
  profile: PublicDirectoryProfile;
  locale: AppLocale;
  compact?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getReasonLabel(locale: AppLocale, reason: DiscoveryReason, isFollowing: boolean) {
  const effectiveReason = isFollowing ? "following" : reason;

  if (locale === "ptBR") {
    switch (effectiveReason) {
      case "following":
        return "Voce ja acompanha";
      case "trending":
        return "Perfil em alta";
      case "link_rich":
        return "Muitos links ativos";
      case "complete":
        return "Perfil bem apresentado";
      default:
        return "Novo criador para descobrir";
    }
  }

  switch (effectiveReason) {
    case "following":
      return "Already in your network";
    case "trending":
      return "Trending profile";
    case "link_rich":
      return "Many active links";
    case "complete":
      return "Well-presented profile";
    default:
      return "New creator to discover";
  }
}

export function NetworkProfileCard({
  profile,
  locale,
  compact = false,
}: NetworkProfileCardProps) {
  const content = appContent[locale].dashboard.discovery;
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing);
  const [followersCount, setFollowersCount] = useState(profile.followersCount);

  function handleFollowChange(nextState: { isFollowing: boolean; followersCount: number | null }) {
    setIsFollowing(nextState.isFollowing);
    setFollowersCount((currentCount) =>
      typeof nextState.followersCount === "number"
        ? nextState.followersCount
        : Math.max(0, currentCount + (nextState.isFollowing ? 1 : -1)),
    );
  }

  return (
    <article className="overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/4 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/18 hover:bg-white/6">
      <div className={`flex gap-3 ${compact ? "flex-col" : "flex-wrap items-start justify-between"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
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

        <div
          className={`max-w-full rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-medium text-cyan-100 ${
            compact ? "self-start whitespace-normal" : "whitespace-normal text-right"
          }`}
        >
          {getReasonLabel(locale, profile.discoveryReason, isFollowing)}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-white/64">
        {profile.bio || content.emptyBio}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
          {followersCount} {followersCount === 1 ? content.followerSingular : content.followerPlural}
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/72">
          {profile.activeLinksCount} {profile.activeLinksCount === 1 ? content.linkSingular : content.linkPlural}
        </div>
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <FollowButton
          targetProfileId={profile.id}
          initialIsFollowing={isFollowing}
          onFollowChange={handleFollowChange}
          locale={locale}
          className="min-h-11 w-full"
        />
        <Link
          href={`/u/${profile.username}`}
          className="inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px"
        >
          {content.openProfile}
        </Link>
      </div>
    </article>
  );
}
