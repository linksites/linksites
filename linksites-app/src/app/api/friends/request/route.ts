import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FriendRequestPayload = {
  targetProfileId?: string;
  action?: "send" | "cancel";
};

function sanitizeId(value?: string | null, maxLength = 64) {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

function sortFriendPair(left: string, right: string) {
  return [left, right].sort() as [string, string];
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: false, error: "mock_mode" }, { status: 400 });
  }

  let payload: FriendRequestPayload;

  try {
    payload = (await request.json()) as FriendRequestPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const targetProfileId = sanitizeId(payload.targetProfileId);
  const action = payload.action;

  if (!targetProfileId || (action !== "send" && action !== "cancel")) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { data: myProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !myProfile) {
    return NextResponse.json({ ok: false, error: "profile_not_found" }, { status: 404 });
  }

  if (myProfile.id === targetProfileId) {
    return NextResponse.json({ ok: false, error: "cannot_request_self" }, { status: 400 });
  }

  const [userOneId, userTwoId] = sortFriendPair(myProfile.id, targetProfileId);
  const { data: existingFriendship } = await supabase
    .from("friendships")
    .select("user_one_id")
    .eq("user_one_id", userOneId)
    .eq("user_two_id", userTwoId)
    .maybeSingle();

  if (existingFriendship) {
    return NextResponse.json({ ok: true, status: "friends" });
  }

  if (action === "cancel") {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "cancelled" })
      .eq("sender_id", myProfile.id)
      .eq("recipient_id", targetProfileId)
      .eq("status", "pending");

    if (error) {
      return NextResponse.json({ ok: false, error: "cancel_failed" }, { status: 400 });
    }
  } else {
    const { data: incomingRequest } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("sender_id", targetProfileId)
      .eq("recipient_id", myProfile.id)
      .eq("status", "pending")
      .maybeSingle();

    if (incomingRequest) {
      return NextResponse.json({ ok: true, status: "request_received" });
    }

    const { data: existingRequest } = await supabase
      .from("friend_requests")
      .select("id")
      .eq("sender_id", myProfile.id)
      .eq("recipient_id", targetProfileId)
      .eq("status", "pending")
      .maybeSingle();

    if (!existingRequest) {
      const { error } = await supabase.from("friend_requests").insert({
        sender_id: myProfile.id,
        recipient_id: targetProfileId,
        status: "pending",
      });

      if (error) {
        return NextResponse.json({ ok: false, error: "request_failed" }, { status: 400 });
      }
    }
  }

  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/messages");

  return NextResponse.json({
    ok: true,
    status: action === "send" ? "request_sent" : "none",
  });
}
