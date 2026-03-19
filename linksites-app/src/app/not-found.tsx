import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="max-w-lg rounded-[2rem] border border-white/8 bg-[var(--panel)] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">404</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-semibold tracking-tight text-white">
          This profile does not exist yet
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/64">
          Once the SaaS is connected to auth and persistence, this route will resolve real public creator pages.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-slate-950"
        >
          Back to app home
        </Link>
      </div>
    </div>
  );
}
