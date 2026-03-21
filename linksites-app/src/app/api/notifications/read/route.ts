import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ReadNotificationsPayload = {
  markAll?: boolean;
};

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: false, error: "mock_mode" }, { status: 400 });
  }

  let payload: ReadNotificationsPayload;

  try {
    payload = (await request.json()) as ReadNotificationsPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload.markAll) {
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

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", myProfile.id)
    .eq("read", false);

  if (error) {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 400 });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/notifications");

  return NextResponse.json({ ok: true });
}
