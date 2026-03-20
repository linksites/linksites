"use client";

import { useState } from "react";

type OpenInBrowserFabProps = {
  label: string;
  hint: string;
};

function isSupportedInAppBrowser(userAgent: string) {
  return /instagram|twitter|x\/|fbav|fban/i.test(userAgent);
}

export function OpenInBrowserFab({ label, hint }: OpenInBrowserFabProps) {
  const [isVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return isSupportedInAppBrowser(window.navigator.userAgent);
  });

  if (!isVisible) {
    return null;
  }

  function handleOpenInBrowser() {
    const currentUrl = window.location.href;
    const isAndroid = /android/i.test(window.navigator.userAgent);

    if (isAndroid) {
      const sanitizedUrl = currentUrl.replace(/^https?:\/\//, "");
      const scheme = currentUrl.startsWith("http://") ? "http" : "https";

      window.location.href = `intent://${sanitizedUrl}#Intent;scheme=${scheme};package=com.android.chrome;end`;
      return;
    }

    window.open(currentUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-xs flex-col items-end gap-2">
      <p className="rounded-2xl border border-white/10 bg-[rgba(4,13,24,0.88)] px-3 py-2 text-right text-xs leading-5 text-white/72 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur">
        {hint}
      </p>
      <button
        type="button"
        onClick={handleOpenInBrowser}
        className="inline-flex min-h-12 items-center gap-3 rounded-full border border-white/12 bg-[rgba(4,13,24,0.9)] px-4 py-3 text-sm font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur transition hover:-translate-y-px hover:border-cyan-300/30 hover:text-cyan-100"
        aria-label={label}
        title={label}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/6">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 17 17 7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 11v7h7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{label}</span>
      </button>
    </div>
  );
}
