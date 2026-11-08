import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { config, json, launch, contextOptions, ensure, writeJson, safeMain } from './common.mjs';

safeMain(async () => {
  const cfg = config(), report = await json(path.join(cfg.run, 'render-report.json'));
  const data = await fs.readFile(path.join(cfg.run, report.file));
  const server = http.createServer((req, res) => {
    if (req.url === '/video.mp4') { res.writeHead(200, { 'Content-Type': 'video/mp4', 'Content-Length': data.length }); res.end(data); }
    else if (req.url === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end('<!doctype html><title>Private local video review</title><style>body{margin:0;background:#0E0E12}video{width:100vw;height:100vh;object-fit:contain}</style><video src="/video.mp4" muted playsinline></video>'); }
    else { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await launch(cfg);
    const page = await browser.newPage(contextOptions());
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(() => {
      window.reviewPlayback = new Promise((resolve, reject) => {
        const video = document.querySelector('video');
        let updates = 0, lastTime = 0, maximumTime = 0;
        video.addEventListener('timeupdate', () => { updates++; lastTime = video.currentTime; maximumTime = Math.max(maximumTime, lastTime); });
        video.addEventListener('error', () => reject(new Error('Video playback failed.')));
        video.addEventListener('ended', () => resolve({ ended: true, seconds: video.duration, maximumTime, timeUpdates: updates, frames: video.getVideoPlaybackQuality().totalVideoFrames, droppedFrames: video.getVideoPlaybackQuality().droppedVideoFrames, playbackRate: video.playbackRate }));
        video.play().catch(reject);
      });
    });
    const result = await Promise.race([
      page.evaluate(() => window.reviewPlayback),
      new Promise((_, reject) => { const timeout = setTimeout(() => reject(new Error('Playback review timed out.')), (report.seconds + 30) * 1000); timeout.unref(); }),
    ]);
    ensure(result.ended && result.playbackRate === 1 && Math.abs(result.seconds - report.seconds) < 0.2 && result.maximumTime > report.seconds - 1, 'The complete export did not play from beginning to end at normal speed.');
    await writeJson(path.join(cfg.run, 'qa/browser-playback.json'), { ...result, automatedOnly: true, humanPrivacyReview: 'pending', observedAt: new Date().toISOString() });
    console.log(`Entire ${report.seconds}-second export played at 1× in a fresh Chromium context. Human acceptance remains pending.`);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
