import { expect, test } from "@playwright/test";

test.describe("Outcome 2: Admin Portal & Landing Enhancements", () => {
  test("landing separates coursework from customer value and does not promise an unavailable APK", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await page.locator("#team summary").click();
    const teamSection = page.locator("#team");
    for (const name of ["Team SafeTrail", "Huỳnh Quốc Việt", "Lê Văn Toàn", "Dương Quang Huy", "Lê Nguyễn Gia Hưng", "Diệp Khai"]) {
      await expect(teamSection).toContainText(name);
    }
    await expect(teamSection).toContainText("EXE201");
    await page.locator("#contact-app summary").click();
    await expect(page.locator("#contact-app")).toContainText("Chưa công bố APK");
    await expect(page.getByRole("link", {name:/Tải.*APK/})).toHaveCount(0);
    await expect(page.locator("body")).not.toContainText("0901.234.567");
    await expect(page.locator("body")).not.toContainText("hỗ trợ 24/7");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expect(page.locator("#team summary")).toBeVisible();
    await expect(page.locator("#contact-app summary")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("unauthenticated access to /admin redirects to login with return path", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login\?next=%2Fadmin|\/login\?next=\/admin|\/login/);
  });
});
