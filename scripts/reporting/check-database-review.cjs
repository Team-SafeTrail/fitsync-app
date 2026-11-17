const { chromium } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1365, height: 950 } });
    await page.goto(pathToFileURL(path.resolve('reports/DATABASE_REVIEW.html')).href);
    if (await page.locator('tbody tr[data-live=yes]').count() !== 8) throw new Error('Expected 8 present baseline tables');
    if (await page.locator('tbody tr[data-live=no]').count() !== 4) throw new Error('Expected 4 missing coaching tables');
    await page.getByRole('button', { name: 'Chưa triển khai' }).click();
    if (await page.locator('tbody tr:visible').count() !== 4) throw new Error('Missing filter failed');
    await page.getByRole('button', { name: 'Tất cả' }).click();
    await page.screenshot({ path: 'docs/evidence/exe201-2026-11-17/database-review-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Mobile page overflow');
    await page.screenshot({ path: 'docs/evidence/exe201-2026-11-17/database-review-mobile.png', fullPage: true });
    console.log('PASS: 8 present / 4 missing; filters work; mobile page fits; screenshots saved.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
