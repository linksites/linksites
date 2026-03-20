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
const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

function normalizeOptionalUrl(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function sanitizeFileName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function extractStoragePath(publicUrl?: string | null) {
  if (!publicUrl) {
    return null;
  }

  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(publicUrl.slice(markerIndex + marker.length));
}

async function uploadAvatar({
  supabase,
  userId,
  file,
  currentAvatarUrl,
}: {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  userId: string;
  file: File;
  currentAvatarUrl: string | null;
}) {
  const extension = sanitizeFileName(file.name.split(".").pop() || "jpg") || "jpg";
  const objectPath = `${userId}/${Date.now()}-avatar.${extension}`;
  const previousPath = extractStoragePath(currentAvatarUrl);

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(objectPath, file, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    throw new Error("avatar_upload_failed");
  }

  if (previousPath && previousPath !== objectPath) {
    await supabase.storage.from(AVATAR_BUCKET).remove([previousPath]);
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function getEditableProfile() {
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

  return { supabase, user, profile: ensuredProfile };
}

export async function updateProfile(formData: FormData) {
  const { supabase, user, profile: ensuredProfile } = await getEditableProfile();

  const displayName = String(formData.get("displayName") ?? "").trim();
  const username = normalizeUsernameInput(String(formData.get("username") ?? "").trim());
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrlInput = normalizeOptionalUrl(String(formData.get("avatarUrl") ?? ""));
  const removeAvatar = formData.get("removeAvatar") === "true";
  const avatarFile = formData.get("avatarFile");
  const themeSlug = String(formData.get("themeSlug") ?? "midnight-grid");
  const isPublished = formData.get("isPublished") === "true";

  if (!displayName) {
    redirect(buildDashboardUrl("error", "invalid_display_name"));
  }

  if (!USERNAME_PATTERN.test(username)) {
    redirect(buildDashboardUrl("error", "invalid_username"));
  }

  if (avatarUrlInput && !HTTP_URL_PATTERN.test(avatarUrlInput)) {
    redirect(buildDashboardUrl("error", "invalid_avatar_url"));
  }

  const uploadedAvatar =
    avatarFile instanceof File && avatarFile.size > 0
      ? avatarFile
      : null;

  if (uploadedAvatar) {
    if (!ALLOWED_AVATAR_TYPES.has(uploadedAvatar.type) || uploadedAvatar.size > MAX_AVATAR_BYTES) {
      redirect(buildDashboardUrl("error", "invalid_avatar_file"));
    }
  }

  let avatarUrl = removeAvatar ? null : avatarUrlInput;

  if (uploadedAvatar) {
    try {
      avatarUrl = await uploadAvatar({
        supabase,
        userId: user.id,
        file: uploadedAvatar,
        currentAvatarUrl: ensuredProfile.avatarUrl,
      });
    } catch {
      redirect(buildDashboardUrl("error", "avatar_upload_failed"));
    }
  } else if (removeAvatar) {
    const existingPath = extractStoragePath(ensuredProfile.avatarUrl);

    if (existingPath) {
      await supabase.storage.from(AVATAR_BUCKET).remove([existingPath]);
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      username,
      bio,
      avatar_url: avatarUrl,
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

export async function updateLinks(formData: FormData) {
  const { supabase, profile } = await getEditableProfile();
  const existingIds = formData
    .getAll("existingLinkIds")
    .map((value) => String(value))
    .filter(Boolean);

  for (const linkId of existingIds) {
    if (formData.get(`remove-${linkId}`) === "true") {
      const { error } = await supabase.from("links").delete().eq("id", linkId).eq("profile_id", profile.id);

      if (error) {
        redirect(buildDashboardUrl("error", "links_save_failed"));
      }

      continue;
    }

    const title = String(formData.get(`title-${linkId}`) ?? "").trim();
    const url = String(formData.get(`url-${linkId}`) ?? "").trim();
    const position = Number(formData.get(`position-${linkId}`) ?? 0);
    const isActive = formData.get(`isActive-${linkId}`) === "true";

    if (!title) {
      redirect(buildDashboardUrl("error", "invalid_link_title"));
    }

    if (!HTTP_URL_PATTERN.test(url)) {
      redirect(buildDashboardUrl("error", "invalid_link_url"));
    }

    const { error } = await supabase
      .from("links")
      .update({
        title,
        url,
        position: Number.isFinite(position) ? position : 0,
        is_active: isActive,
      })
      .eq("id", linkId)
      .eq("profile_id", profile.id);

    if (error) {
      redirect(buildDashboardUrl("error", "links_save_failed"));
    }
  }

  const newSlots = Number(formData.get("newLinkSlots") ?? 0);

  for (let index = 0; index < newSlots; index += 1) {
    const title = String(formData.get(`new-title-${index}`) ?? "").trim();
    const url = String(formData.get(`new-url-${index}`) ?? "").trim();
    const position = Number(formData.get(`new-position-${index}`) ?? existingIds.length + index);
    const isActive = formData.get(`new-isActive-${index}`) === "true";

    if (!title && !url) {
      continue;
    }

    if (!title) {
      redirect(buildDashboardUrl("error", "invalid_link_title"));
    }

    if (!HTTP_URL_PATTERN.test(url)) {
      redirect(buildDashboardUrl("error", "invalid_link_url"));
    }

    const { error } = await supabase.from("links").insert({
      profile_id: profile.id,
      title,
      url,
      position: Number.isFinite(position) ? position : existingIds.length + index,
      is_active: isActive,
    });

    if (error) {
      redirect(buildDashboardUrl("error", "links_save_failed"));
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${profile.username}`);

  redirect(buildDashboardUrl("message", "links_saved"));
}
