import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { mkdir } from "node:fs/promises";
import type { Database } from "../../src/types/database";

test.beforeAll(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.FITSYNC_E2E_LOCAL_DB !== "true" || !url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname)) throw new Error("Final acceptance requires the isolated loopback database.");
});

test("PT edits, reissues and archives a learner without losing the profile", async ({ page, browser }) => {
  test.slow();
  const run = Date.now(), password = "Synthetic-Final-2026-Only!";
  await page.goto("/register");
  await page.getByLabel("Tên hiển thị").fill("PT final acceptance");
  await page.getByLabel("Email", { exact: true }).fill(`final-pt-${run}@example.test`);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Tạo workspace PT", exact: true }).click();
  await expect(page).toHaveURL(/\/workspace$/);
  await page.getByLabel("Tên hiển thị").fill("Learner lifecycle");
  await page.getByLabel("Email nhận lời mời").fill(`final-learner-${run}@example.test`);
  await page.getByRole("button", { name: "Tạo học viên & link mời", exact: true }).click();
  const original = await page.getByTestId("invitation-link").inputValue();
  await page.getByRole("link", { name: /Learner lifecycle/ }).click();
  const dossier = page.url();
  await page.getByText("Quản lý hồ sơ và lời mời", { exact: true }).click();
  let edit = page.getByRole("form", { name: "Sửa hồ sơ học viên" });
  await edit.getByLabel("Tên hiển thị").fill("Learner updated");
  await edit.getByRole("button", { name: "Lưu hồ sơ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Learner updated", exact: true })).toBeVisible();
  await page.getByText("Quản lý hồ sơ và lời mời", { exact: true }).click();
  await page.getByRole("button", { name: "Thu hồi lời mời", exact: true }).click();
  await expect(page.getByText("Đã thu hồi lời mời thành công.", { exact: true })).toBeVisible();
  const learner = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const b = await learner.newPage(); await b.goto(original);
    await expect(b.getByRole("button", { name: "Chấp nhận lời mời", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: "Cấp lại link mời", exact: true }).click();
    const renewed = await page.getByLabel("Link mời cấp lại").inputValue(); expect(renewed).not.toBe(original);
    await b.goto(renewed); await b.getByLabel("Tạo mật khẩu").fill(password);
    await b.getByRole("button", { name: "Chấp nhận lời mời", exact: true }).click(); await expect(b).toHaveURL(/\/workspace$/);
    await page.reload(); await page.getByText("Quản lý hồ sơ và lời mời", { exact: true }).click();
    let archive = page.getByRole("form", { name: "Trạng thái hồ sơ" }); await archive.getByRole("checkbox").check();
    await archive.getByRole("button", { name: "Lưu trữ hồ sơ", exact: true }).click();
    await expect(page.getByText("Hồ sơ đã lưu trữ. Khôi phục trước khi tiếp tục coaching.")).toBeVisible();
    await b.reload(); await expect(b.getByRole("heading", { name: "Hồ sơ đã được lưu trữ" })).toBeVisible();
    await page.goto("/workspace?filter=archived"); await page.getByRole("link", { name: /Learner updated/ }).click(); expect(page.url()).toBe(dossier);
    await page.getByText("Quản lý hồ sơ và lời mời", { exact: true }).click();
    archive = page.getByRole("form", { name: "Trạng thái hồ sơ" }); await archive.getByRole("checkbox").check();
    await archive.getByRole("button", { name: "Khôi phục hồ sơ", exact: true }).click();
    await expect(page.getByRole("button", { name: "Check-in hôm nay", exact: true })).toHaveCount(0);
    await b.reload(); await expect(b.getByRole("heading", { name: "Hồ sơ đã được lưu trữ" })).toHaveCount(0);
    await mkdir("test-results/chat-proof", { recursive: true }); await page.screenshot({ path: "test-results/chat-proof/final-roster-lifecycle.png", fullPage: true });
  } finally { await learner.close(); }
});

test("password recovery email completes PKCE and the new password works", async ({ page }) => {
  test.slow();
  const email = `recovery-${Date.now()}@example.test`, oldPassword = "Synthetic-Before-2026!", newPassword = "Synthetic-After-2026!";
  const setup = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const created = await setup.auth.admin.createUser({ email, password: oldPassword, email_confirm: true, user_metadata: { display_name: "Recovery synthetic", synthetic: true } }); expect(created.error).toBeNull();
  await page.goto("/forgot-password"); await page.getByLabel("Email đã đăng ký", { exact: true }).fill(email);
  await page.getByRole("button", { name: /Gửi.*liên kết/ }).click(); await expect(page).toHaveURL(/\/login/);
  let recoveryLink: string | undefined;
  await expect.poll(async () => {
    const result = await page.request.get(`http://127.0.0.1:54324/view/latest.html?query=${encodeURIComponent(`to:${email}`)}`);
    if (!result.ok()) return false;
    const html = await result.text(); recoveryLink = /href="([^"]*\/auth\/v1\/verify[^"]*)"/.exec(html)?.[1]?.replace(/&amp;/g, "&");
    return Boolean(recoveryLink);
  }, { timeout: 15000, message: "Local recovery email must contain the actual verification link" }).toBe(true);
  expect(new URL(recoveryLink!).origin).toBe(process.env.NEXT_PUBLIC_SUPABASE_URL);
  await page.goto(recoveryLink!); await expect(page).toHaveURL(/\/update-password$/);
  await page.getByLabel("Mật khẩu mới", { exact: true }).fill(newPassword); await page.getByLabel("Xác nhận mật khẩu mới", { exact: true }).fill(newPassword);
  await page.getByRole("button", { name: "Lưu mật khẩu mới", exact: true }).click(); await expect(page).toHaveURL(/\/workspace/);
  const api = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  expect((await api.auth.signInWithPassword({ email, password: oldPassword })).error).not.toBeNull();
  expect((await api.auth.signInWithPassword({ email, password: newPassword })).error).toBeNull();
});
