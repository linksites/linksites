import Link from "next/link";
import { ProfilePreview } from "@/components/profile-preview";
import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const editorFields = [
  { label: "Display name", value: demoProfile.displayName },
  { label: "Username", value: demoProfile.username },
  { label: "Bio", value: demoProfile.bio },
];

export default function DashboardPage() {
  return (
    <div className="page-shell min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">Dashboard MVP</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
              Edit profile, links, and visual identity
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/64">
              This first version is intentionally simple. It shows the editor surface, the preview system, and the
              product shape we will connect to Supabase next.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/4 px-5 py-2 text-sm text-white/78"
            >
              Back to app home
            </Link>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/56">
              {hasSupabaseEnv() ? "Ready for persistence" : "Using mock profile"}
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/8 bg-[var(--panel)] p-6">
            <div className="grid gap-4 md:grid-cols-2">
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
                {demoProfile.links.map((link, index) => (
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
                      Active
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-dashed border-white/12 bg-white/3 p-5">
              <p className="text-sm leading-7 text-white/62">
                Next implementation step: wire this screen to Supabase Auth and save profile and link changes with
                server actions or route handlers.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <ProfilePreview profile={demoProfile} compact />
          </div>
        </section>
      </main>
    </div>
  );
}
