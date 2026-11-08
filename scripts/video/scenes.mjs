import { ensure, expect } from './common.mjs';

export const pause = (page, ms) => page.waitForTimeout(ms);
export async function move(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox(); ensure(box, 'Target control is not visible.');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 24 });
  await pause(page, 250);
}
export async function click(page, locator) {
  await move(page, locator); await page.mouse.down(); await pause(page, 90); await page.mouse.up(); await pause(page, 250);
}
export async function scrollTo(page, locator) {
  await locator.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  await pause(page, 1400);
}
export async function type(page, locator, text) {
  await click(page, locator); await locator.pressSequentially(text, { delay: 85 });
}
export async function openTrainee(page, cfg, warning = false) {
  const id = warning ? process.env.VIDEO_WARNING_TRAINEE_ID : process.env.VIDEO_TRAINEE_ID;
  ensure(id && /^[a-f0-9-]{36}$/i.test(id), 'Set the assigned synthetic trainee UUID; use a separate warning trainee.');
  await page.goto(`${cfg.base}/workspace`);
  await click(page, page.locator(`a.workspace-roster-row[href="/workspace/trainees/${id}"]`));
  await expect(page.locator('.trainee-detail-heading')).toBeVisible();
}
export async function runActions(id, page, cfg) {
  switch (id) {
    case '01-landing':
      await expect(page.locator('.fs-hero h1')).toBeVisible();
      await pause(page, 6500);
      await scrollTo(page, page.locator('#workflow'));
      await move(page, page.locator('#workflow-title'));
      await pause(page, 6500);
      return ['real landing hero', 'verified workflow section'];
    case '02-team':
      await scrollTo(page, page.locator('#team'));
      await expect(page.locator('#team h3')).toHaveCount(5);
      await pause(page, 6000);
      await scrollTo(page, page.locator('#contact-app'));
      await expect(page.getByRole('heading', { name: 'FitSync Android App' })).toBeVisible();
      await pause(page, 5000);
      return ['five public team authors', 'contact and experimental Android direction; no install performed'];
    case '03-workspace':
      await expect(page.locator('.workspace-roster')).toBeVisible();
      await pause(page, 4000);
      await scrollTo(page, page.locator('.workspace-roster'));
      await move(page, page.locator('.workspace-roster-row').first());
      await pause(page, 10000);
      return ['authenticated PT workspace', 'real assigned roster and session status'];
    case '04-trainee':
      await openTrainee(page, cfg);
      await expect(page.getByText('Đã kết nối tài khoản', { exact: false })).toBeVisible();
      await pause(page, 7500);
      await scrollTo(page, page.locator('#session-balance-title'));
      await pause(page, 7000);
      return ['seeded assigned trainee opened', 'linked invitation state', 'session balance'];
    case '05-checkin': {
      ensure(process.env.VIDEO_ALLOW_DEMO_WRITES === 'synthetic-only', 'Check-in recording needs VIDEO_ALLOW_DEMO_WRITES=synthetic-only.');
      ensure(process.env.VIDEO_MEAL_IMAGE, 'Supply an attested synthetic local JPEG/PNG/WebP meal image.');
      ensure(await page.locator('.workspace-complete-today').count() === 0, 'This trainee already checked in today; preserve the previous take or select another dedicated synthetic trainee.');
      await scrollTo(page, page.locator('#daily-checkin-title'));
      await type(page, page.locator('#checkin-note'), 'Năng lượng tốt, đã hoàn thành buổi tập.');
      await page.locator('#meal-photo').setInputFiles(process.env.VIDEO_MEAL_IMAGE);
      await pause(page, 1200);
      await click(page, page.getByRole('button', { name: 'Gửi check-in hôm nay' }));
      await expect(page.locator('.workspace-complete-today')).toBeVisible({ timeout: 60000 });
      await page.reload();
      await expect(page.locator('.workspace-complete-today')).toBeVisible();
      const history = page.locator('section[aria-labelledby="trainee-activity-title"]');
      await scrollTo(page, history);
      await expect(history.locator('img').first()).toBeVisible();
      await expect(history).toContainText('Năng lượng tốt');
      await pause(page, 2500);
      return ['real daily check-in saved', 'synthetic meal uploaded privately', 'note and image persisted across reload'];
    }
    case '06-inbody': {
      ensure(process.env.VIDEO_ALLOW_DEMO_WRITES === 'synthetic-only', 'InBody recording needs VIDEO_ALLOW_DEMO_WRITES=synthetic-only.');
      await openTrainee(page, cfg);
      const history = page.locator('section[aria-labelledby="record-history-title"]');
      await scrollTo(page, history); await pause(page, 1800);
      const before = await history.locator('.workspace-record').count();
      await scrollTo(page, page.locator('#inbody-form-title'));
      for (const [selector, value] of [['#weight-kg', '72'], ['#muscle-kg', '32'], ['#fat-mass-kg', '14.4'], ['#body-fat-percent', '20'], ['#body-water-liters', '42']]) {
        await type(page, page.locator(selector), value);
      }
      await pause(page, 1400);
      await click(page, page.locator('#confirm-inbody'));
      await click(page, page.getByRole('button', { name: 'Xác nhận và lưu', exact: true }));
      await expect(history.locator('.workspace-record')).toHaveCount(before + 1);
      await page.reload();
      await expect(history.locator('.workspace-record')).toHaveCount(before + 1);
      await scrollTo(page, history); await pause(page, 1500);
      return ['manual five-metric entry', 'explicit PT confirmation', 'verified record persisted across reload', 'no production OCR success claimed'];
    }
    case '07-warning':
      await openTrainee(page, cfg, true);
      await expect(page.getByTestId('trainee-warning')).toBeVisible();
      await scrollTo(page, page.getByTestId('trainee-warning'));
      await pause(page, 2200);
      await click(page, page.getByTestId('copy-followup'));
      await expect(page.getByTestId('copy-followup')).toContainText('Đã sao chép');
      await pause(page, 1000);
      if (await page.getByTestId('open-zalo').count()) await move(page, page.getByTestId('open-zalo'));
      return ['calendar-based inactivity warning', 'follow-up copied; no automatic message', 'Zalo shortcut not opened'];
    case '08-admin':
      // Admin and ordinary-user subclips are captured by capture.mjs.
      await expect(page.getByRole('heading', { name: 'Bảng Điều Khiển Quản Trị Hệ Thống' })).toBeVisible();
      await pause(page, 3500);
      await scrollTo(page, page.locator('#users-table')); await pause(page, 5000);
      await scrollTo(page, page.locator('#transactions-table')); await pause(page, 5000);
      await expect(page.locator('main')).toContainText(/synthetic|mô phỏng|Demo/i);
      return ['authenticated admin portal', 'disclosure retained', 'synthetic user and sample transaction tables'];
    default: throw new Error('This scene requires its dedicated asset flow.');
  }
}
