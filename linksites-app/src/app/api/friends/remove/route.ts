import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RemoveFriendPayload = {
  targetProfileId?: string;
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

  let payload: RemoveFriendPayload;

  try {
    payload = (await request.json()) as RemoveFriendPayload;
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

  const { data: myProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !myProfile) {
    return NextResponse.json({ ok: false, error: "profile_not_found" }, { status: 404 });
  }

  const [userOneId, userTwoId] = sortFriendPair(myProfile.id, targetProfileId);
  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("user_one_id", userOneId)
    .eq("user_two_id", userTwoId);

  if (error) {
    return NextResponse.json({ ok: false, error: "remove_failed" }, { status: 400 });
  }

  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/notifications");
  revalidatePath("/dashboard/messages");

  return NextResponse.json({ ok: true, status: "none" });
}
