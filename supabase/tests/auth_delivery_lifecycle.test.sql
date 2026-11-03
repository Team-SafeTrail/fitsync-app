begin;
create extension if not exists pgtap with schema extensions;
select plan(24);

-- Fixtures: PT (1), other PT (2), Learner (3), unlinked Learner (4), Admin (5)
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('83000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated','authenticated','auth-delivery-'||n||'@example.test','',now(),'{}'::jsonb,
  jsonb_build_object('display_name','Auth Delivery '||n),now(),now() from generate_series(1,5) n;

update public.profiles set role='trainee' where id in ('83000000-0000-0000-0000-000000000003','83000000-0000-0000-0000-000000000004');
update public.profiles set role='admin' where id='83000000-0000-0000-0000-000000000005';

-- Trainee profile linked to PT 1 and Learner 3
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name,primary_goal) values
 ('ad000000-0000-0000-0000-000000000001','83000000-0000-0000-0000-000000000003','83000000-0000-0000-0000-000000000001','Linked Learner 3','recomp'),
 ('ad000000-0000-0000-0000-000000000002',null,'83000000-0000-0000-0000-000000000001','Pending Trainee 2','recomp');

-- Initial invitation for trainee 2 (must satisfy check constraint invitation_token_is_sha256)
insert into public.trainee_invitations(id,pt_id,trainee_id,email,token_hash,expires_at,status) values
 ('be000000-0000-0000-0000-000000000001','83000000-0000-0000-0000-000000000001','ad000000-0000-0000-0000-000000000002',
  'auth-delivery-4@example.test',repeat('1', 64),now() + interval '7 days','pending');

-- Privilege checks on new functions
select has_function('public','reissue_trainee_invitation',array['uuid','text','timestamptz'],'reissue function exists');
select has_function('public','revoke_trainee_invitation',array['uuid'],'revoke function exists');
select is(has_function_privilege('anon','public.reissue_trainee_invitation(uuid,text,timestamptz)','EXECUTE'),false,'anonymous cannot reissue');
select is(has_function_privilege('anon','public.revoke_trainee_invitation(uuid)','EXECUTE'),false,'anonymous cannot revoke');

-- Test Scoped Coach Display Identity: Learner 3 views Coach 1
set local role authenticated;
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000003',true);
select results_eq(
  'select id, display_name from public.profiles where id = ''83000000-0000-0000-0000-000000000001''::uuid',
  $$values ('83000000-0000-0000-0000-000000000001'::uuid, 'Auth Delivery 1')$$,
  'Learner can read assigned coach display identity'
);
select results_eq(
  'select id from public.profiles where id = ''83000000-0000-0000-0000-000000000002''::uuid',
  'select null::uuid limit 0',
  'Learner cannot read unassigned coach profile'
);
select results_eq(
  'select id from public.pt_profiles where id = ''83000000-0000-0000-0000-000000000001''::uuid',
  $$values ('83000000-0000-0000-0000-000000000001'::uuid)$$,
  'Learner can read assigned coach pt_profiles'
);
select throws_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('2', 64), now() + interval '3 days')$$,
  '42501',null,'Learner cannot reissue invitations'
);

-- Test PT 1 Reissuing Invitation for Pending Trainee 2
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000001',true);
select lives_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('2', 64), now() + interval '5 days')$$,
  'PT 1 successfully reissues invitation for trainee 2'
);
select results_eq(
  'select status from public.trainee_invitations where token_hash = repeat(''1'', 64)',
  $$values ('revoked'::public.invitation_status)$$,
  'Prior pending invitation is revoked'
);
select results_eq(
  'select status from public.trainee_invitations where token_hash = repeat(''2'', 64)',
  $$values ('pending'::public.invitation_status)$$,
  'New invitation is pending'
);

-- Negative: PT 2 cannot reissue invitation for PT 1 trainee
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000002',true);
select throws_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('3', 64), now() + interval '5 days')$$,
  'P0002',null,'Other PT cannot reissue invitation'
);

-- Negative: PT 1 cannot reissue for already linked trainee 1
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000001',true);
select throws_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000001'::uuid, repeat('3', 64), now() + interval '5 days')$$,
  '22000',null,'Cannot reissue invitation for already linked trainee'
);

-- Negative: Invalid expiry window (e.g. past or > 30 days)
select throws_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('3', 64), now() - interval '1 day')$$,
  '22023',null,'Expiry in past rejected'
);
select throws_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('3', 64), now() + interval '35 days')$$,
  '22023',null,'Expiry > 30 days rejected'
);

-- Test PT Revoke Invitation
select is(
  (select public.revoke_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid)),
  true,
  'PT can revoke active invitation'
);
select results_eq(
  'select status from public.trainee_invitations where token_hash = repeat(''2'', 64)',
  $$values ('revoked'::public.invitation_status)$$,
  'Active invitation is now revoked'
);

-- Preview with revoked hash yields 0 rows (no PII leak)
select results_eq(
  'select count(*)::bigint from public.get_invitation_preview(repeat(''2'', 64))',
  array[0::bigint],
  'Revoked invitation preview leaks no PII'
);

-- Reissue again for acceptance testing
select lives_ok(
  $$select * from public.reissue_trainee_invitation('ad000000-0000-0000-0000-000000000002'::uuid, repeat('4', 64), now() + interval '5 days')$$,
  'Reissue invitation for trainee 2 again'
);

-- Test Accept Invitation: Learner 3 (already linked to trainee 1) attempts to accept pending invite for trainee 2 -> gets 'already_linked'
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000003',true);
select results_eq(
  'select outcome from public.accept_trainee_invitation(repeat(''4'', 64))',
  $$values ('already_linked'::text)$$,
  'Already linked learner gets deterministic already_linked outcome'
);

-- Test Accept Invitation: Learner 4 (unlinked, matching email) accepts -> 'accepted'
select set_config('request.jwt.claim.sub','83000000-0000-0000-0000-000000000004',true);
select results_eq(
  'select outcome from public.accept_trainee_invitation(repeat(''4'', 64))',
  $$values ('accepted'::text)$$,
  'Unlinked matching learner gets accepted'
);

-- Second accept attempt by Learner 4 on same invitation -> 'used'
select results_eq(
  'select outcome from public.accept_trainee_invitation(repeat(''4'', 64))',
  $$values ('used'::text)$$,
  'Accepted invitation cannot be reused (returns used)'
);

-- Revoked token attempt -> 'used'
select results_eq(
  'select outcome from public.accept_trainee_invitation(repeat(''2'', 64))',
  $$values ('used'::text)$$,
  'Revoked token returns used'
);

rollback;
