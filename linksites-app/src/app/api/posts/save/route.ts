import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SavePayload = {
  postId?: string;
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

  let payload: SavePayload;

  try {
    payload = (await request.json()) as SavePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const postId = sanitizeId(payload.postId);

  if (!postId) {
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

  const { data: existingSave } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", myProfile.id)
    .maybeSingle();

  const saved = !existingSave;

  if (existingSave) {
    const { error } = await supabase
      .from("saved_posts")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", myProfile.id);

    if (error) {
      return NextResponse.json({ ok: false, error: "save_delete_failed" }, { status: 400 });
    }
  } else {
    const { error } = await supabase.from("saved_posts").insert({
      post_id: postId,
      user_id: myProfile.id,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "save_create_failed" }, { status: 400 });
    }
  }

  const { count } = await supabase
    .from("saved_posts")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", post.user_id)
    .maybeSingle();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/posts");
  if (ownerProfile?.username) {
    revalidatePath(`/u/${ownerProfile.username}`);
  }

  return NextResponse.json({
    ok: true,
    saved,
    savedCount: count ?? 0,
  });
}

