import { describe, expect, it } from "vitest";

import {
  createChunkedSecureStorage,
  sanitizeSecureStoreKey,
  splitByUtf8Bytes,
  type SecureStoreBackend,
} from "./secure-storage";

function createMemorySecureStore(): SecureStoreBackend & {
  store: Map<string, string>;
} {
  const store = new Map<string, string>();
  return {
    store,
    async getItemAsync(key) {
      return store.get(key) ?? null;
    },
    async setItemAsync(key, value) {
      if (!/^[A-Za-z0-9._-]+$/.test(key)) {
        throw new Error(`Invalid SecureStore key: ${key}`);
      }
      store.set(key, value);
    },
    async deleteItemAsync(key) {
      store.delete(key);
    },
  };
}

describe("platform-backed chunked SecureStore session adapter", () => {
  it("sanitizes keys with colons or spaces to valid SecureStore identifiers", () => {
    expect(sanitizeSecureStoreKey("sb-127.0.0.1:54321-auth-token")).toBe(
      "sb-127.0.0.1_54321-auth-token",
    );
  });

  it("round-trips multi-chunk Supabase session payloads with UTF-8 Vietnamese text", async () => {
    const backend = createMemorySecureStore();
    const storage = createChunkedSecureStorage(backend, 128);

    const payload = JSON.stringify({
      access_token: "a".repeat(300),
      refresh_token: "r".repeat(120),
      user: {
        id: "user-1",
        user_metadata: { display_name: "Nguyễn Minh Quân — Học viên DEMO 💪" },
      },
    });

    await storage.setItem("sb-127.0.0.1:54321-auth-token", payload);
    expect(backend.store.size).toBeGreaterThan(2);

    const restored = await storage.getItem("sb-127.0.0.1:54321-auth-token");
    expect(restored).toBe(payload);
  });

  it("cleans up stale chunks when overwritten with a shorter payload or removed", async () => {
    const backend = createMemorySecureStore();
    const storage = createChunkedSecureStorage(backend, 64);

    await storage.setItem("session:key", "x".repeat(300));
    expect(backend.store.size).toBe(6); // manifest + 5 chunks

    await storage.setItem("session:key", "short");
    expect(backend.store.size).toBe(1);
    expect(await storage.getItem("session:key")).toBe("short");

    await storage.removeItem("session:key");
    expect(backend.store.size).toBe(0);
    expect(await storage.getItem("session:key")).toBeNull();
  });

  it("fails closed by returning null if a chunk is missing", async () => {
    const backend = createMemorySecureStore();
    const storage = createChunkedSecureStorage(backend, 64);

    await storage.setItem("session:key", "y".repeat(200));
    backend.store.delete("session_key.__v1_c1");

    expect(await storage.getItem("session:key")).toBeNull();
  });

  it("never splits surrogate pairs across chunk boundaries", () => {
    const encoder = new TextEncoder();
    const text = "💪".repeat(20);
    const chunks = splitByUtf8Bytes(text, 10); // 4 bytes per emoji -> 2 per chunk = 8 bytes
    expect(chunks.join("")).toBe(text);
    for (const chunk of chunks) {
      expect(encoder.encode(chunk).byteLength).toBeLessThanOrEqual(10);
    }
  });
});
