begin;
create extension if not exists pgtap with schema extensions;
select no_plan();
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('74000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
 'authenticated','authenticated','change-'||n||'@example.test','',now(),'{}'::jsonb,
 jsonb_build_object('display_name','Change synthetic '||n,'synthetic',true),now(),now() from generate_series(1,5)n;
update public.profiles set role='trainee' where id in ('74000000-0000-0000-0000-000000000003','74000000-0000-0000-0000-000000000004');
update public.profiles set role='admin' where id='74000000-0000-0000-0000-000000000005';
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name,primary_goal) values
 ('ae000000-0000-0000-0000-000000000001','74000000-0000-0000-0000-000000000003','74000000-0000-0000-0000-000000000001','Change A','recomp'),
 ('ae000000-0000-0000-0000-000000000002','74000000-0000-0000-0000-000000000004','74000000-0000-0000-0000-000000000001','Change B','recomp');
set local role authenticated;
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000001',true);
-- Fixed primary keys are test setup only; normal API callers cannot choose IDs.
reset role;
insert into public.coaching_appointments(id,trainee_id,pt_id,learner_id,client_request_id,title,kind,starts_at,ends_at) values
 ('af000000-0000-0000-0000-000000000001','ae000000-0000-0000-0000-000000000001',auth.uid(),'74000000-0000-0000-0000-000000000003','ab000000-0000-0000-0000-000000000001','Change A','training','2035-01-01 09:00+07','2035-01-01 10:00+07'),
 ('af000000-0000-0000-0000-000000000002','ae000000-0000-0000-0000-000000000002',auth.uid(),'74000000-0000-0000-0000-000000000004','ab000000-0000-0000-0000-000000000002','Busy slot','training','2035-01-02 09:00+07','2035-01-02 10:00+07');
reset role;
create function pg_temp.request(nonce integer,version integer default 1,starts text default '2035-01-03 09:00+07') returns uuid language sql security invoker as $$
select public.request_appointment_change('af000000-0000-0000-0000-000000000001',version,'reschedule',starts::timestamptz,starts::timestamptz+interval '1 hour','Synthetic schedule request',('ab000000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid);
$$;
create function pg_temp.resolve(nonce integer,choice text default 'accepted',version integer default 1) returns text language sql security invoker as $$
select public.resolve_appointment_change((select id from public.appointment_change_requests where client_request_id='ab000000-0000-0000-0000-000000000011'),choice,version,('ab000000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid);
$$;
select is(has_table_privilege('anon','public.appointment_events','SELECT'),false,'anonymous has no event access');
select is(has_table_privilege('authenticated','public.appointment_change_requests','INSERT'),false,'requests cannot bypass RPC');
select is(has_table_privilege('authenticated','public.appointment_events','UPDATE'),false,'audit append only');
select is(has_column_privilege('authenticated','public.coaching_appointments','version','UPDATE'),false,'cannot forge version');
select is((select count(*) from public.appointment_events),2::bigint,'new bookings are audited');
set local role authenticated;
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000002',true);
select results_eq('select count(*) from public.appointment_events',array[0::bigint],'outsider cannot read event history');
select throws_ok($$select pg_temp.request(11)$$,'42501',null,'outsider cannot request change');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000003',true);
select lives_ok($$select pg_temp.request(11)$$,'learner proposes a change');
select lives_ok($$select pg_temp.request(11)$$,'same request is retry safe');
select results_eq('select count(*) from public.appointment_change_requests',array[1::bigint],'one request on retry');
select throws_ok($$select pg_temp.request(11,1,'2035-01-04 09:00+07')$$,'23505',null,'cannot reuse nonce for different time');
select throws_ok($$select pg_temp.request(12)$$,'23505',null,'only one pending request per appointment');
select results_eq($$select starts_at from public.coaching_appointments where id='af000000-0000-0000-0000-000000000001'$$,array['2035-01-01 09:00+07'::timestamptz],'proposal keeps original slot');
select throws_ok($$select pg_temp.resolve(21)$$,'42501',null,'learner cannot accept own request');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000001',true);
select throws_ok($$select pg_temp.resolve(21,'accepted',2)$$,'40001',null,'stale PT screen conflicts');
select lives_ok($$select pg_temp.resolve(21)$$,'PT accepts atomically');
select lives_ok($$select pg_temp.resolve(21)$$,'decision retry succeeds after version changed');
select results_eq($$select version from public.coaching_appointments where id='af000000-0000-0000-0000-000000000001'$$,array[2],'accept increments version once');
select results_eq($$select state from public.appointment_change_requests$$,array['accepted'::text],'request records accepted decision');
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ae000000-0000-0000-0000-000000000001'$$,array[12],'change does not debit package');
select throws_ok($$select public.change_coaching_appointment('af000000-0000-0000-0000-000000000001',2,'reschedule','2035-01-02 09:30+07','2035-01-02 10:30+07','Synthetic direct conflict','ab000000-0000-0000-0000-000000000031')$$,'23P01',null,'PT reschedule respects overlap');
select results_eq($$select version from public.coaching_appointments where id='af000000-0000-0000-0000-000000000001'$$,array[2],'failed overlap rolls back event and version');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000003',true);
select lives_ok($$select pg_temp.request(12,2,'2035-01-02 09:30+07')$$,'proposal may ask for a busy slot without moving original');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000001',true);
select throws_ok($$select public.resolve_appointment_change((select id from public.appointment_change_requests where state='pending'),'accepted',2,'ab000000-0000-0000-0000-000000000022')$$,'23P01',null,'accept overlap fails atomically');
select results_eq($$select state from public.appointment_change_requests where client_request_id='ab000000-0000-0000-0000-000000000012'$$,array['pending'::text],'failed accept keeps request pending');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000003',true);
select lives_ok($$select public.withdraw_appointment_change((select id from public.appointment_change_requests where state='pending'),'ab000000-0000-0000-0000-000000000023')$$,'learner withdraws pending proposal');
select lives_ok($$select public.withdraw_appointment_change((select id from public.appointment_change_requests where state='withdrawn'),'ab000000-0000-0000-0000-000000000023')$$,'withdraw is retry safe');
select lives_ok($$select pg_temp.request(13,2)$$,'learner can make new proposal after withdrawal');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000001',true);
select lives_ok($$select public.change_coaching_appointment('af000000-0000-0000-0000-000000000001',2,'cancel',null,null,'Synthetic PT cancellation','ab000000-0000-0000-0000-000000000032')$$,'PT cancels with reason');
select lives_ok($$select public.change_coaching_appointment('af000000-0000-0000-0000-000000000001',2,'cancel',null,null,'Synthetic PT cancellation','ab000000-0000-0000-0000-000000000032')$$,'cancel retry returns same revision');
select results_eq($$select state from public.appointment_change_requests where client_request_id='ab000000-0000-0000-0000-000000000013'$$,array['stale'::text],'direct change makes old proposal stale');
select results_eq($$select status from public.coaching_appointments where id='af000000-0000-0000-0000-000000000001'$$,array['retired'::text],'canceled slot is retired, not deleted');
select results_eq($$select count(*) from public.appointment_events where appointment_id='af000000-0000-0000-0000-000000000001'$$,array[3::bigint],'create, reschedule, cancel keep three audit events');
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000005',true);
select results_eq('select count(*) from public.appointment_change_requests',array[0::bigint],'admin cannot read private change reasons');
select throws_ok($$select pg_temp.request(14,3)$$,'42501',null,'admin cannot impersonate learner');
reset role;
update public.trainee_profiles set status='archived' where id='ae000000-0000-0000-0000-000000000002';
set local role authenticated;
select set_config('request.jwt.claim.sub','74000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*) from public.appointment_events',array[0::bigint],'archive denies history to archived pair');
reset role;
select is((select version from public.coaching_appointments where id='af000000-0000-0000-0000-000000000002'),2,'relationship retirement increments version');
select * from finish();
rollback;
