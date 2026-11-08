// Isolated technical check. Fake browser audio is never a presenter recording.
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createStudio } from './server.mjs';
import { chromium, expect, root } from '../common.mjs';

const dataDir=path.join(root,'.video-private','studio-test-'+randomUUID()),checks=[];
const studio=await createStudio({dataDir,port:3118,testMode:true});
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
try{
  const context=await browser.newContext({viewport:{width:1600,height:1100},permissions:['microphone']});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(studio.url);await expect(page.getByRole('heading',{name:'Đọc theo chữ. Còn lại để phòng thu lo.'})).toBeVisible();
  await page.screenshot({path:path.join(dataDir,'ui-desktop.png'),fullPage:true});checks.push('Vietnamese UI loads');
  const config=await(await fetch(studio.url+'/api/config')).json();
  const headers={'Content-Type':'application/json','Origin':studio.url,'X-Studio-Token':config.token};
  const denied=await fetch(studio.url+'/api/render',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(denied.status!==403)throw Error('Local write protection failed');checks.push('untrusted POST rejected');
  const ranged=await fetch(studio.url+'/media/video',{headers:{Range:'bytes=0-1023'}});if(ranged.status!==206||(await ranged.arrayBuffer()).byteLength!==1024)throw Error('Video range failed');checks.push('video range playback');
  await page.locator('#autoExport').uncheck();await page.locator('#sectionMode').click();await page.locator('#recordButton').click();await expect(page.locator('#recordStatus')).toContainText('Đang thu',{timeout:15000});await page.waitForTimeout(1800);await page.locator('#stopButton').click();
  async function waitReady(key){for(let i=0;i<150;i++){const state=await(await fetch(studio.url+'/api/status')).json();const take=state.takes[key]?.find(t=>t.id===state.selected[key]);if(take?.status==='ready')return {state,take};if(state.takes[key]?.at(-1)?.status==='error')throw Error(state.takes[key].at(-1).error);await new Promise(r=>setTimeout(r,300));}throw Error('Audio processing timeout');}
  const ready=await waitReady('01-landing');if(ready.take.seconds<1)throw Error('Recorder did not produce real audio samples');checks.push('browser MediaRecorder → saved raw → filtered WAV');
  await page.locator('#takes').getByRole('button',{name:'Nghe lại'}).click();await expect.poll(()=>page.locator('#playback').evaluate(a=>a.readyState)).toBeGreaterThan(1);checks.push('processed take plays in browser');
  const privateState=JSON.parse(await fs.readFile(path.join(dataDir,'state.json'),'utf8')),raw=await fs.readFile(privateState.takes['01-landing'][0].raw);
  async function upload(key){const r=await fetch(studio.url+'/api/recordings/'+key,{method:'POST',headers:{...headers,'Content-Type':'audio/webm'},body:raw});if(r.status!==202)throw Error('Fixture upload failed');await waitReady(key);}
  await upload('full');
  const render=await fetch(studio.url+'/api/render',{method:'POST',headers,body:JSON.stringify({mode:'full',clean:true,music:true,musicVolume:0.04})}),job=await render.json();if(render.status!==202)throw Error(job.error||'Render did not start');
  let completed;for(let i=0;i<300;i++){const value=await(await fetch(studio.url+'/api/jobs/'+job.id)).json();if(value.status==='ready'){completed=value;break;}if(value.status==='error')throw Error(value.message);await new Promise(r=>setTimeout(r,500));}
  if(!completed||completed.seconds<234.9||completed.width!==1920||completed.fullDecode!=='passed')throw Error('MP4 contract failed');checks.push('voice + ducked original music + MP4 full decode');
  const exported=await fetch(studio.url+'/media/export/'+job.id,{headers:{Range:'bytes=0-1023'}});if(exported.status!==206)throw Error('Export playback failed');checks.push('export range/download');
  await page.locator('#recordButton').click();await page.waitForTimeout(650);await page.locator('#stopButton').click();await page.waitForTimeout(3200);if(await page.locator('#recordStatus').textContent()==='Đang thu · đọc bằng giọng tự nhiên')throw Error('Cancelled countdown started recording');checks.push('cancelled countdown does not record');
  for(const section of config.sections.slice(1))await upload(section.id);
  const sectionResponse=await fetch(studio.url+'/api/render',{method:'POST',headers,body:JSON.stringify({mode:'sections',clean:true,music:true,musicVolume:0.04})});const sectionJob=await sectionResponse.json();if(sectionResponse.status!==202)throw Error(sectionJob.error||'Section render did not start');
  let sectionsReady;for(let i=0;i<450;i++){const value=await(await fetch(studio.url+'/api/jobs/'+sectionJob.id)).json();if(value.status==='ready'){sectionsReady=value;break;}if(value.status==='error')throw Error(value.message);await new Promise(r=>setTimeout(r,500));}
  if(!sectionsReady||Math.abs(sectionsReady.seconds-235)>0.2)throw Error('Section synchronization failed');checks.push('nine-section recording synchronization and full MP4 decode');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(dataDir,'ui-mobile.png'),fullPage:true});if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))throw Error('Mobile overflow');checks.push('mobile has no horizontal overflow');
  if(errors.length)throw Error('Unexpected browser exception');await fs.writeFile(path.join(dataDir,'checks.json'),JSON.stringify({checks,fixtureOnly:true,presenterVoiceGenerated:false,outputSeconds:completed.seconds,browserErrors:0},null,2));
  console.log(JSON.stringify({checks,fixtureOnly:true,presenterVoiceGenerated:false,dataDir},null,2));await context.close();
}finally{await browser.close();await new Promise(r=>studio.server.close(r));}
