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
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "SF Mono", "Consolas", "monospace"],
      },
      colors: {
        canvas: "#0E0E12",
        surface: {
          DEFAULT: "#18181D",
          elevated: "#1F1F25",
          muted: "#13131A",
        },
        "border-default": "#28282E",
        "border-strong": "#3A3A42",
        "text-primary": "#ECEAE6",
        "text-secondary": "#9A968F",
        "text-muted": "#5C5A55",
        brand: {
          DEFAULT: "#F5A623",
          hover: "#FFB83D",
          light: "rgba(245, 166, 35, 0.1)",
          foreground: "#0E0E12",
        },
        accent: {
          DEFAULT: "#34D399",
          light: "rgba(52, 211, 153, 0.1)",
        },
        success: {
          DEFAULT: "#34D399",
          light: "rgba(52, 211, 153, 0.08)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "rgba(245, 158, 11, 0.08)",
        },
        destructive: {
          DEFAULT: "#EF4444",
          light: "rgba(239, 68, 68, 0.08)",
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
