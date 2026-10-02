begin;

create extension if not exists pgtap with schema extensions;
select plan(34);

-- Test accounts: PT A, PT B, Trainee A (linked to PT A), Trainee B (linked to PT B)
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm4-pta@example.test', '', now(), '{}', '{"display_name":"M4 PT A"}', now(), now()),
  ('b2000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm4-ptb@example.test', '', now(), '{}', '{"display_name":"M4 PT B"}', now(), now()),
  ('c3000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm4-trainee-a@example.test', '', now(), '{}', '{"display_name":"M4 Trainee A","role":"trainee"}', now(), now()),
  ('d4000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm4-trainee-b@example.test', '', now(), '{}', '{"display_name":"M4 Trainee B","role":"trainee"}', now(), now());

insert into public.trainee_profiles (
  id, profile_id, assigned_pt_id, display_name, primary_goal,
  total_sessions, remaining_sessions, engagement_started_on
) values
  ('e5000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'M4 Trainee A', 'fat_loss', 12, 10, '2026-09-28'),
  ('f6000000-0000-0000-0000-000000000002', 'd4000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000002', 'M4 Trainee B', 'muscle_gain', 16, 16, '2026-09-28');

-- Structure checks
select has_table('public', 'ocr_attempts', 'ocr_attempts table exists');
select is((select relrowsecurity from pg_class where oid = 'public.ocr_attempts'::regclass), true, 'ocr_attempts has RLS enabled');
select results_eq(
  $$select count(*)::bigint from storage.buckets where id = 'inbody-media'$$,
  array[1::bigint],
  'inbody-media storage bucket exists'
);
select results_eq(
  $$select public from storage.buckets where id = 'inbody-media'$$,
  array[false],
  'inbody-media bucket is strictly private'
);

-- Seed an existing attempt for PT A
insert into storage.objects (bucket_id, name)
values ('inbody-media', 'e5000000-0000-0000-0000-000000000001/attempt-1.png');

insert into public.ocr_attempts (
  id, trainee_id, pt_id, private_image_path, image_mime_type, image_size_bytes,
  status, provider, provider_version, raw_draft
) values (
  '11111111-1111-1111-1111-111111111111',
  'e5000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'e5000000-0000-0000-0000-000000000001/attempt-1.png',
  'image/png',
  2048,
  'success',
  'fake-adapter',
  '1.0.0',
  '{"metrics":{"weight_kg":70.0,"skeletal_muscle_mass_kg":30.0,"body_fat_mass_kg":14.0,"percent_body_fat":20.0,"total_body_water_liters":40.0}}'::jsonb
);

-- Check constraints
select throws_matching(
  $$insert into public.ocr_attempts (
      trainee_id, pt_id, private_image_path, image_mime_type, image_size_bytes,
      status, provider, provider_version
    ) values (
      'e5000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
      'invalid-unscoped-path.png', 'image/png', 2048, 'pending', 'fake', '1.0'
    )$$,
  '.*ocr_attempt_path_scoped.*',
  'database rejects image path not scoped under trainee ID'
);

select throws_matching(
  $$insert into public.ocr_attempts (
      trainee_id, pt_id, private_image_path, image_mime_type, image_size_bytes,
      status, error_code, provider, provider_version
    ) values (
      'e5000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
      'e5000000-0000-0000-0000-000000000001/failed.png', 'image/png', 2048, 'failed', null, 'fake', '1.0'
    )$$,
  '.*ocr_attempt_status_error_consistent.*',
  'failed status requires bounded error code'
);

-- PT A Access check
set local role authenticated;
select set_config('request.jwt.claim.sub', 'a1000000-0000-0000-0000-000000000001', true);

select results_eq(
  'select count(*)::bigint from public.ocr_attempts',
  array[1::bigint],
  'PT A can read own trainee OCR attempts'
);

select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'inbody-media'$$,
  array[1::bigint],
  'PT A can read own trainee private InBody media'
);

select lives_ok(
  $$insert into storage.objects (bucket_id, name)
    values ('inbody-media', 'e5000000-0000-0000-0000-000000000001/pt-a-new.png')$$,
  'PT A can upload image for own assigned trainee'
);

select throws_matching(
  $$insert into storage.objects (bucket_id, name)
    values ('inbody-media', 'f6000000-0000-0000-0000-000000000002/pt-a-cross.png')$$,
  '.*row-level security.*',
  'PT A cannot upload image for trainee of PT B'
);

reset role;

-- PT B (Cross-tenant) Access check
set local role authenticated;
select set_config('request.jwt.claim.sub', 'b2000000-0000-0000-0000-000000000002', true);

select results_eq(
  'select count(*)::bigint from public.ocr_attempts',
  array[0::bigint],
  'PT B cannot read PT A OCR attempts'
);

select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'inbody-media' and name like 'e5000000%' $$,
  array[0::bigint],
  'PT B cannot read PT A trainee private media'
);

select throws_matching(
  $$update public.ocr_attempts
    set is_confirmed = true
    where id = '11111111-1111-1111-1111-111111111111'$$,
  '.*row-level security.*',
  'PT B cannot update PT A OCR attempt'
);

select throws_matching(
  $$delete from storage.objects
    where bucket_id = 'inbody-media' and name = 'e5000000-0000-0000-0000-000000000001/attempt-1.png'$$,
  '.*row-level security.*',
  'PT B cannot delete PT A private media'
);

reset role;

-- Trainee A Access check (Trainees should NOT have access to raw OCR attempts or inbody-media)
set local role authenticated;
select set_config('request.jwt.claim.sub', 'c3000000-0000-0000-0000-000000000003', true);

select results_eq(
  'select count(*)::bigint from public.ocr_attempts',
  array[0::bigint],
  'Trainee cannot read OCR attempts'
);

select results_eq(
  $$select count(*)::bigint from storage.objects where bucket_id = 'inbody-media'$$,
  array[0::bigint],
  'Trainee cannot read inbody-media storage'
);

select throws_matching(
  $$insert into storage.objects (bucket_id, name)
    values ('inbody-media', 'e5000000-0000-0000-0000-000000000001/trainee-leak.png')$$,
  '.*row-level security.*',
  'Trainee cannot insert into inbody-media'
);

reset role;

-- Anonymous Access check
set local role anon;

select throws_matching(
  'select * from public.ocr_attempts',
  '.*permission denied.*',
  'Anonymous role has no select privilege on ocr_attempts'
);

reset role;

-- Atomic confirmation procedure tests
set local role authenticated;
select set_config('request.jwt.claim.sub', 'a1000000-0000-0000-0000-000000000001', true);

-- PT A confirms unchanged values: is_manually_edited should be false
select results_eq(
  $$select outcome, is_manually_edited from public.confirm_ocr_inbody_record(
      '11111111-1111-1111-1111-111111111111'::uuid,
      70.0, 30.0, 14.0, 20.0, 40.0,
      2100, 140, 250, 60
    )$$,
  $$values ('confirmed'::text, false)$$,
  'PT A confirms OCR draft without edits -> verified record created with is_manually_edited = false'
);

-- Verify inbody_record was created with source = 'ocr'
select results_eq(
  $$select source::text, is_manually_edited from public.inbody_records
    where trainee_id = 'e5000000-0000-0000-0000-000000000001'$$,
  $$values ('ocr'::text, false)$$,
  'inbody_records row has source = ocr and is_manually_edited = false'
);

-- Attempt status is updated to confirmed
select results_eq(
  $$select is_confirmed from public.ocr_attempts where id = '11111111-1111-1111-1111-111111111111'$$,
  array[true],
  'ocr_attempt is marked as confirmed'
);

-- Idempotency check: repeat confirmation returns already_confirmed
select results_eq(
  $$select outcome, is_manually_edited from public.confirm_ocr_inbody_record(
      '11111111-1111-1111-1111-111111111111'::uuid,
      70.0, 30.0, 14.0, 20.0, 40.0,
      2100, 140, 250, 60
    )$$,
  $$values ('already_confirmed'::text, false)$$,
  'Repeat confirmation is idempotent and returns already_confirmed'
);

reset role;

-- PT B cannot confirm PT A draft
set local role authenticated;
select set_config('request.jwt.claim.sub', 'b2000000-0000-0000-0000-000000000002', true);

select throws_matching(
  $$select * from public.confirm_ocr_inbody_record(
      '11111111-1111-1111-1111-111111111111'::uuid,
      70.0, 30.0, 14.0, 20.0, 40.0
    )$$,
  '.*Permission denied.*',
  'PT B cannot confirm PT A OCR attempt'
);

reset role;

finish();
rollback;
