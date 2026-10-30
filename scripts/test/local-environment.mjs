// Pure validation: CI must never use a cloud project or allow env-file injection.
export function localTestEnvironment(status) {
  const url = new URL(status.API_URL ?? "");
  if (url.protocol !== "http:" || !["127.0.0.1", "localhost"].includes(url.hostname) || url.port !== "54321" || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Refusing a non-local Supabase test target.");
  }
  const publicKey = status.PUBLISHABLE_KEY || status.ANON_KEY;
  const serviceKey = status.SERVICE_ROLE_KEY;
  for (const value of [publicKey, serviceKey]) {
    if (typeof value !== "string" || !value.trim() || /[\r\n]/.test(value)) throw new Error("Missing or invalid local test keys.");
  }
  return {
    NEXT_PUBLIC_SUPABASE_URL: url.origin,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publicKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
    NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
    FITSYNC_CHAT_ENABLED: "true",
    FITSYNC_CALENDAR_ENABLED: "true",
    FITSYNC_E2E_LOCAL_DB: "true",
    NEXT_TELEMETRY_DISABLED: "1",
  };
}
