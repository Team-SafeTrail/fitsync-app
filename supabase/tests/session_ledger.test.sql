begin;
create extension if not exists pgtap with schema extensions;
select no_plan();
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('75000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
 'authenticated','authenticated','session-'||n||'@example.test','',now(),'{}'::jsonb,
 jsonb_build_object('display_name','Session synthetic '||n,'synthetic',true),now(),now() from generate_series(1,5)n;
update public.profiles set role='trainee' where id in ('75000000-0000-0000-0000-000000000003','75000000-0000-0000-0000-000000000004');
update public.profiles set role='admin' where id='75000000-0000-0000-0000-000000000005';
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name,primary_goal,total_sessions,remaining_sessions) values
 ('ab000000-0000-0000-0000-000000000001','75000000-0000-0000-0000-000000000003','75000000-0000-0000-0000-000000000001','Session A','recomp',12,8);
create function pg_temp.adjust(nonce integer,version integer,balance integer,reason text default 'Synthetic balance correction') returns integer language sql security invoker as $$
select public.set_session_balance('ab000000-0000-0000-0000-000000000001',version,balance,reason,('ab100000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid);
$$;
select is(has_column_privilege('authenticated','public.trainee_profiles','remaining_sessions','UPDATE'),false,'no direct balance bypass');
select is(has_column_privilege('authenticated','public.trainee_profiles','total_sessions','UPDATE'),false,'no unaudited total edits');
select is(has_table_privilege('authenticated','public.session_ledger','INSERT'),false,'ledger writes use controlled RPC');
select is(has_table_privilege('authenticated','public.session_ledger','DELETE'),false,'history cannot be deleted');
select is((select count(*) from public.session_entitlements),0::bigint,'migration does not fabricate opening or past attendance');
set local role authenticated;
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000002',true);
select throws_ok($$select pg_temp.adjust(1,0,7)$$,'42501',null,'outsider PT cannot adjust');
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000001',true);
select lives_ok($$select pg_temp.adjust(1,0,7)$$,'owner records correction from known balance');
select lives_ok($$select pg_temp.adjust(1,0,7)$$,'adjustment retry is idempotent');
select results_eq('select count(*) from public.session_ledger',array[2::bigint],'one opening and one adjustment');
select results_eq($$select delta from public.session_ledger where kind='opening'$$,array[8],'opening captures remaining, not invented historical sessions');
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ab000000-0000-0000-0000-000000000001'$$,array[7],'compatibility balance matches ledger');
select throws_ok($$select pg_temp.adjust(1,0,6)$$,'23505',null,'nonce payload cannot change');
select throws_ok($$select pg_temp.adjust(2,0,6)$$,'40001',null,'stale adjustment rejected');
select throws_ok($$select pg_temp.adjust(2,1,-1)$$,'22023',null,'negative rejected');
select throws_ok($$select pg_temp.adjust(2,1,13)$$,'22023',null,'balance cannot exceed package total');
insert into public.coaching_appointments(id,trainee_id,pt_id,learner_id,client_request_id,title,kind,starts_at,ends_at) values
 ('ab200000-0000-0000-0000-000000000001','ab000000-0000-0000-0000-000000000001',auth.uid(),'75000000-0000-0000-0000-000000000003','ab300000-0000-0000-0000-000000000001','Synthetic session','training','2035-01-01 09:00+07','2035-01-01 10:00+07');
select throws_ok($$select public.complete_coaching_appointment('ab200000-0000-0000-0000-000000000001',1,1,true,'Synthetic complete','ab400000-0000-0000-0000-000000000001')$$,'23514',null,'future appointment cannot be called completed');
reset role;
-- Test-only clock fixture: ordinary users still cannot edit appointment rows.
update public.coaching_appointments set starts_at=now()-interval '2 hours',ends_at=now()-interval '1 hour' where id='ab200000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*) from public.session_ledger',array[2::bigint],'current learner reads own ledger');
select throws_ok($$select pg_temp.adjust(2,1,6)$$,'42501',null,'learner cannot adjust balance');
select throws_ok($$select public.complete_coaching_appointment('ab200000-0000-0000-0000-000000000001',2,1,true,'Synthetic complete','ab400000-0000-0000-0000-000000000001')$$,'42501',null,'learner cannot self debit');
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000001',true);
select lives_ok($$select public.complete_coaching_appointment('ab200000-0000-0000-0000-000000000001',2,1,true,'Synthetic complete','ab400000-0000-0000-0000-000000000001')$$,'PT confirms elapsed appointment with explicit debit');
select lives_ok($$select public.complete_coaching_appointment('ab200000-0000-0000-0000-000000000001',2,1,true,'Synthetic complete','ab400000-0000-0000-0000-000000000001')$$,'completion retry does not debit twice');
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ab000000-0000-0000-0000-000000000001'$$,array[6],'one completed session debits exactly one');
select throws_ok($$select public.complete_coaching_appointment('ab200000-0000-0000-0000-000000000001',2,2,true,'Different nonce completion','ab400000-0000-0000-0000-000000000002')$$,'23505',null,'another nonce cannot complete same appointment twice');
select throws_ok($$select public.change_coaching_appointment('ab200000-0000-0000-0000-000000000001',2,'reschedule','2035-01-02 09:00+07','2035-01-02 10:00+07','Synthetic change after completion','ab400000-0000-0000-0000-000000000003')$$,'23514',null,'completed time cannot be rewritten');
select lives_ok($$select public.reverse_session_completion((select id from public.session_ledger where kind='completion'),2,'Synthetic mistaken completion','ab500000-0000-0000-0000-000000000001')$$,'PT corrects by reversal, preserving debit');
select lives_ok($$select public.reverse_session_completion((select id from public.session_ledger where kind='completion'),2,'Synthetic mistaken completion','ab500000-0000-0000-0000-000000000001')$$,'same reversal retry does not add another credit');
select throws_ok($$select public.reverse_session_completion((select id from public.session_ledger where kind='completion'),3,'Another mistaken completion','ab500000-0000-0000-0000-000000000002')$$,'23505',null,'only one reversal per completion');
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ab000000-0000-0000-0000-000000000001'$$,array[7],'reversal restores one session');
select results_eq('select sum(delta)::integer from public.session_ledger',array[7],'ledger sum equals current remaining balance');
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000005',true);
select results_eq('select count(*) from public.session_ledger',array[0::bigint],'admin has no private coaching ledger override');
reset role;
update public.trainee_profiles set profile_id='75000000-0000-0000-0000-000000000004' where id='ab000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*) from public.session_ledger',array[0::bigint],'replacement identity does not inherit old ledger');
select set_config('request.jwt.claim.sub','75000000-0000-0000-0000-000000000001',true);
select throws_ok($$select pg_temp.adjust(2,3,6)$$,'42501',null,'changed identity needs entitlement review, not silent transfer');
reset role;
select * from finish();
rollback;
