import clsx from "clsx";
import Image from "next/image";
import { appContent } from "@/data/app-content";
import type { AppLocale } from "@/lib/locale";
import { themeCatalog } from "@/lib/mock-data";
import type { ProfileWithLinks } from "@/lib/types";

type ProfilePreviewProps = {
  profile: ProfileWithLinks;
  compact?: boolean;
  locale?: AppLocale;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfilePreview({ profile, compact = false, locale = "ptBR" }: ProfilePreviewProps) {
  const theme = themeCatalog[profile.themeSlug];
  const content = appContent[locale];

  return (
    <section
      className={clsx(
        "rounded-[2rem] border border-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
        compact ? "w-full max-w-md" : "w-full max-w-lg",
      )}
      style={{
        background: theme.background,
        color: theme.text,
      }}
      >
        <div
          className="rounded-[1.7rem] border border-white/8 p-5 backdrop-blur"
          style={{ backgroundColor: theme.panel }}
        >
        <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/8 text-xl font-semibold">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            getInitials(profile.displayName)
          )}
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">{profile.displayName}</h3>
          <p className="mt-2 text-sm opacity-70">@{profile.username}</p>
          <p className="mt-4 text-sm leading-7 opacity-80">{profile.bio}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {profile.links.filter((link) => link.isActive).map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-13 items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:-translate-y-px"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <span>{link.title}</span>
              <span className="text-[var(--accent)]">{content.shared.previewOpen}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
