import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, supabaseClientKey, supabaseUrl } from "@/lib/supabase/env";

export async function createSupabaseServerClient() {
  if (!hasSupabaseEnv()) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase public client key.");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseClientKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot always write cookies. The proxy refresh path handles that case.
        }
      },
    },
  });
}
