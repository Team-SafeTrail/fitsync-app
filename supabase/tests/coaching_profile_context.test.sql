begin;
create extension if not exists pgtap with schema extensions;
select no_plan();
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('73000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
 'authenticated','authenticated','context-'||n||'@example.test','',now(),'{}'::jsonb,
 jsonb_build_object('display_name','Context synthetic '||n),now(),now() from generate_series(1,6)n;
update public.profiles set role='trainee' where id in ('73000000-0000-0000-0000-000000000003','73000000-0000-0000-0000-000000000004','73000000-0000-0000-0000-000000000006');
update public.profiles set role='admin' where id='73000000-0000-0000-0000-000000000005';
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name,primary_goal) values
 ('ad000000-0000-0000-0000-000000000001','73000000-0000-0000-0000-000000000003','73000000-0000-0000-0000-000000000001','Context A','recomp'),
 ('ad000000-0000-0000-0000-000000000002','73000000-0000-0000-0000-000000000004','73000000-0000-0000-0000-000000000002','Context B','recomp'),
 ('ad000000-0000-0000-0000-000000000003',null,'73000000-0000-0000-0000-000000000001','Context pending','recomp');
create function pg_temp.note(student integer,learner integer,nonce integer,visibility text) returns void language sql security invoker as $$
 insert into public.coaching_notes(trainee_id,pt_id,learner_id,client_request_id,visibility,body) values
 (('ad000000-0000-0000-0000-00000000000'||student)::uuid,auth.uid(),
 case when learner is null then null else ('73000000-0000-0000-0000-00000000000'||learner)::uuid end,
 ('be000000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid,visibility,'Synthetic coaching note');
$$;
create function pg_temp.membership(nonce integer,version integer,starts text default '2026-01-01',ends text default '2027-12-31') returns uuid language sql security invoker as $$
 select public.save_coaching_membership('ad000000-0000-0000-0000-000000000001',('bf000000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid,'Two year membership',starts::date,ends::date,version);
$$;
select has_table('public','coaching_membership_versions','membership history table exists');
select has_table('public','coaching_notes','private/shared note table exists');
select is(has_table_privilege('anon','public.coaching_notes','SELECT'),false,'anonymous cannot read notes');
select is(has_table_privilege('authenticated','public.coaching_membership_versions','INSERT'),false,'membership writes must use controlled revision RPC');
select is(has_table_privilege('authenticated','public.coaching_notes','DELETE'),false,'no silent history deletion');
set local role authenticated;
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000001',true);
select lives_ok($$select pg_temp.note(1,3,1,'private')$$,'PT records private note');
select lives_ok($$select pg_temp.note(1,3,2,'shared')$$,'PT explicitly shares note');
select lives_ok($$select pg_temp.membership(1,0)$$,'PT creates inclusive membership dates');
select lives_ok($$select pg_temp.membership(1,0)$$,'same nonce retries despite stale expected version');
select results_eq('select count(*)::bigint from public.coaching_membership_versions',array[1::bigint],'retry creates one version');
select throws_ok($$select pg_temp.membership(1,0,'2026-02-01')$$,'23505',null,'cannot change contents under committed nonce');
select throws_ok($$select pg_temp.membership(2,0)$$,'40001',null,'stale screen cannot overwrite membership');
select throws_ok($$select pg_temp.membership(2,1,'2028-01-01','2027-01-01')$$,'23514',null,'end date must follow start');
select lives_ok($$select pg_temp.membership(2,1,'2026-02-01')$$,'new revision keeps previous version');
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ad000000-0000-0000-0000-000000000001'$$,array[12],'membership does not debit PT sessions');
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[1::bigint],'learner sees shared note only');
select results_eq('select count(*)::bigint from public.coaching_membership_versions',array[2::bigint],'learner sees own membership history');
select throws_ok($$select pg_temp.note(1,3,3,'shared')$$,'42501',null,'learner cannot impersonate PT notes');
select throws_ok($$select pg_temp.membership(3,2)$$,'42501',null,'learner cannot change membership');
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000002',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'other PT sees no notes');
select results_eq('select count(*)::bigint from public.coaching_membership_versions',array[0::bigint],'other PT sees no membership');
select throws_ok($$select pg_temp.note(1,3,4,'private')$$,'42501',null,'other PT cannot add note');
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'other learner sees no notes');
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000005',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'admin has no note override');
select throws_ok($$select pg_temp.membership(3,2)$$,'42501',null,'admin cannot change membership');
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000001',true);
select lives_ok($$select pg_temp.note(3,null,5,'private')$$,'PT can take private intake note before invitation acceptance');
select throws_ok($$select pg_temp.note(3,null,6,'shared')$$,'23514',null,'unlinked learner cannot receive a shared note');
reset role;
update public.trainee_profiles set status='archived' where id='ad000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'archive removes learner note access');
select results_eq('select count(*)::bigint from public.coaching_membership_versions',array[0::bigint],'archive removes membership access');
reset role;
update public.trainee_profiles set status='active',profile_id='73000000-0000-0000-0000-000000000006' where id='ad000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000006',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'replacement learner cannot inherit old notes');
select results_eq('select count(*)::bigint from public.coaching_membership_versions',array[0::bigint],'replacement learner cannot inherit old membership');
reset role;
update public.profiles set role='admin' where id='73000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','73000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_notes',array[0::bigint],'role flip cannot retain private note access');
reset role;
select is(has_function_privilege('anon','public.save_coaching_membership(uuid,uuid,text,date,date,integer)','EXECUTE'),false,'anonymous cannot invoke membership write');
select * from finish();
rollback;
