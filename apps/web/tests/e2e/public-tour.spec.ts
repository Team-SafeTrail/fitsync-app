import { expect, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 844 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

test("public tour stays explicit, responsive, and touch friendly", async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);

    for (const route of ["/app/dashboard", "/app/trainee"]) {
      await page.goto(route);
      await expect(page.locator(".fs-tour-disclosure").getByText("Bản mẫu công khai")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

      const visibleTargets = page.locator("a:visible:not(.sr-only), button:visible:not(.sr-only)");
      for (let index = 0; index < await visibleTargets.count(); index += 1) {
        const target = visibleTargets.nth(index);
        const box = await target.boundingBox();
        if (box) {
          const label = (await target.getAttribute("aria-label")) ?? (await target.innerText());
          expect(box.height, `${viewport.width}px ${route} target: ${label.trim()}`).toBeGreaterThanOrEqual(44);
        }
      }
    }
  }
});

test("PT and trainee sample interactions remain usable from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/app/dashboard");

  await page.getByLabel("Tìm học viên").fill("Khánh Linh");
  await expect(page.getByRole("cell", { name: "Khánh Linh" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Minh Khoa" })).toHaveCount(0);

  await page.getByRole("button", { name: "Xem luồng InBody" }).click();
  const inbodyDialog = page.getByRole("dialog", { name: "Rà soát bản ghi InBody" });
  await expect(inbodyDialog).toBeVisible();
  await expect(inbodyDialog.getByRole("button", { name: "Đóng hộp thoại" })).toBeFocused();
  await inbodyDialog.getByRole("button", { name: /InBody 370/ }).click();
  await expect(inbodyDialog.getByText("Đang nạp kết quả mô phỏng…")).toBeVisible();
  await expect(inbodyDialog.getByText("Dữ liệu minh họa đã sẵn sàng để kiểm tra")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(inbodyDialog).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("link", { name: "Góc nhìn học viên" }).click();
  await expect(page.getByRole("heading", { name: "Xin chào, Linh." })).toBeVisible();
  const phoMeals = page.getByText("Phở bò tái nạm", { exact: true });
  const initialPhoCount = await phoMeals.count();
  await page.getByRole("button", { name: "Ghi bữa trưa" }).click();
  const mealDialog = page.getByRole("dialog", { name: "Check-in bữa ăn" });
  await expect(mealDialog.getByRole("button", { name: "Đóng hộp thoại" })).toBeFocused();
  await mealDialog.getByRole("button", { name: /Phở bò tái nạm/ }).click();
  await mealDialog.getByRole("button", { name: "Lưu vào bản mẫu" }).click();
  await expect(mealDialog).toHaveCount(0);
  await expect(phoMeals).toHaveCount(initialPhoCount + 1);
});

test("public tour follows system appearance and reduced motion", async ({ browser }) => {
  const light = await browser.newContext({ colorScheme: "light" });
  const dark = await browser.newContext({ colorScheme: "dark" });
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const lightPage = await light.newPage();
  const darkPage = await dark.newPage();
  const reducedPage = await reduced.newPage();

  await Promise.all([lightPage.goto("/app/dashboard"), darkPage.goto("/app/dashboard"), reducedPage.goto("/app/trainee")]);
  const lightBackground = await lightPage.locator(".fs-tour-shell").evaluate((element) => getComputedStyle(element).backgroundColor);
  const darkBackground = await darkPage.locator(".fs-tour-shell").evaluate((element) => getComputedStyle(element).backgroundColor);
  const reducedDuration = await reducedPage.getByRole("button", { name: "Ghi thêm bữa ăn" }).evaluate((element) => getComputedStyle(element).transitionDuration);

  expect(lightBackground).not.toBe(darkBackground);
  expect(reducedDuration).toBe("0s");

  await Promise.all([light.close(), dark.close(), reduced.close()]);
});
