import { describe, expect, it } from "vitest";

import { resolveLocalSupabaseConfig } from "./config";

function toBase64Url(json: Record<string, unknown>): string {
  return btoa(JSON.stringify(json))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function makeJwtWithRole(role: string): string {
  const header = toBase64Url({ alg: "HS256", typ: "JWT" });
  const payload = toBase64Url({ role, iss: "supabase-demo" });
  return `${header}.${payload}.signature`;
}

describe("debug-only loopback Supabase config guard", () => {
  const anonJwt = makeJwtWithRole("anon");
  const serviceRoleJwt = makeJwtWithRole("service_role");

  it("accepts loopback 127.0.0.1 and localhost HTTP URLs in debug mode with anon key", () => {
    const res1 = resolveLocalSupabaseConfig({
      url: "http://127.0.0.1:54321/",
      anonKey: anonJwt,
      isDev: true,
    });
    expect(res1.ok).toBe(true);
    if (res1.ok) {
      expect(res1.config.supabaseUrl).toBe("http://127.0.0.1:54321");
    }

    const res2 = resolveLocalSupabaseConfig({
      url: "http://localhost:54321",
      anonKey: anonJwt,
      isDev: true,
    });
    expect(res2.ok).toBe(true);
  });

  it("blocks non-debug builds so local cleartext loopback cannot ship to release", () => {
    const res = resolveLocalSupabaseConfig({
      url: "http://127.0.0.1:54321",
      anonKey: anonJwt,
      isDev: false,
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("NON_DEBUG_BUILD_BLOCKED");
    }
  });

  it("rejects hosted URLs and LAN IPs with no hosted fallback", () => {
    const hosted = resolveLocalSupabaseConfig({
      url: "https://example.supabase.co",
      anonKey: anonJwt,
      isDev: true,
    });
    expect(hosted.ok).toBe(false);
    if (!hosted.ok) {
      expect(hosted.code).toBe("NON_LOOPBACK_URL");
    }

    const lan = resolveLocalSupabaseConfig({
      url: "http://192.168.1.50:54321",
      anonKey: anonJwt,
      isDev: true,
    });
    expect(lan.ok).toBe(false);
    if (!lan.ok) {
      expect(lan.code).toBe("NON_LOOPBACK_URL");
    }

    const missing = resolveLocalSupabaseConfig({
      url: undefined,
      anonKey: anonJwt,
      isDev: true,
    });
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.code).toBe("MISSING_URL");
    }
  });

  it("rejects service_role JWTs, sb_secret_ keys, and placeholder values", () => {
    const svc = resolveLocalSupabaseConfig({
      url: "http://127.0.0.1:54321",
      anonKey: serviceRoleJwt,
      isDev: true,
    });
    expect(svc.ok).toBe(false);
    if (!svc.ok) {
      expect(svc.code).toBe("PRIVILEGED_KEY_REJECTED");
    }

    const sbSecret = resolveLocalSupabaseConfig({
      url: "http://127.0.0.1:54321",
      anonKey: "sb_secret_local_example",
      isDev: true,
    });
    expect(sbSecret.ok).toBe(false);
    if (!sbSecret.ok) {
      expect(sbSecret.code).toBe("PRIVILEGED_KEY_REJECTED");
    }

    const placeholder = resolveLocalSupabaseConfig({
      url: "http://127.0.0.1:54321",
      anonKey: "replace-with-local-supabase-anon-key",
      isDev: true,
    });
    expect(placeholder.ok).toBe(false);
    if (!placeholder.ok) {
      expect(placeholder.code).toBe("MISSING_ANON_KEY");
    }
  });
});
