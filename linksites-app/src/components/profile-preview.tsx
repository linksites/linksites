"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect } from "react";
import { appContent } from "@/data/app-content";
import type { AppLocale } from "@/lib/locale";
import { themeCatalog } from "@/lib/mock-data";
import type { ProfileWithLinks } from "@/lib/types";

const ANALYTICS_SESSION_KEY = "linksites-analytics-session-id";

type ProfilePreviewProps = {
  profile: ProfileWithLinks;
  compact?: boolean;
  locale?: AppLocale;
  analyticsEnabled?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getLinkCtaLabel(url: string, locale: AppLocale, fallback: string) {
  try {
    if (url.startsWith("mailto:")) {
      return locale === "ptBR" ? "Enviar email" : "Send email";
    }

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "").toLowerCase();

    if (hostname.includes("wa.me") || hostname.includes("whatsapp.com")) {
      return locale === "ptBR" ? "Conversar" : "Chat";
    }

    if (
      hostname.includes("instagram.com") ||
      hostname.includes("tiktok.com") ||
      hostname.includes("facebook.com") ||
      hostname.includes("linkedin.com") ||
      hostname.includes("x.com") ||
      hostname.includes("twitter.com") ||
      hostname.includes("threads.net")
    ) {
      return locale === "ptBR" ? "Ver perfil" : "View profile";
    }

    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      return locale === "ptBR" ? "Assistir" : "Watch";
    }

    if (hostname.includes("spotify.com") || hostname.includes("deezer.com")) {
      return locale === "ptBR" ? "Ouvir" : "Listen";
    }

    return locale === "ptBR" ? "Acessar" : "Visit";
  } catch {
    return fallback;
  }
}

function getAnalyticsSessionId() {
  try {
    const existingValue = window.localStorage.getItem(ANALYTICS_SESSION_KEY);

    if (existingValue) {
      return existingValue;
    }

    const newValue = window.crypto.randomUUID();
    window.localStorage.setItem(ANALYTICS_SESSION_KEY, newValue);
    return newValue;
  } catch {
    return "anonymous-session";
  }
}

function sendAnalyticsEvent(payload: Record<string, string | null>) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  });
}

export function ProfilePreview({
  profile,
  compact = false,
  locale = "ptBR",
  analyticsEnabled = false,
}: ProfilePreviewProps) {
  const theme = themeCatalog[profile.themeSlug];
  const content = appContent[locale];
  const activeLinks = profile.links.filter((link) => link.isActive);

  useEffect(() => {
    if (!analyticsEnabled) {
      return;
    }

    try {
      const dateKey = new Date().toISOString().slice(0, 10);
      const viewStorageKey = `linksites-analytics:view:${profile.id}:${dateKey}`;

      if (window.localStorage.getItem(viewStorageKey) === "1") {
        return;
      }

      sendAnalyticsEvent({
        profileId: profile.id,
        eventType: "profile_view",
        sessionId: getAnalyticsSessionId(),
        path: window.location.pathname,
        referrer: document.referrer || null,
        linkId: null,
        linkTitle: null,
      });

      window.localStorage.setItem(viewStorageKey, "1");
    } catch {
      // Ignore client storage issues and keep the public page interactive.
    }
  }, [analyticsEnabled, profile.id]);

  function handleLinkClick(linkId: string, linkTitle: string) {
    if (!analyticsEnabled) {
      return;
    }

    sendAnalyticsEvent({
      profileId: profile.id,
      eventType: "link_click",
      sessionId: getAnalyticsSessionId(),
      path: window.location.pathname,
      referrer: document.referrer || null,
      linkId,
      linkTitle,
    });
  }

  return (
    <section
      className={clsx(
        "rounded-[2rem] border border-white/10 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
        compact ? "w-full max-w-md" : "w-full max-w-lg",
      )}
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <div
        className="rounded-[1.7rem] border border-white/8 p-5 backdrop-blur"
        style={{ backgroundColor: theme.panel }}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/8 text-xl font-semibold">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={profile.displayName}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            getInitials(profile.displayName)
          )}
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">{profile.displayName}</h3>
          <p className="mt-2 text-sm opacity-70">@{profile.username}</p>
          <p className="mt-4 text-sm leading-7 opacity-80">{profile.bio}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleLinkClick(link.id, link.title)}
              className="flex min-h-13 items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition hover:-translate-y-px"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <span>{link.title}</span>
              <span className="text-[var(--accent)]">
                {getLinkCtaLabel(link.url, locale, content.shared.previewOpen)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
