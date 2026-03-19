import { notFound } from "next/navigation";
import { ProfilePreview } from "@/components/profile-preview";
import { getPublicProfileByUsername } from "@/lib/profiles";

type PublicProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <ProfilePreview profile={profile} />
    </div>
  );
}
