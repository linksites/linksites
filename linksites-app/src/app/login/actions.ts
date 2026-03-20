"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAppBaseUrl } from "@/lib/app-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildMessageUrl(path: string, key: "error" | "message", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

function resolveAuthFeedbackKey(
  flow: "login" | "signup" | "magic",
  error: { code?: string | null; message?: string | null },
) {
  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();

  const matches = (...patterns: string[]) =>
    patterns.some((pattern) => code.includes(pattern) || message.includes(pattern));

  if (flow === "signup") {
    if (matches("user_already_exists", "email_exists", "user already registered", "already registered")) {
      return "signup_email_registered";
    }

    if (matches("email_address_invalid", "invalid email", "email address")) {
      return "signup_invalid_email";
    }

    if (matches("weak_password", "password should be at least", "password is too weak")) {
      return "signup_weak_password";
    }

    if (matches("email_provider_disabled", "signups not allowed", "signup is disabled", "email provider is disabled")) {
      return "signup_disabled";
    }

    if (matches("over_email_send_rate_limit", "over_request_rate_limit", "rate limit", "too many requests")) {
      return "signup_rate_limited";
    }

    return error.message?.trim() || "could_not_sign_up";
  }

  if (flow === "login") {
    if (matches("invalid login credentials", "email not confirmed", "email_not_confirmed")) {
      return "login_invalid_credentials";
    }

    if (matches("too many requests", "rate limit", "over_request_rate_limit")) {
      return "login_rate_limited";
    }

    return error.message?.trim() || "could_not_sign_in";
  }

  if (matches("email_address_invalid", "invalid email", "email address")) {
    return "magic_invalid_email";
  }

  if (matches("email_provider_disabled", "email provider is disabled", "signups not allowed")) {
    return "magic_disabled";
  }

  if (matches("over_email_send_rate_limit", "over_request_rate_limit", "rate limit", "too many requests")) {
    return "magic_rate_limited";
  }

  return error.message?.trim() || "could_not_send_magic_link";
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
    redirect(buildMessageUrl("/login", "error", resolveAuthFeedbackKey("login", error)));
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
    redirect(buildMessageUrl("/login", "error", resolveAuthFeedbackKey("signup", error)));
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
    redirect(buildMessageUrl("/login", "error", resolveAuthFeedbackKey("magic", error)));
  }

  redirect(buildMessageUrl("/login", "message", "magic_link_sent"));
}
