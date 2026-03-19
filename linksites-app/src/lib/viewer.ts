import { cache } from "react";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoProfile } from "@/lib/mock-data";
import { ensureProfileForUser, getProfileByUserId } from "@/lib/profiles";

export const getCurrentViewer = cache(async () => {
  if (!hasSupabaseEnv()) {
    return {
      user: {
        id: "demo-user",
        email: "demo@linksites.app",
      },
      profile: demoProfile,
      isMock: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      isMock: false,
    };
  }

  const profile = (await getProfileByUserId(user.id)) ?? (await ensureProfileForUser(user));

  return {
    user,
    profile,
    isMock: false,
  };
});
