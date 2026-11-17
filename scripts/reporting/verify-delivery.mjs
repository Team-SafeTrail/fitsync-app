import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const evidence = path.join(root, 'docs/evidence/exe201-2026-11-17');
const required = [
  'docs/PROJECT_ANALYSIS.md','docs/ARCHITECTURE.md','docs/DEMO_WORKFLOW.md','docs/GIT_AUDIT.md','docs/TEST_EVIDENCE.md',
  'reports/WEEK_08_FORM.md','reports/WEEK_09_FORM.md','reports/WEEK_08_09_PROGRESS_REPORT.md',
  'reports/FINAL_REPORT_READINESS.md','reports/FINAL_REPORT_DRAFT.md','reports/FINANCIAL_REPORT.md','reports/DELIVERY_LINKS.md',
  'presentations/WEEK_08_09_SCRIPT.md','presentations/SLIDE_OUTLINE.md','presentations/CANVA_DELIVERY.md',
  'presentations/WEEK_08_09_CANVA_SOURCE.html','presentations/FitSync_Week_08_09.pdf',
  'project-management/SKILL_TASK_MAPPING.md','project-management/TRELLO_AUDIT.md','project-management/EXE201_GAP_ANALYSIS.md',
  'project-management/IMPLEMENTATION_PLAN.md','project-management/FINAL_DELIVERY.md','project-management/CLEANUP_DRY_RUN.md',
  'project-management/CLEANUP_RESULT.md','project-management/PR_DESCRIPTION.md',
];
const checks = [], errors = [];
const assert = (condition, description) => { checks.push({ description, pass: Boolean(condition) }); if (!condition) errors.push(description); };
const read = file => fs.readFile(path.join(root, file), 'utf8');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = [];
for (const file of required) {
  try { const bytes = await fs.readFile(path.join(root, file)); assert(bytes.length > 0, `Exists: ${file}`); manifest.push({file,bytes:bytes.length,sha256:sha(bytes)}); }
  catch { assert(false, `Exists: ${file}`); }
}
const w8 = await read('reports/WEEK_08_FORM.md'), w9 = await read('reports/WEEK_09_FORM.md');
assert((w8.match(/^## Step \d+:/gm) ?? []).length === 6, 'Week8 exact six fields');
assert((w9.match(/^## Step \d+:/gm) ?? []).length === 5, 'Week9 exact five fields');
assert(/\*\*No\*\*/.test(w8), 'Week8 stop decision is No');
assert(w9.includes('18SJXm70350xOMlOvkuLelAmP6xPavRRd'), 'Week9 verified financial URL');
assert((await read('reports/FINAL_REPORT_DRAFT.md')).match(/^## Part [1-5]/gm)?.length === 5, 'Five-part final structure');
const script = await read('presentations/WEEK_08_09_SCRIPT.md');
assert((script.match(/^## Slide \d+ — /gm) ?? []).length === 10, 'Ten slide scripts');
for (const label of ['Key Message','Speaking Script','Visual Explanation','Transition','Evidence']) assert((script.match(new RegExp(`\\*\\*${label}:\\*\\*`,'g')) ?? []).length === 10, `Ten ${label} fields`);
const html = await read('presentations/WEEK_08_09_CANVA_SOURCE.html');
assert((html.match(/data-document-role="page"/g) ?? []).length === 10, 'Ten annotated HTML pages');
const images = [...html.matchAll(/src="data:image\/png;base64,([^"]+)"/g)].map(m => Buffer.from(m[1], 'base64'));
assert(images.length === 2, 'Exactly two embedded product screenshots');
const originals = await Promise.all(['handoff-pt-dossier.png','handoff-trainee-home.png'].map(n=>fs.readFile(path.join(root,'docs/handoff/screenshots',n))));
assert(images.every((im,i)=>sha(im)===sha(originals[i])), 'Embedded screenshots match original bytes');
const deck = JSON.parse(await read('docs/evidence/exe201-2026-11-17/canva-final-text.json'));
assert(deck.metadata.page_count === 10 && deck.id === 'DAHbJ4OqVNk', 'Final Canva ID and ten pages');
for (const text of ['20 PT + 40 học viên','17 PT','47 PT','ít nhất 20 khách trả phí','Nhóm quyết định dừng kinh doanh']) assert(deck.text.includes(text), `Canva checked text: ${text}`);
assert(!deck.text.includes('Nguyễn Minh Anh') && !deck.text.includes('120'), 'Rejected mock UI text absent');
const metrics = JSON.parse(await read('docs/evidence/exe201-2026-11-17/cloud-metrics.json'));
const counts = metrics.counts;
assert(Object.values(counts.candidate_roles).reduce((a,b)=>a+b,0)===counts.non_synthetic_non_admin_candidates, 'Role counts reconcile to candidates');
assert(Object.values(metrics.candidate_registrations_by_local_date).reduce((a,b)=>a+b,0)===counts.non_synthetic_non_admin_candidates, 'Date groups independently reconcile to candidates');
const finance = {price:199000, cash:{fixed:3000000,variable:16990},economic:{fixed:7800000,variable:31990}};
for(const mode of ['cash','economic']) { const v=finance[mode];v.contribution=finance.price-v.variable;v.break_even=Math.ceil(v.fixed/v.contribution);v.margin=v.contribution/finance.price;v.cases=[20,50,100].map(pt=>({pt,revenue:pt*finance.price,result:pt*v.contribution-v.fixed})); }
assert(finance.cash.break_even===17 && finance.economic.break_even===47, 'Break-even scenarios recomputed');
assert(finance.cash.cases[0].result===640200 && finance.economic.cases[0].result===-4459800, '20 PT scenario cross-check');
const audit=JSON.parse(await read('project-management/trello-audit.json'));
assert(audit.cards.length===106 && Object.values(audit.counts).reduce((a,b)=>a+b,0)===106, 'All106 Trello cards classified once');
assert(audit.counts.Duplicate===5, 'Five exact-title duplicate cards reconciled');
const pdf=JSON.parse(await read('docs/evidence/exe201-2026-11-17/pdf-verification.json'));
assert(pdf.pages===10 && pdf.all_16_by_9 && pdf.sha256===sha(await fs.readFile(path.join(root,'presentations/FitSync_Week_08_09.pdf'))), 'Ten-page16:9 PDF matches verified hash');
for(const file of required.filter(f=>f.endsWith('.md'))) {
 const text=await read(file);
 for(const m of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
  const href=m[1].replace(/^<|>$/g,''); if(/^(https?:|mailto:|#)/.test(href))continue;
  const local=path.resolve(root,path.dirname(file),decodeURIComponent(href.split('#')[0]));
  // This receipt is written after verification; it cannot pre-exist on a clean checkout.
  if(local===path.join(evidence,'delivery-verification.json'))continue;
  try {await fs.access(local);}catch{assert(false,`Broken local link ${file}: ${href}`);}
 }
 assert(!/\b(?:sb_secret_|sbp_)[A-Za-z0-9_-]{12,}|BEGIN (?:RSA )?PRIVATE KEY/.test(text), `No credential literal: ${file}`);
}
await fs.mkdir(evidence,{recursive:true});
const report={checked_at_utc:new Date().toISOString(),pass:errors.length===0,checks,errors,finance,manifest};
await fs.writeFile(path.join(evidence,'delivery-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,checks:checks.length,errors,finance}));
if(errors.length)process.exitCode=1;
