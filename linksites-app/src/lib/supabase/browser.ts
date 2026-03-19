"use client";

import { createBrowserClient } from "@supabase/ssr";
import { hasSupabaseEnv, supabaseClientKey, supabaseUrl } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase public client key.");
  }

  return createBrowserClient(supabaseUrl!, supabaseClientKey!);
}
