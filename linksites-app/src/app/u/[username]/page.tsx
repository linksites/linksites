import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { ProfilePreview } from "@/components/profile-preview";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";
import { getPublicProfileByUsername } from "@/lib/profiles";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const locale = await getServerLocale();
  const content = appContent[locale];
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="page-shell min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
          >
            {content.publicProfile.backHome}
          </Link>
          <LanguageToggle
            locale={locale}
            label={content.shared.languageLabel}
            locales={content.shared.locales}
          />
        </div>

        <div className="flex items-center justify-center">
          <ProfilePreview profile={profile} locale={locale} />
        </div>
      </div>
    </div>
  );
}
