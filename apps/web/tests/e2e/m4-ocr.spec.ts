import { test, expect } from '@playwright/test';

test.describe('M4 OCR Workflow', () => {
  test.use({ storageState: 'tests/e2e/.auth/pt.json' });

  test.beforeEach(async ({ page }) => {
    // Navigate to a known trainee profile workspace
    await page.goto('/workspace/trainees/seed-trainee-id');
  });

  test('successfully uploads OCR, allows correction, and confirms', async ({ page }) => {
    // Upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click({ force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample-inbody.webp');
    
    await expect(page.locator('text=Đang tải lên và xử lý ảnh...')).toBeVisible();
    await expect(page.locator('text=Bản nháp OCR')).toBeVisible();

    // Correction (verify draft data populated and edit it)
    const weightInput = page.locator('input[name="weightKg"]');
    await expect(weightInput).toHaveValue('75.5');
    await weightInput.fill('75.0');

    // Confirmation
    await page.locator('button:has-text("Xác nhận & Lưu")').click();
    await expect(page.locator('text=Bản ghi đã được xác minh và lưu.')).toBeVisible();
  });

  test('handles manual fallback upon upload failure', async ({ page }) => {
    // Attempt upload with bad file
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click({ force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/bad-file.txt');
    
    await expect(page.locator('text=Chỉ hỗ trợ tệp JPEG, PNG, WebP.')).toBeVisible();

    // Manual fallback
    await page.locator('input[name="weightKg"]').fill('80');
    await page.locator('input[name="skeletalMuscleMassKg"]').fill('35');
    await page.locator('input[name="bodyFatMassKg"]').fill('15');
    await page.locator('input[name="percentBodyFat"]').fill('18.5');
    await page.locator('button:has-text("Xác nhận & Lưu")').click();
    await expect(page.locator('text=Bản ghi đã được xác minh và lưu.')).toBeVisible();
  });

  test('reloads maintain attempt isolation (no draft bleed)', async ({ page }) => {
    // If a draft is loaded but the user reloads, the state should reset to manual
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click({ force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample-inbody.webp');
    await expect(page.locator('text=Bản nháp OCR')).toBeVisible();
    
    await page.reload();
    await expect(page.locator('text=Bản nháp OCR')).not.toBeVisible();
    await expect(page.locator('input[name="weightKg"]')).toHaveValue('');
  });
});

test.describe('M4 OCR Workflow - Mobile', () => {
  test.use({ storageState: 'tests/e2e/.auth/pt.json', viewport: { width: 375, height: 667 } });

  test('renders responsive UI correctly', async ({ page }) => {
    await page.goto('/workspace/trainees/seed-trainee-id');
    // Verify layout constraints on mobile
    await expect(page.locator('form.workspace-form-grid')).toBeVisible();
    const box = await page.locator('form.workspace-form-grid').boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
