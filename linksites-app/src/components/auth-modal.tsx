"use client";

import clsx from "clsx";
import Link from "next/link";
import { useEffect } from "react";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  closeLabel?: string;
  signInEyebrow?: string;
  signInLabel: string;
  signInDescription: string;
  signInHref: string;
  signUpEyebrow?: string;
  signUpLabel: string;
  signUpDescription: string;
  signUpHref: string;
  helper: string;
};

export function AuthModal({
  open,
  onClose,
  title,
  description,
  closeLabel = "Close",
  signInEyebrow = "Existing account",
  signInLabel,
  signInDescription,
  signInHref,
  signUpEyebrow = "New here",
  signUpLabel,
  signUpDescription,
  signUpHref,
  helper,
}: AuthModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 transition",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className={clsx(
          "w-full max-w-xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,24,39,0.98),rgba(8,18,30,0.98))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.45)] transition",
          open ? "translate-y-0 scale-100" : "translate-y-4 scale-[0.98]",
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              LinkSites
            </div>
            <h2 id="auth-modal-title" className="mt-3 font-[var(--font-display)] text-2xl font-semibold text-white">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/66">{description}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/4 text-white/70 transition hover:border-white/18 hover:text-white"
            aria-label={closeLabel}
          >
            x
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href={signInHref}
            className="rounded-[1.6rem] border border-cyan-300/18 bg-cyan-300/10 p-5 transition hover:-translate-y-px hover:border-cyan-300/30"
          >
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/64">{signInEyebrow}</div>
            <div className="mt-3 text-lg font-semibold text-white">{signInLabel}</div>
            <p className="mt-2 text-sm leading-7 text-cyan-50/74">{signInDescription}</p>
          </Link>

          <Link
            href={signUpHref}
            className="rounded-[1.6rem] border border-white/10 bg-white/4 p-5 transition hover:-translate-y-px hover:border-white/18"
          >
            <div className="text-xs uppercase tracking-[0.24em] text-white/48">{signUpEyebrow}</div>
            <div className="mt-3 text-lg font-semibold text-white">{signUpLabel}</div>
            <p className="mt-2 text-sm leading-7 text-white/66">{signUpDescription}</p>
          </Link>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/48">{helper}</p>
      </div>
    </div>
  );
}
