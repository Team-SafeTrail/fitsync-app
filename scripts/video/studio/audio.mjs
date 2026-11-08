import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

export async function command(exe,args,onProgress){
  return new Promise((resolve,reject)=>{
    const child=spawn(exe,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});
    let stdout='',stderr='';
    child.stdout.on('data',chunk=>{stdout+=chunk.toString();if(stdout.length>4e6)stdout=stdout.slice(-2e6);onProgress?.(chunk.toString());});
    child.stderr.on('data',chunk=>{stderr+=chunk.toString();if(stderr.length>4e6)stderr=stderr.slice(-2e6);});
    child.on('error',()=>reject(new Error('Không khởi chạy được công cụ âm thanh.')));
    child.on('close',code=>code===0?resolve({stdout,stderr}):reject(new Error('Không xử lý được tệp âm thanh/video này. Bản gốc vẫn được giữ.')));
  });
}
export async function inspect(file,tools){return JSON.parse((await command(tools.probe,['-v','error','-show_streams','-show_format','-of','json',file])).stdout);}
export async function cleanAudio(raw,clean,tools){
  const info=await inspect(raw,tools);
  if(!info.streams.some(s=>s.codec_type==='audio')||info.streams.some(s=>s.codec_type==='video'))throw new Error('Tệp thu cần chỉ chứa âm thanh.');
  const filtered=clean+'.filtered.wav';
  await command(tools.ff,['-v','error','-y','-i',raw,'-vn','-t','361','-af','highpass=f=75,lowpass=f=12000,afftdn=nr=8:nf=-45','-ar','48000','-ac','1','-c:a','pcm_s16le',filtered]);
  const seconds=Number((await inspect(filtered,tools)).format.duration);
  if(!Number.isFinite(seconds)||seconds<0.4||seconds>360)throw new Error('Bản thu cần dài từ nửa giây đến sáu phút. Bản gốc vẫn được giữ.');
  const measured=await command(tools.ff,['-hide_banner','-i',filtered,'-af','volumedetect','-f','null','-']);
  const mean=Number(measured.stderr.match(/mean_volume:\s*(-?[\d.]+)/)?.[1]??-90),peak=Number(measured.stderr.match(/max_volume:\s*(-?[\d.]+)/)?.[1]??-90);
  const gain=Math.min(9,Math.max(-6,-21-mean),-1.5-peak);
  await command(tools.ff,['-v','error','-y','-i',filtered,'-af',`volume=${gain}dB`,'-c:a','pcm_s16le',clean]);
  return {seconds,meanDb:mean,peakDb:peak,gainDb:gain,quiet:mean< -48,processing:'lọc nhẹ, chỉnh mức âm cố định; không đổi tốc độ/cao độ'};
}
export async function composeMusic(file){
  try{await fs.access(file);return;}catch{}
  const rate=24000,seconds=32,count=rate*seconds,signal=new Float64Array(count*2);
  const chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,57,62]];
  const hz=m=>440*2**((m-69)/12);
  for(let bar=0;bar<4;bar++)for(let beat=0;beat<8;beat++){
    const midi=chords[bar][beat%4]+12,start=(bar*8+beat)*rate,f=hz(midi),pan=(beat%2?0.62:0.38);
    for(let j=0;j<rate*3.4;j++){
      const t=j/rate,envelope=Math.min(1,t/0.012)*Math.exp(-1.65*t),v=(Math.sin(2*Math.PI*f*t)+0.18*Math.sin(4*Math.PI*f*t)+0.05*Math.sin(6*Math.PI*f*t))*envelope*0.16;
      const i=((start+j)%count)*2;signal[i]+=v*(1-pan);signal[i+1]+=v*pan;
    }
  }
  let maximum=0;for(const value of signal)maximum=Math.max(maximum,Math.abs(value));
  const buffer=Buffer.alloc(44+count*4);buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(count*4,40);
  for(let i=0;i<signal.length;i++)buffer.writeInt16LE(Math.round(signal[i]/maximum*0.65*32767),44+i*2);
  await fs.writeFile(file,buffer);
}
export async function renderNarration({video,report,sections,takes,mode,options,work,output,tools,progress}){
  await fs.mkdir(work,{recursive:true});let videoInput=video,voiceInput,seconds=report.seconds;
  if(mode==='full'){
    const take=takes.full;voiceInput=options.clean?take.clean:take.raw;seconds=Math.max(report.seconds,take.seconds);
  }else{
    const audioList=[],videoList=[];let position=0;seconds=0;
    for(let i=0;i<sections.length;i++){
      const section=sections[i],take=takes[section.id],duration=Math.max(section.seconds,take.seconds),tag=String(i).padStart(2,'0'),a=path.join(work,tag+'.wav'),v=path.join(work,tag+'.mp4');
      await command(tools.ff,['-v','error','-y','-i',options.clean?take.clean:take.raw,'-af','apad','-t',String(duration),'-ar','48000','-ac','1','-c:a','pcm_s16le',a]);
      await command(tools.ff,['-v','error','-y','-ss',String(position),'-i',video,'-t',String(duration),'-an','-vf',`trim=duration=${section.seconds},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${Math.max(0,duration-section.seconds)}`,'-c:v','libx264','-preset','fast','-crf','18','-threads','2','-pix_fmt','yuv420p','-r','30',v]);
      audioList.push(`file '${tag}.wav'`);videoList.push(`file '${tag}.mp4'`);position+=section.seconds;seconds+=duration;progress(10+(i+1)/sections.length*45,'Đang khớp giọng với từng cảnh…');
    }
    await fs.writeFile(path.join(work,'audio.txt'),audioList.join('\n'));await fs.writeFile(path.join(work,'video.txt'),videoList.join('\n'));
    voiceInput=path.join(work,'voice.wav');videoInput=path.join(work,'visual.mp4');
    await command(tools.ff,['-v','error','-y','-f','concat','-safe','1','-i',path.join(work,'audio.txt'),'-c:a','pcm_s16le',voiceInput]);
    await command(tools.ff,['-v','error','-y','-f','concat','-safe','1','-i',path.join(work,'video.txt'),'-c','copy',videoInput]);
  }
  if(seconds>300)throw new Error('Giọng đọc khiến video vượt 5 phút. Hãy thu lại đoạn dài hơn dự kiến; hệ thống không tăng tốc giọng.');
  progress(62,'Đang ghép giọng và nhạc nền…');
  const music=path.join(work,'ambient.wav');await composeMusic(music);
  const args=['-v','error','-y','-i',videoInput,'-i',voiceInput];if(options.music)args.push('-stream_loop','-1','-i',music);
  const voice=`[1:a]apad,atrim=duration=${seconds},asetpts=PTS-STARTPTS,volume=${options.voiceGain}`;
  const filter=options.music?`${voice},asplit=2[v][key];[2:a]atrim=duration=${seconds},asetpts=PTS-STARTPTS,volume=${options.musicVolume},afade=t=in:st=0:d=1,afade=t=out:st=${Math.max(0,seconds-2)}:d=2[m];[m][key]sidechaincompress=threshold=0.025:ratio=6:attack=20:release=350[bed];[v][bed]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95:level=0[out]`:`${voice},alimiter=limit=0.95:level=0[out]`;
  args.push('-filter_complex',filter,'-map','0:v:0','-map','[out]');
  if(mode==='full'&&seconds>report.seconds+0.03)args.push('-vf',`tpad=stop_mode=clone:stop_duration=${seconds-report.seconds}`,'-c:v','libx264','-preset','fast','-crf','18','-threads','2','-pix_fmt','yuv420p');else args.push('-c:v','copy');
  args.push('-t',String(seconds),'-c:a','aac','-b:a','192k','-movflags','+faststart',output);await command(tools.ff,args);
  progress(92,'Đang kiểm tra toàn bộ tệp xuất…');const info=await inspect(output,tools),v=info.streams.find(s=>s.codec_type==='video');
  if(!v||v.width!==1920||v.height!==1080||!info.streams.some(s=>s.codec_type==='audio')||Math.abs(Number(info.format.duration)-seconds)>0.25)throw new Error('Tệp xuất chưa đạt cấu hình hình/âm thanh. Bản thu gốc vẫn được giữ.');
  await command(tools.ff,['-v','error','-i',output,'-f','null','-']);
  return {seconds:Number(info.format.duration),width:v.width,height:v.height,fullDecode:'passed',speedOrPitchChanged:false,sourceKind:report.kind,submissionReady:false};
}
