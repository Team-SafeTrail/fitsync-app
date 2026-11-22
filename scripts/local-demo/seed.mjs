import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash,randomBytes,randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {repoRoot,privateRoot,demoProject,LocalDemoError} from './config.mjs';
import {localTestEnvironment} from '../test/local-environment.mjs';
import {simulationPdf} from './simulation-pdf.mjs';
const require=createRequire(join(repoRoot,'apps/web/package.json'));
const {createClient}=require('@supabase/supabase-js');
export const demoPlan={syntheticOnly:true,ptAccounts:20,learnerAccounts:8,adminAccounts:1,illustrativeIncomeVnd:3980000,illustrativeCostVnd:3339800,illustrativeCashResultVnd:640200,actualRevenueCreatedVnd:0,actualPayingCustomersCreated:0};
const namespace='exe201-local-demo-v1';
const stableId=label=>{const h=createHash('sha256').update(namespace+label).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20,32)}`;};
function checked(result,label){if(result.error)throw new LocalDemoError(`${label} failed (${result.error.code??result.error.status??'unknown'}); details suppressed.`);return result.data;}
const isoDay=value=>new Date(Date.parse(value)+7*3600000).toISOString().slice(0,10);
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export async function seedDemo(environment){
 const env=localTestEnvironment({API_URL:environment.NEXT_PUBLIC_SUPABASE_URL,PUBLISHABLE_KEY:environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,SERVICE_ROLE_KEY:environment.SUPABASE_SERVICE_ROLE_KEY});
 if(environment.FITSYNC_E2E_LOCAL_DB!=='true')throw new LocalDemoError('Explicit isolated loopback flag required before seeding.');
 const options={auth:{persistSession:false,autoRefreshToken:false}};
 const service=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,options);
 const actual=checked(await service.from('finance_entries').select('id').eq('is_test',false).limit(1),'Check actual ledger');
 if(actual.length)throw new LocalDemoError('This local database contains actual finance entries. Preserve it and use a dedicated demo stack.');
 await mkdir(privateRoot,{recursive:true});
 const file=join(privateRoot,'credentials.json');
 let state=JSON.parse(await readFile(file,'utf8').catch(e=>{if(e.code==='ENOENT')return '{}';throw e;}));
 if(state.namespace&&state.namespace!==namespace)throw new LocalDemoError('Unknown private manifest; preserved.');
 state={namespace,api:env.NEXT_PUBLIC_SUPABASE_URL,project:demoProject,createdAt:new Date().toISOString(),accounts:{},...state};
 if(state.api!==env.NEXT_PUBLIC_SUPABASE_URL)throw new LocalDemoError('Private manifest belongs to another environment.');
 const save=()=>writeFile(file,JSON.stringify(state,null,2)+'\n');
 const users=checked(await service.auth.admin.listUsers({page:1,perPage:1000}),'List local fixture identities').users;
 const account=async(label,role,name)=>{
  const email=`demo.exe201.${label}@example.test`,existing=users.find(u=>u.email===email);
  if(existing&&existing.user_metadata?.demo_namespace!==namespace)throw new LocalDemoError('Fixture email belongs to an unverified account; preserved.');
  let entry=state.accounts[label];
  if(existing){if(!entry||entry.id!==existing.id)throw new LocalDemoError('Existing demo identity has no matching private manifest; password was not changed.');}
  else{const password=`Demo-${randomBytes(18).toString('base64url')}aA1!`;const data=checked(await service.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:name,role:role==='pt'?'pt':'trainee',synthetic:true,demo_namespace:namespace,registration_source:'direct'}}),'Create synthetic account');entry={id:data.user.id,email,password,role,name};state.accounts[label]=entry;users.push(data.user);await save();}
  checked(await service.from('profiles').update({role}).eq('id',entry.id),'Set fixture role');return entry;
 };
 const login=async entry=>{const db=createClient(env.NEXT_PUBLIC_SUPABASE_URL,env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,options);const data=checked(await db.auth.signInWithPassword({email:entry.email,password:entry.password}),'Authenticate synthetic identity');if(data.user.id!==entry.id)throw new LocalDemoError('Fixture identity mismatch.');return db;};
 const admin=await account('admin','admin','DEMO · Quản trị học phần');
 const pts=[];for(let i=1;i<=20;i++)pts.push(await account(`pt${String(i).padStart(2,'0')}`,'pt',`DEMO · PT ${String(i).padStart(2,'0')}`));
 checked(await service.from('pt_profiles').update({subscription_plan:'pro',subscription_valid_until:new Date(Date.now()+30*86400000).toISOString()}).eq('id',pts[0].id),'Set synthetic Pro entitlement');
 const adminApi=await login(admin),ptApi=await login(pts[0]);
 const before=checked(await adminApi.rpc('get_admin_overview'),'Read actual KPI before demo');
 const learners=[];
 for(let i=1;i<=8;i++){
  const learner=await account(`learner${String(i).padStart(2,'0')}`,'trainee',`DEMO · Học viên ${String(i).padStart(2,'0')}`),owner=i<=5?pts[0]:pts[1];
  let relation=checked(await service.from('trainee_profiles').select('id,assigned_pt_id,profile_id').eq('profile_id',learner.id).maybeSingle(),'Read fixture roster');
  if(relation&&relation.assigned_pt_id!==owner.id)throw new LocalDemoError('Fixture relationship changed; preserved.');
  if(!relation)relation=checked(await service.from('trainee_profiles').insert({assigned_pt_id:owner.id,profile_id:learner.id,display_name:learner.name,primary_goal:'recomp',total_sessions:12,remaining_sessions:8}).select('id,assigned_pt_id,profile_id').single(),'Create synthetic roster');
  learners.push({account:learner,traineeId:relation.id,pt:owner});
  const existing=checked(await service.from('inbody_records').select('id').eq('trainee_id',relation.id).limit(1),'Read fixture measurements');
  if(!existing.length){for(let k=2;k>=0;k--){const weight=70+i/10+k/5,fat=14+i/50+k/25;checked(await service.from('inbody_records').insert({trainee_id:relation.id,pt_id:owner.id,verified_by:owner.id,source:'manual',weight_kg:weight,skeletal_muscle_mass_kg:30+i/20,body_fat_mass_kg:fat,percent_body_fat:Number((fat/weight*100).toFixed(1)),total_body_water_liters:40,recorded_at:new Date(Date.now()-k*7*86400000).toISOString(),target_calories:2100,target_protein_grams:126,target_carb_grams:245,target_fat_grams:62}),'Create synthetic measurement');}}
 }
 const first=learners[0],learnerApi=await login(first.account);
 checked(await learnerApi.rpc('submit_daily_checkin',{checkin_note:'DỮ LIỆU DEMO: check-in để trình bày luồng PT–học viên, không phải phản hồi khách thật.'}),'Create synthetic check-in');
 const membership=checked(await service.from('coaching_membership_versions').select('id').eq('trainee_id',first.traineeId).limit(1),'Read fixture membership');
 if(!membership.length)checked(await ptApi.rpc('save_coaching_membership',{target_trainee:first.traineeId,request_id:stableId('membership'),membership_label:'DEMO · Membership 30 ngày',starts_on:isoDay(new Date().toISOString()),ends_on:isoDay(new Date(Date.now()+30*86400000).toISOString()),expected_revision:0}),'Create synthetic membership');
 for(const visibility of ['private','shared']){
  const nonce=stableId('note-'+visibility),existing=checked(await ptApi.from('coaching_notes').select('id').eq('client_request_id',nonce).maybeSingle(),'Read fixture note');
  if(!existing)checked(await ptApi.from('coaching_notes').insert({trainee_id:first.traineeId,pt_id:pts[0].id,learner_id:first.account.id,client_request_id:nonce,visibility,body:`DỮ LIỆU DEMO · Ghi chú ${visibility==='private'?'riêng cho PT':'chia sẻ với học viên'}. Không phải kết quả phỏng vấn hoặc tư vấn cho người thật.`}),'Create synthetic note');
 }
 const message=checked(await ptApi.from('coaching_messages').select('id').eq('client_message_id',stableId('message-pt')).maybeSingle(),'Read fixture chat');
 if(!message){checked(await ptApi.from('coaching_messages').insert({trainee_id:first.traineeId,pt_id:pts[0].id,learner_id:first.account.id,sender_id:pts[0].id,client_message_id:stableId('message-pt'),body:'DEMO · Bạn kiểm tra lịch và gửi check-in ở workspace nhé.'}),'Create PT demo message');checked(await learnerApi.from('coaching_messages').insert({trainee_id:first.traineeId,pt_id:pts[0].id,learner_id:first.account.id,sender_id:first.account.id,client_message_id:stableId('message-learner'),body:'DEMO · Mình đã xem lịch và gửi check-in. Đây là dữ liệu mô phỏng.'}),'Create learner demo message');}
 const day=isoDay(new Date(Date.now()+2*86400000).toISOString());
 for(const [label,hour] of [['review',9],['training',11]]){
  const nonce=stableId('appointment-'+label),existing=checked(await ptApi.from('coaching_appointments').select('id').eq('client_request_id',nonce).maybeSingle(),'Read fixture appointment');
  if(!existing)checked(await ptApi.from('coaching_appointments').insert({trainee_id:first.traineeId,pt_id:pts[0].id,learner_id:first.account.id,client_request_id:nonce,title:`DEMO · ${label==='review'?'Trao đổi tiến trình':'Buổi tập'}`,kind:label==='review'?'consultation':'training',starts_at:`${day}T${String(hour).padStart(2,'0')}:00:00+07:00`,ends_at:`${day}T${String(hour+1).padStart(2,'0')}:00:00+07:00`}), 'Create synthetic appointment');
 }
 const recordFinance=async(label,amount,category,customer)=>{
  const reference=`DEMO-EXE201-${label.toUpperCase()}`,nonce=stableId('finance-'+label),pdf=simulationPdf(reference,amount),hash=createHash('sha256').update(pdf).digest('hex'),path=`${admin.id}/${nonce}.pdf`;
  const existing=checked(await adminApi.from('finance_entries').select('id,is_test,evidence_sha256,amount_vnd').eq('bank_reference',reference.toLowerCase()).maybeSingle(),'Read simulated ledger');
  if(existing){if(!existing.is_test||existing.evidence_sha256!==hash||existing.amount_vnd!==amount)throw new LocalDemoError('Existing ledger reference differs; no evidence overwritten.');return existing.id;}
  const upload=await adminApi.storage.from('finance-evidence').upload(path,pdf,{contentType:'application/pdf',upsert:false});
  if(upload.error){const old=checked(await adminApi.storage.from('finance-evidence').download(path),'Read prior synthetic document');if(createHash('sha256').update(Buffer.from(await old.arrayBuffer())).digest('hex')!==hash)throw new LocalDemoError('Existing private document differs; preserved.');}
  return checked(await adminApi.rpc('record_finance_entry',{request_nonce:nonce,entry_kind:customer?'income':'expense',entry_category:category,amount,transaction_reference:reference,transacted_at:new Date(Date.parse(state.createdAt)-60000).toISOString(),receipt_path:path,receipt_sha256:hash,description:'DỮ LIỆU MÔ PHỎNG · không có chuyển tiền thật · '+label,test_entry:true,...(customer?{customer}:{})}),'Record TEST-only finance entry');
 };
 for(let i=0;i<pts.length;i++)await recordFinance(`pt${String(i+1).padStart(2,'0')}`,199000,'subscription',pts[i].id);
 await recordFinance('fixed-cost',3000000,'hosting');await recordFinance('variable-cost',339800,'other');
 const after=checked(await adminApi.rpc('get_admin_overview'),'Read actual KPI after demo');
 for(const key of ['paidCustomers','recordedRevenueVnd','recordedCostVnd'])if(before[key]!==after[key])throw new LocalDemoError('Synthetic seed changed actual finance KPI.');
 const entries=checked(await adminApi.from('finance_entries').select('kind,amount_vnd,is_test,bank_reference').like('bank_reference','demo-exe201-%'),'Verify simulated ledger');
 const income=entries.filter(e=>e.kind==='income').reduce((sum,e)=>sum+e.amount_vnd,0),cost=entries.filter(e=>e.kind==='expense').reduce((sum,e)=>sum+e.amount_vnd,0);
 if(entries.some(e=>!e.is_test)||income!==3980000||cost!==3339800)throw new LocalDemoError('Simulation reconciliation failed.');
 state.seedComplete=true;state.trainees=learners.map(l=>({id:l.traineeId,accountId:l.account.id,ptId:l.pt.id}));await save();
 const selected=['admin','pt01','pt02','learner01','learner06'].map(label=>state.accounts[label]);
 const html=`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FitSync — truy cập DEMO local</title><style>body{font:16px system-ui;max-width:950px;margin:40px auto;padding:20px;color:#143e38}table{border-collapse:collapse;width:100%}td,th{padding:14px;border-bottom:1px solid #d4dfd7;text-align:left}code{overflow-wrap:anywhere}aside{padding:16px;background:#fff2db}a{color:#226c5d}</style><h1>FitSync · DEMO học phần</h1><aside>Tất cả tài khoản, số đo và giao dịch trong bộ này là mô phỏng. Không có tiền thật được chuyển. File chứa mật khẩu local, không upload hoặc gửi giảng viên như bằng chứng khách trả phí.</aside><p><a href="http://127.0.0.1:3000">Mở ứng dụng</a> · <a href="http://127.0.0.1:54323">Mở database Studio local</a></p><table><thead><tr><th>Vai trò</th><th>Email</th><th>Mật khẩu local</th></tr></thead><tbody>${selected.map(a=>`<tr><td>${escape(a.name)}</td><td><code>${escape(a.email)}</code></td><td><code>${escape(a.password)}</code></td></tr>`).join('')}</tbody></table><p>PT01 có Pro synthetic; PT02 Free có3 hồ sơ. Hai gói cùng chức năng coaching.20 khoản thu TEST tổng3.980.000đ, chi phí TEST3.339.800đ, chênh lệch mô phỏng640.200đ; không tính thành doanh thu hoặc20 khách trả phí thật.</p></html>`;
 await writeFile(join(privateRoot,'LOCAL_DEMO_ACCESS.html'),html);
 const receipt={...demoPlan,verified:true,checkedAt:new Date().toISOString(),actualFinanceKpiUnchanged:true,simulatedLedgerEntries:entries.length};
 await writeFile(join(privateRoot,'seed-verification.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify(receipt));return receipt;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(!process.argv.includes('--apply'))console.log(JSON.stringify({...demoPlan,mode:'plan-only',noNetworkOrMutations:true}));
 else seedDemo(process.env).catch(error=>{console.error(error instanceof LocalDemoError?error.message:'Synthetic seed failed; raw details suppressed.');process.exitCode=1;});
}
