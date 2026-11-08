import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, scenes, argument, ensure, json, writeJson, media, probe, launch, contextOptions, safeMain } from './common.mjs';
import { architectureFilter, architectureText } from './architecture.mjs';

export function selectScenes(requested) {
  const ids = requested.split(',');
  ensure(ids.length === new Set(ids).size && ids.every(id => scenes.some(s => s.id === id)), 'Scene selection contains an unknown or duplicate scene.');
  return scenes.filter(s => ids.includes(s.id));
}
export function validateTake(take, expected, manifest, { allowRecovered = false } = {}) {
  ensure(take.seconds === expected.seconds && Number.isFinite(take.trimStart) && take.trimStart >= 0, 'Take timing is invalid.');
  ensure(take.sourceRevision === manifest.sourceRevision && take.origin === manifest.origin, 'Take provenance differs from its scene.');
  const recovered = allowRecovered && take.browserErrors === null && take.unexpectedPopups === null && ['automation_timeout_after_submit', 'recording_exceeded_slot'].includes(take.recoveryVerification?.reason) && take.recoveryVerification?.serverPersistenceConfirmed === true && take.recoveryVerification?.segmentFramesReviewed === true && take.recoveryVerification?.fullDecodePassed === true;
  ensure(take.syntheticAttested && ((take.browserErrors === 0 && take.unexpectedPopups === 0) || recovered), 'Take failed its synthetic/browser checks.');
}
export function validateWorkflowPreview(manifests) {
  ensure(manifests.length === scenes.length && manifests.every((m, i) => m.id === scenes[i].id), 'Workflow preview requires all nine sections, including its explicit limitation variants.');
  for (const manifest of manifests) {
    if (!manifest.partial) continue;
    ensure((manifest.id === '07-warning' && manifest.variant === 'activity-review' && manifest.seconds === 25) || (manifest.id === '08-admin' && manifest.variant === 'ordinary-role-protection' && manifest.seconds === 15), 'Unsupported partial scene cannot be used in the workflow preview.');
    ensure(manifest.missingActions?.length > 0, 'Workflow limitations must be declared.');
  }
  const total = manifests.reduce((sum, m) => sum + m.seconds, 0);
  ensure(total >= 225 && total <= 285, 'Workflow preview must remain within the preferred 3:45–4:45 range.');
}
export async function completeGate(cfg, manifests) {
  ensure(manifests.length === scenes.length && manifests.every((m, i) => m.id === scenes[i].id), 'Complete export requires all nine scenes in source-script order.');
  ensure(manifests.every(m => !m.partial && m.seconds === scenes.find(s => s.id === m.id).seconds), 'Complete export rejects partial scenes and missing role transitions.');
  ensure(!cfg.local && manifests.every(m => !m.localDraft && m.origin === cfg.base), 'Complete export requires one verified production origin, not local footage.');
  ensure(manifests.every(m => m.sourceRevision === manifests[0].sourceRevision), 'All scenes must demonstrate one source revision.');
  const evidenceFile = argument('--evidence');
  ensure(evidenceFile, 'Complete export requires local reviewed recording evidence via --evidence.');
  const e = await json(evidenceFile);
  ensure(e.productionOrigin === cfg.base && e.productionCommit === manifests[0].sourceRevision, 'Evidence must map the recorded source SHA to the deployed production build.');
  for (const key of ['independentReviewVerified', 'pr28ReplacementAccepted', 'deployedCodeVerified', 'fiveMigrationsVerified', 'syntheticSeedVerified', 'dedicatedSessionsVerified', 'adminAndNonAdminVerified', 'rawTakesPrivacyReviewed']) {
    ensure(e[key] === true, `Complete recording gate pending: ${key}.`);
  }
  for (const key of ['reviewReceipt', 'deploymentReceipt', 'migrationReceipt', 'seedReceipt', 'authorizationReceipt', 'rawReviewReceipt']) ensure(typeof e[key] === 'string' && e[key].trim().length > 8, `Missing evidence reference: ${key}.`);
  const erdURL = new URL(e.erdViewOnlyUrl);
  ensure(erdURL.protocol === 'https:' && !erdURL.username && !erdURL.password && !/token|signature|key=/i.test(erdURL.search), 'ERD requires a non-secret HTTPS view-only evidence link.');
  ensure(e.erdViewOnlyVerified === true, 'ERD view-only access has not been verified.');
  const browser = await launch(cfg);
  try {
    const context = await browser.newContext(contextOptions());
    const page = await context.newPage();
    const response = await page.goto(cfg.base, { waitUntil: 'networkidle' });
    ensure(response?.status() === 200 && new URL(page.url()).origin === cfg.base, 'Production failed the fresh-private-context HTTP 200 gate.');
    await page.locator('.fs-hero h1').waitFor();
    await context.close();
  } finally { await browser.close(); }
  return { productionOrigin: cfg.base, productionCommit: e.productionCommit, finalGatesVerified: true };
}

async function main() {
  const cfg = config();
  const draft = process.argv.includes('--draft'), complete = process.argv.includes('--complete'), preview = process.argv.includes('--workflow-preview');
  ensure(Number(draft) + Number(complete) + Number(preview) === 1, 'Choose exactly one of --draft, --workflow-preview, or --complete.');
  const selected = selectScenes(argument('--scenes', scenes.map(s => s.id).join(',')));
  const manifests = [];
  for (const scene of selected) {
    let m; try { m = await json(path.join(cfg.run, 'scenes', `${scene.id}.json`)); } catch { throw new Error(`Missing successful scene ${scene.id}; do not fill it with fake UI, freeze frames, or slides.`); }
    ensure(m.id === scene.id && (m.seconds === scene.seconds || ((draft || preview) && m.partial)) && m.parts.reduce((s, p) => s + p.seconds, 0) === m.seconds, 'Scene timing differs from the primary timeline.');
    manifests.push(m);
  }
  ensure(manifests.every(m => m.origin === cfg.base && m.sourceRevision === manifests[0].sourceRevision), 'Selected scenes must share one origin and revision.');
  if (preview) validateWorkflowPreview(manifests);
  // Validate every input and all gates BEFORE encoding or naming a deliverable.
  const inputs = [];
  for (const [index, m] of manifests.entries()) {
    for (const part of m.parts) {
      if (part.key === 'erd') {
        ensure(m.id === '09-erd-outro' && (draft || preview || part.reviewed) && part.seconds === 28, 'ERD input is not reviewed for final use.');
        inputs.push({ part, scene: selected[index], image: path.join(cfg.run, part.file) });
      } else {
        const take = await json(path.join(cfg.run, 'takes', `${part.key}.json`));
        validateTake(take, part, m, { allowRecovered: draft || preview });
        const file = path.resolve(cfg.run, take.file);
        ensure(path.dirname(file) === path.join(cfg.run, 'raw') && file.endsWith('.webm'), 'Take path must be a raw capture in this run.');
        const info = probe(file), video = info.streams.find(s => s.codec_type === 'video');
        ensure(video?.width === 1920 && video?.height === 1080 && Number(info.format.duration) >= take.trimStart + part.seconds, 'Capture input is incomplete or not 1080p.');
        inputs.push({ part, scene: selected[index], take, file });
      }
    }
  }
  const gate = complete ? await completeGate(cfg, manifests) : { finalGatesVerified: false };
  if (process.argv.includes('--check-only')) { console.log(`Validated ${selected.length} scene manifests; ${complete ? 'production gates passed' : 'visual preview only'}.`); return; }
  const outName = draft ? 'FitSync-Product-Walkthrough-DRAFT.mp4' : 'FitSync-Product-Walkthrough-visual.mp4';
  const output = path.join(cfg.run, outName);
  ensure(!await fs.access(output).then(() => true, () => false), 'Export exists; choose a new run or preserve/rename the previous output explicitly.');
  const work = path.join(cfg.run, '.edit'); await fs.mkdir(work, { recursive: true });
  const font = process.env.VIDEO_FONT_FILE || (process.platform === 'win32' ? 'C:/Windows/Fonts/arial.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
  await fs.copyFile(font, path.join(work, 'font.ttf'));
  for (const [file, content] of Object.entries(architectureText)) await fs.writeFile(path.join(work, file), content);
  const status = draft ? `BẢN NHÁP · ${cfg.local ? 'LOCAL' : 'PRODUCTION'} · ${selected.length}/9 cảnh đã quay` : preview ? 'FitSync · Demo walkthrough' : 'FitSync · Product walkthrough';
  await fs.writeFile(path.join(work, 'status.txt'), status);
  const ff = process.env.FFMPEG || 'ffmpeg';
  const encoded = []; let position = 0; const chapters = [];
  for (const [index, input] of inputs.entries()) {
    const tag = String(index).padStart(2, '0'), target = path.join(work, `${tag}.mp4`);
    const label = input.part.key === '09-outro' ? 'FitSync · Cảm ơn Thầy và các bạn' : input.part.key.endsWith('-denial') ? 'PT thường mở /admin → được chuyển về /workspace' : input.part.key.startsWith('07-activity-') ? 'PT xem check-in · Cập nhật số buổi' : input.part.key === '08-logout' ? 'Đăng xuất · Admin demo chưa truy cập được' : input.scene.title;
    await fs.writeFile(path.join(work, `${tag}.txt`), label);
    const statusFilter = `drawtext=fontfile=font.ttf:textfile=status.txt:fontsize=18:fontcolor=0xECEAE6:box=1:boxcolor=0x0E0E12@0.85:boxborderw=9:x=28:y=h-42${draft ? '' : ":enable='lt(t,3)'"}`;
    const overlay = `drawtext=fontfile=font.ttf:textfile=${tag}.txt:fontsize=24:fontcolor=0xECEAE6:box=1:boxcolor=0x0E0E12@0.92:boxborderw=12:x=28:y=h-100:enable='lt(t,${input.scene.id === '02-team' ? input.part.seconds : 4})',${statusFilter}`;
    let args;
    if (input.image) {
      const imageInfo = probe(input.image).streams.find(s => s.codec_type === 'video');
      const imageFilter = architectureFilter({ width: imageInfo.width, height: imageInfo.height, statusFilter });
      args = ['-loop', '1', '-framerate', '30', '-i', input.image, '-filter_complex', imageFilter, '-map', '[out]'];
    } else {
      args = ['-i', input.file, '-vf', `trim=start=${input.take.trimStart}:duration=${input.part.seconds},setpts=PTS-STARTPTS,fps=30,${overlay},format=yuv420p`];
    }
    media(ff, ['-hide_banner', '-loglevel', 'error', '-y', ...args, '-t', String(input.part.seconds), '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-threads', '2', '-pix_fmt', 'yuv420p', '-r', '30', target], work);
    encoded.push(`${tag}.mp4`); chapters.push({ key: input.part.key, start: position, seconds: input.part.seconds }); position += input.part.seconds;
    console.log(`Encoded ${input.part.key}.`);
  }
  await fs.writeFile(path.join(work, 'concat.txt'), encoded.map(file => `file '${file}'`).join('\n') + '\n');
  const pending = path.join(work, 'render.mp4');
  media(ff, ['-v', 'error', '-y', '-f', 'concat', '-safe', '1', '-i', 'concat.txt', '-c', 'copy', '-an', '-movflags', '+faststart', pending], work);
  const info = probe(pending), v = info.streams.find(s => s.codec_type === 'video');
  ensure(v.width === 1920 && v.height === 1080 && v.avg_frame_rate === '30/1' && !info.streams.some(s => s.codec_type === 'audio'), 'Visual render format or silent-audio contract failed.');
  ensure(Math.abs(Number(info.format.duration) - position) <= 0.15, 'Render duration does not match the scene timeline.');
  ensure(!complete || position === 255, 'Complete visual must follow the 255-second primary timeline.');
  media(ff, ['-v', 'error', '-i', pending, '-f', 'null', '-']);
  await fs.rename(pending, output);
  const report = { kind: draft ? 'partial-draft' : preview ? 'workflow-visual-preview' : 'complete-visual-review-pending', file: outName, sourceRevision: manifests[0].sourceRevision, origin: cfg.base, seconds: Number(info.format.duration), width: v.width, height: v.height, fps: v.avg_frame_rate, videoCodec: v.codec_name, audio: 'none; awaiting human narration', bytes: Number(info.format.size), fullDecode: 'passed', selectedScenes: selected.map(s => s.id), sceneDurations: Object.fromEntries(manifests.map(m => [m.id,m.seconds])), missingScenes: scenes.filter(s => !selected.some(t => t.id === s.id)).map(s => s.id), incompleteScenes: manifests.filter(m => m.partial).map(m => ({ id: m.id, missingActions: m.missingActions })), chapters, ...gate, fullVideoPrivacyReview: 'pending', submissionReady: false };
  await writeJson(path.join(cfg.run, 'render-report.json'), report);
  const qa = path.join(cfg.run, 'qa'); await fs.mkdir(qa, { recursive: true });
  // 1 fps overview plus boundaries; visual sampling is not full human acceptance.
  media(ff, ['-v', 'error', '-y', '-i', output, '-vf', 'fps=1,scale=480:270,tile=4x5', '-q:v', '2', path.join(qa, 'overview-%02d.jpg')]);
  media(ff, ['-v', 'error', '-y', '-ss', '4', '-i', output, '-frames:v', '1', path.join(qa, 'poster.png')]);
  console.log(`Exported ${outName}: ${position}s, 1920×1080, 30 fps, silent. Entire stream decoded; full human visual/privacy review remains required.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) safeMain(main);
