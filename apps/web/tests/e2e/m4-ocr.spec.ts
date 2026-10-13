import { expect, test } from "@playwright/test";

test.describe('M4 OCR Workflow (End-to-End)', () => {
  test("PT registers, creates trainee, and uses OCR for InBody", async ({ browser }) => {
    test.slow();
    const runId = Date.now();
    const password = "FitSync-M4-Strong-2026";
    const ptEmail = `m4-pt-${runId}@example.test`;
    const traineeEmail = `m4-trainee-${runId}@example.test`;

    // 1. Setup PT
    const ptContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const ptPage = await ptContext.newPage();
    
    await ptPage.goto("/register");
    await ptPage.getByLabel("Tên hiển thị").fill("PT OCR Test");
    await ptPage.getByLabel("Email").fill(ptEmail);
    await ptPage.getByLabel("Mật khẩu").fill(password);
    await ptPage.getByRole("button", { name: "Tạo workspace PT" }).click();
    await expect(ptPage).toHaveURL(/\/workspace$/);

    // 2. Create Trainee
    await ptPage.getByLabel("Tên hiển thị").fill("Học viên OCR");
    await ptPage.getByLabel("Email nhận lời mời").fill(traineeEmail);
    await ptPage.getByLabel("Số điện thoại").fill("0901234567");
    await ptPage.getByLabel("Mục tiêu chính").selectOption("recomp");
    await ptPage.getByLabel("Tổng số buổi").fill("12");
    await ptPage.getByLabel("Số buổi còn lại").fill("10");
    await ptPage.getByRole("button", { name: "Tạo học viên" }).click();

    const traineeRow = ptPage.getByRole("link", { name: /Học viên OCR/ });
    await expect(traineeRow).toBeVisible();
    const traineePath = await traineeRow.getAttribute("href");
    expect(traineePath).toBeTruthy();

    // 3. Trainee Accepts Invitation
    const invitationUrl = await ptPage.getByTestId("invitation-link").inputValue();
    const traineeContext = await browser.newContext({ viewport: { width: 430, height: 932 } });
    const traineePage = await traineeContext.newPage();
    await traineePage.goto(invitationUrl);
    await traineePage.getByLabel("Tạo mật khẩu").fill(password);
    await traineePage.getByRole("button", { name: "Chấp nhận lời mời" }).click();
    await expect(traineePage).toHaveURL(/\/workspace$/);

    // 4. PT navigates to Trainee Profile
    await ptPage.goto(traineePath!);
    await expect(ptPage.getByRole("heading", { name: "Xác nhận năm chỉ số InBody" })).toBeVisible();

    // Inject mockScenario
    await ptPage.evaluate(() => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'mockScenario';
      input.value = 'clean_success';
      document.body.appendChild(input);
    });

    // Create a dummy valid PNG buffer so sharp doesn't crash
    const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const validPng = Buffer.from(validPngBase64, 'base64');

    // Create a dummy file input using DataTransfer
    await ptPage.locator('input[type="file"]').setInputFiles({
      name: 'sample-inbody.png',
      mimeType: 'image/png',
      buffer: validPng,
    });

    // We passed a clean scenario, so we wait for success
    await expect(ptPage.locator('text=Tải ảnh thành công')).toBeVisible({ timeout: 10000 });
    await expect(ptPage.getByText('(Bản nháp OCR)', { exact: true })).toBeVisible();

    // 5. Correction (verify draft data populated and edit it)
    const weightInput = ptPage.locator('input[name="weightKg"]');
    await expect(weightInput).toHaveValue('70'); // deterministic clean scenario default
    await weightInput.fill('71.5');

    // Confirmation
    await ptPage.locator('input[name="confirmed"]').check();
    await ptPage.locator('button:has-text("Xác nhận và lưu")').click();
    await expect(ptPage.locator('text=Bản ghi InBody đã được xác minh và lưu')).toBeVisible();
    
    // 6. Test manual fallback failure
    await ptPage.goto(traineePath!);
    const badJpeg = Buffer.from([0x00, 0x00, 0x00, 0x00]); // invalid signature
    await ptPage.locator('input[type="file"]').setInputFiles({
      name: 'bad-inbody.jpg',
      mimeType: 'image/jpeg',
      buffer: badJpeg,
    });
    
    await expect(
      ptPage.getByText('Nội dung tệp không khớp với phần mở rộng hoặc định dạng ảnh đã khai báo.'),
    ).toBeVisible();

    // Manual fallback
    await ptPage.locator('input[name="weightKg"]').fill('80');
    await ptPage.locator('input[name="skeletalMuscleMassKg"]').fill('35');
    await ptPage.locator('input[name="bodyFatMassKg"]').fill('15');
    await ptPage.locator('input[name="percentBodyFat"]').fill('18.5');
    await ptPage.locator('input[name="confirmed"]').check();
    await ptPage.locator('button:has-text("Xác nhận và lưu")').click();
    await expect(ptPage.locator('text=Bản ghi đã được lưu thành công.')).toBeVisible();
  });
});
