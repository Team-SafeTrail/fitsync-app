import { expect, test } from "@playwright/test";

test("PT invites a trainee, verifies InBody data, and isolation holds on desktop and mobile", async ({ browser }) => {
  test.slow();
  const runId = Date.now();
  const password = "FitSync-M2-Strong-2026";
  const ptEmail = `m2-pt-${runId}@example.test`;
  const traineeEmail = `m2-trainee-${runId}@example.test`;
  const outsiderEmail = `m2-outsider-${runId}@example.test`;

  const ptContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const ptPage = await ptContext.newPage();
  const runtimeErrors: string[] = [];
  ptPage.on("pageerror", (error) => runtimeErrors.push(error.message));

  const landingResponse = await ptPage.goto("/");
  expect(landingResponse?.ok()).toBe(true);
  await expect(ptPage.locator("#main-content")).toBeVisible();
  await expect(ptPage.getByRole("link", { name: "Khám phá bản mẫu" }).first()).toHaveAttribute("href", "/app/dashboard");
  const demoResponse = await ptPage.goto("/app/dashboard");
  expect(demoResponse?.ok()).toBe(true);
  await expect(ptPage.getByRole("heading", { name: "Smart PT Hub" })).toBeVisible();
  await expect(ptPage.getByText("Bản mẫu công khai").first()).toBeVisible();
  await expect(ptPage.locator("aside")).toHaveCSS("background-color", "rgb(17, 17, 21)");

  await ptPage.goto("/register");
  await ptPage.getByLabel("Tên hiển thị").fill("PT E2E Minh");
  await ptPage.getByLabel("Email").fill(ptEmail);
  await ptPage.getByLabel("Mật khẩu").fill(password);
  await ptPage.getByRole("button", { name: "Tạo workspace PT" }).click();
  await expect(ptPage).toHaveURL(/\/workspace$/);
  await expect(ptPage.getByText("Roster đang trống")).toBeVisible();

  await ptPage.getByLabel("Tên hiển thị").fill("Học viên E2E Lan");
  await ptPage.getByLabel("Email nhận lời mời").fill(traineeEmail);
  await ptPage.getByLabel("Số điện thoại").fill("0901234567");
  await ptPage.getByLabel("Mục tiêu chính").selectOption("recomp");
  await ptPage.getByLabel("Tổng số buổi").fill("12");
  await ptPage.getByLabel("Số buổi còn lại").fill("10");
  await ptPage.getByRole("button", { name: "Tạo học viên" }).click();

  const invitationUrl = await ptPage.getByTestId("invitation-link").inputValue();
  expect(invitationUrl).toMatch(/\/invite\/[A-Za-z0-9_-]{43}$/);
  await ptPage.getByRole("button", { name: "Sao chép link" }).click();
  await expect(ptPage.getByRole("button", { name: "Đã sao chép" })).toBeVisible();
  const traineeRow = ptPage.getByRole("link", { name: /Học viên E2E Lan/ });
  await expect(traineeRow).toContainText("Chờ chấp nhận");
  const traineePath = await traineeRow.getAttribute("href");
  expect(traineePath).toMatch(/^\/workspace\/trainees\/[0-9a-f-]+$/);

  const traineeContext = await browser.newContext({ viewport: { width: 430, height: 932 } });
  const traineePage = await traineeContext.newPage();
  traineePage.on("pageerror", (error) => runtimeErrors.push(error.message));
  await traineePage.goto(invitationUrl);
  await expect(traineePage.getByRole("heading", { name: "Chào Học viên E2E Lan." })).toBeVisible();
  await traineePage.getByLabel("Tạo mật khẩu").fill(password);
  await traineePage.getByRole("button", { name: "Chấp nhận lời mời" }).click();
  await expect(traineePage).toHaveURL(/\/workspace$/);
  await expect(traineePage.getByText("Tổng quan của bạn")).toBeVisible();
  await expect(traineePage.getByText("Chưa có bản ghi đã xác minh")).toBeVisible();

  await ptPage.reload();
  await expect(ptPage.getByRole("link", { name: /Học viên E2E Lan/ })).toContainText("Đã kết nối");
  await ptPage.setViewportSize({ width: 390, height: 844 });
  await ptPage.reload();
  await expect(ptPage.getByRole("link", { name: /Học viên E2E Lan/ })).toBeVisible();
  expect(await ptPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await ptPage.setViewportSize({ width: 1440, height: 1000 });
  await ptPage.goto(traineePath!);
  await expect(ptPage.getByText("Đã kết nối tài khoản")).toBeVisible();

  await ptPage.getByLabel("Cân nặng (kg)").fill("70");
  await ptPage.getByLabel("Khối cơ xương (kg)").fill("30");
  await ptPage.getByLabel("Khối mỡ (kg)").fill("8");
  await ptPage.getByLabel("Tỷ lệ mỡ (%)").fill("40");
  await ptPage.getByLabel("Tổng nước cơ thể (L)").fill("40");
  await ptPage.getByLabel("Năng lượng (kcal)").fill("2100");
  await ptPage.getByLabel("Protein (g)").fill("126");
  await ptPage.getByLabel("Carb (g)").fill("245");
  await ptPage.getByLabel("Chất béo (g)").fill("62");
  await ptPage.getByLabel(/Tôi đã đối chiếu các chỉ số/).check();
  await ptPage.getByRole("button", { name: "Xác nhận và lưu" }).click();
  await expect(ptPage.locator(".workspace-alert[role='alert']")).toContainText("chưa được lưu");
  await expect(ptPage.getByText(/chênh nhau quá 2 điểm phần trăm/).first()).toBeVisible();
  await expect(ptPage.getByTestId("verified-record")).toHaveCount(0);

  await ptPage.getByLabel("Khối mỡ (kg)").fill("14");
  await ptPage.getByLabel("Tỷ lệ mỡ (%)").fill("20");
  await ptPage.getByRole("button", { name: "Xác nhận và lưu" }).click();
  await expect(ptPage.getByRole("status")).toContainText("Bản ghi đã được xác minh và lưu");
  await expect(ptPage.getByTestId("verified-record")).toContainText("70 kg");

  await ptPage.reload();
  await expect(ptPage.getByTestId("verified-record")).toContainText("70 kg");
  const nutritionForm = ptPage.getByTestId("verified-record").locator("form");
  await nutritionForm.getByLabel("Kcal").fill("2200");
  await nutritionForm.getByRole("button", { name: "Lưu bản nháp" }).click();
  await expect(ptPage).toHaveURL(/nutrition=updated/);
  await expect(ptPage.getByRole("status")).toContainText("Đã cập nhật bản nháp dinh dưỡng");

  await traineePage.reload();
  await expect(traineePage.getByTestId("verified-record")).toContainText("70 kg");
  await expect(traineePage.getByTestId("verified-record")).toContainText("2200 kcal");
  await traineePage.setViewportSize({ width: 390, height: 844 });
  await traineePage.reload();
  await expect(traineePage.getByTestId("verified-record")).toBeVisible();
  const mobileHasNoOverflow = await traineePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(mobileHasNoOverflow).toBe(true);

  const outsiderContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const outsiderPage = await outsiderContext.newPage();
  outsiderPage.on("pageerror", (error) => runtimeErrors.push(error.message));
  await outsiderPage.goto("/register");
  await outsiderPage.getByLabel("Tên hiển thị").fill("PT Không Liên Quan");
  await outsiderPage.getByLabel("Email").fill(outsiderEmail);
  await outsiderPage.getByLabel("Mật khẩu").fill(password);
  await outsiderPage.getByRole("button", { name: "Tạo workspace PT" }).click();
  await expect(outsiderPage).toHaveURL(/\/workspace$/);
  const deniedResponse = await outsiderPage.goto(traineePath!);
  expect(deniedResponse?.status()).toBe(404);
  await expect(outsiderPage.getByRole("heading", { name: "Đường dẫn này chưa có trong hành trình." })).toBeVisible();

  expect(runtimeErrors).toEqual([]);
  await Promise.all([ptContext.close(), traineeContext.close(), outsiderContext.close()]);
});
