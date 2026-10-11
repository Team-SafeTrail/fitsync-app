import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const foundationPath = fileURLToPath(new URL("./foundation.css", import.meta.url));
const designPath = fileURLToPath(new URL("../../../../DESIGN.md", import.meta.url));
const foundation = readFileSync(foundationPath, "utf8");
const design = readFileSync(designPath, "utf8");

function block(pattern: RegExp) {
  const match = foundation.match(pattern);
  if (!match) throw new Error(`Missing token block: ${pattern}`);
  return match[1];
}

function token(css: string, name: string) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  if (!match) throw new Error(`Missing color token --${name}`);
  return match[1];
}

function luminance(hex: string) {
  const values = hex.slice(1).match(/../g)!.map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = values.map((value) => value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

function expectThemeContrast(css: string) {
  const textPairs = [
    ["fs-text-primary", "fs-canvas"],
    ["fs-text-secondary", "fs-canvas"],
    ["fs-text-muted", "fs-canvas"],
    ["fs-on-brand", "fs-brand"],
    ["fs-on-danger", "fs-danger"],
    ["fs-success", "fs-success-soft"],
    ["fs-warning", "fs-warning-soft"],
    ["fs-danger", "fs-danger-soft"],
  ] as const;

  for (const [foreground, background] of textPairs) {
    expect(contrast(token(css, foreground), token(css, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast(token(css, "fs-border-strong"), token(css, "fs-surface"))).toBeGreaterThanOrEqual(3);
  expect(contrast(token(css, "fs-focus-ring"), token(css, "fs-canvas"))).toBeGreaterThanOrEqual(3);
}

describe("FitSync Adaptive Interface contract", () => {
  it("keeps DESIGN.md versioned and canonical", () => {
    expect(design).toMatch(/^---\nversion: 4\.0\.0\n/);
    expect(design.match(/^## .+$/gm)).toEqual([
      "## Overview",
      "## Colors",
      "## Typography",
      "## Layout",
      "## Elevation & Depth",
      "## Shapes",
      "## Components",
      "## Do's and Don'ts",
    ]);
    expect(design).toContain("Carbon v3.1 reconciliation");
  });

  it("meets contrast floors in light and dark themes", () => {
    const light = block(/:root,\s*\n\[data-theme="light"\]\s*\{([\s\S]*?)\n\}/);
    const dark = block(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
    expectThemeContrast(light);
    expectThemeContrast(dark);
  });

  it("defines all three accessibility media fallbacks", () => {
    expect(foundation).toContain("@media (prefers-reduced-motion: reduce)");
    expect(foundation).toContain("@media (prefers-reduced-transparency: reduce)");
    expect(foundation).toContain("@media (prefers-contrast: more)");
  });
});
