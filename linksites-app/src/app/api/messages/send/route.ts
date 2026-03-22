import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SendMessagePayload = {
  roomId?: string;
  content?: string;
};

const MAX_MESSAGE_LENGTH = 1000;

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

  let payload: SendMessagePayload;

  try {
    payload = (await request.json()) as SendMessagePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const roomId = sanitizeId(payload.roomId);
  const content = payload.content?.trim() ?? "";

  if (!roomId || !content) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ ok: false, error: "message_too_long" }, { status: 400 });
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

  const { data: participant } = await supabase
    .from("chat_room_participants")
    .select("room_id")
    .eq("room_id", roomId)
    .eq("profile_id", myProfile.id)
    .maybeSingle();

  if (!participant) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("messages").insert({
    room_id: roomId,
    sender_id: myProfile.id,
    content,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "message_send_failed" }, { status: 400 });
  }

  const now = new Date().toISOString();
  await supabase.from("chat_room_participants").update({ last_read_at: now }).eq("room_id", roomId).eq("profile_id", myProfile.id);
  await supabase.from("chat_rooms").update({ updated_at: now }).eq("id", roomId);

  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard/network");

  return NextResponse.json({ ok: true });
}
