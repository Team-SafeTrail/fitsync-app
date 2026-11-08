import http from 'node:http';
import fs from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, randomBytes } from 'node:crypto';
import { cleanAudio, renderNarration, composeMusic } from './audio.mjs';

const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../..');
const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1];};
async function exists(file){return fs.access(file).then(()=>true,()=>false);}
async function tool(env,name,portable){if(process.env[env])return process.env[env];if(await exists(portable))return portable;return name;}
export async function createStudio({run=path.resolve(root,'outputs/video/production-draft-02'),dataDir,port=3117,testMode=false}={}){
  run=path.resolve(run);dataDir=path.resolve(dataDir||path.join(run,'voice-studio'));
  const report=JSON.parse(await fs.readFile(path.join(run,'render-report.json'),'utf8'));
  if(!['workflow-visual-preview','complete-visual-review-pending'].includes(report.kind))throw new Error('Cần video walkthrough đã có đầy đủ dòng thời gian.');
  const video=path.resolve(run,report.file);if(path.dirname(video)!==run)throw new Error('Đường dẫn video không hợp lệ.');
  const tools={ff:await tool('FFMPEG','ffmpeg','D:/CodexArtifacts/fitsync-video-tools/runtime/node_modules/ffmpeg-static/ffmpeg.exe'),probe:await tool('FFPROBE','ffprobe','D:/CodexArtifacts/fitsync-video-tools/runtime/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe')};
  const script=JSON.parse(await fs.readFile(path.join(here,'script-vi.json'),'utf8'));let start=0;
  const sections=script.map(s=>{const seconds=report.sceneDurations?.[s.id];if(!seconds)throw new Error('Thiếu thời lượng cảnh.');const v={...s,start,seconds};start+=seconds;return v;});
  await fs.mkdir(dataDir,{recursive:true});const stateFile=path.join(dataDir,'state.json');
  let state={takes:{},selected:{},exports:[],script:{}};try{state={...state,...JSON.parse(await fs.readFile(stateFile,'utf8'))};}catch{}
  let saveQueue=Promise.resolve();const save=()=>{saveQueue=saveQueue.then(async()=>{await fs.writeFile(stateFile+'.tmp',JSON.stringify(state,null,2));await fs.rename(stateFile+'.tmp',stateFile);});return saveQueue;};
  const jobs=new Map(),processing=new Set(),token=randomBytes(24).toString('hex');let rendering=false;
  const validKey=id=>id==='full'||sections.some(s=>s.id===id);
  const publicState=()=>({takes:Object.fromEntries(Object.entries(state.takes).map(([id,takes])=>[id,takes.map(({raw,clean,...t})=>t)])),selected:state.selected,exports:state.exports.map(({file,...entry})=>entry),processing:[...processing],rendering});
  const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));};
  const body=async(req,limit=65536)=>{let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>limit)throw new Error('Tệp quá lớn. Hãy thu từng đoạn.');chunks.push(chunk);}return Buffer.concat(chunks);};
  const bodyJson=async req=>JSON.parse((await body(req)).toString('utf8'));
  async function sendFile(req,res,file,type,download){
    const stat=await fs.stat(file);const range=req.headers.range;let begin=0,end=stat.size-1,status=200;
    if(range){const m=/^bytes=(\d*)-(\d*)$/.exec(range);if(!m){res.writeHead(416);res.end();return;}
      if(!m[1]){begin=Math.max(0,stat.size-Number(m[2]));}else{begin=Number(m[1]);if(m[2])end=Math.min(end,Number(m[2]));}
      if(begin>end||begin<0||begin>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}status=206;
    }
    const headers={'Content-Type':type,'Content-Length':end-begin+1,'Accept-Ranges':'bytes'};if(status===206)headers['Content-Range']=`bytes ${begin}-${end}/${stat.size}`;if(download)headers['Content-Disposition']=`attachment; filename="${download}"`;
    res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return;}createReadStream(file,{start:begin,end}).on('error',()=>res.destroy()).pipe(res);
  }
  const server=http.createServer(async(req,res)=>{
    res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');
    const host=req.headers.host||'',allowedHosts=[`127.0.0.1:${server.address()?.port}`,`localhost:${server.address()?.port}`];
    if(!allowedHosts.includes(host)){json(res,403,{error:'Chỉ sử dụng phòng thu trên máy này.'});return;}
    try{
      const url=new URL(req.url,`http://${host}`),p=url.pathname;
      if(req.method==='POST'){
        if(req.headers['x-studio-token']!==token||!allowedHosts.some(h=>req.headers.origin===`http://${h}`)){json(res,403,{error:'Phiên phòng thu đã thay đổi. Hãy tải lại trang.'});return;}
      }
      if(req.method==='GET'&&p==='/api/config'){json(res,200,{token,sections:sections.map(s=>({...s,text:state.script[s.id]||s.text})),seconds:report.seconds,testMode});return;}
      if(req.method==='GET'&&p==='/api/status'){json(res,200,publicState());return;}
      if((req.method==='GET'||req.method==='HEAD')&&p==='/media/video'){await sendFile(req,res,video,'video/mp4');return;}
      if(req.method==='GET'&&p==='/media/music'){const music=path.join(dataDir,'ambient.wav');await composeMusic(music);await sendFile(req,res,music,'audio/wav');return;}
      if(req.method==='POST'&&p==='/api/script'){
        const {id,text}=await bodyJson(req);if(!sections.some(s=>s.id===id)||typeof text!=='string'||!text.trim()||text.length>10000)throw new Error('Đoạn lời đọc không hợp lệ.');state.script[id]=text.trim();await save();json(res,200,{ok:true});return;
      }
      const upload=/^\/api\/recordings\/([a-z0-9-]+)$/.exec(p);
      if(req.method==='POST'&&upload){
        const key=upload[1];if(!validKey(key))throw new Error('Không tìm thấy đoạn thu.');if(processing.has(key))throw new Error('Đoạn này đang được lưu và lọc âm thanh.');
        const mime=(req.headers['content-type']||'').split(';')[0],ext={'audio/webm':'webm','audio/ogg':'ogg','audio/mp4':'m4a','audio/wav':'wav','audio/x-wav':'wav'}[mime];if(!ext)throw new Error('Trình duyệt chưa gửi định dạng âm thanh được hỗ trợ.');
        const rawData=await body(req,64*1024*1024);if(rawData.length<100)throw new Error('Chưa nhận được âm thanh. Hãy kiểm tra micro.');
        const id=Date.now().toString(36)+'-'+randomUUID().slice(0,8),dir=path.join(dataDir,'recordings',key);await fs.mkdir(dir,{recursive:true});const raw=path.join(dir,id+'.'+ext),clean=path.join(dir,id+'.wav');await fs.writeFile(raw,rawData);
        const take={id,key,raw,clean,status:'processing',createdAt:new Date().toISOString(),fixture:testMode};(state.takes[key]??=[]).push(take);processing.add(key);await save();json(res,202,{id,key});
        void (async()=>{try{Object.assign(take,await cleanAudio(raw,clean,tools),{status:'ready'});state.selected[key]=id;}catch(error){take.status='error';take.error=error.message;}finally{processing.delete(key);await save();}})();return;
      }
      if(req.method==='POST'&&p==='/api/select'){
        const {key,id}=await bodyJson(req);if(!validKey(key)||!state.takes[key]?.some(t=>t.id===id&&t.status==='ready'))throw new Error('Bản thu chưa sẵn sàng.');state.selected[key]=id;await save();json(res,200,{ok:true});return;
      }
      const audio=/^\/media\/audio\/([a-z0-9-]+)\/([a-z0-9-]+)$/.exec(p);
      if((req.method==='GET'||req.method==='HEAD')&&audio){const take=state.takes[audio[1]]?.find(t=>t.id===audio[2]);if(!take)throw new Error('Không tìm thấy bản thu.');const clean=url.searchParams.get('clean')!=='0';await sendFile(req,res,clean?take.clean:take.raw,clean?'audio/wav':'audio/'+path.extname(take.raw).slice(1),url.searchParams.has('download')?`FitSync-${audio[1]}-${clean?'loc-am.wav':'goc.'+path.extname(take.raw).slice(1)}`:undefined);return;}
      if(req.method==='POST'&&p==='/api/render'){
        if(rendering||processing.size)throw new Error('Đang xử lý âm thanh. Bạn chờ xong rồi xuất video nhé.');const request=await bodyJson(req),mode=request.mode==='sections'?'sections':'full';
        const keys=mode==='full'?['full']:sections.map(s=>s.id),takes={};for(const key of keys){const take=state.takes[key]?.find(t=>t.id===state.selected[key]&&t.status==='ready');if(!take)throw new Error(mode==='full'?'Bạn cần thu toàn bài trước khi xuất.':'Bạn cần thu đủ 9 đoạn trước khi xuất.');takes[key]=take;}
        const options={clean:request.clean!==false,music:request.music!==false,musicVolume:Math.max(0,Math.min(0.15,Number.isFinite(Number(request.musicVolume))?Number(request.musicVolume):0.04)),voiceGain:Math.max(0.5,Math.min(1.8,Number(request.voiceGain)||1))};
        const id=Date.now().toString(36)+'-'+randomUUID().slice(0,8),job={id,status:'processing',progress:2,message:'Đang chuẩn bị bản xuất…',fixture:testMode};jobs.set(id,job);rendering=true;json(res,202,job);
        void(async()=>{try{
          const work=path.join(dataDir,'renders',id),name=testMode?'TEST-AUDIO-ONLY-EXPORT.mp4':'FitSync-Product-Walkthrough-voiceover.mp4',output=path.join(work,name);
          const result=await renderNarration({video,report,sections,takes,mode,options,work,output,tools,progress:(value,message)=>Object.assign(job,{progress:value,message})});
          Object.assign(job,{status:'ready',progress:100,message:'Video có giọng đọc đã sẵn sàng.',...result});state.exports.push({id,file:output,name,seconds:result.seconds,mode,createdAt:new Date().toISOString(),fixture:testMode,...result});await save();await fs.writeFile(path.join(work,'export-report.json'),JSON.stringify({...result,mode,options,humanVoiceSource:!testMode,fixture:testMode,uploaded:false},null,2));
        }catch(error){Object.assign(job,{status:'error',message:error.message});}finally{rendering=false;}})();return;
      }
      const job=/^\/api\/jobs\/([a-z0-9-]+)$/.exec(p);if(req.method==='GET'&&job){const value=jobs.get(job[1]);if(!value)throw new Error('Không tìm thấy tác vụ xuất.');json(res,200,value);return;}
      const exported=/^\/media\/export\/([a-z0-9-]+)$/.exec(p);if((req.method==='GET'||req.method==='HEAD')&&exported){const entry=state.exports.find(e=>e.id===exported[1]);if(!entry)throw new Error('Không tìm thấy video đã xuất.');await sendFile(req,res,entry.file,'video/mp4',url.searchParams.has('download')?entry.name:undefined);return;}
      const publicFiles={'/':'index.html','/app.js':'app.js','/style.css':'style.css'};if(req.method==='GET'&&publicFiles[p]){const ext=path.extname(publicFiles[p]);res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[ext]});res.end(await fs.readFile(path.join(here,publicFiles[p])));return;}
      json(res,404,{error:'Không tìm thấy trang này.'});
    }catch(error){if(!res.headersSent)json(res,400,{error:error instanceof SyntaxError?'Dữ liệu gửi lên chưa hợp lệ.':error.message?.includes('ENOENT')?'Tệp chưa sẵn sàng. Hãy chờ xử lý xong.':error.message||'Có lỗi xử lý. Bản thu đã lưu không bị xóa.'});else res.destroy();}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
  return {server,url:`http://127.0.0.1:${server.address().port}`,dataDir};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  createStudio({run:path.resolve(arg('--run',path.join(root,'outputs/video/production-draft-02'))),dataDir:arg('--data-dir'),port:Number(arg('--port','3117')),testMode:process.argv.includes('--test-mode')}).then(studio=>console.log(`Phòng thu FitSync: ${studio.url}`)).catch(()=>{console.error('Không mở được phòng thu. Kiểm tra video nguồn hoặc chọn cổng khác.');process.exitCode=1;});
}
