import { headers } from "next/headers";

function normalizeBaseUrl(value: string) {
  return value.startsWith("http") ? value.replace(/\/+$/, "") : `https://${value.replace(/\/+$/, "")}`;
}

export async function getAppBaseUrl() {
  const explicitUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (explicitUrl) {
    return normalizeBaseUrl(explicitUrl);
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}
