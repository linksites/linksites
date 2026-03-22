const DEFAULT_AUTH_NEXT_PATH = "/dashboard";

export function sanitizeNextPath(value?: string | null) {
  if (!value) {
    return DEFAULT_AUTH_NEXT_PATH;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("/") || trimmedValue.startsWith("//")) {
    return DEFAULT_AUTH_NEXT_PATH;
  }

  return trimmedValue;
}

