import {spawn,spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {createServer} from 'node:net';
import {join,dirname,delimiter} from 'node:path';
import {prepareRuntime,repoRoot,runtimeRoot,privateRoot,LocalDemoError} from './config.mjs';
import {seedDemo,demoPlan} from './seed.mjs';
import {localTestEnvironment} from '../test/local-environment.mjs';

if(!process.argv.includes('--run')){
 console.log(JSON.stringify({mode:'plan-only',project:'fitsync-exe201-demo',url:'http://127.0.0.1:3000',runtimeRoot,credentialsOutsideGit:true,requiresDocker:true,cloudEnvOverwritten:false,...demoPlan}));
 process.exit(0);
}
const environment={...process.env};
if(process.platform==='win32'){
 const candidates=[join(process.env.LOCALAPPDATA??'','Programs/DockerDesktop/resources/bin/docker.exe'),join(process.env.ProgramFiles??'C:/Program Files','Docker/Docker/resources/bin/docker.exe')];
 const binary=candidates.find(p=>existsSync(p));
 if(binary){const key=Object.keys(environment).find(k=>k.toLowerCase()==='path')??'PATH';environment[key]=dirname(binary)+delimiter+(environment[key]??'');}
}
function safeCli(args,timeout=12*60*1000){
 const result=spawnSync(process.execPath,[join(repoRoot,'node_modules/supabase/dist/supabase.js'),...args,'--workdir',runtimeRoot],{cwd:repoRoot,env:environment,encoding:'utf8',timeout,maxBuffer:32e6});
 if(result.status!==0){const raw=(result.stderr??'')+(result.stdout??'');const cause=/address already in use|port.*allocated/i.test(raw)?'A required local port is already in use. Existing services were preserved.':/docker.*daemon|docker.*pipe|connect.*docker/i.test(raw)?'Docker Engine is not available. Start Docker Desktop and retry.':'The local stack command did not finish. No raw output or keys were printed.';throw new LocalDemoError(cause);}
 return result.stdout;
}
async function checkWebPort(){
 const server=createServer();await new Promise((resolve,reject)=>{server.once('error',()=>reject(new LocalDemoError('Port3000 is occupied; existing processes were not stopped.')));server.listen(3000,'127.0.0.1',resolve);});await new Promise(resolve=>server.close(resolve));
}
async function next(args,env){
 const child=spawn(process.execPath,[join(repoRoot,'node_modules/next/dist/bin/next'),...args],{cwd:join(repoRoot,'apps/web'),env,stdio:'inherit'});
 return await new Promise((resolve,reject)=>{child.once('error',()=>reject(new LocalDemoError('Cannot start the application process.')));child.once('exit',code=>resolve(code??1));process.once('SIGINT',()=>child.kill('SIGTERM'));process.once('SIGTERM',()=>child.kill('SIGTERM'));});
}
try{
 await checkWebPort();
 const docker=spawnSync('docker',['info','--format','{{.ServerVersion}}'],{env:environment,encoding:'utf8',timeout:20000,stdio:['ignore','pipe','pipe']});
 if(docker.status!==0)throw new LocalDemoError('Docker Engine is required. See project-management/LOCAL_SETUP_REVIEW.md; Windows components are not installed by this launcher.');
 const manifest=await prepareRuntime();
 console.log(`Starting isolated ${manifest.projectId}; ${manifest.migrations.length} migrations. Cloud configuration is preserved.`);
 safeCli(['start','--exclude','imgproxy,edge-runtime,logflare,vector,supavisor,realtime']);
 const status=JSON.parse(safeCli(['status','--output','json'],30000));
 const env={...environment,...localTestEnvironment(status),NEXT_PUBLIC_E2E_TEST:'false',FITSYNC_DEMO_MODE:'true',OPENAI_API_KEY:'',FITSYNC_PAYMENT_BANK:'',FITSYNC_PAYMENT_ACCOUNT_NUMBER:'',FITSYNC_PAYMENT_ACCOUNT_HOLDER:''};
 console.log('Local database ready. Creating labelled synthetic teaching data; credentials remain private.');
 await seedDemo(env);
 console.log('Building the actual application against the isolated local stack.');
 if(await next(['build'],env)!==0)throw new LocalDemoError('Application build failed; no successful demo is claimed.');
 console.log(`FitSync local: http://127.0.0.1:3000 · Database: http://127.0.0.1:54323`);
 console.log(`Private demo access: ${join(privateRoot,'LOCAL_DEMO_ACCESS.html')}`);
 console.log('Synthetic dataset only. Ctrl+C stops this web process; database volumes are preserved.');
 process.exitCode=await next(['start','--hostname','127.0.0.1','--port','3000'],env);
}catch(error){console.error(error instanceof LocalDemoError?error.message:'Local demo failed; raw details suppressed.');process.exitCode=1;}
