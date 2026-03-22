import Link from "next/link";
import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { FriendRequestsPanel } from "@/components/friend-requests-panel";
import { FollowingPostsFeedPanel } from "@/components/following-posts-feed-panel";
import { NetworkDiscoverySection } from "@/components/network-discovery-section";
import { NetworkActivityPanel } from "@/components/network-activity-panel";
import { NotificationsPanel } from "@/components/notifications-panel";
import { SavedPostsPanel } from "@/components/saved-posts-panel";
import { SocialConnectionsPanel } from "@/components/social-connections-panel";
import { getDashboardPageData } from "@/lib/dashboard";
import { getNetworkProfiles } from "@/lib/profiles";
import type { AppLocale } from "@/lib/locale";
import {
  getFriendRequests,
  getFriends,
  getFollowingPostsFeed,
  getNetworkActivity,
  getNotifications,
  getSavedPosts,
  getSocialConnections,
  getUnreadNotificationsCount,
} from "@/lib/social";
import type { PublicDirectoryProfile } from "@/lib/types";

type DashboardNetworkPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    tab?: string;
    view?: string;
    sort?: string;
  }>;
};

type NetworkView = "all" | "following" | "recommended";
type NetworkSort = "smart" | "followers" | "links" | "new";
type NetworkTab = "discover" | "feed" | "saved";

function resolveTab(value?: string): NetworkTab {
  if (value === "feed" || value === "saved") {
    return value;
  }

  return "discover";
}

function resolveView(value?: string): NetworkView {
  if (value === "following" || value === "recommended") {
    return value;
  }

  return "all";
}

function resolveSort(value?: string): NetworkSort {
  if (value === "followers" || value === "links" || value === "new") {
    return value;
  }

  return "smart";
}

function sortProfiles(profiles: PublicDirectoryProfile[], sort: NetworkSort) {
  return [...profiles].sort((left, right) => {
    switch (sort) {
      case "followers":
        if (right.followersCount !== left.followersCount) {
          return right.followersCount - left.followersCount;
        }
        break;
      case "links":
        if (right.activeLinksCount !== left.activeLinksCount) {
          return right.activeLinksCount - left.activeLinksCount;
        }
        break;
      case "new":
        if (right.createdAt !== left.createdAt) {
          return right.createdAt.localeCompare(left.createdAt);
        }
        break;
      default:
        if (right.discoveryScore !== left.discoveryScore) {
          return right.discoveryScore - left.discoveryScore;
        }
        break;
    }

    if (right.followersCount !== left.followersCount) {
      return right.followersCount - left.followersCount;
    }

    if (right.activeLinksCount !== left.activeLinksCount) {
      return right.activeLinksCount - left.activeLinksCount;
    }

    return left.username.localeCompare(right.username);
  });
}

function createQueryString(tab: NetworkTab, view: NetworkView, sort: NetworkSort) {
  const params = new URLSearchParams();

  if (tab !== "discover") {
    params.set("tab", tab);
  }

  if (view !== "all") {
    params.set("view", view);
  }

  if (sort !== "smart") {
    params.set("sort", sort);
  }

  const query = params.toString();
  return query ? `/dashboard/network?${query}` : "/dashboard/network";
}

function getNetworkCopy(locale: AppLocale) {
  if (locale === "ptBR") {
    return {
      stats: {
        visible: "Visíveis agora",
        following: "Na sua rede",
        recommended: "Recomendados",
      },
      filters: {
        tabs: "Abas",
        discoverTab: "Descoberta",
        feedTab: "Feed",
        savedTab: "Salvos",
        view: "Visão",
        sort: "Ordenação",
        all: "Tudo",
        following: "Seguindo",
        recommended: "Recomendados",
        smart: "Inteligente",
        followers: "Mais seguidores",
        links: "Mais links",
        recent: "Mais novos",
      },
      mainSections: {
        all: {
          title: "Toda a rede publicada",
          description: "Misture perfis que você já segue com novas sugestões e encontre criadores mais fortes para abrir ou acompanhar.",
          emptyTitle: "Ainda não encontramos perfis para mostrar aqui",
          emptyDescription: "Quando mais pessoas publicarem seus perfis, esta grade vai ganhar novos criadores para descobrir.",
        },
        following: {
          title: "Perfis que você já segue",
          description: "Acompanhe sua própria rede e volte rápido para os criadores que já fazem parte da sua curadoria.",
          emptyTitle: "Você ainda não segue ninguém",
          emptyDescription: "Use os cards recomendados abaixo para começar a montar sua rede dentro do LinkSites.",
        },
        recommended: {
          title: "Recomendados para você",
          description: "Uma lista focada em perfis com mais potencial de descoberta para transformar esta área no início da sua rede.",
          emptyTitle: "Não há recomendações novas por enquanto",
          emptyDescription: "Quando novos perfis forem publicados ou sua rede crescer, esta lista volta a ganhar sugestões.",
        },
      },
      highlights: {
        followingTitle: "Seguindo",
        followingDescription: "Perfis que já estão conectados com você e merecem retorno rápido.",
        followingEmptyTitle: "Nenhum perfil seguido ainda",
        followingEmptyDescription: "Comece pelos recomendados para construir a sua primeira rede.",
        recommendedTitle: "Recomendados",
        recommendedDescription: "Sugestões para ampliar alcance, repertório e conexões dentro do produto.",
        recommendedEmptyTitle: "Sem sugestões novas agora",
        recommendedEmptyDescription: "Publique mais perfis e a descoberta vai ficar mais rica.",
      },
      feed: {
        title: "Feed da sua rede",
        description: "Acompanhe publicações recentes dos perfis que você segue e use os salvos para guardar o que merece retorno.",
      },
      saved: {
        title: "Posts salvos",
        description: "Seu acervo pessoal de posts guardados para revisitar, responder ou transformar em referência dentro da rede.",
      },
    };
  }

  return {
    stats: {
      visible: "Visible now",
      following: "In your network",
      recommended: "Recommended",
    },
    filters: {
      tabs: "Tabs",
      discoverTab: "Discovery",
      feedTab: "Feed",
      savedTab: "Saved",
      view: "View",
      sort: "Sort",
      all: "All",
      following: "Following",
      recommended: "Recommended",
      smart: "Smart",
      followers: "Most followers",
      links: "Most links",
      recent: "Newest",
    },
    mainSections: {
      all: {
        title: "The full published network",
        description: "Mix profiles you already follow with fresh suggestions and find stronger creators to open or follow next.",
        emptyTitle: "We could not find profiles to show here yet",
        emptyDescription: "As more people publish their pages, this grid will keep filling up with new creators to discover.",
      },
      following: {
        title: "Profiles you already follow",
        description: "Stay close to your own network and jump back into the creators that already belong to your curation.",
        emptyTitle: "You are not following anyone yet",
        emptyDescription: "Use the recommended cards below to start building your network inside LinkSites.",
      },
      recommended: {
        title: "Recommended for you",
        description: "A focused list of profiles with stronger discovery potential to turn this page into the start of your network.",
        emptyTitle: "There are no fresh recommendations right now",
        emptyDescription: "As new profiles go live and your network grows, this list will keep updating.",
      },
    },
    highlights: {
      followingTitle: "Following",
      followingDescription: "Profiles already connected to you and worth keeping close.",
      followingEmptyTitle: "No followed profiles yet",
      followingEmptyDescription: "Start with the recommended creators below to build your first network.",
      recommendedTitle: "Recommended",
      recommendedDescription: "Suggestions to expand your reach, taste, and connections inside the product.",
      recommendedEmptyTitle: "No fresh suggestions right now",
      recommendedEmptyDescription: "Publish more profiles and discovery will become richer here.",
    },
    feed: {
      title: "Your network feed",
      description: "Follow fresh posts from profiles you already follow and keep the best ones close with saved posts.",
    },
    saved: {
      title: "Saved posts",
      description: "Your personal collection of posts kept to revisit, reply to, or use as references inside the network.",
    },
  };
}

export default async function DashboardNetworkPage({ searchParams }: DashboardNetworkPageProps) {
  const params = await searchParams;
  const selectedTab = resolveTab(params.tab);
  const selectedView = resolveView(params.view);
  const selectedSort = resolveSort(params.sort);
  const data = await getDashboardPageData(params, { networkLimit: 6, networkScope: "recommended" });
  const copy = getNetworkCopy(data.locale);
  const viewerProfileId = data.profile.id;

  const [mainProfilesRaw, followingProfilesRaw, recommendedProfilesRaw, followers, notifications, unreadCount, activity, followingFeed, savedPosts, friendRequests, friends] =
    await Promise.all([
      getNetworkProfiles({
        viewerProfileId,
        excludeProfileId: viewerProfileId,
        limit: 18,
        scope: selectedView,
      }),
      getNetworkProfiles({
        viewerProfileId,
        excludeProfileId: viewerProfileId,
        limit: 6,
        scope: "following",
      }),
      getNetworkProfiles({
        viewerProfileId,
        excludeProfileId: viewerProfileId,
        limit: 6,
        scope: "recommended",
      }),
      getSocialConnections({
        profileId: viewerProfileId,
        viewerProfileId,
        kind: "followers",
        limit: 6,
      }),
      getNotifications({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 6,
      }),
      getUnreadNotificationsCount(viewerProfileId),
      getNetworkActivity({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 6,
      }),
      getFollowingPostsFeed({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 8,
      }),
      getSavedPosts({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 6,
      }),
      getFriendRequests({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 6,
      }),
      getFriends({
        profileId: viewerProfileId,
        viewerProfileId,
        limit: 6,
      }),
    ]);

  const mainProfiles = sortProfiles(mainProfilesRaw, selectedSort);
  const followingProfiles = sortProfiles(followingProfilesRaw, "smart");
  const recommendedProfiles = sortProfiles(recommendedProfilesRaw, "smart");
  const mainSection = copy.mainSections[selectedView];
  const filterOptions = [
    { key: "all" as const, label: copy.filters.all },
    { key: "following" as const, label: copy.filters.following },
    { key: "recommended" as const, label: copy.filters.recommended },
  ];
  const tabOptions = [
    { key: "discover" as const, label: copy.filters.discoverTab },
    { key: "feed" as const, label: copy.filters.feedTab },
    { key: "saved" as const, label: copy.filters.savedTab },
  ];
  const sortOptions = [
    { key: "smart" as const, label: copy.filters.smart },
    { key: "followers" as const, label: copy.filters.followers },
    { key: "links" as const, label: copy.filters.links },
    { key: "new" as const, label: copy.filters.recent },
  ];
  const connectionsCopy =
    data.locale === "ptBR"
      ? {
          followersTitle: "Seguidores para cultivar",
          followersDescription: "Perfis que já se aproximaram de você e podem virar uma relação mais forte dentro da rede.",
          followersEmptyTitle: "Sem seguidores por enquanto",
          followersEmptyDescription: "Quando novos perfis seguirem você, esta lista vai começar a ganhar movimento.",
          followingTitle: "Perfis que você segue",
          followingDescription: "Os perfis que você já acompanha para manter a rede viva e com retorno constante.",
          followingEmptyTitle: "Você ainda não segue perfis",
          followingEmptyDescription: "Comece pelos recomendados acima para formar sua primeira rede de conexões.",
        }
      : {
          followersTitle: "Followers to nurture",
          followersDescription: "Profiles that already moved closer to you and can become stronger relationships inside the network.",
          followersEmptyTitle: "No followers yet",
          followersEmptyDescription: "As new profiles follow you, this list will start gaining movement.",
          followingTitle: "Your following base",
          followingDescription: "The profiles you already follow to keep the network active and worth revisiting.",
          followingEmptyTitle: "You are not following profiles yet",
          followingEmptyDescription: "Start with the recommended cards above to form your first social layer.",
        };

  return (
    <DashboardFrame
      locale={data.locale}
      sharedContent={data.content.shared}
      dashboardContent={data.content.dashboard}
      dashboardTitle={data.dashboardTitle}
      profile={data.profile}
      onboarding={data.onboarding}
      publicProfileUrl={data.publicProfileUrl}
      usingMockData={data.usingMockData}
      networkProfiles={data.networkProfiles}
      currentPath="/dashboard/network"
      asideAnalytics={data.analytics}
    >
      <section className="dashboard-panel dashboard-rise rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">
            {data.content.dashboard.discovery.label}
          </div>
          <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
            {data.content.dashboard.discovery.title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/60">
            {data.content.dashboard.discovery.description}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.stats.visible}</div>
            <p className="mt-3 text-2xl font-semibold text-white">{mainProfiles.length}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.stats.following}</div>
            <p className="mt-3 text-2xl font-semibold text-white">{followingProfiles.length}</p>
          </div>
          <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.stats.recommended}</div>
            <p className="mt-3 text-2xl font-semibold text-white">{recommendedProfiles.length}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-panel rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
        <div className="grid gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.filters.tabs}</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {tabOptions.map((option) => {
                const isActive = selectedTab === option.key;

                return (
                  <Link
                    key={option.key}
                    href={createQueryString(option.key, selectedView, selectedSort)}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "border-cyan-300/24 bg-cyan-300/14 text-cyan-100"
                        : "border-white/10 bg-white/4 text-white/64 hover:border-white/16 hover:text-white",
                    ].join(" ")}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {selectedTab === "discover" ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.filters.view}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {filterOptions.map((option) => {
                    const isActive = selectedView === option.key;

                    return (
                      <Link
                        key={option.key}
                        href={createQueryString(selectedTab, option.key, selectedSort)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          isActive
                            ? "border-cyan-300/24 bg-cyan-300/14 text-cyan-100"
                            : "border-white/10 bg-white/4 text-white/64 hover:border-white/16 hover:text-white",
                        ].join(" ")}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">{copy.filters.sort}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {sortOptions.map((option) => {
                    const isActive = selectedSort === option.key;

                    return (
                      <Link
                        key={option.key}
                        href={createQueryString(selectedTab, selectedView, option.key)}
                        className={[
                          "rounded-full border px-4 py-2 text-sm font-medium transition",
                          isActive
                            ? "border-cyan-300/24 bg-cyan-300/14 text-cyan-100"
                            : "border-white/10 bg-white/4 text-white/64 hover:border-white/16 hover:text-white",
                        ].join(" ")}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {selectedTab === "discover" ? (
        <>
          <NetworkDiscoverySection
            profiles={mainProfiles}
            locale={data.locale}
            variant="grid"
            title={mainSection.title}
            description={mainSection.description}
            emptyTitle={mainSection.emptyTitle}
            emptyDescription={mainSection.emptyDescription}
          />

          <section className="grid gap-6 xl:grid-cols-2">
            <NetworkDiscoverySection
              profiles={followingProfiles}
              locale={data.locale}
              variant="stack"
              title={copy.highlights.followingTitle}
              description={copy.highlights.followingDescription}
              emptyTitle={copy.highlights.followingEmptyTitle}
              emptyDescription={copy.highlights.followingEmptyDescription}
            />
            <NetworkDiscoverySection
              profiles={recommendedProfiles}
              locale={data.locale}
              variant="stack"
              title={copy.highlights.recommendedTitle}
              description={copy.highlights.recommendedDescription}
              emptyTitle={copy.highlights.recommendedEmptyTitle}
              emptyDescription={copy.highlights.recommendedEmptyDescription}
            />
          </section>
        </>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-2">
        <NotificationsPanel
          notifications={notifications}
          unreadCount={unreadCount}
          locale={data.locale}
          profileUsername={data.profile.username}
        />
        <NetworkActivityPanel items={activity} locale={data.locale} />
      </section>

      {selectedTab === "feed" ? (
        <FollowingPostsFeedPanel posts={followingFeed} locale={data.locale} />
      ) : null}

      {selectedTab === "saved" ? <SavedPostsPanel posts={savedPosts} locale={data.locale} /> : null}

      <section className="grid gap-6 xl:grid-cols-2">
        <FriendRequestsPanel items={friendRequests} locale={data.locale} />
        <SocialConnectionsPanel
          profiles={friends}
          locale={data.locale}
          title={data.locale === "ptBR" ? "Amigos aprovados" : "Approved friends"}
          description={
            data.locale === "ptBR"
              ? "Perfis que já podem abrir conversas privadas com você quando as mensagens chegarem."
              : "Profiles that can already enter the private layer with you once messaging goes live."
          }
          emptyTitle={data.locale === "ptBR" ? "Sem amigos aprovados ainda" : "No approved friends yet"}
          emptyDescription={
            data.locale === "ptBR"
              ? "Aceite pedidos ou envie novas amizades para preparar sua rede privada."
              : "Accept requests or send new friendship invites to prepare your private network."
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SocialConnectionsPanel
          profiles={followers}
          locale={data.locale}
          title={connectionsCopy.followersTitle}
          description={connectionsCopy.followersDescription}
          emptyTitle={connectionsCopy.followersEmptyTitle}
          emptyDescription={connectionsCopy.followersEmptyDescription}
        />
        <SocialConnectionsPanel
          profiles={followingProfiles}
          locale={data.locale}
          title={connectionsCopy.followingTitle}
          description={connectionsCopy.followingDescription}
          emptyTitle={connectionsCopy.followingEmptyTitle}
          emptyDescription={connectionsCopy.followingEmptyDescription}
        />
      </section>
    </DashboardFrame>
  );
}
