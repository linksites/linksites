import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfilePreview } from "@/components/profile-preview";
import { PublicProfilePostsSection } from "@/components/public-profile-posts-section";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";
import { getPublicProfileByUsername } from "@/lib/profiles";
import { getProfilePosts } from "@/lib/social";
import { getCurrentViewer } from "@/lib/viewer";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const locale = await getServerLocale();
  const content = appContent[locale];
  const { username } = await params;
  const viewer = await getCurrentViewer();
  const hasAuthenticatedSession = Boolean(viewer.user && !viewer.isMock);
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const posts = await getProfilePosts({
    profileId: profile.id,
    viewerProfileId: viewer.profile?.id,
    limit: 8,
  });

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={hasAuthenticatedSession ? "/dashboard" : "/login"}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
          >
            {hasAuthenticatedSession ? content.publicProfile.backHome : "Criar seu perfil"}
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <ProfilePreview profile={profile} locale={locale} analyticsEnabled />
        </div>

        <div className="flex items-center justify-center">
          <PublicProfilePostsSection posts={posts} locale={locale} canComment={hasAuthenticatedSession} />
        </div>
      </div>
    </div>
  );
}
