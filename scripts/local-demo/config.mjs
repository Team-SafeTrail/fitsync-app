import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,join,sep} from 'node:path';
export const repoRoot=resolve(fileURLToPath(new URL('../../',import.meta.url)));
export const demoProject='fitsync-exe201-demo';
export const runtimeRoot=resolve(repoRoot,'../outputs/local-demo-runtime');
export const privateRoot=resolve(repoRoot,'../outputs/local-demo-private');
export class LocalDemoError extends Error {constructor(message){super(message);this.name='LocalDemoError';}}
export function demoConfig(source){
 if(!/^project_id\s*=\s*"fitsync-app"\s*$/m.test(source))throw new LocalDemoError('Unexpected source Supabase project ID.');
 const section=/\[db\.seed\][\s\S]*?(?=\n\[|$)/;
 if(!section.test(source))throw new LocalDemoError('Missing seed configuration.');
 return source.replace(/^project_id\s*=.*$/m,`project_id = "${demoProject}"`)
  .replace(section,block=>block.replace(/^enabled\s*=.*$/m,'enabled = false').replace(/^sql_paths\s*=.*$/m,'sql_paths = []'))
  .replace(/^openai_api_key\s*=.*$/m,'openai_api_key = ""');
}
export async function prepareRuntime(){
 const workspace=resolve(repoRoot,'..');
 if(!runtimeRoot.startsWith(workspace+sep)||!privateRoot.startsWith(workspace+sep)||runtimeRoot.startsWith(repoRoot+sep)||privateRoot.startsWith(repoRoot+sep))throw new LocalDemoError('Demo runtime must remain outside Git and inside the workspace.');
 const config=demoConfig(await readFile(join(repoRoot,'supabase','config.toml'),'utf8'));
 const names=(await readdir(join(repoRoot,'supabase','migrations'))).filter(n=>/^\d{14}_[a-z0-9_]+\.sql$/.test(n)).sort();
 const migrationDirectory=join(runtimeRoot,'supabase','migrations');
 const previous=(await readdir(migrationDirectory).catch(e=>{if(e.code==='ENOENT')return [];throw e;})).filter(n=>n.endsWith('.sql'));
 if(previous.some(n=>!names.includes(n)))throw new LocalDemoError('Runtime has an unknown migration; existing files were preserved. Review before continuing.');
 const existingConfig=await readFile(join(runtimeRoot,'supabase','config.toml'),'utf8').catch(e=>{if(e.code==='ENOENT')return null;throw e;});
 if(existingConfig!==null&&existingConfig!==config)throw new LocalDemoError('Runtime configuration differs; existing settings were preserved.');
 const files=[],copies=[];
 for(const name of names){const bytes=await readFile(join(repoRoot,'supabase','migrations',name));const sha256=createHash('sha256').update(bytes).digest('hex');if(previous.includes(name)){const old=await readFile(join(migrationDirectory,name));if(createHash('sha256').update(old).digest('hex')!==sha256)throw new LocalDemoError('Existing runtime migration differs; no files were changed.');}else copies.push({name,bytes});files.push({name,sha256});}
 await mkdir(migrationDirectory,{recursive:true});await mkdir(privateRoot,{recursive:true});
 if(existingConfig===null)await writeFile(join(runtimeRoot,'supabase','config.toml'),config);
 for(const {name,bytes} of copies)await writeFile(join(migrationDirectory,name),bytes);
 const manifest={syntheticOnly:true,projectId:demoProject,createdAt:new Date().toISOString(),source:repoRoot,migrations:files,baseSeedDisabled:true,cloudEnvCopied:false};
 await writeFile(join(runtimeRoot,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return manifest;
}
