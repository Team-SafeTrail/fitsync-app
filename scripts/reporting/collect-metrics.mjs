// Read-only aggregate report. Never prints credentials, emails or health values.
import { createRequire } from 'node:module';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const requireWeb = createRequire(resolve('apps/web/package.json'));
const { loadEnvConfig } = requireWeb('@next/env');
const { createClient } = requireWeb('@supabase/supabase-js');
loadEnvConfig(resolve('apps/web'));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const allowedHost = 'uqjqkvalzdrcvxayhtre.supabase.co';
if (!url || !key || new URL(url).origin !== `https://${allowedHost}` || new URL(url).username || new URL(url).password) {
  throw new Error('Expected FitSync cloud configuration unavailable. No query executed.');
}
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: (input, init = {}) => {
    const method = (init.method ?? 'GET').toUpperCase();
    if (!['GET', 'HEAD'].includes(method)) throw new Error('Collector permits read-only HTTP methods.');
    return fetch(input, { ...init, signal: AbortSignal.timeout(15000) });
  } },
});
async function rows(table, columns) {
  const result = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(columns).order('id').range(from, from + 999);
    if (error) throw new Error(`Read failed: ${table} (${error.code ?? 'unknown'}).`);
    result.push(...data);
    if (data.length < 1000) return result;
  }
}
async function authUsers() {
  const all = [];
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Auth aggregate read failed (${error.status ?? 'unknown'}).`);
    all.push(...data.users);
    if (data.users.length < 1000) return all;
  }
}
try {
  const [users, profiles, trainees, plans, records, checkins] = await Promise.all([
    authUsers(), rows('profiles', 'id,role'), rows('trainee_profiles', 'id,profile_id'),
    rows('pt_profiles', 'id,subscription_plan'), rows('inbody_records', 'trainee_id'),
    rows('checkins', 'trainee_id,created_at'),
  ]);
  const roleById = new Map(profiles.map(p => [p.id, p.role]));
  const candidates = users.filter(u => u.user_metadata?.synthetic !== true && u.user_metadata?.synthetic !== 'true'
    && roleById.has(u.id) && roleById.get(u.id) !== 'admin'
    && !/(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])/i.test(u.email ?? ''));
  const ids = new Set(candidates.map(u => u.id));
  const traineeIds = new Set(trainees.filter(t => ids.has(t.profile_id)).map(t => t.id));
  const tally = (items, group) => items.reduce((out, item) => { const k = group(item); out[k] = (out[k] ?? 0) + 1; return out; }, {});
  const cutoff = Date.now() - 7 * 86400000;
  const recent = checkins.filter(c => traineeIds.has(c.trainee_id) && Date.parse(c.created_at) >= cutoff);
  const tablePresence = {};
  for (const table of ['coaching_messages', 'coaching_appointments', 'coaching_membership_versions', 'coaching_notes']) {
    // HEAD errors have no JSON body and can be ambiguous in SDKs. GET limit 0
    // verifies the relation without returning any row or health value.
    const { error, status } = await db.from(table).select('id').limit(0);
    tablePresence[table] = error ? { readable: false, status, code: error.code } : { readable: status === 200, status };
  }
  const report = {
    checked_at_utc: new Date().toISOString(), source: 'FitSync cloud Auth Admin + read-only REST selects',
    method: 'No mutations, no health metric values selected. Contact identifiers used only in memory for test filtering.',
    counts: {
      auth_total: users.length,
      synthetic_marked: users.filter(u => String(u.user_metadata?.synthetic) === 'true').length,
      profiles_by_role: tally(profiles, p => p.role),
      non_synthetic_non_admin_candidates: candidates.length,
      candidate_roles: tally(candidates, u => roleById.get(u.id)),
      candidate_confirmed: candidates.filter(u => u.email_confirmed_at).length,
      candidate_ever_signed_in: candidates.filter(u => u.last_sign_in_at).length,
      candidate_signin_last_7d: candidates.filter(u => Date.parse(u.last_sign_in_at) >= cutoff).length,
      non_synthetic_pt_plans: tally(plans.filter(p => ids.has(p.id)), p => p.subscription_plan),
      candidate_inbody_records: records.filter(r => traineeIds.has(r.trainee_id)).length,
      candidate_checkins: checkins.filter(c => traineeIds.has(c.trainee_id)).length,
      candidate_learners_with_checkin_7d: new Set(recent.map(c => c.trainee_id)).size,
      all_inbody_records: records.length, all_checkins: checkins.length,
    },
    candidate_registrations_by_local_date: tally(candidates, u => new Date(Date.parse(u.created_at) + 7 * 3600000).toISOString().slice(0, 10)),
    coaching_table_presence: tablePresence,
    limitations: ['Candidates have not been independently confirmed as customers.', 'Pro plan is not proof of payment.',
      'last_sign_in_at measures latest sign-in, not all weekly activity.', 'No acquisition-channel or billing data obtained.',
      'Multiple read queries are not a single transactional snapshot; concurrent changes may affect totals.'],
  };
  if (Object.values(report.counts.candidate_roles).reduce((a, b) => a + b, 0) !== candidates.length) throw new Error('Cohort reconciliation failed.');
  const output = resolve(process.argv[2] ?? '../outputs/exe201-source-audit-2026-11-17/cloud-metrics.json');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  // Throwing Supabase SDK errors can leak request metadata; emit only our bounded messages.
  console.error(error instanceof Error && /^(Read failed|Auth aggregate|Cohort)/.test(error.message)
    ? error.message : 'Read-only collection unavailable; no successful report written.');
  process.exitCode = 1;
}
