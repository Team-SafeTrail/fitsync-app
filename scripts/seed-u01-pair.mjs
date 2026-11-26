import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(new URL('../', import.meta.url)));
const webRequire = createRequire(join(repoRoot, 'apps/web/package.json'));
const { createClient } = webRequire('@supabase/supabase-js');

async function loadEnv() {
  const envPath = join(repoRoot, 'apps/web/.env.local');
  const env = { ...process.env };
  try {
    const raw = await readFile(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!env[key]) env[key] = val;
      }
    }
  } catch {
    // Rely on process.env if .env.local does not exist
  }
  return env;
}

const U01_PT_EMAIL = 'pt.u01@example.test';
const U01_PT_NAME = 'PT U-01 Hào';

const U01_LEARNER_EMAIL = 'trainee.u01@example.test';
const U01_LEARNER_NAME = 'Học viên U-01 Nam';

const U01_OTHER_PT_EMAIL = 'pt.other@example.test';
const U01_OTHER_PT_NAME = 'PT Khác (Test Isolation)';

async function ensureUser(adminClient, usersList, email, password, role, displayName) {
  let user = usersList.find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
        role: role === 'pt' ? 'pt' : 'trainee',
        synthetic: true,
        fixture_tag: 'u01-test'
      }
    });
    if (createError) throw createError;
    user = createData.user;
    usersList.push(user);
    console.log(`[+] Created synthetic user: ${email} (${role})`);
  } else {
    const { error: updateError } = await adminClient.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...user.user_metadata,
        display_name: displayName,
        role: role === 'pt' ? 'pt' : 'trainee',
        synthetic: true,
        fixture_tag: 'u01-test'
      }
    });
    if (updateError) throw updateError;
    console.log(`[~] Updated synthetic user: ${email} (${role})`);
  }

  // Ensure row in public.profiles (handles existing auth.users after schema reset)
  const { error: profileErr } = await adminClient.from('profiles').upsert({
    id: user.id,
    display_name: displayName,
    role
  }, { onConflict: 'id' });
  if (profileErr) throw profileErr;

  // Ensure row in public.pt_profiles when role is PT
  if (role === 'pt') {
    const { error: ptErr } = await adminClient.from('pt_profiles').upsert({
      id: user.id
    }, { onConflict: 'id' });
    if (ptErr) throw ptErr;
  }

  return user;
}

async function main() {
  const args = process.argv.slice(2);
  const cleanTodayOnly = args.includes('--clean-today');

  const env = await loadEnv();
  const supabaseUrl = (env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321').replace(/\/+$/, '');
  const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const u01Password = env.FITSYNC_U01_PASSWORD || `Demo-${randomBytes(12).toString('base64url')}aA1!`;

  console.log(`\n======================================================`);
  console.log(`  FitSync - Chuẩn bị cặp tài khoản & kiểm thử U-01   `);
  console.log(`======================================================`);
  console.log(`Target Supabase URL: ${supabaseUrl}`);

  if (!serviceRoleKey) {
    console.error(`\n[!] Thiếu SUPABASE_SERVICE_ROLE_KEY trong môi trường hoặc apps/web/.env.local`);
    console.error(`    Cần service_role key để tạo tài khoản synthetic và kiểm tra RLS.`);
    process.exit(1);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data: listData, error: listError } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;
  const usersList = listData.users ?? [];

  // 1. Tạo/cập nhật tài khoản PT chính, Học viên, và PT khác (để test quyền cách ly)
  console.log(`\n1. Chuẩn bị tài khoản synthetic:`);
  const ptUser = await ensureUser(adminClient, usersList, U01_PT_EMAIL, u01Password, 'pt', U01_PT_NAME);
  const learnerUser = await ensureUser(adminClient, usersList, U01_LEARNER_EMAIL, u01Password, 'trainee', U01_LEARNER_NAME);
  await ensureUser(adminClient, usersList, U01_OTHER_PT_EMAIL, u01Password, 'pt', U01_OTHER_PT_NAME);

  // 2. Thiết lập liên kết trong trainee_profiles
  console.log(`\n2. Thiết lập liên kết hồ sơ học viên (trainee_profiles):`);
  let { data: traineeProfile, error: selectProfileErr } = await adminClient
    .from('trainee_profiles')
    .select('*')
    .eq('profile_id', learnerUser.id)
    .maybeSingle();
  if (selectProfileErr) throw selectProfileErr;

  if (!traineeProfile) {
    const { data: createdProfile, error: profileErr } = await adminClient
      .from('trainee_profiles')
      .insert({
        assigned_pt_id: ptUser.id,
        profile_id: learnerUser.id,
        display_name: U01_LEARNER_NAME,
        primary_goal: 'muscle_gain',
        status: 'active',
        total_sessions: 12,
        remaining_sessions: 10
      })
      .select()
      .single();
    if (profileErr) throw profileErr;
    traineeProfile = createdProfile;
    console.log(`[+] Đã tạo mới trainee_profiles (ID: ${traineeProfile.id}) liên kết tới PT ${ptUser.id}`);
  } else {
    const { error: updateProfileErr } = await adminClient
      .from('trainee_profiles')
      .update({
        assigned_pt_id: ptUser.id,
        profile_id: learnerUser.id,
        status: 'active',
        archived_at: null,
        total_sessions: Math.max(traineeProfile.total_sessions ?? 12, 10),
        remaining_sessions: 10
      })
      .eq('id', traineeProfile.id);
    if (updateProfileErr) throw updateProfileErr;
    console.log(`[~] Đã đồng bộ trainee_profiles (ID: ${traineeProfile.id}) gắn với PT ${ptUser.id}`);
  }

  // 3. Nếu yêu cầu --clean-today, xóa các check-in ngày hôm nay để học viên có thể test gửi từ app
  const vietnamDate = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  console.log(`\n3. Trạng thái ngày giờ hệ thống: Ngày Việt Nam hiện tại: ${vietnamDate}`);

  if (cleanTodayOnly) {
    const { error: delErr } = await adminClient
      .from('checkins')
      .delete()
      .eq('trainee_id', traineeProfile.id)
      .eq('local_checkin_date', vietnamDate);
    if (delErr) throw delErr;
    await adminClient
      .from('trainee_profiles')
      .update({ last_checkin_date: null })
      .eq('id', traineeProfile.id);
    console.log(`[✓] Đã dọn dẹp sạch check-in ngày ${vietnamDate} của học viên. Sẵn sàng cho Android test!`);
    return;
  }

  // 4. Kiểm thử RPC và quyền truy cập RLS
  console.log(`\n4. Kiểm thử kiểm soát quyền (RLS) & RPC:`);
  if (!anonKey) {
    console.log(`[-] Bỏ qua bước login anon do thiếu anonKey.`);
  } else {
    // Dọn trước nếu hôm nay đã có check-in để test được trường hợp created + already_submitted
    await adminClient
      .from('checkins')
      .delete()
      .eq('trainee_id', traineeProfile.id)
      .eq('local_checkin_date', vietnamDate);

    // Đăng nhập học viên
    const learnerClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error: authErr } = await learnerClient.auth.signInWithPassword({
      email: U01_LEARNER_EMAIL,
      password: u01Password
    });
    if (authErr) throw authErr;
    console.log(`[✓] Học viên đăng nhập thành công qua client anon`);

    // Gọi get_assigned_coach_identity
    const { data: coachIdData, error: coachIdErr } = await learnerClient.rpc('get_assigned_coach_identity');
    if (coachIdErr) throw coachIdErr;
    console.log(`[✓] Trainee đọc danh tính PT phụ trách thành công:`, coachIdData);

    // Submit một check-in test (lần 1 -> created)
    const testNote = `[U-01 Backend Verification] Buổi tập ngày ${vietnamDate} hoàn thành tốt.`;
    const { data: checkinData, error: checkinErr } = await learnerClient.rpc('submit_daily_checkin', {
      checkin_note: testNote
    });
    if (checkinErr) throw checkinErr;
    console.log(`[✓] Trainee submit_daily_checkin lần 1 thành công:`, checkinData);

    // Submit lại trong cùng ngày (lần 2 -> already_submitted)
    const { data: retryData, error: retryErr } = await learnerClient.rpc('submit_daily_checkin', {
      checkin_note: `${testNote} (retry)`
    });
    if (retryErr) throw retryErr;
    console.log(`[✓] Kiểm tra retry cùng ngày Việt Nam (outcome = already_submitted):`, retryData);

    // Đăng nhập PT chính để đọc lại checkin
    const ptClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error: ptAuthErr } = await ptClient.auth.signInWithPassword({ email: U01_PT_EMAIL, password: u01Password });
    if (ptAuthErr) throw ptAuthErr;
    const { data: ptReadsCheckin, error: ptReadErr } = await ptClient
      .from('checkins')
      .select('*')
      .eq('trainee_id', traineeProfile.id)
      .eq('local_checkin_date', vietnamDate);
    if (ptReadErr) throw ptReadErr;
    console.log(`[✓] PT phụ trách đọc lại check-in trên bảng checkins: Tìm thấy ${ptReadsCheckin?.length ?? 0} bản ghi (Ghi chú: "${ptReadsCheckin?.[0]?.note}")`);

    // Đăng nhập PT khác để kiểm tra Isolation
    const otherPtClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { error: otherAuthErr } = await otherPtClient.auth.signInWithPassword({ email: U01_OTHER_PT_EMAIL, password: u01Password });
    if (otherAuthErr) throw otherAuthErr;
    const { data: otherReadsCheckin, error: otherReadErr } = await otherPtClient
      .from('checkins')
      .select('*')
      .eq('trainee_id', traineeProfile.id);
    if (otherReadErr) throw otherReadErr;
    if (!otherReadsCheckin || otherReadsCheckin.length === 0) {
      console.log(`[✓] RLS Isolation đạt: PT ngoài không xem được check-in của học viên này (0 bản ghi).`);
    } else {
      throw new Error(`RLS Isolation thất bại: PT khác đọc được ${otherReadsCheckin.length} bản ghi!`);
    }

    // Sau khi test xong, xóa bản ghi test hôm nay để học viên có thể bấm gửi thật từ Android Emulator / Web
    const { error: resetErr } = await adminClient
      .from('checkins')
      .delete()
      .eq('trainee_id', traineeProfile.id)
      .eq('local_checkin_date', vietnamDate);
    if (resetErr) throw resetErr;
    await adminClient
      .from('trainee_profiles')
      .update({ last_checkin_date: null })
      .eq('id', traineeProfile.id);
    console.log(`[✓] Đã reset trạng thái check-in hôm nay về "Chưa check-in" để sẵn sàng cho bài test thực tế.`);
  }

  console.log(`\n======================================================`);
  console.log(`  THÔNG TIN BÀN GIAO MÔI TRƯỜNG CHO HUY (FRONTEND)    `);
  console.log(`======================================================`);
  console.log(`1. Cặp tài khoản kiểm thử U-01:`);
  console.log(`   - Tài khoản Học viên (dùng đăng nhập trên Android):`);
  console.log(`     * Email:    ${U01_LEARNER_EMAIL}`);
  console.log(`     * Mật khẩu: ${u01Password}`);
  console.log(`   - Tài khoản PT phụ trách (dùng đăng nhập Web để xem lại):`);
  console.log(`     * Web URL:  http://127.0.0.1:3000/login`);
  console.log(`     * Email:    ${U01_PT_EMAIL}`);
  console.log(`     * Mật khẩu: ${u01Password}`);
  console.log(`     * Trainee dossier URL: http://127.0.0.1:3000/workspace/trainees/${traineeProfile.id}`);
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('[!] Lỗi thực thi:', err);
  process.exit(1);
});
