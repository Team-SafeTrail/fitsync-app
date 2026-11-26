import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BrandMark } from "../components/BrandMark";
import { EyeIcon, EyeOffIcon } from "../components/Icons";
import { InlineBanner } from "../components/InlineBanner";
import { PrimaryButton } from "../components/PrimaryButton";
import { mapSignInErrorMessage } from "../features/trainee/trainee-api";
import { getSupabaseClient } from "../lib/supabase";
import { colors, fonts, radius, spacing, touchTarget } from "../theme/tokens";

type SignInScreenProps = {
  supabaseUrl: string;
  notice: string | null;
  onSignedIn: () => void;
  onClearNotice: () => void;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

export function SignInScreen({
  supabaseUrl,
  notice,
  onSignedIn,
  onClearNotice,
}: SignInScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    onClearNotice();
    setFormError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const nextErrors: FieldErrors = {};
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Nhập địa chỉ email hợp lệ.";
    }
    if (password.length === 0) {
      nextErrors.password = "Nhập mật khẩu của bạn.";
    }

    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setFormError(mapSignInErrorMessage(error));
        return;
      }

      setPassword("");
      onSignedIn();
    } catch (err) {
      setFormError(
        mapSignInErrorMessage({
          message: err instanceof Error ? err.message : "network request failed",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, spacing.lg) + spacing.base,
            paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.base,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <BrandMark size="md" />
            <Text style={styles.heading}>Đăng nhập học viên</Text>
            <Text style={styles.subtitle}>
              Mở trang Hôm nay và gửi check-in hằng ngày cho PT phụ trách.
            </Text>
          </View>

          {notice ? (
            <InlineBanner tone="warning" title="Thông báo phiên" message={notice} />
          ) : null}

          <View style={styles.surface}>
            {formError ? (
              <InlineBanner tone="error" title="Chưa thể đăng nhập" message={formError} />
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label} nativeID="signin-email-label">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                editable={!submitting}
                placeholder="hocvien@example.test"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                accessibilityLabel="Email đăng nhập"
                accessibilityLabelledBy="signin-email-label"
                style={[styles.input, fieldErrors.email && styles.inputError]}
              />
              {fieldErrors.email ? (
                <Text style={styles.fieldError} accessibilityRole="alert">
                  {fieldErrors.email}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label} nativeID="signin-password-label">
                Mật khẩu
              </Text>
              <View style={[styles.passwordRow, fieldErrors.password && styles.inputError]}>
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  editable={!submitting}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    void handleSubmit();
                  }}
                  accessibilityLabel="Mật khẩu"
                  accessibilityLabelledBy="signin-password-label"
                  style={styles.passwordInput}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  disabled={submitting}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Pressable>
              </View>
              {fieldErrors.password ? (
                <Text style={styles.fieldError} accessibilityRole="alert">
                  {fieldErrors.password}
                </Text>
              ) : null}
            </View>

            <PrimaryButton
              label="Đăng nhập"
              loadingLabel="Đang đăng nhập..."
              loading={submitting}
              onPress={() => {
                void handleSubmit();
              }}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Chỉ dành cho tài khoản học viên đã liên kết qua lời mời từ PT trên web.
            </Text>
            <Text style={styles.debugMeta}>
              Đích kiểm thử local debug: {supabaseUrl}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    gap: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: colors.forest,
    marginTop: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  surface: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.base,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    color: colors.forest,
  },
  input: {
    minHeight: touchTarget.minSize,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.forest,
  },
  passwordRow: {
    minHeight: touchTarget.minSize,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    minHeight: touchTarget.minSize,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.forest,
  },
  eyeButton: {
    minWidth: touchTarget.minSize,
    minHeight: touchTarget.minSize,
    alignItems: "center",
    justifyContent: "center",
  },
  inputError: {
    borderColor: colors.destructive,
  },
  fieldError: {
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.destructive,
  },
  submitButton: {
    marginTop: spacing.xs,
  },
  footer: {
    gap: spacing.xs,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  debugMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
});
