import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReadPayload = {
  roomId?: string;
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

  let payload: ReadPayload;

  try {
    payload = (await request.json()) as ReadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const roomId = sanitizeId(payload.roomId);

  if (!roomId) {
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

  const { error } = await supabase
    .from("chat_room_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("room_id", roomId)
    .eq("profile_id", myProfile.id);

  if (error) {
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 400 });
  }

  revalidatePath("/dashboard/messages");

  return NextResponse.json({ ok: true });
}

