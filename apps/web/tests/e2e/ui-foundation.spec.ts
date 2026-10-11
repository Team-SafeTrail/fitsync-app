import { expect, test } from "@playwright/test";

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((channel) => Number.parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground: string, background: string) {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
}

test("adaptive tokens, targets, and dialog behavior meet the foundation contract", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ui-foundation-preview");
  await expect(page.getByRole("heading", { name: /Nền tảng rõ ràng/ })).toBeVisible();

  const undersizedButtons = await page.locator("button").evaluateAll((buttons) => buttons
    .filter((button) => {
      const rect = button.getBoundingClientRect();
      return rect.width < 44 || rect.height < 44;
    })
    .map((button) => button.textContent));
  expect(undersizedButtons).toEqual([]);

  const lightTokens = await page.locator("main").evaluate((main) => {
    main.setAttribute("data-theme", "light");
    const styles = getComputedStyle(main);
    return {
      canvas: styles.getPropertyValue("--fs-canvas").trim(),
      primary: styles.getPropertyValue("--fs-text-primary").trim(),
      secondary: styles.getPropertyValue("--fs-text-secondary").trim(),
      muted: styles.getPropertyValue("--fs-text-muted").trim(),
      brand: styles.getPropertyValue("--fs-brand").trim(),
      onBrand: styles.getPropertyValue("--fs-on-brand").trim(),
    };
  });
  expect(contrast(lightTokens.primary, lightTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(lightTokens.secondary, lightTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(lightTokens.muted, lightTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(lightTokens.onBrand, lightTokens.brand)).toBeGreaterThanOrEqual(4.5);

  const darkTokens = await page.locator("main").evaluate((main) => {
    main.setAttribute("data-theme", "dark");
    const styles = getComputedStyle(main);
    return {
      canvas: styles.getPropertyValue("--fs-canvas").trim(),
      primary: styles.getPropertyValue("--fs-text-primary").trim(),
      secondary: styles.getPropertyValue("--fs-text-secondary").trim(),
      muted: styles.getPropertyValue("--fs-text-muted").trim(),
      brand: styles.getPropertyValue("--fs-brand").trim(),
      onBrand: styles.getPropertyValue("--fs-on-brand").trim(),
    };
  });
  expect(contrast(darkTokens.primary, darkTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(darkTokens.secondary, darkTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(darkTokens.muted, darkTokens.canvas)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(darkTokens.onBrand, darkTokens.brand)).toBeGreaterThanOrEqual(4.5);

  const trigger = page.getByRole("button", { name: "Mở tác vụ mẫu" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Tạo học viên mẫu" });
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel("Tên học viên")).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.getByRole("button", { name: "Lưu học viên mẫu" }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Đóng" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("system theme and accessibility media preferences have deterministic fallbacks", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/ui-foundation-preview");
  const main = page.locator("main");
  await expect(main).not.toHaveAttribute("data-theme");
  await expect.poll(() => main.evaluate((element) => getComputedStyle(element).getPropertyValue("--fs-canvas").trim())).toBe("#11110f");

  const primaryButton = page.getByRole("button", { name: "Mở tác vụ mẫu" });
  await expect(primaryButton).toHaveCSS("transition-duration", "0s");

  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: "dark" },
      { name: "prefers-reduced-motion", value: "reduce" },
      { name: "prefers-reduced-transparency", value: "reduce" },
      { name: "prefers-contrast", value: "more" },
    ],
  });
  await primaryButton.click();
  const dialog = page.getByRole("dialog", { name: "Tạo học viên mẫu" });
  await expect(dialog).toHaveCSS("backdrop-filter", "none");
  await expect(dialog).toHaveCSS("border-top-width", "2px");
});
