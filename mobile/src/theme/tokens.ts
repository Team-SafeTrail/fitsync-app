// Approved FitSync Coaching Interface design tokens (DESIGN.md v4.0.0)
export const colors = {
  canvas: "#F5F8F6",
  surface: "#FFFFFF",
  surfaceMuted: "#EAF0EB",
  surfaceElevated: "#EAF3ED",
  forest: "#143E38",
  deep: "#102E2A",
  textPrimary: "#143E38",
  textSecondary: "#465E53",
  textMuted: "#52675C",
  jade: "#226C5D",
  sun: "#FFD29C",
  border: "#D4DFD7",
  borderStrong: "#6F8879",
  success: "#1D6951",
  successBg: "#EAF3ED",
  warning: "#85520F",
  warningBg: "#FFF2DB",
  warningBorder: "#E5C690",
  destructive: "#AC3434",
  destructiveBg: "#FCEDED",
  destructiveBorder: "#E5B4B4",
  onBrand: "#FFFFFF",
} as const;

export const fonts = {
  regular: "BeVietnamPro_400Regular",
  medium: "BeVietnamPro_500Medium",
  semiBold: "BeVietnamPro_600SemiBold",
  bold: "BeVietnamPro_700Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

export const touchTarget = {
  minSize: 48,
} as const;
