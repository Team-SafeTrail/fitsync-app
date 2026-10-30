import { expect, test } from "@playwright/test";

for (const width of [1440, 390, 320]) {
  test(`approved coaching language and sample review work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Cùng tập/ })).toBeVisible();
    await page.getByRole("button", { name: "Học viên", exact: true }).click();
    await expect(page.locator("[data-pt-only]")).not.toBeVisible();
    await expect(page.locator("[data-trainee-only]")).toBeVisible();
    await page.getByRole("button", { name: "Huấn luyện viên", exact: true }).click();
    await expect(page.locator("[data-pt-only]")).toBeVisible();
    await page.getByRole("button", { name: "Thử mở bản nháp" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();
    const confirm = sheet.getByRole("button", { name: "Xác nhận bản mẫu" });
    await expect(confirm).toBeDisabled();
    await sheet.getByRole("checkbox").check();
    await confirm.click();
    await expect(sheet.getByRole("status")).toContainText("Không lưu");
    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Thử mở bản nháp" })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto("/app/dashboard");
    await page.getByRole("textbox", { name: "Tìm học viên" }).fill("khánh linh");
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText("Khánh Linh");
    await page.getByRole("button", { name: "Đọc phiếu mẫu", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Đọc phiếu mẫu", exact: true })).toBeFocused();
    await page.goto("/app/trainee");
    await expect(page.getByRole("heading", { name: "Hôm nay của Linh" })).toBeVisible();
    await page.getByRole("button", { name: /Ghi bữa trưa/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("public auth, invitation and legal surfaces retain shared navigation", async ({ page }) => {
  for (const route of ["/login", "/register", "/invite/invalid", "/privacy", "/terms"]) {
    await page.goto(route);
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.getByRole("link", {name:/FitSync|Trang giới thiệu|trang chủ/i}).first()).toHaveAttribute("href", "/");
  }
  await page.goto("/workspace");
  await expect(page).toHaveURL(/\/login/);
});
