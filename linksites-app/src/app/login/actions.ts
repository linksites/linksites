"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function buildMessageUrl(path: string, key: "error" | "message", value: string) {
  return `${path}?${key}=${encodeURIComponent(value)}`;
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect(buildMessageUrl("/login", "error", "Enter your email and password to continue."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", error.message));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  if (!email || !password) {
    redirect(buildMessageUrl("/login", "error", "Enter your email and password to create your account."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", error.message));
  }

  revalidatePath("/", "layout");
  redirect(buildMessageUrl("/login", "message", "Check your email to confirm your account."));
}

export async function magicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";

  if (!email) {
    redirect(buildMessageUrl("/login", "error", "Enter your email to receive a magic link."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) {
    redirect(buildMessageUrl("/login", "error", error.message));
  }

  redirect(buildMessageUrl("/login", "message", "Magic link sent. Check your inbox."));
}
