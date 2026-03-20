"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppBaseUrl } from "@/lib/app-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildMessageUrl(path: string, key: "error" | "message", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(buildMessageUrl("/login", "error", "missing_credentials"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", "could_not_sign_in"));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const appBaseUrl = await getAppBaseUrl();

  if (!email || !password) {
    redirect(buildMessageUrl("/login", "error", "missing_signup_credentials"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appBaseUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", "could_not_sign_up"));
  }

  revalidatePath("/", "layout");
  redirect(buildMessageUrl("/login", "message", "check_email"));
}

export async function magicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const appBaseUrl = await getAppBaseUrl();

  if (!email) {
    redirect(buildMessageUrl("/login", "error", "missing_magic_email"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appBaseUrl}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", "could_not_send_magic_link"));
  }

  redirect(buildMessageUrl("/login", "message", "magic_link_sent"));
}
