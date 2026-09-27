import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";
import type { Database } from "../../src/types/database";

const MILLISECONDS_PER_DAY = 86_400_000;

function addDays(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function applicationDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function apiClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Local Supabase browser configuration is required for E2E.");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

test("trainee check-in reaches the PT with private media, session updates, and manual warnings", async ({ browser }) => {
  test.slow();
  const runId = Date.now();
  const password = "FitSync-M3-Strong-2026";
  const ptEmail = `m3-pt-${runId}@example.test`;
  const traineeEmail = `m3-trainee-${runId}@example.test`;
  const outsiderEmail = `m3-outsider-${runId}@example.test`;
  const runtimeErrors: string[] = [];
  const networkRequests: string[] = [];

  const ptContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const ptPage = await ptContext.newPage();
  ptPage.on("pageerror", (error) => runtimeErrors.push(error.message));
  ptPage.on("request", (request) => networkRequests.push(request.url()));

  await ptPage.goto("/register");
  await ptPage.getByLabel("Tên hiển thị").fill("PT M3 Minh");
  await ptPage.getByLabel("Email").fill(ptEmail);
  await ptPage.getByLabel("Mật khẩu").fill(password);
  await ptPage.getByRole("button", { name: "Tạo workspace PT" }).click();
  await expect(ptPage).toHaveURL(/\/workspace$/);

  await ptPage.getByLabel("Tên hiển thị").fill("Học viên M3 Lan");
  await ptPage.getByLabel("Email nhận lời mời").fill(traineeEmail);
  await ptPage.getByLabel("Số điện thoại").fill("0901234567");
  await ptPage.getByLabel("Tổng số buổi").fill("12");
  await ptPage.getByLabel("Số buổi còn lại").fill("10");
  await ptPage.getByRole("button", { name: "Tạo học viên" }).click();

  const invitationUrl = await ptPage.getByTestId("invitation-link").inputValue();
  const traineeRow = ptPage.getByRole("link", { name: /Học viên M3 Lan/ });
  const traineePath = await traineeRow.getAttribute("href");
  expect(traineePath).toMatch(/^\/workspace\/trainees\/[0-9a-f-]+$/);
  const traineeId = traineePath!.split("/").at(-1)!;

  const traineeContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const traineePage = await traineeContext.newPage();
  traineePage.on("pageerror", (error) => runtimeErrors.push(error.message));
  traineePage.on("request", (request) => networkRequests.push(request.url()));
  await traineePage.goto(invitationUrl);
  await traineePage.getByLabel("Tạo mật khẩu").fill(password);
  await traineePage.getByRole("button", { name: "Chấp nhận lời mời" }).click();
  await expect(traineePage).toHaveURL(/\/workspace$/);
  await expect(traineePage.getByRole("heading", { name: "Check-in trong một phút" })).toBeVisible();

  const onePixelPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  );
  await traineePage.getByLabel("Ghi chú").fill("Năng lượng tốt, đã hoàn thành buổi chân.");
  await traineePage.getByLabel(/Thêm ảnh bữa ăn/).setInputFiles({
    name: "bua-trua.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  });
  await traineePage.getByRole("button", { name: "Gửi check-in hôm nay" }).click();
  await expect(traineePage.getByTestId("checkin-complete-today")).toBeVisible();
  await expect(traineePage.getByTestId("checkin-activity")).toContainText("Năng lượng tốt");
  await expect(traineePage.getByTestId("private-meal-photo")).toBeVisible();
  expect(await traineePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await traineePage.reload();
  await expect(traineePage.getByTestId("checkin-complete-today")).toBeVisible();
  await expect(traineePage.getByTestId("checkin-activity")).toContainText("Năng lượng tốt");
  const traineeMealImage = traineePage.getByTestId("private-meal-photo").locator("img");
  await expect.poll(() => traineeMealImage.evaluate((image) => {
    const mealImage = image as HTMLImageElement;
    return mealImage.complete && mealImage.naturalWidth > 0;
  })).toBe(true);

  await ptPage.goto(traineePath!);
  await expect(ptPage.getByRole("heading", { name: "Check-in của học viên" })).toBeVisible();
  await expect(ptPage.getByTestId("checkin-activity")).toContainText("Năng lượng tốt");
  await expect(ptPage.getByTestId("private-meal-photo")).toBeVisible();
  await ptPage.getByRole("spinbutton", { name: /Số buổi còn lại/ }).fill("8");
  await ptPage.getByRole("button", { name: "Cập nhật số buổi" }).click();
  await expect(ptPage.getByRole("status")).toContainText("Đã cập nhật số buổi còn lại");
  await ptPage.reload();
  await expect(ptPage.getByRole("spinbutton", { name: /Số buổi còn lại/ })).toHaveValue("8");

  await traineePage.reload();
  await expect(traineePage.locator(".workspace-session-stat")).toContainText("8");

  const ptApi = apiClient();
  const { error: ptLoginError } = await ptApi.auth.signInWithPassword({ email: ptEmail, password });
  expect(ptLoginError).toBeNull();
  const { data: mealRows, error: mealReadError } = await ptApi
    .from("meal_logs")
    .select("private_photo_path, checkin_id")
    .eq("trainee_id", traineeId);
  expect(mealReadError).toBeNull();
  expect(mealRows).toHaveLength(1);
  const privatePhotoPath = mealRows![0].private_photo_path;
  const checkinId = mealRows![0].checkin_id;

  const today = applicationDate();
  expect(Date.parse(`${today}T00:00:00Z`) / MILLISECONDS_PER_DAY).toBeGreaterThan(0);
  const { error: notDueUpdateError } = await ptApi
    .from("trainee_profiles")
    .update({ last_checkin_date: addDays(today, -3) })
    .eq("id", traineeId);
  expect(notDueUpdateError).toBeNull();
  await ptPage.goto("/workspace");
  await expect(ptPage.getByTestId("warning-queue")).toHaveCount(0);

  const { error: dueUpdateError } = await ptApi
    .from("trainee_profiles")
    .update({ last_checkin_date: addDays(today, -4) })
    .eq("id", traineeId);
  expect(dueUpdateError).toBeNull();
  await ptPage.reload();
  await expect(ptPage.getByTestId("warning-queue")).toContainText("Học viên M3 Lan");
  await ptPage.getByTestId("copy-followup").click();
  await expect(ptPage.getByTestId("copy-followup")).toContainText("Đã sao chép");
  await expect(ptPage.getByTestId("open-zalo")).toHaveAttribute("href", "https://zalo.me/0901234567");
  await expect(ptPage.getByText("Không có tin nhắn nào được tự động gửi.")).toBeVisible();

  await ptPage.setViewportSize({ width: 390, height: 844 });
  await ptPage.goto(traineePath!);
  await expect(ptPage.getByTestId("trainee-warning")).toBeVisible();
  await expect(ptPage.getByTestId("checkin-activity")).toBeVisible();
  expect(await ptPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const outsiderContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const outsiderPage = await outsiderContext.newPage();
  outsiderPage.on("pageerror", (error) => runtimeErrors.push(error.message));
  outsiderPage.on("request", (request) => networkRequests.push(request.url()));
  await outsiderPage.goto("/register");
  await outsiderPage.getByLabel("Tên hiển thị").fill("PT M3 Không Liên Quan");
  await outsiderPage.getByLabel("Email").fill(outsiderEmail);
  await outsiderPage.getByLabel("Mật khẩu").fill(password);
  await outsiderPage.getByRole("button", { name: "Tạo workspace PT" }).click();
  await expect(outsiderPage).toHaveURL(/\/workspace$/);
  const deniedResponse = await outsiderPage.goto(traineePath!);
  expect(deniedResponse?.status()).toBe(404);

  const outsiderApi = apiClient();
  const { error: outsiderLoginError } = await outsiderApi.auth.signInWithPassword({ email: outsiderEmail, password });
  expect(outsiderLoginError).toBeNull();
  const { data: deniedCheckins, error: deniedReadError } = await outsiderApi
    .from("checkins")
    .select("id")
    .eq("id", checkinId);
  expect(deniedReadError).toBeNull();
  expect(deniedCheckins).toEqual([]);
  const { data: deniedMutation, error: deniedMutationError } = await outsiderApi
    .from("trainee_profiles")
    .update({ remaining_sessions: 0 })
    .eq("id", traineeId)
    .select("id");
  expect(deniedMutationError).toBeNull();
  expect(deniedMutation).toEqual([]);
  const { data: deniedSignedMedia, error: deniedSignedMediaError } = await outsiderApi.storage
    .from("meal-media")
    .createSignedUrl(privatePhotoPath, 60);
  expect(deniedSignedMediaError).not.toBeNull();
  expect(deniedSignedMedia?.signedUrl).toBeFalsy();
  const { data: deniedDownload, error: deniedDownloadError } = await outsiderApi.storage
    .from("meal-media")
    .download(privatePhotoPath);
  expect(deniedDownloadError).not.toBeNull();
  expect(deniedDownload).toBeNull();

  await ptPage.setViewportSize({ width: 1440, height: 1000 });
  await ptPage.goto(traineePath!);
  await expect(ptPage.getByRole("spinbutton", { name: /Số buổi còn lại/ })).toHaveValue("8");
  await expect(ptPage.getByTestId("private-meal-photo")).toBeVisible();

  expect(networkRequests.some((url) => /zalo\.me|\/messages?(?:\/|\?|$)|send-message/i.test(url))).toBe(false);
  expect(runtimeErrors).toEqual([]);

  await Promise.all([
    ptApi.auth.signOut(),
    outsiderApi.auth.signOut(),
    ptContext.close(),
    traineeContext.close(),
    outsiderContext.close(),
  ]);
});
