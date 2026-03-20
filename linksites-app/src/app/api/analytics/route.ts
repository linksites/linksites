import { NextResponse } from "next/server";
import type { AnalyticsEventName } from "@/lib/analytics";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AnalyticsPayload = {
  profileId?: string;
  eventType?: AnalyticsEventName;
  sessionId?: string;
  linkId?: string | null;
  linkTitle?: string | null;
  path?: string | null;
  referrer?: string | null;
};

function sanitizeOptionalText(value?: string | null, maxLength = 240) {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function isValidEventType(value?: string): value is AnalyticsEventName {
  return value === "profile_view" || value === "link_click";
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: true, mode: "mock" });
  }

  let payload: AnalyticsPayload;

  try {
    payload = (await request.json()) as AnalyticsPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const profileId = sanitizeOptionalText(payload.profileId, 64);
  const sessionId = sanitizeOptionalText(payload.sessionId, 120);
  const eventType = payload.eventType;

  if (!profileId || !sessionId || !isValidEventType(eventType)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("analytics_events").insert({
    profile_id: profileId,
    event_type: eventType,
    session_id: sessionId,
    link_id: sanitizeOptionalText(payload.linkId, 64),
    link_title: sanitizeOptionalText(payload.linkTitle, 120),
    path: sanitizeOptionalText(payload.path, 240),
    referrer: sanitizeOptionalText(payload.referrer, 500),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 202 });
  }

  return NextResponse.json({ ok: true });
}
