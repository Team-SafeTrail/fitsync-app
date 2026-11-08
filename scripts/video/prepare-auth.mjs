import fs from 'node:fs/promises';
import path from 'node:path';
import { config, argument, contextOptions, ensure, launch, safeMain, writeJson } from './common.mjs';

safeMain(async () => {
  const cfg = config();
  const role = argument('--role');
  ensure(['pt', 'trainee', 'admin'].includes(role), 'Supply --role pt, trainee, or admin.');
  ensure(process.env.VIDEO_SYNTHETIC_CONFIRM === 'synthetic-only', 'Dedicated synthetic demo accounts must be attested before authentication.');
  const key = role.toUpperCase();
  const email = process.env[`VIDEO_${key}_EMAIL`], password = process.env[`VIDEO_${key}_PASSWORD`];
  ensure(email && password, 'Supply role credentials through an ignored local environment file; never put them in commands or chat.');
  await fs.mkdir(cfg.privateDir, { recursive: true });
  const browser = await launch(cfg);
  let stage = 'open dedicated browser';
  let page;
  const responseStatuses = [];
  try {
    // No video, screenshot, trace, HAR, console forwarding or persistent personal profile.
    const context = await browser.newContext(contextOptions());
    page = await context.newPage();
    page.on('response', response => { if (response.request().method() === 'POST' && new URL(response.url()).origin === cfg.base) responseStatuses.push(response.status()); });
    stage = 'load login page';
    await page.goto(`${cfg.base}/login`);
    stage = 'find real login fields';
    await page.locator('input[name=email]').fill(email);
    await page.locator('input[name=password]').fill(password);
    stage = 'submit dedicated login';
    await page.getByRole('button', { name: 'Vào workspace' }).click();
    stage = 'wait for authenticated route';
    await page.waitForURL(url => ['/workspace', '/admin'].includes(url.pathname) || (url.pathname === '/login' && url.searchParams.has('error')), { timeout: 30000 });
    ensure(['/workspace', '/admin'].includes(new URL(page.url()).pathname), 'The deployed sign-in rejected the supplied demo login.');
    if (role === 'admin') {
      stage = 'verify admin authorization';
      await page.goto(`${cfg.base}/admin`);
      await page.waitForURL('**/admin');
      await page.getByRole('heading', { name: 'Bảng Điều Khiển Quản Trị Hệ Thống' }).waitFor();
    } else if (role === 'trainee') {
      await page.locator('.trainee-heading').waitFor();
    } else {
      await page.locator('.workspace-roster').waitFor();
      await page.goto(`${cfg.base}/admin`);
      await page.waitForURL('**/workspace');
    }
    const file = path.join(cfg.privateDir, `${role}.auth-state.json`);
    await context.storageState({ path: file });
    await writeJson(path.join(cfg.privateDir, `${role}.session-meta.json`), { role, origin: cfg.base, syntheticAttested: true, preparedAt: new Date().toISOString() });
    await fs.chmod(file, 0o600);
    await context.close();
    console.log(`Prepared ${role} demo session off-camera. State stays private and ignored.`);
  } catch {
    await writeJson(path.join(cfg.privateDir, `${role}.auth-result.json`), { role, success: false, stage, postResponseStatuses: responseStatuses, finalRoute: page ? new URL(page.url()).pathname.replace(/\/invite\/.*/, '/invite/[redacted]') : null, visibleLoginError: page ? new URL(page.url()).searchParams.has('error') : false, secretsLogged: false });
    throw new Error(`Demo authentication did not complete at step: ${stage}. A secret-free status classification is stored privately.`);
  } finally { await browser.close(); }
});
