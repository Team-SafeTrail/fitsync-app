begin;
create extension if not exists pgtap with schema extensions;
select plan(24);
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('84000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
 'authenticated','authenticated','roster-'||n||'@example.test','',now(),'{}',jsonb_build_object('display_name','Roster '||n),now(),now() from generate_series(1,3) n;
update public.profiles set role='trainee' where id='84000000-0000-0000-0000-000000000003';
update public.profiles set phone='0901234567' where id='84000000-0000-0000-0000-000000000001';
delete from public.pt_profiles where id='84000000-0000-0000-0000-000000000003';
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name) values
 ('ae000000-0000-0000-0000-000000000001','84000000-0000-0000-0000-000000000003','84000000-0000-0000-0000-000000000001','Linked learner'),
 ('ae000000-0000-0000-0000-000000000002',null,'84000000-0000-0000-0000-000000000001','Pending learner');
insert into public.trainee_invitations(pt_id,trainee_id,email,token_hash,expires_at) values
 ('84000000-0000-0000-0000-000000000001','ae000000-0000-0000-0000-000000000002','pending-roster@example.test',repeat('a',64),now()+interval '7 days');

select is(has_function_privilege('anon','public.get_assigned_coach_identity()','EXECUTE'),false,'Anonymous cannot read coach identity');
select is(has_column_privilege('authenticated','public.trainee_profiles','status','UPDATE'),false,'No direct archive bypass');
select is(has_column_privilege('authenticated','public.profiles','role','UPDATE'),false,'No self role escalation');
select is(has_column_privilege('authenticated','public.pt_profiles','subscription_plan','UPDATE'),false,'No self upgrade');
set local role authenticated;
select set_config('request.jwt.claim.sub','84000000-0000-0000-0000-000000000003',true);
select is((select count(*)::integer from public.profiles where id='84000000-0000-0000-0000-000000000001'),0,'Coach phone and profile row remain private');
select is((select count(*)::integer from public.pt_profiles where id='84000000-0000-0000-0000-000000000001'),0,'Coach billing row private');
select is((select display_name from public.get_assigned_coach_identity()),'Roster 1','Scoped name available');
select is((select count(*)::integer from jsonb_object_keys((select to_jsonb(c) from public.get_assigned_coach_identity() c))),2,'Identity has only id and display_name');
select throws_ok($$select public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',1,'Forged',null,'recomp')$$,'42501',null,'Learner cannot edit PT roster');
select set_config('request.jwt.claim.sub','84000000-0000-0000-0000-000000000002',true);
select throws_ok($$select public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',1,'Forged',null,'recomp')$$,'42501',null,'Other PT cannot edit');
select throws_ok($$select public.set_trainee_archived('ae000000-0000-0000-0000-000000000001',1,true)$$,'42501',null,'Other PT cannot archive');
select set_config('request.jwt.claim.sub','84000000-0000-0000-0000-000000000001',true);
select is(public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',1,'Updated learner','0901234567','recomp'),2,'Owner edit increments version');
select is((select display_name from public.trainee_profiles where id='ae000000-0000-0000-0000-000000000001'),'Updated learner','Edited profile persists');
select throws_ok($$select public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',1,'Stale edit',null,'recomp')$$,'40001',null,'Stale edit rejected');
select throws_ok($$select public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',2,'X',null,'recomp')$$,'22023',null,'Invalid name rejected at DB');
select is(public.set_trainee_archived('ae000000-0000-0000-0000-000000000001',2,true),3,'Archive increments version');
select is((select status::text from public.trainee_profiles where id='ae000000-0000-0000-0000-000000000001'),'archived','Profile archived');
select throws_ok($$select public.save_trainee_profile('ae000000-0000-0000-0000-000000000001',3,'Wrong edit',null,'recomp')$$,'22023',null,'Archived profile read only');
select is(public.set_trainee_archived('ae000000-0000-0000-0000-000000000002',1,true),2,'Unlinked profile archived');
select is((select status::text from public.trainee_invitations where token_hash=repeat('a',64)),'revoked','Archiving revokes pending token');
select is(public.set_trainee_archived('ae000000-0000-0000-0000-000000000001',3,false),4,'Restore increments version');
select is((select remaining_sessions from public.trainee_profiles where id='ae000000-0000-0000-0000-000000000001'),12,'Lifecycle does not alter sessions');
select is((select count(*)::integer from public.trainee_profile_events where trainee_id='ae000000-0000-0000-0000-000000000001'),3,'Append-only edit/archive/restore history');
select throws_ok($$delete from public.trainee_profile_events$$,'42501',null,'Client cannot erase audit events');
select * from finish();
rollback;
