import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config, scenes, getScene, argument, ensure, contextOptions, launch, statePath, writeJson, revision, media, probe, safeMain, expect, json } from './common.mjs';
import { runActions, pause, scrollTo, click } from './scenes.mjs';

function captureDecoration() {
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '#created-invitation,.video-private-text{visibility:hidden!important}nextjs-portal,[data-nextjs-toast]{display:none!important}';
    document.head.append(style);
    const cursor = document.createElement('div');
    cursor.id = 'video-cursor'; cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<svg width="25" height="31" viewBox="0 0 25 31"><path d="M3 2V24L9 18L14 28L18 26L13 17H22Z" fill="#ECEAE6" stroke="#0E0E12" stroke-width="2"/></svg>';
    Object.assign(cursor.style, { position: 'fixed', left: '-40px', top: '0px', zIndex: '2147483647', pointerEvents: 'none', filter: 'drop-shadow(0 2px 3px #0009)' });
    document.body.append(cursor);
    document.addEventListener('mousemove', e => { cursor.style.left = `${e.clientX}px`; cursor.style.top = `${e.clientY}px`; });
    document.addEventListener('mousedown', () => { cursor.style.filter = 'drop-shadow(0 0 5px #F5A623)'; });
    document.addEventListener('mouseup', () => { cursor.style.filter = 'drop-shadow(0 2px 3px #0009)'; });
    // Privacy-only masking; no product text, results or application state are fabricated.
    const mask = () => {
      for (const el of document.querySelectorAll('p,span,small,div,a')) {
        if (el.children.length || el.classList.contains('video-private-text')) continue;
        const text = el.textContent || '';
        const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
        if (email.some(value => !/@example\.(test|com)$/i.test(value)) || /0901\.234\.567/.test(text)) el.classList.add('video-private-text');
      }
    };
    mask(); new MutationObserver(mask).observe(document.body, { subtree: true, childList: true });
  });
}

async function take(browser, cfg, options) {
  const { key, role, seconds, route, start, actions, expectedPath } = options;
  const file = path.join(cfg.run, 'takes', `${key}.json`);
  ensure(!await fs.access(file).then(() => true, () => false), 'Take already exists. Use a new run directory to preserve it.');
  const scratch = path.join(cfg.privateDir, 'takes', randomUUID());
  await fs.mkdir(scratch, { recursive: true });
  const state = role === 'anonymous' ? undefined : await statePath(cfg, role);
  if (state) {
    const meta = await json(path.join(cfg.privateDir, `${role}.session-meta.json`));
    ensure(meta.origin === cfg.base && meta.role === role && meta.syntheticAttested, 'Dedicated session origin/role/attestation does not match this recording.');
  }
  const context = await browser.newContext({ ...contextOptions(), ...(state ? { storageState: state } : {}), recordVideo: { dir: scratch, size: { width: 1920, height: 1080 } } });
  await context.addInitScript(captureDecoration);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  let errors = 0, popups = 0;
  page.on('pageerror', () => { errors++; });
  context.on('page', popup => { if (popup !== page) { popups++; void popup.close(); } });
  const video = page.video();
  let passed;
  try {
    const response = await page.goto(`${cfg.base}${route}`, { waitUntil: 'networkidle' });
    ensure(response?.ok(), 'Scene entry did not return successful HTTP.');
    if (role !== 'anonymous') ensure(new URL(page.url()).pathname === (expectedPath || route), 'Authenticated entry redirected; refresh the dedicated role session off-camera.');
    await page.evaluate(() => document.fonts.ready);
    if (start) await start(page);
    // Off-camera solid sync slate is detected in the actual encoded video below.
    // It and all navigation/compilation before it are trimmed, never exported.
    await page.evaluate(() => {
      const slate = document.createElement('div'); slate.id = 'video-sync-slate';
      Object.assign(slate.style, { position: 'fixed', inset: '0', background: '#ff00ff', zIndex: '2147483647' }); document.body.append(slate);
    });
    await pause(page, 700);
    await page.locator('#video-sync-slate').evaluate(el => el.remove());
    const started = performance.now();
    await page.mouse.move(1740, 950, { steps: 20 });
    passed = await actions(page);
    const elapsed = (performance.now() - started) / 1000;
    ensure(elapsed <= seconds - 0.2, 'Take exceeded its narration slot. Retake or edit dead loading explicitly; do not accelerate the footage.');
    await pause(page, (seconds - elapsed + 0.4) * 1000);
    ensure(errors === 0 && popups === 0, 'Take contains a browser error or unexpected popup; keep it private and retake.');
    const qa = path.join(cfg.run, 'qa'); await fs.mkdir(qa, { recursive: true });
    await page.screenshot({ path: path.join(qa, `${key}-end.png`) });
  } finally { await context.close(); }
  const rawPath = await video.path();
  const info = probe(rawPath), stream = info.streams.find(s => s.codec_type === 'video');
  ensure(stream.width === 1920 && stream.height === 1080, 'Raw capture dimensions do not match 1080p.');
  const [n, d] = stream.avg_frame_rate.split('/').map(Number), fps = n / d;
  const pixels = media(process.env.FFMPEG || 'ffmpeg', ['-v', 'error', '-i', rawPath, '-vf', 'scale=1:1', '-pix_fmt', 'rgb24', '-f', 'rawvideo', 'pipe:1']);
  let marker = -1;
  for (let i = 0; i < pixels.length; i += 3) if (pixels[i] > 240 && pixels[i + 1] < 15 && pixels[i + 2] > 240) marker = i / 3;
  ensure(marker >= 0, 'Could not locate the capture sync marker. Take was not exported.');
  const trimStart = (marker + 1) / fps;
  ensure(Number(info.format.duration) >= trimStart + seconds, 'Raw take is shorter than the required scene.');
  const destination = path.join(cfg.run, 'raw', `${key}.webm`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(rawPath, destination);
  await writeJson(file, { key, seconds, trimStart, file: `raw/${key}.webm`, sourceRevision: revision(), origin: cfg.base, localDraft: cfg.local, syntheticAttested: role === 'anonymous' || process.env.VIDEO_SYNTHETIC_CONFIRM === 'synthetic-only', role, passed, browserErrors: errors, unexpectedPopups: popups, privacyReview: 'pending', recordedAt: new Date().toISOString() });
  console.log(`Recorded ${key}: ${seconds}s of real application interaction.`);
}

safeMain(async () => {
  if (process.argv.includes('--list')) { for (const s of scenes) console.log(`${s.id} ${s.seconds}s ${s.role}`); return; }
  const cfg = config(), scene = getScene(argument('--scene'));
  await fs.mkdir(cfg.run, { recursive: true });
  const existing = path.join(cfg.run, 'scenes', `${scene.id}.json`);
  ensure(!await fs.access(existing).then(() => true, () => false), 'Scene already recorded; preserve it and choose a new run directory.');
  const browser = await launch(cfg);
  const parts = [];
  const workflowPreview = process.argv.includes('--workflow-preview');
  let variant;
  async function record(options) { await take(browser, cfg, options); parts.push({ key: options.key, seconds: options.seconds }); }
  try {
    // Warm routes without camera first. This does not substitute backend results.
    const warm = await browser.newPage(contextOptions()); await warm.goto(`${cfg.base}/`, { waitUntil: 'networkidle' }); await warm.close();
    if (scene.id === '03-workspace') {
      await record({ key: `${scene.id}-login`, role: 'anonymous', route: '/login', seconds: 5, actions: async page => { await expect(page.locator('input[name=password]')).toHaveValue(''); await pause(page, 1200); return ['empty login screen; credentials entered off-camera']; } });
      await record({ key: scene.id, role: 'pt', route: '/workspace', seconds: 25, actions: page => runActions(scene.id, page, cfg) });
    } else if (scene.id === '05-checkin' && process.argv.includes('--resume-checkin')) {
      const recovered = await json(path.join(cfg.run, 'takes', '05-checkin-input.json'));
      ensure(recovered.recoveryVerification?.serverPersistenceConfirmed === true, 'Only the actual persisted check-in may resume its recorded input segment.');
      parts.push({ key: '05-checkin-input', seconds: 12 });
      await record({ key: '05-checkin-result', role: 'trainee', route: '/workspace', seconds: 16, actions: async page => {
        await expect(page.locator('.workspace-complete-today')).toBeVisible();
        const history = page.locator('section[aria-labelledby="trainee-activity-title"]');
        await scrollTo(page, history);
        await expect(history).toContainText('Năng lượng tốt');
        await expect(history.locator('img').first()).toBeVisible();
        await pause(page, 3500);
        await page.reload();
        await expect(page.locator('.workspace-complete-today')).toBeVisible();
        await scrollTo(page, history);
        await expect(history.locator('img').first()).toBeVisible();
        return ['real submitted check-in and synthetic meal persisted across reload', 'only the upload wait was cut between actual input and actual saved result'];
      } });
    } else if (scene.id === '06-inbody' && process.argv.includes('--resume-inbody')) {
      parts.push({ key: '06-inbody-input', seconds: 23 });
      await record({ key: '06-inbody-result', role: 'pt', route: `/workspace/trainees/${process.env.VIDEO_TRAINEE_ID}`, seconds: 10, actions: async page => {
        const history = page.locator('section[aria-labelledby="record-history-title"]');
        await expect(history.getByTestId('verified-record')).toHaveCount(2);
        await scrollTo(page, history);
        await expect(history.getByTestId('verified-record').first()).toContainText('72 kg');
        await pause(page, 3500);
        return ['actual manual InBody confirmation persisted; two verified records after reload', 'actual input/save footage retained; loading wait removed'];
      } });
    } else if (scene.id === '07-warning' && workflowPreview && process.argv.includes('--resume-activity')) {
      variant = 'activity-review';
      parts.push({ key: '07-activity-input', seconds: 17 });
      await record({ key: '07-activity-result', role: 'pt', route: `/workspace/trainees/${process.env.VIDEO_TRAINEE_ID}`, seconds: 8, actions: async page => {
        await expect(page.locator('#remaining-session-balance')).toHaveValue('7');
        await scrollTo(page, page.locator('#session-balance-title'));
        await pause(page, 2500);
        return ['actual session update persisted after reload', 'activity review uses real trainee check-in; no inactivity warning claim'];
      } });
    } else if (scene.id === '07-warning' && workflowPreview) {
      variant = 'activity-review';
      await record({ key: '07-activity-review', role: 'pt', route: '/workspace', seconds: 25, actions: async page => {
        ensure(process.env.VIDEO_ALLOW_DEMO_WRITES === 'synthetic-only', 'Session-balance changes require dedicated synthetic demo write authorization.');
        const { openTrainee } = await import('./scenes.mjs');
        await openTrainee(page, cfg);
        const history = page.locator('section[aria-labelledby="checkin-history-title"]');
        await scrollTo(page, history);
        await expect(history).toContainText('Năng lượng tốt');
        await expect(history.locator('img').first()).toBeVisible();
        await pause(page, 4000);
        await scrollTo(page, page.locator('#session-balance-title'));
        await page.locator('#remaining-session-balance').fill('7');
        await click(page, page.getByRole('button', { name: 'Cập nhật số buổi', exact: true }));
        await expect(page.locator('.workspace-inline-status')).toContainText('Đã cập nhật');
        await page.reload();
        await expect(page.locator('#remaining-session-balance')).toHaveValue('7');
        await scrollTo(page, page.locator('#session-balance-title'));
        return ['PT sees the actual persisted trainee check-in and synthetic meal', 'remaining sessions updated and persisted', 'no inactive warning state or automatic Zalo sending claimed'];
      } });
    } else if (scene.id === '08-admin' && workflowPreview) {
      variant = 'ordinary-role-protection';
      await record({ key: '08-admin-denial', role: 'pt', route: '/workspace', seconds: 8, actions: async page => {
        await page.goto(`${cfg.base}/admin`);
        await page.waitForURL('**/workspace');
        await expect(page.locator('.workspace-roster')).toBeVisible();
        await pause(page, 2000);
        return ['ordinary authenticated PT actually denied /admin and redirected', 'admin portal itself unavailable to the provided demo login'];
      } });
      await record({ key: '08-logout', role: 'pt', route: '/workspace', seconds: 7, actions: async page => {
        await click(page, page.getByRole('button', { name: 'Đăng xuất', exact: true }).filter({ visible: true }).first());
        await page.waitForURL('**/login');
        await expect(page.locator('input[name=password]')).toHaveValue('');
        await pause(page, 1800);
        return ['real PT logout and empty login page', 'no credential entry captured'];
      } });
    } else if (scene.id === '08-admin' && process.argv.includes('--admin-only')) {
      await record({ key: scene.id, role: 'admin', route: '/admin', seconds: 30, actions: page => runActions(scene.id, page, cfg) });
    } else if (scene.id === '08-admin') {
      // Validate required sessions before starting any account transition.
      await statePath(cfg, 'pt'); await statePath(cfg, 'admin');
      await record({ key: `${scene.id}-logout`, role: 'pt', route: '/workspace', seconds: 5, actions: async page => { await click(page, page.getByRole('button', { name: 'Đăng xuất', exact: true }).filter({ visible: true }).first()); await page.waitForURL('**/login'); return ['real PT logout; next admin login prepared off-camera']; } });
      await record({ key: scene.id, role: 'admin', route: '/admin', seconds: 30, actions: page => runActions(scene.id, page, cfg) });
      await record({ key: `${scene.id}-denial`, role: 'pt', route: '/workspace', seconds: 8, actions: async page => { await page.goto(`${cfg.base}/admin`); await page.waitForURL('**/workspace'); await expect(page.locator('.workspace-roster')).toBeVisible(); return ['ordinary PT actually denied /admin and redirected to /workspace']; } });
    } else if (scene.id === '09-erd-outro') {
      const assetDraft = process.argv.includes('--asset-draft');
      ensure(process.env.VIDEO_ERD_IMAGE && (assetDraft || process.env.VIDEO_ERD_REVIEWED === 'true'), 'Provide the actual ERD asset; final use also needs VIDEO_ERD_REVIEWED=true.');
      await fs.mkdir(path.join(cfg.run, 'assets'), { recursive: true });
      await fs.copyFile(process.env.VIDEO_ERD_IMAGE, path.join(cfg.run, 'assets/erd.png'));
      const info = probe(path.join(cfg.run, 'assets/erd.png'));
      ensure(assetDraft || info.streams[0].width >= 2560, 'Final ERD asset must be at least 2560px wide; use --asset-draft for the provided lower-resolution draft.');
      const crop = (process.env.VIDEO_ERD_CROP || '').split(',').map(Number);
      ensure(crop.length === 4 && crop.every(Number.isFinite) && crop[0] > 0 && crop[1] > 0 && crop[2] >= 0 && crop[3] >= 0, 'Supply reviewed readable detail crop as VIDEO_ERD_CROP=width,height,x,y.');
      ensure(crop[2] + crop[0] <= info.streams[0].width && crop[3] + crop[1] <= info.streams[0].height, 'ERD detail crop exceeds image bounds.');
      parts.push({ key: 'erd', file: 'assets/erd.png', seconds: 28, crop, reviewed: !assetDraft });
      await record({ key: '09-outro', role: 'anonymous', route: '/', seconds: 4, actions: async page => { await expect(page.locator('.fs-hero h1')).toBeVisible(); await pause(page, 1000); return ['actual landing closing frame']; } });
    } else {
      await record({ key: scene.id, role: scene.role, route: scene.route, seconds: scene.seconds, start: scene.id === '02-team' ? page => scrollTo(page, page.locator('#team')) : undefined, actions: page => runActions(scene.id, page, cfg) });
    }
    const partial = !!variant || (scene.id === '08-admin' && process.argv.includes('--admin-only'));
    const missingActions = variant === 'activity-review' ? ['aged inactivity-warning fixture', 'Zalo handoff demonstration'] : variant === 'ordinary-role-protection' ? ['authenticated admin portal', 'admin KPI/user/transaction tables'] : partial ? ['PT logout', 'non-admin /admin denial'] : [];
    await writeJson(existing, { id: scene.id, seconds: parts.reduce((total, part) => total + part.seconds, 0), parts, partial, variant, missingActions, sourceRevision: revision(), origin: cfg.base, localDraft: cfg.local });
  } finally { await browser.close(); }
});
