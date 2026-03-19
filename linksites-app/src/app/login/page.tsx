import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login, magicLink, signup } from "@/app/login/actions";
import { getCurrentViewer } from "@/lib/viewer";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

function Notice({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        tone === "error"
          ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
          : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
      }`}
    >
      {children}
    </div>
  );
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const viewer = await getCurrentViewer();

  if (viewer.user && !viewer.isMock) {
    redirect("/dashboard");
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] border border-white/8 bg-[var(--panel)] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">Access LinkSites</div>
          <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Sign in and enter your creator workspace
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/66">
            This is the first real entry point of the SaaS. Sign in, create your account, or use a magic link to
            access your dashboard without friction.
          </p>

          <div className="mt-8 space-y-3">
            {params.error ? <Notice tone="error">{params.error}</Notice> : null}
            {params.message ? <Notice tone="info">{params.message}</Notice> : null}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <form action={login} className="rounded-[1.7rem] border border-white/8 bg-white/4 p-5">
              <div className="text-sm font-semibold text-white">Sign in with password</div>
              <div className="mt-4 space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">Password</span>
                  <input
                    name="password"
                    type="password"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder="Your password"
                  />
                </label>
              </div>
              <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-px">
                Sign in
              </button>
            </form>

            <form action={signup} className="rounded-[1.7rem] border border-white/8 bg-white/4 p-5">
              <div className="text-sm font-semibold text-white">Create account</div>
              <div className="mt-4 space-y-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs uppercase tracking-[0.24em] text-white/46">Password</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="min-h-12 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                    placeholder="Create a password"
                  />
                </label>
              </div>
              <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)]/30 hover:text-[var(--accent)]">
                Create my account
              </button>
            </form>
          </div>

          <form action={magicLink} className="mt-5 rounded-[1.7rem] border border-white/8 bg-white/3 p-5">
            <div className="text-sm font-semibold text-white">Prefer a magic link?</div>
            <p className="mt-2 text-sm leading-7 text-white/60">
              Enter your email and receive a secure sign-in link. This is helpful if you created a user by invitation
              and have not set a password yet.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                name="email"
                type="email"
                required
                className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none"
                placeholder="you@example.com"
              />
              <button className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/22 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:-translate-y-px">
                Send magic link
              </button>
            </div>
          </form>

          <Link href="/" className="mt-6 inline-flex text-sm text-white/58 transition hover:text-[var(--accent)]">
            Back to product overview
          </Link>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(8,17,31,0.92),rgba(7,15,26,0.9))] p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">Inside the product</div>
          <h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What a signed-in creator will feel
          </h2>
          <div className="mt-6 grid gap-4">
            {[
              "A private dashboard linked to a real account",
              "A published or draft status for the page",
              "A clear sense of unlocked features and next actions",
              "A live public route tied to the stored profile",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-[var(--accent)]">
                  0{index + 1}
                </div>
                <p className="pt-1 text-sm leading-7 text-white/66">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
