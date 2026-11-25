import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, fonts, radius, spacing } from "../theme/tokens";
import { AlertCircleIcon, CheckCircleIcon } from "./Icons";

type BannerTone = "success" | "warning" | "error" | "info";

type InlineBannerProps = {
  tone: BannerTone;
  title?: string;
  message: string;
};

export function InlineBanner({ tone, title, message }: InlineBannerProps) {
  const isError = tone === "error";
  const isWarning = tone === "warning";
  const isSuccess = tone === "success";

  const iconColor = isError
    ? colors.destructive
    : isWarning
      ? colors.warning
      : isSuccess
        ? colors.success
        : colors.jade;

  return (
    <View
      style={[
        styles.container,
        isError && styles.error,
        isWarning && styles.warning,
        isSuccess && styles.success,
        tone === "info" && styles.info,
      ]}
      accessibilityRole={isError || isWarning ? "alert" : "text"}
      accessibilityLiveRegion={isError || isWarning ? "assertive" : "polite"}
    >
      <View style={styles.iconWrap}>
        {isSuccess ? (
          <CheckCircleIcon size={18} color={iconColor} />
        ) : (
          <AlertCircleIcon size={18} color={iconColor} />
        )}
      </View>
      <View style={styles.body}>
        {title ? (
          <Text
            style={[
              styles.title,
              isError && styles.errorText,
              isWarning && styles.warningText,
              isSuccess && styles.successText,
              tone === "info" && styles.infoText,
            ]}
          >
            {title}
          </Text>
        ) : null}
        <Text
          style={[
            styles.message,
            isError && styles.errorText,
            isWarning && styles.warningText,
            isSuccess && styles.successText,
            tone === "info" && styles.infoText,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  iconWrap: {
    marginTop: 2,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  success: {
    backgroundColor: colors.successBg,
    borderColor: colors.border,
  },
  warning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
  },
  error: {
    backgroundColor: colors.destructiveBg,
    borderColor: colors.destructiveBorder,
  },
  info: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: colors.warning,
  },
  errorText: {
    color: colors.destructive,
  },
  infoText: {
    color: colors.forest,
  },
});
