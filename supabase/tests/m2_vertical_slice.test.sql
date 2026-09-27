begin;

create extension if not exists pgtap with schema extensions;
select plan(25);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('11000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2-pta@example.test', '', now(), '{}', '{"display_name":"M2 PT A"}', now(), now()),
  ('22000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2-ptb@example.test', '', now(), '{}', '{"display_name":"M2 PT B"}', now(), now()),
  ('33000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2-trainee-a@example.test', '', now(), '{}', '{"display_name":"Trainee A","role":"trainee"}', now(), now()),
  ('44000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'm2-trainee-b@example.test', '', now(), '{}', '{"display_name":"Trainee B","role":"trainee"}', now(), now()),
  ('55000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'expired@example.test', '', now(), '{}', '{"display_name":"Expired Invitee","role":"trainee"}', now(), now()),
  ('66000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'accept@example.test', '', now(), '{}', '{"display_name":"Accepted Invitee","role":"trainee"}', now(), now());

insert into public.trainee_profiles (
  id, profile_id, assigned_pt_id, display_name, phone, primary_goal,
  total_sessions, remaining_sessions
) values
  ('aa000000-0000-0000-0000-000000000001', '33000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000001', 'Trainee A', '0900000001', 'fat_loss', 12, 10),
  ('bb000000-0000-0000-0000-000000000002', '44000000-0000-0000-0000-000000000004', '22000000-0000-0000-0000-000000000002', 'Trainee B', '0900000002', 'muscle_gain', 16, 16),
  ('cc000000-0000-0000-0000-000000000003', null, '11000000-0000-0000-0000-000000000001', 'Expired Invitee', null, 'recomp', 8, 8),
  ('dd000000-0000-0000-0000-000000000004', null, '11000000-0000-0000-0000-000000000001', 'Accepted Invitee', null, 'recomp', 10, 10);

insert into public.trainee_invitations (
  id, pt_id, trainee_id, email, token_hash, status, expires_at, created_at
) values
  ('a1000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 'cc000000-0000-0000-0000-000000000003', 'expired@example.test', repeat('a', 64), 'pending', now() - interval '1 minute', now() - interval '2 days'),
  ('b2000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', 'dd000000-0000-0000-0000-000000000004', 'accept@example.test', repeat('b', 64), 'pending', now() + interval '7 days', now());

insert into public.inbody_records (
  id, trainee_id, pt_id, weight_kg, skeletal_muscle_mass_kg,
  body_fat_mass_kg, percent_body_fat, total_body_water_liters,
  target_calories, target_protein_grams, target_carb_grams,
  target_fat_grams, verified_by
) values (
  'f1000000-0000-0000-0000-000000000001',
  'aa000000-0000-0000-0000-000000000001',
  '11000000-0000-0000-0000-000000000001',
  70, 30, 14, 20, 40, 2100, 126, 245, 62,
  '11000000-0000-0000-0000-000000000001'
);

select has_column('public', 'trainee_profiles', 'profile_id', 'trainee records can exist before an auth profile');
select has_column('public', 'trainee_invitations', 'trainee_id', 'invitations identify their trainee record');
select hasnt_column('public', 'trainee_invitations', 'token', 'raw invitation tokens are never stored');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11000000-0000-0000-0000-000000000001', true);
select results_eq(
  'select count(*)::bigint from public.trainee_profiles',
  array[3::bigint],
  'PT A sees only their roster'
);
select results_eq(
  $$select count(*)::bigint from public.trainee_profiles where id = 'bb000000-0000-0000-0000-000000000002'$$,
  array[0::bigint],
  'PT A cannot read PT B trainee'
);
select results_eq(
  $$select count(*)::bigint from public.inbody_records where id = 'f1000000-0000-0000-0000-000000000001'$$,
  array[1::bigint],
  'PT A can read their verified record'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '22000000-0000-0000-0000-000000000002', true);
select results_eq(
  $$select count(*)::bigint from public.trainee_profiles where assigned_pt_id = '11000000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'PT B cannot read PT A roster'
);
select results_eq(
  $$with changed as (
      update public.trainee_profiles
      set remaining_sessions = 0
      where id = 'aa000000-0000-0000-0000-000000000001'
      returning 1
    ) select count(*)::bigint from changed$$,
  array[0::bigint],
  'PT B cannot mutate PT A trainee'
);
select results_eq(
  $$with changed as (
      update public.inbody_records
      set target_calories = 999
      where id = 'f1000000-0000-0000-0000-000000000001'
      returning 1
    ) select count(*)::bigint from changed$$,
  array[0::bigint],
  'PT B cannot mutate PT A record'
);
select throws_ok(
  $$insert into public.inbody_records (
      trainee_id, pt_id, weight_kg, skeletal_muscle_mass_kg,
      body_fat_mass_kg, percent_body_fat, verified_by
    ) values (
      'aa000000-0000-0000-0000-000000000001',
      '22000000-0000-0000-0000-000000000002',
      70, 30, 14, 20,
      '22000000-0000-0000-0000-000000000002'
    )$$,
  '42501',
  'new row violates row-level security policy for table "inbody_records"',
  'PT B cannot insert a record for PT A trainee'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '33000000-0000-0000-0000-000000000003', true);
select results_eq(
  'select count(*)::bigint from public.trainee_profiles',
  array[1::bigint],
  'trainee A sees only their own trainee profile'
);
select results_eq(
  'select count(*)::bigint from public.inbody_records',
  array[1::bigint],
  'trainee A sees their verified record'
);
select results_eq(
  $$with changed as (
      update public.inbody_records
      set target_calories = 999
      where id = 'f1000000-0000-0000-0000-000000000001'
      returning 1
    ) select count(*)::bigint from changed$$,
  array[0::bigint],
  'trainees cannot edit coaching nutrition drafts'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '44000000-0000-0000-0000-000000000004', true);
select results_eq(
  $$select count(*)::bigint from public.inbody_records where trainee_id = 'aa000000-0000-0000-0000-000000000001'$$,
  array[0::bigint],
  'trainee B cannot read trainee A record'
);
reset role;

select throws_matching(
  $$insert into public.inbody_records (
      trainee_id, pt_id, weight_kg, skeletal_muscle_mass_kg,
      body_fat_mass_kg, percent_body_fat, verified_by
    ) values (
      'aa000000-0000-0000-0000-000000000001',
      '11000000-0000-0000-0000-000000000001',
      70, 30, 8, 40,
      '11000000-0000-0000-0000-000000000001'
    )$$,
  '.*inbody_cross_field_check.*',
  'fat mass and body-fat percentage must be consistent'
);
select throws_matching(
  $$insert into public.inbody_records (
      trainee_id, pt_id, weight_kg, skeletal_muscle_mass_kg,
      body_fat_mass_kg, percent_body_fat, verified_by
    ) values (
      'aa000000-0000-0000-0000-000000000001',
      '11000000-0000-0000-0000-000000000001',
      60, 50, 15, 25,
      '11000000-0000-0000-0000-000000000001'
    )$$,
  '.*inbody_components_within_weight.*',
  'muscle and fat components cannot exceed total weight'
);
select throws_matching(
  $$insert into public.inbody_records (
      trainee_id, pt_id, weight_kg, skeletal_muscle_mass_kg,
      body_fat_mass_kg, percent_body_fat, total_body_water_liters,
      verified_by
    ) values (
      'aa000000-0000-0000-0000-000000000001',
      '11000000-0000-0000-0000-000000000001',
      70, 30, 14, 20, 80,
      '11000000-0000-0000-0000-000000000001'
    )$$,
  '.*inbody_water_within_weight.*',
  'total body water cannot exceed body weight'
);

set local role anon;
select results_eq(
  $$select count(*)::bigint from public.get_invitation_preview(repeat('a', 64))$$,
  array[0::bigint],
  'expired invitation is not previewable'
);
select results_eq(
  $$select count(*)::bigint from public.get_invitation_preview(repeat('b', 64))$$,
  array[1::bigint],
  'valid invitation is previewable with its secret token hash'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '55000000-0000-0000-0000-000000000005', true);
select results_eq(
  $$select outcome from public.accept_trainee_invitation(repeat('a', 64))$$,
  array['expired'::text],
  'expired invitation cannot be accepted'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '66000000-0000-0000-0000-000000000006', true);
select results_eq(
  $$select outcome from public.accept_trainee_invitation(repeat('b', 64))$$,
  array['accepted'::text],
  'valid invitation links the authenticated trainee'
);
select results_eq(
  $$select outcome from public.accept_trainee_invitation(repeat('b', 64))$$,
  array['used'::text],
  'accepted invitation cannot be reused'
);
select results_eq(
  $$select count(*)::bigint
    from public.trainee_profiles
    where id = 'dd000000-0000-0000-0000-000000000004'
      and profile_id = '66000000-0000-0000-0000-000000000006'$$,
  array[1::bigint],
  'accepted trainee is linked to exactly one auth profile'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '11000000-0000-0000-0000-000000000001', true);
select lives_ok(
  $$select public.create_trainee_with_invitation(
      'New trainee',
      'fat_loss',
      '0900000009',
      12,
      12,
      'new@example.test',
      repeat('c', 64),
      now() + interval '7 days'
    )$$,
  'PT can atomically create a trainee and hashed invitation'
);
select results_eq(
  $$select count(*)::bigint
    from public.trainee_invitations
    where token_hash = repeat('c', 64)
      and trainee_id is not null$$,
  array[1::bigint],
  'invitation persists only the supplied token hash and trainee link'
);
reset role;

select * from finish();
rollback;
