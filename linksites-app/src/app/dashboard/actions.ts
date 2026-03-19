"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureProfileForUser, normalizeUsernameInput } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildDashboardUrl(kind: "error" | "message", value: string) {
  return `/dashboard?${kind}=${encodeURIComponent(value)}`;
}

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;

export async function updateProfile(formData: FormData) {
  if (!hasSupabaseEnv()) {
    redirect(buildDashboardUrl("error", "mock_mode_readonly"));
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=sign_in_required");
  }

  const ensuredProfile = await ensureProfileForUser(user);

  if (!ensuredProfile) {
    redirect(buildDashboardUrl("error", "profile_save_failed"));
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const username = normalizeUsernameInput(String(formData.get("username") ?? "").trim());
  const bio = String(formData.get("bio") ?? "").trim();
  const themeSlug = String(formData.get("themeSlug") ?? "midnight-grid");
  const isPublished = formData.get("isPublished") === "true";

  if (!displayName) {
    redirect(buildDashboardUrl("error", "invalid_display_name"));
  }

  if (!USERNAME_PATTERN.test(username)) {
    redirect(buildDashboardUrl("error", "invalid_username"));
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      username,
      bio,
      theme_slug: themeSlug,
      is_published: isPublished,
    })
    .eq("id", ensuredProfile.id)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23505") {
      redirect(buildDashboardUrl("error", "username_taken"));
    }

    redirect(buildDashboardUrl("error", "profile_save_failed"));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${username}`);

  if (ensuredProfile.username !== username) {
    revalidatePath(`/u/${ensuredProfile.username}`);
  }

  redirect(buildDashboardUrl("message", "profile_saved"));
}
