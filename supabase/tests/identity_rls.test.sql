begin;

create extension if not exists pgtap with schema extensions;
select plan(13);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pta@example.test', '', now(), '{}', '{"display_name":"PT A"}', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ptb@example.test', '', now(), '{}', '{"display_name":"PT B"}', now(), now()),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'trainee@example.test', '', now(), '{}', '{"display_name":"Trainee A"}', now(), now());

update public.profiles
set role = 'trainee'
where id = '30000000-0000-0000-0000-000000000003';
delete from public.pt_profiles
where id = '30000000-0000-0000-0000-000000000003';
insert into public.trainee_profiles (id, profile_id, assigned_pt_id, display_name)
values (
  '30000000-0000-0000-0000-000000000003',
  '30000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000001',
  'Trainee A'
);

select has_table('public', 'profiles', 'profiles table exists');
select has_table('public', 'pt_profiles', 'pt_profiles table exists');
select has_table('public', 'trainee_profiles', 'trainee_profiles table exists');
select has_table('public', 'inbody_records', 'inbody_records table exists');
select is((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), true, 'profiles has RLS');
select is((select relrowsecurity from pg_class where oid = 'public.trainee_profiles'::regclass), true, 'trainee_profiles has RLS');
select is((select relrowsecurity from pg_class where oid = 'public.trainee_invitations'::regclass), true, 'invitations have RLS');
select is((select relrowsecurity from pg_class where oid = 'public.inbody_records'::regclass), true, 'inbody records have RLS');
select is(has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'), false, 'users cannot change their role');
select is(has_column_privilege('authenticated', 'public.pt_profiles', 'subscription_plan', 'UPDATE'), false, 'PTs cannot change their subscription tier');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select results_eq(
  'select count(*)::bigint from public.trainee_profiles',
  array[1::bigint],
  'PT A can read their assigned trainee'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-0000-0000-000000000002', true);
select results_eq(
  'select count(*)::bigint from public.trainee_profiles',
  array[0::bigint],
  'PT B cannot read PT A trainee'
);
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000003', true);
select results_eq(
  'select count(*)::bigint from public.trainee_profiles',
  array[1::bigint],
  'trainee can read only their own profile'
);
reset role;

select * from finish();
rollback;
