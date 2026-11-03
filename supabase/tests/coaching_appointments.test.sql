begin;
create extension if not exists pgtap with schema extensions;
select plan(29);

insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('72000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated','authenticated','calendar-'||n||'@example.test','',now(),'{}'::jsonb,
  jsonb_build_object('display_name','Calendar synthetic '||n),now(),now() from generate_series(1,5) n;
update public.profiles set role='trainee' where id in ('72000000-0000-0000-0000-000000000003','72000000-0000-0000-0000-000000000004');
update public.profiles set role='admin' where id='72000000-0000-0000-0000-000000000005';
insert into public.trainee_profiles(id,profile_id,assigned_pt_id,display_name,primary_goal) values
 ('ac000000-0000-0000-0000-000000000001','72000000-0000-0000-0000-000000000003','72000000-0000-0000-0000-000000000001','Calendar A','recomp'),
 ('ac000000-0000-0000-0000-000000000002','72000000-0000-0000-0000-000000000004','72000000-0000-0000-0000-000000000001','Calendar B','recomp');

create function pg_temp.book(student integer, coach integer, learner integer, nonce integer, starts text, ends text) returns void
language sql security invoker as $$
 insert into public.coaching_appointments(trainee_id,pt_id,learner_id,client_request_id,title,kind,starts_at,ends_at)
 values (('ac000000-0000-0000-0000-00000000000'||student)::uuid,
 ('72000000-0000-0000-0000-00000000000'||coach)::uuid,('72000000-0000-0000-0000-00000000000'||learner)::uuid,
 ('bd000000-0000-0000-0000-'||lpad(nonce::text,12,'0'))::uuid,'Training without exercises','training',starts::timestamptz,ends::timestamptz);
$$;

select has_table('public','coaching_appointments','shared appointments exist');
select is(has_table_privilege('anon','public.coaching_appointments','SELECT'),false,'anonymous cannot read');
select is(has_table_privilege('authenticated','public.coaching_appointments','UPDATE'),false,'no direct appointment edits');
select is(has_table_privilege('authenticated','public.coaching_appointments','DELETE'),false,'no history deletion');
select is(has_column_privilege('authenticated','public.coaching_appointments','created_at','INSERT'),false,'cannot forge audit time');
select is(has_column_privilege('authenticated','public.coaching_appointments','status','INSERT'),false,'cannot bypass slot exclusion by status');

set local role authenticated;
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000001',true);
select lives_ok($$select pg_temp.book(1,1,3,1,'2035-01-01 09:00+07','2035-01-01 10:00+07')$$,'PT creates a session without exercises');
select lives_ok($$select pg_temp.book(1,1,3,2,'2035-01-01 10:00+07','2035-01-01 11:00+07')$$,'adjacent sessions allowed');
select throws_ok($$select pg_temp.book(2,1,4,3,'2035-01-01 09:30+07','2035-01-01 10:30+07')$$,'23P01',null,'PT cannot double book another learner');
select results_eq('select count(*)::bigint from public.coaching_appointments',array[2::bigint],'PT reads own appointments');
select throws_ok($$select pg_temp.book(1,1,3,1,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'23505',null,'nonce cannot create a second appointment');
select throws_ok($$select pg_temp.book(1,1,3,4,'2035-01-02 10:00+07','2035-01-02 09:00+07')$$,'23514',null,'end must follow start');
select throws_ok($$select pg_temp.book(1,2,3,5,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'42501',null,'cannot forge PT');
select throws_ok($$select pg_temp.book(1,1,4,6,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'42501',null,'cannot forge learner');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[2::bigint],'learner reads same two appointments');
select throws_ok($$select pg_temp.book(1,1,3,7,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'42501',null,'learner cannot overwrite PT scheduling authority');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000004',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'other learner cannot read');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000002',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'other PT cannot read');
select throws_ok($$select pg_temp.book(1,2,3,8,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'42501',null,'other PT cannot book assigned learner');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000005',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'admin has no private agenda override');
select throws_ok($$select pg_temp.book(1,5,3,9,'2035-01-02 09:00+07','2035-01-02 10:00+07')$$,'42501',null,'admin cannot impersonate PT');
reset role;
select results_eq($$select remaining_sessions from public.trainee_profiles where id='ac000000-0000-0000-0000-000000000001'$$,array[12],'booking does not deduct sessions');
update public.trainee_profiles set status='archived' where id='ac000000-0000-0000-0000-000000000001';
select results_eq($$select count(*)::bigint from public.coaching_appointments where status='retired'$$,array[2::bigint],'archival retires slots without deleting history');
set local role authenticated;
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'archived PT thread inaccessible');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000003',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'archived learner thread inaccessible');
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000001',true);
select lives_ok($$select pg_temp.book(2,1,4,10,'2035-01-01 09:00+07','2035-01-01 10:00+07')$$,'retired slots no longer block active learner');
reset role;
update public.profiles set role='admin' where id='72000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub','72000000-0000-0000-0000-000000000001',true);
select results_eq('select count(*)::bigint from public.coaching_appointments',array[0::bigint],'role flip cannot retain private access');
reset role;
update public.trainee_profiles set status='active' where id='ac000000-0000-0000-0000-000000000001';
select results_eq($$select count(*)::bigint from public.coaching_appointments where status='retired'$$,array[2::bigint],'unarchive does not resurrect old schedule claims');
update public.trainee_profiles set profile_id=null where id='ac000000-0000-0000-0000-000000000002';
select results_eq($$select count(*)::bigint from public.coaching_appointments where status='scheduled'$$,array[0::bigint],'unlink retires outstanding slot');
select * from finish();
rollback;
