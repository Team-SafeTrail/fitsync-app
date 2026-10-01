begin;
select plan(7);

-- Test 1: handle_new_user defaults to pt
insert into auth.users (id, email, raw_user_meta_data) values ('10000000-0000-0000-0000-000000000000', 'admin@example.com', '{"role":"admin"}');
select results_eq(
  $$ select role from public.profiles where id = '10000000-0000-0000-0000-000000000000' $$,
  $$ values ('pt'::public.user_role) $$,
  'Role admin should default to pt'
);

-- Test 2: handle_new_user accepts trainee
insert into auth.users (id, email, raw_user_meta_data) values ('20000000-0000-0000-0000-000000000000', 'trainee@example.com', '{"role":"trainee"}');
select results_eq(
  $$ select role from public.profiles where id = '20000000-0000-0000-0000-000000000000' $$,
  $$ values ('trainee'::public.user_role) $$,
  'Role trainee should be accepted'
);

-- Test 3: handle_new_user creates pt profile if pt
select results_eq(
  $$ select id from public.pt_profiles where id = '10000000-0000-0000-0000-000000000000' $$,
  $$ values ('10000000-0000-0000-0000-000000000000'::uuid) $$,
  'PT profile should be created'
);

-- Test 4: ocr_attempts structure
select has_table('public', 'ocr_attempts', 'Table ocr_attempts should exist');
select has_column('public', 'ocr_attempts', 'status', 'ocr_attempts should have status column');

-- Test 6: Storage bucket exists
select results_eq(
  $$ select name from storage.buckets where id = 'inbody-scans' $$,
  $$ values ('inbody-scans'::text) $$,
  'Bucket inbody-scans should exist'
);

-- Test 7: Storage policies exist
select ok(
  (select count(*) from pg_policies where tablename = 'objects' and policyname like 'inbody_scans%') = 3,
  'inbody-scans should have 3 RLS policies'
);

select * from finish();
rollback;
