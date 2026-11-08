import fs from 'node:fs/promises';
import path from 'node:path';
import { config, scenes, launch, contextOptions, probe, writeJson, revision, safeMain } from './common.mjs';

safeMain(async () => {
  const cfg = config(), browser = await launch(cfg), checks = [];
  try {
    const context = await browser.newContext(contextOptions());
    const page = await context.newPage();
    let errors = 0; page.on('pageerror', () => { errors++; });
    for (const route of ['/', '/login', '/workspace', '/admin', '/downloads/fitsync-v0.1.0-alpha.apk']) {
      const response = await page.goto(`${cfg.base}${route}`, { waitUntil: 'networkidle' });
      checks.push({ route, status: response?.status(), finalPath: new URL(page.url()).pathname, titlePresent: !!await page.title() });
    }
    const states = {};
    for (const role of ['pt', 'trainee', 'admin']) states[role] = await fs.access(path.join(cfg.privateDir, `${role}.auth-state.json`)).then(() => 'available; not validated by this anonymous preflight', () => 'missing');
    await writeJson(path.join(cfg.run, 'preflight.json'), { sourceRevision: revision(), origin: cfg.base, localDraft: cfg.local, checkedAt: new Date().toISOString(), checks, pageErrors: errors, dedicatedStates: states, expectedSeconds: scenes.reduce((t, s) => t + s.seconds, 0), ffmpegDependencies: 'set FFMPEG and FFPROBE', productionEvidence: 'pending separate verification', signedUrlsOrCredentialsLogged: false });
    console.log('Anonymous route preflight recorded. No credentials, browser state or provider payloads printed.');
    await context.close();
  } finally { await browser.close(); }
});
