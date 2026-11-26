// Strict debug-only loopback configuration for Android U-01 local testing.
// No hosted fallback is permitted; cleartext HTTP is restricted to loopback
// (127.0.0.1 / localhost) via USB `adb reverse` and rejected outside debug builds.

export type MobileSupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export type ConfigResolution =
  | { ok: true; config: MobileSupabaseConfig }
  | { ok: false; code: ConfigErrorCode; message: string };

export type ConfigErrorCode =
  | "NON_DEBUG_BUILD_BLOCKED"
  | "MISSING_URL"
  | "INVALID_URL"
  | "NON_LOOPBACK_URL"
  | "MISSING_ANON_KEY"
  | "PRIVILEGED_KEY_REJECTED";

const ALLOWED_LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost"]);
const PLACEHOLDER_KEY_PREFIX = "replace-with-";

function decodeJwtRole(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = decodeBase64Utf8(padded);
    const payload = JSON.parse(decoded) as { role?: unknown };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

function decodeBase64Utf8(base64: string): string {
  if (typeof globalThis.atob === "function") {
    return globalThis.atob(base64);
  }
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < base64.length; i += 1) {
    const ch = base64[i];
    if (!ch || ch === "=") break;
    const idx = alphabet.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 6) | idx;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((value >> bits) & 0xff);
    }
  }
  return output;
}

export function resolveLocalSupabaseConfig(options: {
  url: string | undefined;
  anonKey: string | undefined;
  isDev: boolean;
}): ConfigResolution {
  if (!options.isDev) {
    return {
      ok: false,
      code: "NON_DEBUG_BUILD_BLOCKED",
      message:
        "Bản Android U-01 hiện chỉ dành cho kiểm thử local debug qua USB adb reverse; chưa hỗ trợ bản phát hành.",
    };
  }

  const rawUrl = options.url?.trim() ?? "";
  if (!rawUrl) {
    return {
      ok: false,
      code: "MISSING_URL",
      message:
        "Thiếu EXPO_PUBLIC_SUPABASE_URL. Tạo mobile/.env.local với http://127.0.0.1:54321 và chạy adb reverse tcp:54321 tcp:54321.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return {
      ok: false,
      code: "INVALID_URL",
      message: "EXPO_PUBLIC_SUPABASE_URL không đúng định dạng URL.",
    };
  }

  if (parsed.protocol !== "http:" || !ALLOWED_LOOPBACK_HOSTS.has(parsed.hostname)) {
    return {
      ok: false,
      code: "NON_LOOPBACK_URL",
      message:
        "Bản U-01 chỉ cho phép đích loopback local (http://127.0.0.1:<port> hoặc http://localhost:<port>) và không tự chuyển sang máy chủ từ xa.",
    };
  }

  const rawKey = options.anonKey?.trim() ?? "";
  if (!rawKey || rawKey.toLowerCase().startsWith(PLACEHOLDER_KEY_PREFIX)) {
    return {
      ok: false,
      code: "MISSING_ANON_KEY",
      message:
        "Thiếu EXPO_PUBLIC_SUPABASE_ANON_KEY của Supabase local trong mobile/.env.local.",
    };
  }

  const jwtRole = decodeJwtRole(rawKey);
  if (jwtRole === "service_role" || rawKey.startsWith("sb_secret_")) {
    return {
      ok: false,
      code: "PRIVILEGED_KEY_REJECTED",
      message:
        "Từ chối khóa đặc quyền (service_role / secret) trên ứng dụng Android. Chỉ dùng khóa anon/publishable local.",
    };
  }

  const normalizedUrl = `${parsed.protocol}//${parsed.host}`;
  return {
    ok: true,
    config: {
      supabaseUrl: normalizedUrl,
      supabaseAnonKey: rawKey,
    },
  };
}

export function getRuntimeSupabaseConfig(): ConfigResolution {
  const isDevRuntime = typeof __DEV__ === "boolean" ? __DEV__ : false;
  return resolveLocalSupabaseConfig({
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    isDev: isDevRuntime,
  });
}
