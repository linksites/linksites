import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseClientKey, supabaseUrl } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!supabaseUrl || !supabaseClientKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseClientKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const redirectTo = request.nextUrl.clone();
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("code");
    redirectTo.searchParams.delete("next");

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectResponse = NextResponse.redirect(redirectTo);

      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });

      return redirectResponse;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.delete("code");
    loginUrl.searchParams.delete("next");
    loginUrl.searchParams.set("error", "verify_link_failed");

    return NextResponse.redirect(loginUrl);
  }

  await supabase.auth.getUser();

  return supabaseResponse;
}
