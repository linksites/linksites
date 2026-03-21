import { NetworkProfileCard } from "@/components/network-profile-card";
import type { AppLocale } from "@/lib/locale";
import type { PublicDirectoryProfile } from "@/lib/types";
import { appContent } from "@/data/app-content";

type NetworkDiscoverySectionProps = {
  profiles: PublicDirectoryProfile[];
  locale?: AppLocale;
  variant?: "grid" | "stack";
  label?: string;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

export function NetworkDiscoverySection({
  profiles,
  locale = "ptBR",
  variant = "grid",
  label,
  title,
  description,
  emptyTitle,
  emptyDescription,
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
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">{label ?? content.label}</div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {title ?? content.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{description ?? content.description}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
          {profiles.length} {profiles.length === 1 ? content.profileSingular : content.profilePlural}
        </div>
      </div>

      {profiles.length ? (
        <div className={gridClassName}>
          {profiles.map((profile) => (
            <NetworkProfileCard
              key={profile.id}
              profile={profile}
              locale={locale}
              compact={variant === "stack"}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-5 py-6">
          <p className="text-sm font-semibold text-white">{emptyTitle ?? content.emptyTitle}</p>
          <p className="mt-2 text-sm leading-7 text-white/60">{emptyDescription ?? content.emptyDescription}</p>
        </div>
      )}
    </section>
  );
}
