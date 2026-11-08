import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

export const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(new URL('../../apps/web/package.json', import.meta.url));
export const { chromium, expect } = require('@playwright/test');
export const scenes = [
  { id: '01-landing', role: 'anonymous', route: '/', seconds: 25, title: 'FitSync · Quy trình đồng hành' },
  { id: '02-team', role: 'anonymous', route: '/', seconds: 20, title: 'Team SafeTrail · Android: chưa xác minh bản cài đặt' },
  { id: '03-workspace', role: 'pt', route: '/workspace', seconds: 30, title: 'PT Workspace' },
  { id: '04-trainee', role: 'pt', route: '/workspace', seconds: 27, title: 'Học viên · Trạng thái kết nối' },
  { id: '05-checkin', role: 'trainee', route: '/workspace', seconds: 28, title: 'Trainee Check-in · Ảnh bữa ăn synthetic' },
  { id: '06-inbody', role: 'pt', route: '/workspace', seconds: 33, title: 'InBody · Nhập tay, kiểm tra và xác nhận' },
  { id: '07-warning', role: 'pt', route: '/workspace', seconds: 17, title: 'Inactivity Alert · Liên hệ có chủ đích' },
  { id: '08-admin', role: 'pt', route: '/workspace', seconds: 43, title: 'Admin Portal · Sample transactions' },
  { id: '09-erd-outro', role: 'anonymous', route: '/', seconds: 32, title: 'Architecture · RLS và private storage' },
];
export function argument(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i < 0 ? fallback : process.argv[i + 1];
}
export function ensure(condition, message) { if (!condition) throw new Error(message); }
export function getScene(id) {
  const scene = scenes.find(s => s.id === id);
  ensure(scene, 'Unknown scene. Use --list.');
  return scene;
}
export function config() {
  const base = new URL(process.env.VIDEO_BASE_URL || 'http://127.0.0.1:3100');
  ensure(['http:', 'https:'].includes(base.protocol) && !base.username && !base.password && !base.search && !base.hash && base.pathname === '/', 'VIDEO_BASE_URL must be a plain HTTP(S) origin.');
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
  return {
    base: base.origin, local,
    run: path.resolve(argument('--run', process.env.VIDEO_RUN_DIR || path.join(root, 'outputs/video/draft-01'))),
    privateDir: path.resolve(process.env.VIDEO_PRIVATE_DIR || path.join(root, '.video-private')),
    executablePath: process.env.VIDEO_CHROME_PATH || undefined,
  };
}
export async function launch(cfg) {
  return chromium.launch({ headless: !process.argv.includes('--headed'), ...(cfg.executablePath ? { executablePath: cfg.executablePath } : {}) });
}
export function contextOptions() {
  return { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, locale: 'vi-VN', timezoneId: 'Asia/Ho_Chi_Minh', reducedMotion: 'no-preference' };
}
export async function json(file) { return JSON.parse(await fs.readFile(file, 'utf8')); }
export async function writeJson(file, data) { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n'); }
export function revision() {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  ensure(r.status === 0, 'Cannot determine source revision.'); return r.stdout.trim();
}
export function media(executable, args, cwd) {
  ensure(executable, 'Set FFMPEG and FFPROBE to local executables.');
  const r = spawnSync(executable, args, { cwd, encoding: null, maxBuffer: 32 * 1024 * 1024, windowsHide: true });
  ensure(r.status === 0, `Media command failed (${path.basename(executable)}); review local inputs. No provider output is logged.`);
  return r.stdout;
}
export function probe(file) { return JSON.parse(media(process.env.FFPROBE || 'ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]).toString()); }
export async function statePath(cfg, role) {
  ensure(process.env.VIDEO_SYNTHETIC_CONFIRM === 'synthetic-only', 'Attest dedicated synthetic demo state with VIDEO_SYNTHETIC_CONFIRM=synthetic-only.');
  const file = path.join(cfg.privateDir, `${role}.auth-state.json`);
  await fs.access(file).catch(() => { throw new Error(`Missing dedicated ${role} state. Run prepare-auth.mjs off-camera.`); });
  return file;
}
export function safeMain(fn) {
  fn().catch(error => {
    // Playwright errors often embed page URLs, form values and provider payloads.
    // Intentionally omit their messages/stacks. See successful manifests only.
    const message = error?.constructor === Error ? error.message : 'Browser action failed; inspect the scene privately, without traces or shared logs.';
    const safe = /https?:\/\/|eyJ|token=|password=|apikey=|[A-Za-z]:\\/.test(message) ? 'Operation failed. Sensitive diagnostic details were suppressed.' : message;
    console.error(safe); process.exitCode = 1;
  });
}
