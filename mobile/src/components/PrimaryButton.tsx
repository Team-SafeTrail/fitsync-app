import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

import { colors, fonts, radius, spacing, touchTarget } from "../theme/tokens";

type PrimaryButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  onPress: () => void;
  style?: ViewStyle;
  accessibilityHint?: string;
};

export function PrimaryButton({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
  variant = "primary",
  onPress,
  style,
  accessibilityHint,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const textColor =
    variant === "primary" ? colors.onBrand : colors.forest;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={loading && loadingLabel ? loadingLabel : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.spinner}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {loading && loadingLabel ? loadingLabel : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.minSize,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.forest,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.52,
  },
  spinner: {
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  primaryLabel: {
    color: colors.onBrand,
  },
  secondaryLabel: {
    color: colors.forest,
  },
});
