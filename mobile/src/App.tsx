import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { BrandMark } from "./components/BrandMark";
import { InlineBanner } from "./components/InlineBanner";
import {
  loadTraineeToday,
  type TraineeTodayState,
} from "./features/trainee/trainee-api";
import {
  attachSupabaseAppStateRefresh,
  getSupabaseClient,
  getSupabaseConfigStatus,
} from "./lib/supabase";
import { CheckinScreen } from "./screens/CheckinScreen";
import { SignInScreen } from "./screens/SignInScreen";
import { TodayScreen, type TodayNotice } from "./screens/TodayScreen";
import { colors, fonts, radius, spacing } from "./theme/tokens";

void SplashScreen.preventAutoHideAsync();

type AppScreen = "signin" | "today" | "checkin";
type LoadedTodayState = Exclude<TraineeTodayState, { kind: "session_expired" }>;

function ConfigBlockedView({ message }: { message: string }) {
  return (
    <SafeAreaView style={styles.centeredRoot}>
      <View style={styles.configCard}>
        <BrandMark size="md" />
        <Text style={styles.configTitle}>Chưa cấu hình đích Supabase local</Text>
        <InlineBanner tone="error" title="Cấu hình không hợp lệ" message={message} />
        <Text style={styles.configHelp}>
          Bản Android U-01 chỉ chạy ở chế độ debug qua USB adb reverse (127.0.0.1:54321) và
          không tự chuyển sang máy chủ từ xa.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function AuthenticatedApp({ supabaseUrl }: { supabaseUrl: string }) {
  const [screen, setScreen] = useState<AppScreen>("signin");
  const [hydratingSession, setHydratingSession] = useState(true);
  const [signInNotice, setSignInNotice] = useState<string | null>(null);

  const [todayState, setTodayState] = useState<LoadedTodayState | null>(null);
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayRefreshing, setTodayRefreshing] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [todayNotice, setTodayNotice] = useState<TodayNotice | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const intentionalSignOutRef = useRef(false);
  const screenRef = useRef<AppScreen>("signin");
  screenRef.current = screen;

  const handleSessionExpired = useCallback(async (message: string) => {
    try {
      await getSupabaseClient().auth.signOut({ scope: "local" });
    } catch {
      // Ignore local cleanup error when session is already invalid.
    }
    setTodayState(null);
    setTodayError(null);
    setTodayNotice(null);
    setSignInNotice(message);
    setScreen("signin");
  }, []);

  const refreshToday = useCallback(
    async (isPullRefresh = false) => {
      if (isPullRefresh) {
        setTodayRefreshing(true);
      } else {
        setTodayLoading(true);
      }
      setTodayError(null);

      try {
        const result = await loadTraineeToday(getSupabaseClient());
        if (result.kind === "session_expired") {
          await handleSessionExpired(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          );
          return;
        }
        setTodayState(result);
      } catch (err) {
        setTodayError(
          err instanceof Error
            ? err.message
            : "Không thể tải dữ liệu hôm nay. Kiểm tra kết nối tới Supabase local.",
        );
      } finally {
        setTodayLoading(false);
        setTodayRefreshing(false);
      }
    },
    [handleSessionExpired],
  );

  useEffect(() => {
    const client = getSupabaseClient();
    const detachAppState = attachSupabaseAppStateRefresh(client);

    let active = true;
    void client.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session) {
          setScreen("today");
          void refreshToday(false);
        } else {
          setScreen("signin");
        }
      })
      .catch(() => {
        if (!active) return;
        setScreen("signin");
      })
      .finally(() => {
        if (active) setHydratingSession(false);
      });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        const wasSignedIn = screenRef.current !== "signin";
        const wasIntentional = intentionalSignOutRef.current;
        intentionalSignOutRef.current = false;
        setTodayState(null);
        setTodayError(null);
        setTodayNotice(null);
        if (wasSignedIn && !wasIntentional) {
          setSignInNotice("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
        setScreen("signin");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      detachAppState();
    };
  }, [refreshToday]);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    intentionalSignOutRef.current = true;
    try {
      await getSupabaseClient().auth.signOut();
    } catch {
      try {
        await getSupabaseClient().auth.signOut({ scope: "local" });
      } catch {
        // Proceed to sign-in view even if local sign-out fails.
      }
    } finally {
      setSigningOut(false);
      setTodayState(null);
      setTodayError(null);
      setTodayNotice(null);
      setSignInNotice("Bạn đã đăng xuất khỏi thiết bị này.");
      setScreen("signin");
    }
  }

  if (hydratingSession) {
    return (
      <SafeAreaView style={styles.centeredRoot}>
        <BrandMark size="md" />
        <ActivityIndicator
          size="small"
          color={colors.jade}
          style={styles.bootSpinner}
        />
        <Text style={styles.bootText}>Đang kiểm tra phiên đăng nhập...</Text>
      </SafeAreaView>
    );
  }

  if (screen === "signin") {
    return (
      <SignInScreen
        supabaseUrl={supabaseUrl}
        notice={signInNotice}
        onClearNotice={() => setSignInNotice(null)}
        onSignedIn={() => {
          setSignInNotice(null);
          setTodayNotice(null);
          setScreen("today");
          void refreshToday(false);
        }}
      />
    );
  }

  if (screen === "checkin" && todayState?.kind === "active") {
    return (
      <CheckinScreen
        traineeId={todayState.trainee.id}
        initialDate={todayState.todayVietnamDate}
        onBack={() => setScreen("today")}
        onCompleted={(notice) => {
          setTodayNotice(notice);
          setScreen("today");
          void refreshToday(false);
        }}
        onSessionExpired={(message) => {
          void handleSessionExpired(message);
        }}
        onAccessDenied={(message) => {
          setTodayNotice({
            tone: "warning",
            title: "Cần kiểm tra trạng thái hồ sơ",
            message,
          });
          setScreen("today");
          void refreshToday(false);
        }}
      />
    );
  }

  return (
    <TodayScreen
      todayState={todayState}
      loading={todayLoading}
      refreshing={todayRefreshing}
      error={todayError}
      notice={todayNotice}
      signingOut={signingOut}
      onRefresh={() => {
        void refreshToday(true);
      }}
      onOpenCheckin={() => {
        setTodayNotice(null);
        setScreen("checkin");
      }}
      onSignOut={() => {
        void handleSignOut();
      }}
      onDismissNotice={() => setTodayNotice(null)}
    />
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    BeVietnamPro_400Regular: require("../assets/fonts/be-vietnam-pro-0.ttf"),
    BeVietnamPro_500Medium: require("../assets/fonts/be-vietnam-pro-1.ttf"),
    BeVietnamPro_600SemiBold: require("../assets/fonts/be-vietnam-pro-2.ttf"),
    BeVietnamPro_700Bold: require("../assets/fonts/be-vietnam-pro-3.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const configResult = getSupabaseConfigStatus();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {configResult.ok ? (
        <AuthenticatedApp supabaseUrl={configResult.config.supabaseUrl} />
      ) : (
        <ConfigBlockedView message={configResult.message} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredRoot: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  bootSpinner: {
    marginTop: spacing.lg,
  },
  bootText: {
    marginTop: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
  },
  configCard: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.base,
  },
  configTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.forest,
  },
  configHelp: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
});
