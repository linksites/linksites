import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FollowPayload = {
  targetProfileId?: string;
  action?: "follow" | "unfollow";
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

  let payload: FollowPayload;

  try {
    payload = (await request.json()) as FollowPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const targetProfileId = sanitizeId(payload.targetProfileId);
  const action = payload.action;

  if (!targetProfileId || (action !== "follow" && action !== "unfollow")) {
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
    return NextResponse.json({ ok: false, error: "cannot_follow_self" }, { status: 400 });
  }

  let createdFollow = false;

  if (action === "follow") {
    const { error } = await supabase.from("follows").insert({
      follower_id: myProfile.id,
      followed_id: targetProfileId,
    });

    if (error && error.code !== "23505") {
      return NextResponse.json({ ok: false, error: "follow_failed" }, { status: 400 });
    }

    createdFollow = !error;
  } else {
    const { error } = await supabase
      .from("follows")
      .delete()
      .match({ follower_id: myProfile.id, followed_id: targetProfileId });

    if (error) {
      return NextResponse.json({ ok: false, error: "unfollow_failed" }, { status: 400 });
    }
  }

  if (createdFollow) {
    await supabase.from("notifications").insert({
      recipient_id: targetProfileId,
      sender_id: myProfile.id,
      type: "new_follower",
    });
  }

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("username, followers_count")
    .eq("id", targetProfileId)
    .maybeSingle();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/notifications");
  if (targetProfile?.username) {
    revalidatePath(`/u/${targetProfile.username}`);
  }

  return NextResponse.json({
    ok: true,
    following: action === "follow",
    followersCount: targetProfile?.followers_count ?? null,
  });
}
