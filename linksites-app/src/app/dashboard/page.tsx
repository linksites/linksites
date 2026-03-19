import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfilePreview } from "@/components/profile-preview";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getCurrentViewer } from "@/lib/viewer";

export default async function DashboardPage() {
  const viewer = await getCurrentViewer();
  const usingMockData = !hasSupabaseEnv() || viewer.isMock;

  if (!usingMockData && !viewer.user) {
    redirect("/login?message=Sign in to access your creator dashboard.");
  }

  const profile =
    viewer.profile ??
    (usingMockData
      ? demoProfile
      : {
          id: "pending-profile",
          username: viewer.user?.email?.split("@")[0] ?? "new-user",
          displayName: viewer.user?.email?.split("@")[0] ?? "New creator",
          bio: "Your account is authenticated, but your profile record still needs to be created or linked in the database.",
          avatarUrl: null,
          themeSlug: "midnight-grid" as const,
          isPublished: false,
          links: [],
        });
  const editorFields = [
    { label: "Display name", value: profile.displayName },
    { label: "Username", value: profile.username },
    { label: "Bio", value: profile.bio },
  ];

  return (
    <div className="page-shell min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Dashboard MVP</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
              Welcome back, {profile.displayName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">
              Your account is now connected to the product layer. This dashboard already reflects real session state
              and can grow into editing, analytics, plans, and publishing controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
            >
              Back to app home
            </Link>
            <form action="/auth/signout" method="post">
              <button className="inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-100 transition hover:-translate-y-px">
                Sign out
              </button>
            </form>
          </div>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Session</div>
                <p className="mt-3 text-lg font-semibold text-white">{viewer.user ? "Authenticated" : "Mock mode"}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  {viewer.user?.email ?? "Using the local fallback account while Supabase is unavailable."}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Profile status</div>
                <p className="mt-3 text-lg font-semibold text-white">{profile.isPublished ? "Published" : "Draft"}</p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  {profile.isPublished
                    ? `Your public page can already be visited at /u/${profile.username}.`
                    : "Publish this profile when you want the public page to go live."}
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-white/8 bg-[var(--panel)] p-5">
                <div className="text-xs uppercase tracking-[0.24em] text-white/42">Unlocked</div>
                <p className="mt-3 text-lg font-semibold text-white">{profile.links.length} active services</p>
                <p className="mt-2 text-sm leading-7 text-white/58">
                  Public profile, link stack, visual theme, and protected dashboard access are already connected.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-white/42">Creator identity</div>
                  <h2 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-white">
                    Profile information from your account
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
                  {usingMockData ? "Fallback data" : "Live from Supabase"}
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {editorFields.map((field) => (
                  <label key={field.label} className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{field.label}</span>
                    <input
                      readOnly
                      value={field.value}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Links</div>
                <div className="mt-4 space-y-3">
                  {profile.links.length ? (
                    profile.links.map((link, index) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between rounded-[1.4rem] border border-white/8 bg-white/4 px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {index + 1}. {link.title}
                          </p>
                          <p className="mt-1 text-xs text-white/54">{link.url}</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--accent)]">
                          {link.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/3 px-4 py-5 text-sm leading-7 text-white/58">
                      No links yet. The next phase will let users create and edit them directly from this dashboard.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
                <p className="text-sm leading-7 text-white/62">
                  Next implementation step: replace this read-only state with editable profile and link actions, then
                  add save feedback and onboarding progress.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfilePreview profile={profile} compact />
          </div>
        </section>
      </main>
    </div>
  );
}
