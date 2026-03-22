import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CommentPayload = {
  postId?: string;
  content?: string;
};

const MAX_COMMENT_LENGTH = 500;

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

  let payload: CommentPayload;

  try {
    payload = (await request.json()) as CommentPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const postId = sanitizeId(payload.postId);
  const content = payload.content?.trim() ?? "";

  if (!postId || !content || content.length > MAX_COMMENT_LENGTH) {
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

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, user_id")
    .eq("id", postId)
    .maybeSingle();

  if (postError || !post) {
    return NextResponse.json({ ok: false, error: "post_not_found" }, { status: 404 });
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: myProfile.id,
    content,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ ok: false, error: "comment_create_failed" }, { status: 400 });
  }

  if (post.user_id !== myProfile.id) {
    await supabase.from("notifications").insert({
      recipient_id: post.user_id,
      sender_id: myProfile.id,
      type: "new_comment",
      entity_id: postId,
    });
  }

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", post.user_id)
    .maybeSingle();

  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard/notifications");
  if (ownerProfile?.username) {
    revalidatePath(`/u/${ownerProfile.username}`);
  }

  return NextResponse.json({ ok: true });
}
