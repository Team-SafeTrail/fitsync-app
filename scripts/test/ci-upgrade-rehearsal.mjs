import {spawnSync} from "node:child_process";
import {mkdtemp,readdir,rename,readFile} from "node:fs/promises";
import {isAbsolute,join,resolve,sep} from "node:path";

// Disposable CI only. Never accepts a database URL/project ref from a caller.
if(process.env.GITHUB_ACTIONS!=="true"||!process.env.GITHUB_ENV||!process.env.RUNNER_TEMP||!isAbsolute(process.env.RUNNER_TEMP)) throw new Error("Upgrade rehearsal is restricted to an ephemeral GitHub runner.");
const directory=resolve("supabase/migrations");
const baseline="20261002150000_fix_m4_ocr_backend_gates.sql";
const files=(await readdir(directory)).filter(name=>name.endsWith(".sql")&&name>baseline).sort();
if(!files.length) throw new Error("No additive migrations found for upgrade rehearsal.");
const held=await mkdtemp(join(process.env.RUNNER_TEMP,"fitsync-upgrade-"));
const project=/^project_id\s*=\s*"([a-zA-Z0-9_-]+)"/m.exec(await readFile("supabase/config.toml","utf8"))?.[1];
if(!project) throw new Error("Cannot resolve the disposable local container.");
function run(command,args) {
 const result=spawnSync(command,args,{stdio:"inherit",timeout:15*60*1000});
 if(result.status!==0) throw new Error("Disposable upgrade command failed.");
}
function fingerprint() {
 const tables=["profiles","pt_profiles","trainee_profiles","trainee_invitations","inbody_records","checkins","meal_logs","ocr_attempts"];
 const sql=tables.map(name=>`select '${name}',count(*),md5(coalesce(jsonb_agg(to_jsonb(t) order by id)::text,'')) from public.${name} t`).join(";");
 const result=spawnSync("docker",["exec",`supabase_db_${project}`,"psql","-U","postgres","-d","postgres","-At","-c",sql],{encoding:"utf8",timeout:30000,maxBuffer:1024*1024});
 if(result.status!==0) throw new Error("Cannot fingerprint the disposable baseline.");
 return result.stdout;
}
const moved=[];let before;
try {
 for(const name of files) {
  const source=resolve(directory,name);
  if(!source.startsWith(directory+sep)) throw new Error("Migration path escaped workspace.");
  await rename(source,join(held,name));moved.push(name);
 }
 run(process.execPath,["scripts/test/ci-local-supabase.mjs"]);
 before=fingerprint();
} finally {
 for(const name of moved) await rename(join(held,name),join(directory,name));
}
run(process.execPath,["node_modules/supabase/dist/supabase.js","migration","up","--local"]);
if(before!==fingerprint()) throw new Error("Upgrade changed legacy row contents or counts.");
console.log(`Upgrade from five-migration baseline applied ${files.length} additive migrations; all legacy row fingerprints unchanged.`);
