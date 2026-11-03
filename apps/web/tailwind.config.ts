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
        sans: ["var(--font-be-vietnam)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-be-vietnam)", "var(--font-be-vietnam)", "sans-serif"],
        mono: ["var(--font-mono)", "SF Mono", "Consolas", "monospace"],
      },
      colors: {
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          elevated: "var(--color-surface-elevated)",
          muted: "var(--color-surface-muted)",
        },
        "border-default": "var(--color-border-default)",
        "border-strong": "var(--color-border-strong)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        brand: {
          DEFAULT: "var(--color-brand)",
          hover: "var(--color-brand-hover)",
          light: "var(--color-brand-light)",
          foreground: "var(--color-brand-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-success)",
          light: "var(--color-success-light)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          light: "rgba(52, 211, 153, 0.08)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          light: "var(--color-warning-light)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          light: "var(--color-destructive-light)",
        },
      },
      borderRadius: {
        sm: "4px",
        base: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        sm: "0 2px 4px 0 rgba(0, 0, 0, 0.25)",
        md: "0 4px 12px -2px rgba(0, 0, 0, 0.3)",
        lg: "0 8px 24px -4px rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px rgba(245, 166, 35, 0.08)",
        "glow-accent": "0 0 30px rgba(52, 211, 153, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
