// Platform-backed secure session storage adapter for Supabase Auth.
// Uses expo-secure-store (Android Keystore-backed EncryptedSharedPreferences)
// with UTF-8 byte-safe chunking below the 2048-byte native SecureStore ceiling.

export type SecureStoreBackend = {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
};

export type SupabaseStorageAdapter = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

// Keep each entry well under Android Keystore / expo-secure-store's 2048-byte limit.
export const SECURE_STORE_MAX_CHUNK_BYTES = 1600;

export function sanitizeSecureStoreKey(rawKey: string): string {
  // expo-secure-store only accepts [A-Za-z0-9._-]
  return rawKey.replace(/[^A-Za-z0-9._-]/g, "_");
}

function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0x7f) bytes += 1;
    else if (code <= 0x7ff) bytes += 2;
    else if (code <= 0xffff) bytes += 3;
    else bytes += 4;
  }
  return bytes;
}

export function splitByUtf8Bytes(value: string, maxBytes = SECURE_STORE_MAX_CHUNK_BYTES): string[] {
  if (value.length === 0) return [""];
  const chunks: string[] = [];
  let current = "";
  let currentBytes = 0;

  for (const char of value) {
    const charBytes = utf8ByteLength(char);
    if (currentBytes + charBytes > maxBytes && current.length > 0) {
      chunks.push(current);
      current = char;
      currentBytes = charBytes;
    } else {
      current += char;
      currentBytes += charBytes;
    }
  }
  if (current.length > 0) {
    chunks.push(current);
  }
  return chunks;
}

function manifestKey(safeKey: string): string {
  return `${safeKey}.__v1_chunks`;
}

function chunkKey(safeKey: string, index: number): string {
  return `${safeKey}.__v1_c${index}`;
}

export function createChunkedSecureStorage(
  backend: SecureStoreBackend,
  maxChunkBytes = SECURE_STORE_MAX_CHUNK_BYTES,
): SupabaseStorageAdapter {
  async function readExistingChunkCount(safeKey: string): Promise<number> {
    const rawCount = await backend.getItemAsync(manifestKey(safeKey));
    if (!rawCount) return 0;
    const parsed = Number.parseInt(rawCount, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
  }

  return {
    async getItem(key: string): Promise<string | null> {
      const safeKey = sanitizeSecureStoreKey(key);
      const count = await readExistingChunkCount(safeKey);
      if (count > 0) {
        const parts: string[] = [];
        for (let i = 0; i < count; i += 1) {
          const part = await backend.getItemAsync(chunkKey(safeKey, i));
          if (part === null) {
            // Partial/corrupted write: fail closed by forcing clean re-authentication.
            return null;
          }
          parts.push(part);
        }
        return parts.join("");
      }
      // Single-value or legacy direct key fallback.
      return backend.getItemAsync(safeKey);
    },

    async setItem(key: string, value: string): Promise<void> {
      const safeKey = sanitizeSecureStoreKey(key);
      const previousCount = await readExistingChunkCount(safeKey);
      const chunks = splitByUtf8Bytes(value, maxChunkBytes);

      if (chunks.length === 1 && utf8ByteLength(value) <= maxChunkBytes) {
        await backend.setItemAsync(safeKey, value);
        if (previousCount > 0) {
          await backend.deleteItemAsync(manifestKey(safeKey));
          for (let i = 0; i < previousCount; i += 1) {
            await backend.deleteItemAsync(chunkKey(safeKey, i));
          }
        }
        return;
      }

      for (let i = 0; i < chunks.length; i += 1) {
        await backend.setItemAsync(chunkKey(safeKey, i), chunks[i] ?? "");
      }
      await backend.setItemAsync(manifestKey(safeKey), String(chunks.length));
      await backend.deleteItemAsync(safeKey);

      for (let i = chunks.length; i < previousCount; i += 1) {
        await backend.deleteItemAsync(chunkKey(safeKey, i));
      }
    },

    async removeItem(key: string): Promise<void> {
      const safeKey = sanitizeSecureStoreKey(key);
      const previousCount = await readExistingChunkCount(safeKey);
      await backend.deleteItemAsync(safeKey);
      await backend.deleteItemAsync(manifestKey(safeKey));
      for (let i = 0; i < previousCount; i += 1) {
        await backend.deleteItemAsync(chunkKey(safeKey, i));
      }
    },
  };
}
