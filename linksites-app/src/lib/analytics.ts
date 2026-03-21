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

type AnalyticsViewRow = {
  session_id: string;
};

type AnalyticsClickRow = {
  link_id: string | null;
  link_title: string | null;
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

const ANALYTICS_PAGE_SIZE = 1000;

async function fetchAnalyticsRows<T>({
  totalCount,
  fetchPage,
}: {
  totalCount: number;
  fetchPage: (from: number, to: number) => Promise<{ data: T[] | null; error: unknown }>;
}) {
  const rows: T[] = [];

  for (let from = 0; from < totalCount; from += ANALYTICS_PAGE_SIZE) {
    const to = Math.min(from + ANALYTICS_PAGE_SIZE - 1, totalCount - 1);
    const page = await fetchPage(from, to);

    if (page.error) {
      return null;
    }

    rows.push(...(page.data ?? []));
  }

  return rows;
}

export async function getProfileAnalytics(profileId: string): Promise<ProfileAnalyticsSummary> {
  if (!hasSupabaseEnv()) {
    return MOCK_ANALYTICS_SUMMARY;
  }

  const supabase = await createSupabaseServerClient();
  const recentWindowStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [viewsCountResult, clicksCountResult, recentViewsResult] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("event_type", "profile_view"),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("event_type", "link_click"),
    supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("event_type", "profile_view")
      .gte("created_at", recentWindowStart),
  ]);

  if (viewsCountResult.error || clicksCountResult.error || recentViewsResult.error) {
    return emptyAnalyticsSummary();
  }

  const totalViews = viewsCountResult.count ?? 0;
  const totalClicks = clicksCountResult.count ?? 0;
  const [viewRows, clickRows] = await Promise.all([
    fetchAnalyticsRows<AnalyticsViewRow>({
      totalCount: totalViews,
      fetchPage: async (from, to) =>
        await supabase
          .from("analytics_events")
          .select("session_id")
          .eq("profile_id", profileId)
          .eq("event_type", "profile_view")
          .range(from, to),
    }),
    fetchAnalyticsRows<AnalyticsClickRow>({
      totalCount: totalClicks,
      fetchPage: async (from, to) =>
        await supabase
          .from("analytics_events")
          .select("link_id, link_title")
          .eq("profile_id", profileId)
          .eq("event_type", "link_click")
          .range(from, to),
    }),
  ]);

  if (!viewRows || !clickRows) {
    return emptyAnalyticsSummary();
  }

  const uniqueVisitors = new Set(viewRows.map((entry) => entry.session_id)).size;
  const clickCounts = new Map<string, { title: string | null; clicks: number }>();

  for (const entry of clickRows) {
    const key = entry.link_id ?? entry.link_title ?? "unknown";
    const current = clickCounts.get(key);

    clickCounts.set(key, {
      title: sanitizeAnalyticsText(entry.link_title),
      clicks: (current?.clicks ?? 0) + 1,
    });
  }

  const topLink = Array.from(clickCounts.values()).sort((left, right) => right.clicks - left.clicks)[0] ?? null;

  return {
    totalViews,
    uniqueVisitors,
    totalClicks,
    recentViews: recentViewsResult.count ?? 0,
    topLinkTitle: topLink?.title ?? null,
    topLinkClicks: topLink?.clicks ?? 0,
  };
}
