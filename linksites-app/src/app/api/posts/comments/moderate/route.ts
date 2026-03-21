import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ModerateCommentPayload = {
  commentId?: string;
  action?: "approve" | "reject" | "delete";
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

  let payload: ModerateCommentPayload;

  try {
    payload = (await request.json()) as ModerateCommentPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const commentId = sanitizeId(payload.commentId);
  const action = payload.action;

  if (!commentId || (action !== "approve" && action !== "reject" && action !== "delete")) {
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

  const { data: comment, error: commentError } = await supabase
    .from("comments")
    .select("id, post_id")
    .eq("id", commentId)
    .maybeSingle();

  if (commentError || !comment) {
    return NextResponse.json({ ok: false, error: "comment_not_found" }, { status: 404 });
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", comment.post_id)
    .maybeSingle();

  if (postError || !post || post.user_id !== myProfile.id) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  if (action === "delete") {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
      return NextResponse.json({ ok: false, error: "comment_delete_failed" }, { status: 400 });
    }
  } else {
    const { error } = await supabase
      .from("comments")
      .update({ status: action === "approve" ? "approved" : "rejected" })
      .eq("id", commentId);

    if (error) {
      return NextResponse.json({ ok: false, error: "comment_update_failed" }, { status: 400 });
    }
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
