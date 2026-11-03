import { expect, test } from "@playwright/test";

test.describe("Outcome 2: Admin Portal & Landing Enhancements", () => {
  test("landing displays SafeTrail team members, contact info and Android APK download CTA", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");

    // 1. Check TeamSection presence and members
    const teamSection = page.locator("#team");
    await expect(teamSection).toBeVisible();
    await expect(teamSection.getByText("Team SafeTrail")).toBeVisible();
    await expect(teamSection.getByText("Huỳnh Quốc Việt")).toBeVisible();
    await expect(teamSection.getByText("Lê Văn Toàn")).toBeVisible();
    await expect(teamSection.getByText("Dương Quang Huy")).toBeVisible();
    await expect(teamSection.getByText("Lê Nguyễn Gia Hưng")).toBeVisible();
    await expect(teamSection.getByText("Diệp Khai")).toBeVisible();

    // 2. Check Contact & Android APK CTA
    const contactAppSection = page.locator("#contact-app");
    await expect(contactAppSection).toBeVisible();
    await expect(contactAppSection.getByText("FitSync Android App")).toBeVisible();
    await expect(contactAppSection.getByText("Tải Bản Cài Đặt Android APK")).toBeVisible();
    await expect(contactAppSection.getByText("0901.234.567")).toBeVisible();

    // 3. Check responsiveness on mobile viewport (no horizontal overflow)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator("#team")).toBeVisible();
    await expect(page.locator("#contact-app")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("unauthenticated access to /admin redirects to login with return path", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin|\/login\?next=\/admin|\/login/);
  });
});
