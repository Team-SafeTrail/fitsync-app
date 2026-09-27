begin;

create extension if not exists pgtap with schema extensions;
select plan(44);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('12000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm3-pta@example.test', '', now(), '{}', '{"display_name":"M3 PT A"}', now(), now()),
  ('23000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm3-ptb@example.test', '', now(), '{}', '{"display_name":"M3 PT B"}', now(), now()),
  ('34000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm3-trainee-a@example.test', '', now(), '{}', '{"display_name":"M3 Trainee A","role":"trainee"}', now(), now()),
  ('45000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm3-trainee-b@example.test', '', now(), '{}', '{"display_name":"M3 Trainee B","role":"trainee"}', now(), now());

insert into public.trainee_profiles (
  id, profile_id, assigned_pt_id, display_name, primary_goal,
  total_sessions, remaining_sessions, engagement_started_on, last_checkin_date
) values
  ('ac000000-0000-0000-0000-000000000001', '34000000-0000-0000-0000-000000000003', '12000000-0000-0000-0000-000000000001', 'M3 Trainee A', 'fat_loss', 12, 8, '2026-09-20', '2026-09-21'),
  ('bd000000-0000-0000-0000-000000000002', '45000000-0000-0000-0000-000000000004', '23000000-0000-0000-0000-000000000002', 'M3 Trainee B', 'muscle_gain', 16, 16, '2026-09-20', null);

insert into public.checkins (
  id, trainee_id, local_checkin_date, note, submitted_at
) values (
  'c1000000-0000-0000-0000-000000000001',
  'ac000000-0000-0000-0000-000000000001',
  '2026-09-21',
  'Đã hoàn thành buổi tập chân.',
  '2026-09-21 02:00:00+00'
);

insert into public.meal_logs (
  id, checkin_id, trainee_id, private_photo_path, photo_mime_type, photo_size_bytes
) values (
  'd1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'ac000000-0000-0000-0000-000000000001',
  'ac000000-0000-0000-0000-000000000001/checkin-a.png',
  'image/png',
  68
);

insert into storage.objects (bucket_id, name)
values ('meal-media', 'ac000000-0000-0000-0000-000000000001/checkin-a.png');

select has_table('public', 'checkins', 'check-ins table exists');
select has_table('public', 'meal_logs', 'meal logs table exists');
select is((select relrowsecurity from pg_class where oid = 'public.checkins'::regclass), true, 'check-ins have RLS');
select is((select relrowsecurity from pg_class where oid = 'public.meal_logs'::regclass), true, 'meal logs have RLS');
select results_eq(
  $$select count(*)::bigint from storage.buckets where id = 'meal-media'$$,
  array[1::bigint],
  'meal media bucket exists'
);
select results_eq(
  $$select public from storage.buckets where id = 'meal-media'$$,
  array[false],
  'meal media bucket is private'
);
select is(public.application_timezone(), 'Asia/Ho_Chi_Minh', 'application timezone is explicit');
select is(
  public.application_local_date('2026-09-21 16:59:59+00'::timestamptz),
  '2026-09-21'::date,
  'instant before local midnight remains on the prior application date'
);
select is(
  public.application_local_date('2026-09-21 17:00:00+00'::timestamptz),
  '2026-09-22'::date,
  'UTC 17:00 advances the application date in Vietnam'
);
select is(
  public.checkin_warning_starts_on('2026-09-21'::date),
  '2026-09-25'::date,
  'warning starts after three intervening dates fully elapse'
);
select is(
  public.is_checkin_warning_due('2026-09-21'::date, '2026-09-24 16:59:59+00'::timestamptz),
  false,
  'warning is not due one second before the fourth local date'
);
select is(
  public.is_checkin_warning_due('2026-09-21'::date, '2026-09-24 17:00:00+00'::timestamptz),
  true,
  'warning is due exactly at midnight after three full calendar days'
);
select throws_matching(
  $$insert into public.checkins (trainee_id, local_checkin_date)
    values ('ac000000-0000-0000-0000-000000000001', '2026-09-21')$$,
  '.*checkins_one_per_local_day.*',
  'a trainee can have only one check-in per local date'
);
select throws_matching(
  $$insert into public.checkins (trainee_id, local_checkin_date, note)
    values ('bd000000-0000-0000-0000-000000000002', '2026-09-21', repeat('x', 501))$$,
  '.*checkins_note_check.*',
  'database rejects an oversized check-in note'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '12000000-0000-0000-0000-000000000001', true);
select results_eq('select count(*)::bigint from public.checkins', array[1::bigint], 'PT A reads linked trainee check-ins');
select results_eq('select count(*)::bigint from public.meal_logs', array[1::bigint], 'PT A reads linked trainee meal logs');
select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'meal-media'$$,
  array[1::bigint],
  'PT A reads linked trainee private media metadata'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '23000000-0000-0000-0000-000000000002', true);
select results_eq('select count(*)::bigint from public.checkins', array[0::bigint], 'PT B cannot read PT A check-ins');
select results_eq('select count(*)::bigint from public.meal_logs', array[0::bigint], 'PT B cannot read PT A meal logs');
select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'meal-media'$$,
  array[0::bigint],
  'PT B cannot read PT A private media metadata'
);
reset role;

select is(has_table_privilege('authenticated', 'public.checkins', 'INSERT'), false, 'authenticated users cannot directly insert check-ins');
select is(has_table_privilege('authenticated', 'public.meal_logs', 'INSERT'), false, 'authenticated users cannot directly insert meal logs');
select is(has_table_privilege('authenticated', 'public.checkins', 'UPDATE'), false, 'check-ins are immutable to authenticated users');

set local role authenticated;
select set_config('request.jwt.claim.sub', '34000000-0000-0000-0000-000000000003', true);
select results_eq('select count(*)::bigint from public.checkins', array[1::bigint], 'trainee A reads their check-in');
select results_eq('select count(*)::bigint from public.meal_logs', array[1::bigint], 'trainee A reads their meal log');
select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'meal-media'$$,
  array[1::bigint],
  'trainee A reads their private media metadata'
);
select lives_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('meal-media', 'ac000000-0000-0000-0000-000000000001/new-upload.webp')$$,
  'trainee A may create a private object under their own path'
);
select throws_matching(
  $$insert into storage.objects (bucket_id, name)
    values ('meal-media', 'bd000000-0000-0000-0000-000000000002/cross-tenant.webp')$$,
  '.*row-level security.*',
  'trainee A cannot create an object under trainee B path'
);
select results_eq(
  $$select outcome from public.submit_daily_checkin('Hôm nay ổn.', null, null, null)$$,
  array['created'::text],
  'linked trainee creates the current local-date check-in'
);
select results_eq(
  $$select outcome from public.submit_daily_checkin('Lần hai.', null, null, null)$$,
  array['already_submitted'::text],
  'second check-in on the same local date is rejected deterministically'
);
select results_eq(
  $$select count(*)::bigint from public.checkins$$,
  array[2::bigint],
  'duplicate submission does not add a row'
);
select results_eq(
  $$select last_checkin_date from public.trainee_profiles
    where id = 'ac000000-0000-0000-0000-000000000001'$$,
  array[public.application_local_date(now())],
  'successful submission updates the trainee warning reference date'
);
select throws_ok(
  $$select public.submit_daily_checkin('Photo', 'wrong/path.png', 'image/png', 68)$$,
  '22023',
  'Meal photo metadata is invalid',
  'database rejects meal media outside the trainee path'
);
select throws_ok(
  $$select public.submit_daily_checkin(
      'Photo',
      'ac000000-0000-0000-0000-000000000001/missing.png',
      'image/png',
      68
    )$$,
  '22023',
  'Meal photo object not found',
  'database requires meal media to exist before linking it to a check-in'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '45000000-0000-0000-0000-000000000004', true);
select results_eq(
  $$select count(*)::bigint from public.checkins
    where trainee_id = 'ac000000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'trainee B cannot read trainee A check-ins'
);
select results_eq(
  $$select count(*)::bigint from public.meal_logs
    where trainee_id = 'ac000000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'trainee B cannot read trainee A meal logs'
);
select results_eq(
  $$select count(*)::bigint from storage.objects
    where bucket_id = 'meal-media'
      and name like 'ac000000-0000-0000-0000-000000000001/%'$$,
  array[0::bigint],
  'trainee B cannot read trainee A private object rows'
);
select throws_matching(
  $$insert into storage.objects (bucket_id, name)
    values ('meal-media', 'ac000000-0000-0000-0000-000000000001/forbidden.png')$$,
  '.*row-level security.*',
  'trainee B cannot upload into trainee A private path'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '12000000-0000-0000-0000-000000000001', true);
select lives_ok(
  $$update public.trainee_profiles
    set remaining_sessions = 7
    where id = 'ac000000-0000-0000-0000-000000000001'$$,
  'PT A can update the explicit remaining-session balance'
);
select results_eq(
  $$select remaining_sessions from public.trainee_profiles
    where id = 'ac000000-0000-0000-0000-000000000001'$$,
  array[7],
  'authorized session balance persists'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '23000000-0000-0000-0000-000000000002', true);
select results_eq(
  $$with changed as (
      update public.trainee_profiles
      set remaining_sessions = 0
      where id = 'ac000000-0000-0000-0000-000000000001'
      returning 1
    ) select count(*)::bigint from changed$$,
  array[0::bigint],
  'PT B cannot mutate PT A session balance'
);
select throws_ok(
  $$select public.submit_daily_checkin('Not a trainee', null, null, null)$$,
  '42501',
  'Linked trainee account required',
  'PT accounts cannot submit trainee check-ins'
);
reset role;

select is(has_table_privilege('anon', 'public.checkins', 'SELECT'), false, 'anonymous users cannot select check-ins');

set local role anon;
select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'meal-media'$$,
  array[0::bigint],
  'anonymous users cannot discover private meal media'
);
reset role;

select * from finish();
rollback;
