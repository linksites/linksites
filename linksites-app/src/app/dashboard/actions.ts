"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ensureProfileForUser, normalizeUsernameInput } from "@/lib/profiles";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeDashboardRedirectTarget(value: string | null) {
  if (!value || !value.startsWith("/dashboard")) {
    return "/dashboard";
  }

  return value;
}

function buildDashboardUrl(kind: "error" | "message", value: string, redirectTo = "/dashboard") {
  return `${redirectTo}?${kind}=${encodeURIComponent(value)}`;
}

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/;
const HTTP_URL_PATTERN = /^https?:\/\/.+/i;
const AVATAR_BUCKET = "avatars";
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const MAX_POST_LENGTH = 280;
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

function getBooleanFormValue(formData: FormData, key: string) {
  return formData.getAll(key).some((value) => String(value) === "true");
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

async function getEditableProfile(redirectTo = "/dashboard") {
  if (!hasSupabaseEnv()) {
    redirect(buildDashboardUrl("error", "mock_mode_readonly", redirectTo));
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
    redirect(buildDashboardUrl("error", "profile_save_failed", redirectTo));
  }

  return { supabase, user, profile: ensuredProfile };
}

type LinkMutation = {
  id?: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
};

function normalizeLinkPosition(value: number, fallback: number) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.trunc(value));
}

export async function updateProfile(formData: FormData) {
  const redirectTo = normalizeDashboardRedirectTarget(String(formData.get("redirectTo") ?? ""));
  const { supabase, user, profile: ensuredProfile } = await getEditableProfile(redirectTo);

  const displayName = String(formData.get("displayName") ?? "").trim();
  const username = normalizeUsernameInput(String(formData.get("username") ?? "").trim());
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrlInput = normalizeOptionalUrl(String(formData.get("avatarUrl") ?? ""));
  const removeAvatar = getBooleanFormValue(formData, "removeAvatar");
  const avatarFile = formData.get("avatarFile");
  const themeSlug = String(formData.get("themeSlug") ?? "midnight-grid");
  const isPublished = formData.get("isPublished") === "true";

  if (!displayName) {
    redirect(buildDashboardUrl("error", "invalid_display_name", redirectTo));
  }

  if (!USERNAME_PATTERN.test(username)) {
    redirect(buildDashboardUrl("error", "invalid_username", redirectTo));
  }

  if (avatarUrlInput && !HTTP_URL_PATTERN.test(avatarUrlInput)) {
    redirect(buildDashboardUrl("error", "invalid_avatar_url", redirectTo));
  }

  const uploadedAvatar =
    avatarFile instanceof File && avatarFile.size > 0
      ? avatarFile
      : null;

  if (uploadedAvatar) {
    if (!ALLOWED_AVATAR_TYPES.has(uploadedAvatar.type) || uploadedAvatar.size > MAX_AVATAR_BYTES) {
      redirect(buildDashboardUrl("error", "invalid_avatar_file", redirectTo));
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
      redirect(buildDashboardUrl("error", "avatar_upload_failed", redirectTo));
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
      redirect(buildDashboardUrl("error", "username_taken", redirectTo));
    }

    redirect(buildDashboardUrl("error", "profile_save_failed", redirectTo));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${username}`);

  if (ensuredProfile.username !== username) {
    revalidatePath(`/u/${ensuredProfile.username}`);
  }

  redirect(buildDashboardUrl("message", "profile_saved", redirectTo));
}

export async function updateLinks(formData: FormData) {
  const redirectTo = normalizeDashboardRedirectTarget(String(formData.get("redirectTo") ?? ""));
  const { supabase, profile } = await getEditableProfile(redirectTo);
  const existingIds = formData
    .getAll("existingLinkIds")
    .map((value) => String(value))
    .filter(Boolean);
  const linksToDelete = new Set<string>();
  const existingLinksToUpdate: LinkMutation[] = [];

  for (const [index, linkId] of existingIds.entries()) {
    if (getBooleanFormValue(formData, `remove-${linkId}`)) {
      linksToDelete.add(linkId);
      continue;
    }

    const title = String(formData.get(`title-${linkId}`) ?? "").trim();
    const url = String(formData.get(`url-${linkId}`) ?? "").trim();
    const position = normalizeLinkPosition(Number(formData.get(`position-${linkId}`) ?? index), index);
    const isActive = getBooleanFormValue(formData, `isActive-${linkId}`);

    if (!title) {
      redirect(buildDashboardUrl("error", "invalid_link_title", redirectTo));
    }

    if (!HTTP_URL_PATTERN.test(url)) {
      redirect(buildDashboardUrl("error", "invalid_link_url", redirectTo));
    }

    existingLinksToUpdate.push({
      id: linkId,
      title,
      url,
      position,
      isActive,
    });
  }

  const newSlots = normalizeLinkPosition(Number(formData.get("newLinkSlots") ?? 0), 0);
  const newLinksToInsert: LinkMutation[] = [];

  for (let index = 0; index < newSlots; index += 1) {
    const title = String(formData.get(`new-title-${index}`) ?? "").trim();
    const url = String(formData.get(`new-url-${index}`) ?? "").trim();
    const position = normalizeLinkPosition(
      Number(formData.get(`new-position-${index}`) ?? existingLinksToUpdate.length + index),
      existingLinksToUpdate.length + index,
    );
    const isActive = getBooleanFormValue(formData, `new-isActive-${index}`);

    if (!title && !url) {
      continue;
    }

    if (!title) {
      redirect(buildDashboardUrl("error", "invalid_link_title", redirectTo));
    }

    if (!HTTP_URL_PATTERN.test(url)) {
      redirect(buildDashboardUrl("error", "invalid_link_url", redirectTo));
    }

    newLinksToInsert.push({
      title,
      url,
      position,
      isActive,
    });
  }

  const normalizedLinks = [...existingLinksToUpdate, ...newLinksToInsert]
    .sort((left, right) => left.position - right.position)
    .map((link, index) => ({
      ...link,
      position: index,
    }));

  const existingUpdates = normalizedLinks.filter((link): link is LinkMutation & { id: string } => Boolean(link.id));
  const newInserts = normalizedLinks.filter((link) => !link.id);
  const updateResults = await Promise.all(
    existingUpdates.map((link) =>
      supabase
        .from("links")
        .update({
          title: link.title,
          url: link.url,
          position: link.position,
          is_active: link.isActive,
        })
        .eq("id", link.id)
        .eq("profile_id", profile.id),
    ),
  );

  if (updateResults.some((result) => result.error)) {
    redirect(buildDashboardUrl("error", "links_save_failed", redirectTo));
  }

  if (newInserts.length) {
    const { error } = await supabase.from("links").insert(
      newInserts.map((link) => ({
        profile_id: profile.id,
        title: link.title,
        url: link.url,
        position: link.position,
        is_active: link.isActive,
      })),
    );

    if (error) {
      redirect(buildDashboardUrl("error", "links_save_failed", redirectTo));
    }
  }

  if (linksToDelete.size) {
    const { error } = await supabase.from("links").delete().eq("profile_id", profile.id).in("id", [...linksToDelete]);

    if (error) {
      redirect(buildDashboardUrl("error", "links_save_failed", redirectTo));
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath(`/u/${profile.username}`);

  redirect(buildDashboardUrl("message", "links_saved", redirectTo));
}

export async function createPost(formData: FormData) {
  const redirectTo = normalizeDashboardRedirectTarget(String(formData.get("redirectTo") ?? ""));
  const { supabase, profile } = await getEditableProfile(redirectTo);
  const content = String(formData.get("content") ?? "").trim();

  if (!content) {
    redirect(buildDashboardUrl("error", "invalid_post_content", redirectTo));
  }

  if (content.length > MAX_POST_LENGTH) {
    redirect(buildDashboardUrl("error", "invalid_post_length", redirectTo));
  }

  const { error } = await supabase.from("posts").insert({
    user_id: profile.id,
    content,
  });

  if (error) {
    redirect(buildDashboardUrl("error", "post_save_failed", redirectTo));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/u/${profile.username}`);

  redirect(buildDashboardUrl("message", "post_saved", redirectTo));
}

export async function deletePost(formData: FormData) {
  const redirectTo = normalizeDashboardRedirectTarget(String(formData.get("redirectTo") ?? ""));
  const { supabase, profile } = await getEditableProfile(redirectTo);
  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    redirect(buildDashboardUrl("error", "post_delete_failed", redirectTo));
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId).eq("user_id", profile.id);

  if (error) {
    redirect(buildDashboardUrl("error", "post_delete_failed", redirectTo));
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/network");
  revalidatePath("/dashboard/posts");
  revalidatePath(`/u/${profile.username}`);

  redirect(buildDashboardUrl("message", "post_deleted", redirectTo));
}
