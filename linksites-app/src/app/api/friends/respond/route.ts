import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FriendRespondPayload = {
  requestId?: string;
  action?: "accept" | "reject";
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

  let payload: FriendRespondPayload;

  try {
    payload = (await request.json()) as FriendRespondPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const requestId = sanitizeId(payload.requestId);
  const action = payload.action;

  if (!requestId || (action !== "accept" && action !== "reject")) {
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

  const { data: friendRequest, error: requestError } = await supabase
    .from("friend_requests")
    .select("id, sender_id, recipient_id, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError || !friendRequest || friendRequest.status !== "pending") {
    return NextResponse.json({ ok: false, error: "request_not_found" }, { status: 404 });
  }

  if (friendRequest.recipient_id !== myProfile.id) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  if (action === "accept") {
    const [userOneId, userTwoId] = sortFriendPair(friendRequest.sender_id, friendRequest.recipient_id);

    const { error: friendshipError } = await supabase.from("friendships").upsert(
      {
        user_one_id: userOneId,
        user_two_id: userTwoId,
      },
      {
        onConflict: "user_one_id,user_two_id",
        ignoreDuplicates: true,
      },
    );

    if (friendshipError) {
      return NextResponse.json({ ok: false, error: "friendship_create_failed" }, { status: 400 });
    }
  }

  const { error } = await supabase
    .from("friend_requests")
    .update({ status: action === "accept" ? "accepted" : "rejected" })
    .eq("id", requestId);

  if (error) {
    return NextResponse.json({ ok: false, error: "request_update_failed" }, { status: 400 });
  }

  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/messages");

  return NextResponse.json({
    ok: true,
    status: action === "accept" ? "friends" : "none",
  });
}
