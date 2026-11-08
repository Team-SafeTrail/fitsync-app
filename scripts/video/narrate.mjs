import fs from 'node:fs/promises';
import path from 'node:path';
import { config, scenes, argument, ensure, json, media, probe, writeJson, safeMain } from './common.mjs';

safeMain(async () => {
  const cfg = config(), folder = argument('--voiceover-dir'), reviewFile = argument('--review');
  ensure(folder && reviewFile, 'Supply --voiceover-dir and --review for actual human narration and completed visual/privacy review.');
  const report = await json(path.join(cfg.run, 'render-report.json')), review = await json(reviewFile);
  const preview = process.argv.includes('--workflow-preview');
  ensure(preview ? report.kind === 'workflow-visual-preview' && report.missingScenes.length === 0 : report.kind === 'complete-visual-review-pending' && report.finalGatesVerified && report.missingScenes.length === 0, 'Use the matching reviewed visual mode; a preview cannot be promoted to FINAL.');
  ensure(review.file === report.file && review.fullVideoWatched === true && review.privacyPassed === true && review.claimsPassed === true && review.humanVoiceRecorded === true && review.reviewer && review.reviewedAt, 'Record actual full-length visual/privacy review and human voice attestation before FINAL.');
  const work = path.join(cfg.run, '.voice'); await fs.mkdir(work, { recursive: true });
  const ff = process.env.FFMPEG || 'ffmpeg';
  // Validate every human section before transcoding any audio.
  const inputs = scenes.map(s => ({ ...s, seconds: preview ? report.sceneDurations[s.id] : s.seconds, file: path.join(path.resolve(folder), `${s.id}.wav`) }));
  for (const input of inputs) {
    const info = probe(input.file);
    ensure(info.streams.some(s => s.codec_type === 'audio'), 'A supplied narration file has no audio stream.');
    ensure(Number(info.format.duration) <= input.seconds, `Human narration for ${input.id} exceeds its slot. Re-time the visual edit; do not speed up or truncate speech.`);
  }
  const output = path.join(cfg.run, preview ? 'FitSync-Product-Walkthrough-narrated-preview.mp4' : 'FitSync-Product-Walkthrough-FINAL.mp4');
  ensure(!await fs.access(output).then(() => true, () => false), 'FINAL already exists; preserve it before another render.');
  for (const input of inputs) media(ff, ['-v', 'error', '-y', '-i', input.file, '-af', 'apad', '-t', String(input.seconds), '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', path.join(work, `${input.id}.wav`)]);
  await fs.writeFile(path.join(work, 'audio.txt'), inputs.map(i => `file '${i.id}.wav'`).join('\n') + '\n');
  media(ff, ['-v', 'error', '-y', '-f', 'concat', '-safe', '1', '-i', 'audio.txt', '-c:a', 'pcm_s16le', 'voiceover.wav'], work);
  media(ff, ['-v', 'error', '-y', '-i', path.join(cfg.run, report.file), '-i', path.join(work, 'voiceover.wav'), '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', output]);
  const info = probe(output);
  ensure(Math.abs(Number(info.format.duration) - report.seconds) < 0.2 && info.streams.some(s => s.codec_type === 'audio'), 'Narrated media contract failed.');
  media(ff, ['-v', 'error', '-i', output, '-f', 'null', '-']);
  await writeJson(path.join(cfg.run, 'narration-report.json'), { file: path.basename(output), humanVoiceAttested: true, seconds: Number(info.format.duration), fullDecode: 'passed', fullNarratedPlaybackReview: 'pending', uploaded: false, submissionReady: false });
  console.log('Human sections synced without pitch/speed changes, compression or music. Watch the entire narrated export before accepting or uploading.');
});
