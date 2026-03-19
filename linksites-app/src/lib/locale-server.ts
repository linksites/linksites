import { cookies } from "next/headers";
import { normalizeLocale } from "@/lib/locale";

export async function getServerLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get("linksites-locale")?.value);
}
