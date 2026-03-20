import { demoProfile } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AnalyticsEventName = "profile_view" | "link_click";

export type ProfileAnalyticsSummary = {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  recentViews: number;
  topLinkTitle: string | null;
  topLinkClicks: number;
};

const MOCK_ANALYTICS_SUMMARY: ProfileAnalyticsSummary = {
  totalViews: 128,
  uniqueVisitors: 57,
  totalClicks: 34,
  recentViews: 19,
  topLinkTitle: demoProfile.links[0]?.title ?? null,
  topLinkClicks: 16,
};

function emptyAnalyticsSummary(): ProfileAnalyticsSummary {
  return {
    totalViews: 0,
    uniqueVisitors: 0,
    totalClicks: 0,
    recentViews: 0,
    topLinkTitle: null,
    topLinkClicks: 0,
  };
}

function sanitizeAnalyticsText(value?: string | null) {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, 240);
}

export async function getProfileAnalytics(profileId: string): Promise<ProfileAnalyticsSummary> {
  if (!hasSupabaseEnv()) {
    return MOCK_ANALYTICS_SUMMARY;
  }

  const supabase = await createSupabaseServerClient();
  const recentWindowStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsResult, clicksResult, recentViewsResult] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("session_id", { count: "exact" })
      .eq("profile_id", profileId)
      .eq("event_type", "profile_view")
      .range(0, 9999),
    supabase
      .from("analytics_events")
      .select("link_id, link_title", { count: "exact" })
      .eq("profile_id", profileId)
      .eq("event_type", "link_click")
      .range(0, 9999),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("event_type", "profile_view")
      .gte("created_at", recentWindowStart),
  ]);

  if (viewsResult.error || clicksResult.error || recentViewsResult.error) {
    return emptyAnalyticsSummary();
  }

  const uniqueVisitors = new Set((viewsResult.data ?? []).map((entry) => entry.session_id)).size;
  const clickCounts = new Map<string, { title: string | null; clicks: number }>();

  for (const entry of clicksResult.data ?? []) {
    const key = entry.link_id ?? entry.link_title ?? "unknown";
    const current = clickCounts.get(key);

    clickCounts.set(key, {
      title: sanitizeAnalyticsText(entry.link_title),
      clicks: (current?.clicks ?? 0) + 1,
    });
  }

  const topLink = Array.from(clickCounts.values()).sort((left, right) => right.clicks - left.clicks)[0] ?? null;

  return {
    totalViews: viewsResult.count ?? 0,
    uniqueVisitors,
    totalClicks: clicksResult.count ?? 0,
    recentViews: recentViewsResult.count ?? 0,
    topLinkTitle: topLink?.title ?? null,
    topLinkClicks: topLink?.clicks ?? 0,
  };
}
