import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState, type AppStateStatus } from "react-native";

import type { Database } from "../types/database";
import { getRuntimeSupabaseConfig, type ConfigResolution } from "./config";
import { createChunkedSecureStorage } from "./secure-storage";
import { getVietnamDate, parseHttpDateHeader } from "./vietnam-date";

function createFitSyncClient(supabaseUrl: string, supabaseAnonKey: string) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: platformSecureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      fetch: fetchCapturingServerDate,
    },
  });
}

export type FitSyncSupabaseClient = ReturnType<typeof createFitSyncClient>;

let cachedClient: FitSyncSupabaseClient | null = null;
let cachedConfigResult: ConfigResolution | null = null;
let lastServerDateInstant: Date | null = null;
let appStateSubscriptionAttached = false;

const platformSecureStorage = createChunkedSecureStorage({
  getItemAsync: (key) => SecureStore.getItemAsync(key),
  setItemAsync: (key, value) => SecureStore.setItemAsync(key, value),
  deleteItemAsync: (key) => SecureStore.deleteItemAsync(key),
});

const fetchCapturingServerDate: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const parsed = parseHttpDateHeader(response.headers.get("date"));
  if (parsed) {
    lastServerDateInstant = parsed;
  }
  return response;
};

export function getLastObservedServerVietnamDate(): string {
  return getVietnamDate(lastServerDateInstant ?? new Date());
}

export function getSupabaseConfigStatus(): ConfigResolution {
  if (!cachedConfigResult) {
    cachedConfigResult = getRuntimeSupabaseConfig();
  }
  return cachedConfigResult;
}

// Single Supabase client instance backed by expo-secure-store (Android Keystore).
export function getSupabaseClient(): FitSyncSupabaseClient {
  if (cachedClient) {
    return cachedClient;
  }

  const configResult = getSupabaseConfigStatus();
  if (!configResult.ok) {
    throw new Error(configResult.message);
  }

  const client = createFitSyncClient(
    configResult.config.supabaseUrl,
    configResult.config.supabaseAnonKey,
  );
  cachedClient = client;
  return client;
}

export function attachSupabaseAppStateRefresh(client: FitSyncSupabaseClient): () => void {
  if (appStateSubscriptionAttached) {
    return () => {};
  }
  appStateSubscriptionAttached = true;

  const handleStateChange = (state: AppStateStatus) => {
    if (state === "active") {
      void client.auth.startAutoRefresh();
    } else {
      void client.auth.stopAutoRefresh();
    }
  };

  if (AppState.currentState === "active") {
    void client.auth.startAutoRefresh();
  }

  const subscription = AppState.addEventListener("change", handleStateChange);
  return () => {
    subscription.remove();
    appStateSubscriptionAttached = false;
  };
}
