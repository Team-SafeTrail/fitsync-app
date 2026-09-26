import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Consolas", "monospace"],
      },
      colors: {
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",
        "border-default": "#E2E8F0",
        "border-strong": "#CBD5E1",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-muted": "#94A3B8",
        brand: {
          DEFAULT: "#1E40AF",
          hover: "#1D4ED8",
          light: "#EFF6FF",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0F766E",
          light: "#F0FDFA",
        },
        success: {
          DEFAULT: "#15803D",
          light: "#F0FDF4",
        },
        warning: {
          DEFAULT: "#B45309",
          light: "#FFFBEB",
        },
        destructive: {
          DEFAULT: "#B91C1C",
          light: "#FEF2F2",
        },
      },
      borderRadius: {
        sm: "4px",
        base: "6px",
        md: "8px",
        lg: "10px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
        sm: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)",
        md: "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)",
        dropdown: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
