import { NextResponse } from "next/server";
import { ensureDirectConversation } from "@/lib/messages";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ConversationPayload = {
  targetProfileId?: string;
};

function sanitizeId(value?: string | null, maxLength = 64) {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: false, error: "mock_mode" }, { status: 400 });
  }

  let payload: ConversationPayload;

  try {
    payload = (await request.json()) as ConversationPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const targetProfileId = sanitizeId(payload.targetProfileId);

  if (!targetProfileId) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!myProfile) {
    return NextResponse.json({ ok: false, error: "profile_not_found" }, { status: 404 });
  }

  const result = await ensureDirectConversation({
    viewerProfileId: myProfile.id,
    targetProfileId,
  });

  if (!result.ok) {
    const status = result.reason === "not_friends" ? 403 : 400;

    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
        debugMessage: process.env.NODE_ENV === "development" ? result.debugMessage ?? null : null,
      },
      { status },
    );
  }

  return NextResponse.json({
    ok: true,
    roomId: result.roomId,
  });
}
