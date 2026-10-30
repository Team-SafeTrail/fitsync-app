begin;
create extension if not exists pgtap with schema extensions;
select plan(29);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
select ('71000000-0000-0000-0000-00000000000' || n)::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated',
  'chat-' || n || '@example.test', '', now(), '{}'::jsonb,
  jsonb_build_object('display_name', 'Chat synthetic ' || n), now(), now()
from generate_series(1,5) n;
update public.profiles set role = 'trainee' where id in (
  '71000000-0000-0000-0000-000000000003', '71000000-0000-0000-0000-000000000004'
);
update public.profiles set role = 'admin' where id = '71000000-0000-0000-0000-000000000005';
insert into public.trainee_profiles (id, profile_id, assigned_pt_id, display_name, primary_goal)
values
 ('aa000000-0000-0000-0000-000000000001', '71000000-0000-0000-0000-000000000003', '71000000-0000-0000-0000-000000000001', 'Chat student A', 'fat_loss'),
 ('aa000000-0000-0000-0000-000000000002', '71000000-0000-0000-0000-000000000004', '71000000-0000-0000-0000-000000000002', 'Chat student B', 'recomp');

select has_table('public','coaching_messages','chat table exists');
select is(has_table_privilege('anon','public.coaching_messages','SELECT'),false,'anonymous cannot read chat');
select is(has_table_privilege('authenticated','public.coaching_messages','UPDATE'),false,'history cannot be edited');
select is(has_table_privilege('authenticated','public.coaching_messages','DELETE'),false,'history cannot be deleted');
select is(has_column_privilege('authenticated','public.coaching_messages','created_at','INSERT'),false,'cannot forge timestamps');
select is(has_column_privilege('authenticated','public.coaching_messages','id','INSERT'),false,'cannot forge record IDs');

set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000001',true);
select lives_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000001','Hello')$$,'assigned PT sends');
select results_eq('select count(*)::bigint from public.coaching_messages',array[1::bigint],'PT sees own thread');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000004','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000010','Wrong learner identity')$$,'42501',null,'cannot forge learner identity');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000002','Forged')$$,'42501',null,'cannot forge sender');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000002','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000003','Wrong PT')$$,'42501',null,'cannot forge thread PT');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000001','Hello')$$,'23505',null,'retry cannot duplicate message');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000004','')$$,'23514',null,'empty body rejected');
reset role;

-- Role changes revoke old participant access even when the same auth ID remains assigned.
update public.profiles set role='admin' where id='71000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'changing participant role to admin removes private chat access');
reset role;
update public.profiles set role='pt' where id='71000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[1::bigint],'linked learner reads');
select lives_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000005','Reply')$$,'linked learner replies');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'other learner cannot read');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000004','bb000000-0000-0000-0000-000000000006','Intrusion')$$,'42501',null,'other learner cannot send');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000002',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'other PT cannot read');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000002','bb000000-0000-0000-0000-000000000007','Intrusion')$$,'42501',null,'other PT cannot send');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000005',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'system admin has no chat override');
reset role;

update public.trainee_profiles set status='archived' where id='aa000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'archive stops read');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000003','bb000000-0000-0000-0000-000000000008','Archived')$$,'42501',null,'archive stops sends');
reset role;

update public.trainee_profiles set status='active',profile_id=null where id='aa000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'unlink stops PT reading old messages');
select throws_ok($$insert into public.coaching_messages(trainee_id,pt_id,learner_id,sender_id,client_message_id,body) values ('aa000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000001','71000000-0000-0000-0000-000000000003','71000000-0000-0000-0000-000000000001','bb000000-0000-0000-0000-000000000009','Unlinked')$$,'42501',null,'cannot send to unlinked profile');
reset role;

-- A different linked auth identity must not inherit prior private messages.
update public.trainee_profiles set profile_id=null where id='aa000000-0000-0000-0000-000000000002';
update public.trainee_profiles set profile_id='71000000-0000-0000-0000-000000000004' where id='aa000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'new auth identity cannot inherit history');
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'old history is not exposed under a changed learner identity');
reset role;

update public.trainee_profiles set profile_id='71000000-0000-0000-0000-000000000003',assigned_pt_id='71000000-0000-0000-0000-000000000002' where id='aa000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000002',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'new PT does not inherit old private thread');
reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','71000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_messages',array[0::bigint],'old PT loses thread access');
reset role;
select * from finish();
rollback;
