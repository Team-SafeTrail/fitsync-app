import { expect, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

test("public surfaces stay responsive and preserve their access paths", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const visibleTargets = page.locator("a:visible:not(.sr-only), button:visible:not(.sr-only)");
    for (let index = 0; index < await visibleTargets.count(); index += 1) {
      const target = visibleTargets.nth(index);
      const box = await target.boundingBox();
      if (box) {
        const label = (await target.getAttribute("aria-label")) ?? (await target.innerText());
        expect(box.height, `${viewport.width}px target: ${label.trim()}`).toBeGreaterThanOrEqual(44);
      }
    }
  }

  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Mở menu" });
  await menuButton.click();
  await expect(page.locator("#mobile-navigation").getByRole("link", { name: "Cách hoạt động" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Tạo không gian FitSync." })).toBeVisible();
  await expect(page.getByLabel("Tên hiển thị")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Tiếp tục cùng học viên." })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();

  await page.goto("/invite/not-valid");
  await expect(page.getByRole("heading", { name: "Yêu cầu PT gửi liên kết mới." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Đến trang đăng nhập" })).toHaveAttribute("href", "/login");

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Quyền riêng tư", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Trở về trang chủ" })).toHaveAttribute("href", "/");

  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Điều khoản bản mẫu", exact: true })).toBeVisible();

  const response = await page.goto("/route-khong-ton-tai");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Đường dẫn này chưa có trong hành trình." })).toBeVisible();
});

test("public surfaces follow the system theme", async ({ browser }) => {
  const light = await browser.newContext({ colorScheme: "light" });
  const dark = await browser.newContext({ colorScheme: "dark" });
  const lightPage = await light.newPage();
  const darkPage = await dark.newPage();

  await Promise.all([lightPage.goto("/"), darkPage.goto("/")]);
  const lightBackground = await lightPage.locator(".fs-landing").evaluate((element) => getComputedStyle(element).backgroundColor);
  const darkBackground = await darkPage.locator(".fs-landing").evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(lightBackground).not.toBe(darkBackground);

  await Promise.all([light.close(), dark.close()]);
});
