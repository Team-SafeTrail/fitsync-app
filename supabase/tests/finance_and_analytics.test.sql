-- All rows and receipt metadata below are disposable unit fixtures, never
-- evidence of customer payments. False synthetic flag exercises actual-mode rules.
begin;
create extension if not exists pgtap with schema extensions;
select plan(30);
insert into auth.users(id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
select ('85000000-0000-0000-0000-00000000000'||n)::uuid,'00000000-0000-0000-0000-000000000000'::uuid,
 'authenticated','authenticated','ledger-fixture-'||n||'@fitsync.invalid','',now(),'{}',
 jsonb_build_object('display_name','Ledger fixture '||n,'synthetic',n<>2),now(),now() from generate_series(1,4) n;
update public.profiles set role='admin' where id='85000000-0000-0000-0000-000000000001';
update public.profiles set role='trainee' where id='85000000-0000-0000-0000-000000000003';
delete from public.pt_profiles where id in ('85000000-0000-0000-0000-000000000001','85000000-0000-0000-0000-000000000003');
insert into storage.objects(bucket_id,name,metadata) values ('finance-evidence','85000000-0000-0000-0000-000000000001/unit-fixture.png','{"mimetype":"image/png","size":100}');

select is(has_table_privilege('authenticated','public.finance_entries','INSERT'),false,'No direct ledger insert');
select is(has_table_privilege('authenticated','public.finance_entries','UPDATE'),false,'No ledger mutation');
select is(has_table_privilege('authenticated','public.finance_entries','DELETE'),false,'No ledger deletion');
select is(has_function_privilege('anon','public.get_admin_overview()','EXECUTE'),false,'No anonymous admin snapshot');
select is((select public from storage.buckets where id='finance-evidence'),false,'Receipts are private');
set local role authenticated;
select set_config('request.jwt.claim.sub','85000000-0000-0000-0000-000000000002',true);
select throws_ok('select public.get_admin_overview()','42501',null,'PT cannot get admin data');
select is((select count(*)::integer from public.finance_entries),0,'PT cannot read ledger');
select lives_ok($$select public.request_pt_upgrade('cc000000-0000-0000-0000-000000000001')$$,'PT can request upgrade');
select is(public.request_pt_upgrade('cc000000-0000-0000-0000-000000000001'),public.request_pt_upgrade('cc000000-0000-0000-0000-000000000002'),'Retries and multiple pending requests reuse one request');
select is((select amount_vnd from public.billing_requests where customer_id=auth.uid()),199000,'Server fixes price');
select lives_ok('select public.log_workspace_open()','Workspace usage can be recorded');
select lives_ok('select public.log_workspace_open()','Daily retry accepted');
select set_config('request.jwt.claim.sub','85000000-0000-0000-0000-000000000003',true);
select throws_ok($$select public.request_pt_upgrade('cc000000-0000-0000-0000-000000000003')$$,'42501',null,'Learner cannot purchase PT plan');
select throws_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000010','income','subscription',199000,'unit-ref-1',now(),'85000000-0000-0000-0000-000000000001/unit-fixture.png',repeat('a',64),'Unit fixture only',false,'85000000-0000-0000-0000-000000000002')$$,'42501',null,'Non-admin cannot verify payment');
select set_config('request.jwt.claim.sub','85000000-0000-0000-0000-000000000001',true);
select is((public.get_admin_overview()->>'paidCustomers')::integer,0,'Legacy plans and requests are not paid customers');
select is((select count(*)::integer from public.product_events where actor_id='85000000-0000-0000-0000-000000000002' and event_key='workspace_opened'),1,'One daily workspace event per actor');
select lives_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000010','income','subscription',199000,'unit-ref-1',now(),'85000000-0000-0000-0000-000000000001/unit-fixture.png',repeat('a',64),'Unit fixture only',false,'85000000-0000-0000-0000-000000000002')$$,'Admin reconciliation records unit fixture');
select lives_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000010','income','subscription',199000,'unit-ref-1',now(),'85000000-0000-0000-0000-000000000001/unit-fixture.png',repeat('a',64),'Unit fixture only',false,'85000000-0000-0000-0000-000000000002')$$,'Identical nonce retry is idempotent');
select is((public.get_admin_overview()->>'recordedRevenueVnd')::bigint,199000::bigint,'One recorded income only');
select is((public.get_admin_overview()->>'paidCustomers')::integer,1,'Reconciled subscription counts one payer');
select is((select state from public.billing_requests where customer_id='85000000-0000-0000-0000-000000000002'),'reconciled','Payment reconciles pending request');
select throws_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000011','income','subscription',199000,'unit-ref-1',now(),'85000000-0000-0000-0000-000000000001/unit-fixture.png',repeat('a',64),'Duplicate reference',false,'85000000-0000-0000-0000-000000000002')$$,'23505',null,'Bank reference cannot count twice');
select throws_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000012','income','subscription',199000,'unit-ref-2',now(),'85000000-0000-0000-0000-000000000001/unit-fixture.png',repeat('a',64),'Synthetic must be test',false,'85000000-0000-0000-0000-000000000004')$$,'22023',null,'Synthetic customer cannot become actual revenue');
select throws_ok($$select public.record_finance_entry('cc000000-0000-0000-0000-000000000013','expense','hosting',10000,'unit-ref-3',now(),'missing.png',repeat('a',64),'Missing evidence fixture',true,null)$$,'22023',null,'Missing receipt rejected');
select lives_ok($$select public.reverse_finance_entry((select id from public.finance_entries where bank_reference='unit-ref-1'),'cc000000-0000-0000-0000-000000000020','Unit reversal fixture')$$,'Correction appends a reversal');
select is((public.get_admin_overview()->>'recordedRevenueVnd')::bigint,0::bigint,'Reversal removes revenue');
select is((public.get_admin_overview()->>'paidCustomers')::integer,0,'Reversed payment does not count payer');
select is((select state from public.billing_requests where customer_id='85000000-0000-0000-0000-000000000002'),'reversed','Reversed payment is visible on billing request');
select is((select count(*)::integer from public.finance_entries),2,'Original and reversal both retained');
select throws_ok($$select public.reverse_finance_entry((select id from public.finance_entries where bank_reference='unit-ref-1'),'cc000000-0000-0000-0000-000000000021','Second reversal fixture')$$,'23505',null,'Cannot reverse twice');
select * from finish();
rollback;
