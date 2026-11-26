import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { colors, fonts, spacing } from "../theme/tokens";

type BrandMarkProps = {
  size?: "sm" | "md";
  showWordmark?: boolean;
};

export function BrandMark({ size = "md", showWordmark = true }: BrandMarkProps) {
  const width = size === "sm" ? 28 : 34;
  const height = size === "sm" ? 22 : 27;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityRole="header"
      accessibilityLabel="FitSync"
    >
      <Svg
        width={width}
        height={height}
        viewBox="0 0 40 32"
        fill="none"
        importantForAccessibility="no-hide-descendants"
      >
        <Path
          d="M23 6h-7a10 10 0 0 0 0 20h1M17 6h7a10 10 0 0 1 0 20h-1M14 16h12"
          stroke={colors.forest}
          strokeWidth={2.7}
          strokeLinecap="round"
        />
      </Svg>
      {showWordmark ? (
        <Text style={[styles.wordmark, size === "sm" && styles.wordmarkSm]}>
          fitsync
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  wordmark: {
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: -0.6,
    color: colors.forest,
  },
  wordmarkSm: {
    fontSize: 18,
  },
});
