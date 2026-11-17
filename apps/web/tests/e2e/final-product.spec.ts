import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { mkdir } from "node:fs/promises";
import type { Database } from "../../src/types/database";
import { createHash, randomUUID } from "node:crypto";

test.use({ video: "on" });

test.beforeAll(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (process.env.FITSYNC_E2E_LOCAL_DB !== "true" || !url || !["127.0.0.1", "localhost"].includes(new URL(url).hostname)) throw new Error("Final acceptance requires the isolated loopback database.");
});

test("concurrent Free creation allows three profiles; current Pro can add more", async ({ page }) => {
  test.slow();
  const email = `quota-${Date.now()}@example.test`, password = "Synthetic-Quota-2026-Only!";
  const setup = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const user = await setup.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: "Quota synthetic", synthetic: true } }); expect(user.error).toBeNull();
  const api = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  expect((await api.auth.signInWithPassword({ email, password })).error).toBeNull();
  const create = (n: number) => api.rpc("create_trainee_with_invitation", { trainee_display_name: `Quota learner ${n}`, trainee_goal: "recomp", trainee_phone: "", package_total: 12, package_remaining: 12, invite_email: `quota-${n}-${Date.now()}@example.test`, invite_token_hash: createHash("sha256").update(randomUUID()).digest("hex"), invite_expires_at: new Date(Date.now() + 7 * 86400000).toISOString() });
  const race = await Promise.all([1, 2, 3, 4].map(create)); expect(race.filter(r => !r.error)).toHaveLength(3); expect(race.filter(r => r.error?.code === "P0001")).toHaveLength(1);
  expect((await api.from("trainee_profiles").select("id")).data).toHaveLength(3);
  await page.goto("/login"); await page.getByLabel("Email", { exact: true }).fill(email); await page.getByLabel("Mật khẩu", { exact: true }).fill(password); await page.getByRole("button", { name: "Vào workspace", exact: true }).click();
  await page.getByRole("button", { name: "Thêm học viên", exact: true }).first().click(); await page.getByLabel("Tên hiển thị").fill("Fourth denied"); await page.getByLabel("Email nhận lời mời").fill(`quota-denied-${Date.now()}@example.test`); await page.getByRole("button", { name: "Tạo học viên & link mời", exact: true }).click(); await expect(page.getByRole("alert")).toContainText("Gói Free tối đa 3");
  // Test-only entitlement, never recorded as customer revenue.
  expect((await setup.from("pt_profiles").update({ subscription_plan: "pro", subscription_valid_until: new Date(Date.now() + 30 * 86400000).toISOString() }).eq("id", user.data.user!.id)).error).toBeNull();
  expect((await create(5)).error).toBeNull(); expect((await api.from("trainee_profiles").select("id")).data).toHaveLength(4);
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

test("real admin ledger stores private TEST evidence, reverses once and never counts test revenue", async ({ page, browser }) => {
  test.slow();
  const run = Date.now(), password = "Synthetic-Finance-2026-Only!";
  const setup = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
  const adminEmail = `finance-admin-${run}@example.test`, ptEmail = `finance-pt-${run}@example.test`;
  const admin = await setup.auth.admin.createUser({ email: adminEmail, password, email_confirm: true, user_metadata: { display_name: "Finance admin synthetic", synthetic: true } }); expect(admin.error).toBeNull();
  expect((await setup.from("profiles").update({ role: "admin" }).eq("id", admin.data.user!.id)).error).toBeNull();
  const pt = await setup.auth.admin.createUser({ email: ptEmail, password, email_confirm: true, user_metadata: { display_name: "Finance PT synthetic", synthetic: true } }); expect(pt.error).toBeNull();
  const ptContext = await browser.newContext();
  try {
    const b = await ptContext.newPage(); await b.goto("/login"); await b.getByLabel("Email", { exact: true }).fill(ptEmail); await b.getByLabel("Mật khẩu", { exact: true }).fill(password); await b.getByRole("button", { name: "Vào workspace", exact: true }).click();
    await b.goto("/workspace/billing"); await b.getByRole("form", { name: "Yêu cầu nâng cấp" }).getByRole("checkbox").check(); await b.getByRole("button", { name: "Gửi yêu cầu nâng cấp", exact: true }).click();
    await expect(b.getByText("requested", { exact: false })).toBeVisible();
    await page.goto("/login"); await page.getByLabel("Email", { exact: true }).fill(adminEmail); await page.getByLabel("Mật khẩu", { exact: true }).fill(password); await page.getByRole("button", { name: "Vào workspace", exact: true }).click();
    await page.goto("/admin"); await expect(page.getByTestId("live-admin-dashboard")).toBeVisible();
    await expect(page.locator("body")).not.toContainText("FS-VQR-20261021");
    await page.getByText("Ghi giao dịch đã đối soát", { exact: true }).click();
    const form = page.getByRole("form", { name: "Ghi sổ tài chính" });
    const reference = `SYNTHETIC-ONLY-${run}`;
    await form.getByLabel("Khách PT", { exact: true }).selectOption(pt.data.user!.id);
    await form.getByLabel("Thời gian giao dịch (kèm múi giờ)").fill(new Date().toISOString());
    await form.getByLabel("Mã tham chiếu trên sao kê").fill(reference); await form.getByLabel("Diễn giải", { exact: true }).fill("SYNTHETIC ONLY: disposable test, not a customer receipt");
    // Generic 1px PNG, explicitly marked TEST. It is not a fabricated bank receipt.
    await form.getByLabel(/Chứng từ riêng tư/).setInputFiles({ name: "SYNTHETIC-ONLY.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64") });
    await form.getByLabel(/Giao dịch thử/).check(); await form.getByLabel(/Tôi đã đối chiếu/).check(); await form.getByRole("button", { name: "Ghi giao dịch và chứng từ", exact: true }).click();
    const ledger = page.getByRole("region", { name: "Sổ thu chi", exact: true }); await expect(ledger).toContainText(reference); await expect(ledger).toContainText("Dữ liệu thử");
    await expect(page.getByRole("region", { name: "Số liệu đã ghi nhận" }).locator(".admin-kpi-card").filter({ hasText: "PT đã trả phí được đối soát" }).locator("strong")).toHaveText("0");
    const snapshot = await setup.rpc("get_admin_overview"); expect(snapshot.error).not.toBeNull(); // service_role without an authenticated admin identity is insufficient.
    const entry = await setup.from("finance_entries").select("id,evidence_path,is_test").eq("bank_reference", reference.toLowerCase()).single(); expect(entry.error).toBeNull(); expect(entry.data?.is_test).toBe(true);
    const publicFile = await page.request.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/finance-evidence/${entry.data!.evidence_path}`); expect(publicFile.ok()).toBe(false);
    await ledger.getByText("Thêm bút toán đảo", { exact: true }).click(); await ledger.getByLabel("Lý do điều chỉnh").fill("SYNTHETIC reversal acceptance test"); await ledger.getByRole("checkbox").check(); await ledger.getByRole("button", { name: "Xác nhận điều chỉnh", exact: true }).click();
    await expect(ledger).toContainText("SYNTHETIC reversal acceptance test");
    expect((await setup.from("finance_entries").select("id").eq("reverses_id", entry.data!.id)).data).toHaveLength(1);
    await mkdir("test-results/chat-proof", { recursive: true });
    for (const width of [1440, 390]) { await page.setViewportSize({ width, height: 1000 }); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); await page.screenshot({ path: `test-results/chat-proof/final-live-admin-${width}.png`, fullPage: true }); }
  } finally { await ptContext.close(); }
});
