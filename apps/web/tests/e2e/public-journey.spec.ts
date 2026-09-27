import { expect, test } from "@playwright/test";

test("landing separates the public sample from real PT activation on desktop and mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Bớt việc quản lý/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Khám phá bản mẫu" }).first()).toHaveAttribute("href", "/app/dashboard");
  await expect(page.getByRole("link", { name: "Tạo workspace PT" }).first()).toHaveAttribute("href", "/register");

  await page.getByRole("link", { name: "Khám phá bản mẫu" }).first().click();
  await expect(page).toHaveURL(/\/app\/dashboard$/);
  await expect(page.getByText("Bản mẫu công khai").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Tạo workspace PT thật/ })).toHaveAttribute("href", "/register");
  await expect(page.locator("aside")).toHaveCSS("background-color", "rgb(17, 17, 21)");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Smart PT Hub" })).toBeVisible();
  await expect(page.getByText("Bản mẫu công khai").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.getByRole("link", { name: /Tạo workspace PT thật/ }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Tạo không gian FitSync." })).toBeVisible();
});
