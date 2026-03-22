import Link from "next/link";
import type { OnboardingSummary } from "@/lib/onboarding";
import type { ProfileWithLinks } from "@/lib/types";
import type { DashboardCopy } from "@/components/dashboard/dashboard-types";
import type { AppLocale } from "@/lib/locale";

type DashboardSidebarProps = {
  locale: AppLocale;
  content: DashboardCopy;
  profile: ProfileWithLinks;
  onboarding: OnboardingSummary;
  publicProfileUrl: string;
  usingMockData: boolean;
  currentPath: string;
};

export function DashboardSidebar({
  locale,
  content,
  profile,
  onboarding,
  publicProfileUrl,
  usingMockData,
  currentPath,
}: DashboardSidebarProps) {
  const sectionLinks =
    locale === "ptBR"
      ? [
          { href: "/dashboard", label: "Visão geral", description: "Status, onboarding e link público" },
          { href: "/dashboard/analytics", label: "Analytics", description: "Leitura rápida da performance" },
          { href: "/dashboard/profile", label: "Perfil", description: "Identidade, tema e publicação" },
          { href: "/dashboard/links", label: "Links", description: "Botões, ordem e visibilidade" },
          { href: "/dashboard/posts", label: "Posts", description: "Atualizações curtas e feed público" },
          { href: "/dashboard/network", label: "Rede", description: "Descoberta, conexões e atividade" },
          { href: "/dashboard/notifications", label: "Notificações", description: "Seguidores, alertas e fila social" },
          { href: "/dashboard/messages", label: "Mensagens", description: "Conversas privadas entre amigos" },
        ]
      : [
          { href: "/dashboard", label: "Overview", description: "Status, onboarding, and public link" },
          { href: "/dashboard/analytics", label: "Analytics", description: "Quick performance read" },
          { href: "/dashboard/profile", label: "Profile", description: "Identity, theme, and publishing" },
          { href: "/dashboard/links", label: "Links", description: "Buttons, order, and visibility" },
          { href: "/dashboard/posts", label: "Posts", description: "Short updates and public feed" },
          { href: "/dashboard/network", label: "Network", description: "Social layer and discovery" },
          { href: "/dashboard/notifications", label: "Notifications", description: "Followers, alerts, and social queue" },
          { href: "/dashboard/messages", label: "Messages", description: "Private conversations between friends" },
        ];

  return (
    <aside className="dashboard-panel rounded-[1.8rem] border border-white/8 bg-[var(--panel)] p-5">
      <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.profileStatusLabel}</div>
        <p className="mt-3 text-lg font-semibold text-white">
          {profile.isPublished ? content.profilePublished : content.profileDraft}
        </p>
        <p className="mt-2 text-sm leading-7 text-white/58">
          {onboarding.completedCount}/{onboarding.totalCount} {content.onboardingCompletedLabel}
        </p>
      </div>

      <nav className="mt-5 space-y-2">
        {sectionLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group block rounded-[1.2rem] border px-4 py-3 transition hover:-translate-y-px ${
              currentPath === item.href
                ? "border-cyan-300/28 bg-cyan-300/10"
                : "border-white/8 bg-white/3 hover:border-cyan-300/18 hover:bg-white/6"
            }`}
          >
            <div className="text-sm font-semibold text-white group-hover:text-cyan-100">{item.label}</div>
            <p className="mt-1 text-sm leading-6 text-white/56">{item.description}</p>
          </Link>
        ))}
      </nav>

      <div className="mt-5 rounded-[1.4rem] border border-white/8 bg-white/3 p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">{content.publicCardUrlLabel}</div>
        <p className="mt-3 break-all text-sm leading-6 text-white/72">{publicProfileUrl}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={publicProfileUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
              profile.isPublished
                ? "bg-cyan-300/12 text-cyan-100 hover:-translate-y-px"
                : "pointer-events-none border border-white/10 bg-white/4 text-white/42"
            }`}
            aria-disabled={!profile.isPublished}
          >
            {content.publicCardOpen}
          </a>
          <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm text-white/60">
            {usingMockData ? content.sessionFallback : content.identityLive}
          </span>
        </div>
      </div>
    </aside>
  );
}
