-- Genuine administration and manual reconciliation. Empty at migration time:
-- neither legacy Pro flags nor synthetic fixtures become revenue or receipts.
create function public.is_system_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
revoke all on function public.is_system_admin() from public, anon, authenticated;
grant execute on function public.is_system_admin() to authenticated;

create table public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete restrict,
  client_nonce uuid not null,
  kind text not null check (kind in ('income','expense','reversal')),
  category text not null check (category in ('subscription','marketing','hosting','tools','other')),
  amount_vnd bigint not null check (amount_vnd between 1 and 10000000000),
  customer_id uuid references public.pt_profiles(id) on delete restrict,
  bank_reference text,
  occurred_at timestamptz not null,
  evidence_path text not null,
  evidence_sha256 text not null check (evidence_sha256 ~ '^[0-9a-f]{64}$'),
  note text not null check (length(btrim(note)) between 5 and 500),
  is_test boolean not null default false,
  reverses_id uuid unique references public.finance_entries(id) on delete restrict,
  service_until timestamptz,
  created_at timestamptz not null default now(),
  unique(actor_id,client_nonce),
  check ((kind = 'reversal') = (reverses_id is not null)),
  check (kind = 'reversal' or (bank_reference is not null and length(bank_reference) between 3 and 120)),
  check (category <> 'subscription' or customer_id is not null)
);
create unique index finance_reference_once on public.finance_entries(bank_reference) where kind <> 'reversal';
create index finance_entries_date_idx on public.finance_entries(occurred_at desc, id desc);
alter table public.finance_entries enable row level security;
revoke all on public.finance_entries from public, anon, authenticated;
grant select on public.finance_entries to authenticated;
create policy finance_admin_read on public.finance_entries for select to authenticated using (public.is_system_admin());

create table public.billing_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.pt_profiles(id) on delete restrict,
  client_nonce uuid not null,
  amount_vnd integer not null default 199000 check (amount_vnd = 199000),
  state text not null default 'requested' check (state in ('requested','reconciled','withdrawn','reversed')),
  finance_entry_id uuid unique references public.finance_entries(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(customer_id,client_nonce),
  check ((state in ('reconciled','reversed')) = (finance_entry_id is not null))
);
create unique index billing_one_pending_per_pt on public.billing_requests(customer_id) where state = 'requested';
alter table public.billing_requests enable row level security;
revoke all on public.billing_requests from public, anon, authenticated;
grant select on public.billing_requests to authenticated;
create policy billing_read_own_or_admin on public.billing_requests for select to authenticated
using (customer_id = auth.uid() or public.is_system_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('finance-evidence','finance-evidence',false,5242880,array['application/pdf','image/jpeg','image/png']);
create policy finance_evidence_upload_admin on storage.objects for insert to authenticated with check (
 bucket_id='finance-evidence' and public.is_system_admin() and (storage.foldername(name))[1] = auth.uid()::text
);
create policy finance_evidence_read_admin on storage.objects for select to authenticated using (
 bucket_id='finance-evidence' and public.is_system_admin()
);
create policy finance_evidence_cleanup_unreferenced on storage.objects for delete to authenticated using (
 bucket_id='finance-evidence' and public.is_system_admin() and (storage.foldername(name))[1] = auth.uid()::text
 and not exists (select 1 from public.finance_entries e where e.evidence_path=name)
);

create function public.request_pt_upgrade(request_nonce uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid;
begin
 if (select role from public.profiles where id=auth.uid()) is distinct from 'pt'::public.user_role or request_nonce is null then
   raise exception 'PT account required' using errcode='42501'; end if;
 perform 1 from public.pt_profiles where id=auth.uid() for update;
 if not found then raise exception 'PT account required' using errcode='42501'; end if;
 select id into result from public.billing_requests where customer_id=auth.uid() and (client_nonce=request_nonce or state='requested') order by created_at limit 1;
 if result is not null then return result; end if;
 insert into public.billing_requests(customer_id,client_nonce) values(auth.uid(),request_nonce) returning id into result;
 return result;
end; $$;

create function public.record_finance_entry(request_nonce uuid, entry_kind text, entry_category text, amount bigint,
 transaction_reference text, transacted_at timestamptz, receipt_path text, receipt_sha256 text, description text, test_entry boolean, customer uuid default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare existing public.finance_entries%rowtype; result uuid; paid_until timestamptz; synthetic_customer boolean;
begin
 if not public.is_system_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 -- One administrator's retries serialize before inspecting the nonce.
 perform 1 from public.profiles where id=auth.uid() for update;
 select * into existing from public.finance_entries where actor_id=auth.uid() and client_nonce=request_nonce;
 if found then
  if existing.kind=entry_kind and existing.category=entry_category and existing.amount_vnd=amount
    and existing.customer_id is not distinct from customer and existing.bank_reference=lower(btrim(transaction_reference))
    and existing.occurred_at=transacted_at and existing.evidence_path=receipt_path and existing.evidence_sha256=receipt_sha256
    and existing.note=btrim(description) and existing.is_test=test_entry then return existing.id; end if;
  raise exception 'Nonce reused with different entry' using errcode='40001';
 end if;
 if request_nonce is null or entry_kind not in ('income','expense') or entry_category not in ('subscription','marketing','hosting','tools','other')
  or amount is null or amount not between 1 and 10000000000 or transacted_at is null or transacted_at > now()+interval '5 minutes'
  or test_entry is null or length(btrim(description)) not between 5 and 500 or description is null
  or transaction_reference is null or length(btrim(transaction_reference)) not between 3 and 120
  or receipt_sha256 is null or receipt_sha256 !~ '^[0-9a-f]{64}$' then
  raise exception 'Invalid finance entry' using errcode='22023'; end if;
 if not exists (select 1 from storage.objects where bucket_id='finance-evidence' and name=receipt_path
   and (storage.foldername(name))[1]=auth.uid()::text) then raise exception 'Private receipt required' using errcode='22023'; end if;
 if customer is not null then
  perform 1 from public.pt_profiles p join public.profiles u on u.id=p.id where p.id=customer and u.role='pt' for update of p;
  if not found then raise exception 'PT customer required' using errcode='22023'; end if;
  select coalesce((u.raw_user_meta_data->>'synthetic')='true',false) or coalesce(u.email ~* '(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])',false)
   into synthetic_customer from auth.users u where u.id=customer;
  if synthetic_customer and not test_entry then raise exception 'Synthetic customer cannot be actual revenue' using errcode='22023'; end if;
 end if;
 if entry_category='subscription' then
  if entry_kind<>'income' or customer is null or amount<>199000 then raise exception 'Subscription is 199000 VND per PT month' using errcode='22023'; end if;
  if not test_entry then
   select greatest(now(),coalesce(max(e.service_until),now()))+interval '1 month' into paid_until
    from public.finance_entries e where e.customer_id=customer and e.category='subscription' and e.kind='income' and not e.is_test
    and not exists(select 1 from public.finance_entries r where r.reverses_id=e.id);
  end if;
 end if;
 insert into public.finance_entries(actor_id,client_nonce,kind,category,amount_vnd,customer_id,bank_reference,occurred_at,evidence_path,evidence_sha256,note,is_test,service_until)
 values(auth.uid(),request_nonce,entry_kind,entry_category,amount,customer,lower(btrim(transaction_reference)),transacted_at,receipt_path,receipt_sha256,btrim(description),test_entry,paid_until) returning id into result;
 if paid_until is not null then
  update public.pt_profiles set subscription_plan='pro', subscription_valid_until=paid_until where id=customer;
  update public.billing_requests set state='reconciled',finance_entry_id=result where customer_id=customer and state='requested';
 end if;
 return result;
end; $$;

create function public.reverse_finance_entry(target_entry uuid, request_nonce uuid, reason text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare original public.finance_entries%rowtype; existing public.finance_entries%rowtype; result uuid; paid_until timestamptz;
begin
 if not public.is_system_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 perform 1 from public.profiles where id=auth.uid() for update;
 select * into existing from public.finance_entries where actor_id=auth.uid() and client_nonce=request_nonce;
 if found then
  if existing.reverses_id=target_entry and existing.note=btrim(reason) then return existing.id; end if;
  raise exception 'Nonce reused' using errcode='40001';
 end if;
 if request_nonce is null or reason is null or length(btrim(reason)) not between 5 and 500 then raise exception 'Reason required' using errcode='22023'; end if;
 select * into original from public.finance_entries where id=target_entry for update;
 if not found or original.kind='reversal' then raise exception 'Original entry required' using errcode='22023'; end if;
 if original.customer_id is not null then perform 1 from public.pt_profiles where id=original.customer_id for update; end if;
 if exists(select 1 from public.finance_entries where reverses_id=target_entry) then raise exception 'Already reversed' using errcode='23505'; end if;
 insert into public.finance_entries(actor_id,client_nonce,kind,category,amount_vnd,customer_id,occurred_at,evidence_path,evidence_sha256,note,is_test,reverses_id)
 values(auth.uid(),request_nonce,'reversal',original.category,original.amount_vnd,original.customer_id,now(),original.evidence_path,original.evidence_sha256,btrim(reason),original.is_test,original.id) returning id into result;
 if original.category='subscription' and not original.is_test then
  update public.billing_requests set state='reversed' where finance_entry_id=original.id;
  select max(e.service_until) into paid_until from public.finance_entries e where e.customer_id=original.customer_id
   and e.category='subscription' and e.kind='income' and not e.is_test and not exists(select 1 from public.finance_entries r where r.reverses_id=e.id);
  update public.pt_profiles set subscription_plan=case when paid_until>now() then 'pro'::public.subscription_plan else 'free'::public.subscription_plan end,
   subscription_valid_until=paid_until where id=original.customer_id;
 end if;
 return result;
end; $$;

revoke all on function public.request_pt_upgrade(uuid) from public,anon,authenticated;
revoke all on function public.record_finance_entry(uuid,text,text,bigint,text,timestamptz,text,text,text,boolean,uuid) from public,anon,authenticated;
revoke all on function public.reverse_finance_entry(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.request_pt_upgrade(uuid) to authenticated;
grant execute on function public.record_finance_entry(uuid,text,text,bigint,text,timestamptz,text,text,text,boolean,uuid) to authenticated;
grant execute on function public.reverse_finance_entry(uuid,uuid,text) to authenticated;

-- Privacy-minimal, first-party event ledger. It stores no health values, text,
-- IP address, message, URL, email or phone. No third-party tracking is enabled.
create table public.product_events (
 id uuid primary key default gen_random_uuid(), actor_id uuid not null references public.profiles(id) on delete restrict,
 event_key text not null check(event_key in ('registered','workspace_opened','trainee_created','invitation_accepted','inbody_confirmed','checkin_submitted','chat_sent','appointment_created','upgrade_requested')),
 subject_id uuid, channel text not null default 'unknown' check(channel in ('unknown','direct','facebook','tiktok','zalo','referral')),
 is_test boolean not null, event_day date not null default public.application_local_date(now()), occurred_at timestamptz not null default now(),
 unique(actor_id,event_key,subject_id)
);
create unique index workspace_daily_event_once on public.product_events(actor_id,event_key,event_day) where event_key='workspace_opened';
create index product_event_week_idx on public.product_events(event_day,event_key) where not is_test;
alter table public.product_events enable row level security;
revoke all on public.product_events from public,anon,authenticated;
grant select on public.product_events to authenticated;
create policy product_events_admin_read on public.product_events for select to authenticated using(public.is_system_admin());

create function public.capture_product_event()
returns trigger language plpgsql security definer set search_path='' as $$
declare actor uuid; subject uuid; key text; synthetic boolean; origin text := 'unknown';
begin
 if tg_table_name='profiles' then actor:=new.id; subject:=new.id; key:='registered';
 elsif tg_table_name='trainee_profiles' and tg_op='INSERT' then actor:=new.assigned_pt_id; subject:=new.id; key:='trainee_created';
 elsif tg_table_name='trainee_profiles' then
  if old.profile_id is not null or new.profile_id is null then return new; end if;
  actor:=new.profile_id; subject:=new.id; key:='invitation_accepted';
 elsif tg_table_name='inbody_records' then actor:=new.pt_id; subject:=new.id; key:='inbody_confirmed';
 elsif tg_table_name='checkins' then select profile_id into actor from public.trainee_profiles where id=new.trainee_id; subject:=new.id; key:='checkin_submitted';
 elsif tg_table_name='coaching_messages' then actor:=new.sender_id; subject:=new.id; key:='chat_sent';
 elsif tg_table_name='coaching_appointments' then actor:=new.pt_id; subject:=new.id; key:='appointment_created';
 elsif tg_table_name='billing_requests' then actor:=new.customer_id; subject:=new.id; key:='upgrade_requested';
 end if;
 if actor is null then return new; end if;
 select coalesce((raw_user_meta_data->>'synthetic')='true',false) or coalesce(email ~* '(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])',false),
  case when raw_user_meta_data->>'acquisition_channel' in ('direct','facebook','tiktok','zalo','referral') then raw_user_meta_data->>'acquisition_channel' else 'unknown' end
 into synthetic,origin from auth.users where id=actor;
 insert into public.product_events(actor_id,event_key,subject_id,channel,is_test) values(actor,key,subject,coalesce(origin,'unknown'),coalesce(synthetic,true)) on conflict do nothing;
 return new;
end; $$;
revoke all on function public.capture_product_event() from public,anon,authenticated;
create trigger event_registered after insert on public.profiles for each row execute function public.capture_product_event();
create trigger event_trainee_created after insert on public.trainee_profiles for each row execute function public.capture_product_event();
create trigger event_invitation_accepted after update of profile_id on public.trainee_profiles for each row execute function public.capture_product_event();
create trigger event_inbody_confirmed after insert on public.inbody_records for each row execute function public.capture_product_event();
create trigger event_checkin_submitted after insert on public.checkins for each row execute function public.capture_product_event();
create trigger event_chat_sent after insert on public.coaching_messages for each row execute function public.capture_product_event();
create trigger event_appointment_created after insert on public.coaching_appointments for each row execute function public.capture_product_event();
create trigger event_upgrade_requested after insert on public.billing_requests for each row execute function public.capture_product_event();

create function public.log_workspace_open()
returns void language plpgsql security definer set search_path='' as $$
declare synthetic boolean;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role in ('pt','trainee')) then raise exception 'Workspace account required' using errcode='42501'; end if;
 select coalesce((raw_user_meta_data->>'synthetic')='true',false) or coalesce(email ~* '(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])',false) into synthetic from auth.users where id=auth.uid();
 insert into public.product_events(actor_id,event_key,is_test) values(auth.uid(),'workspace_opened',coalesce(synthetic,true)) on conflict do nothing;
end; $$;
revoke all on function public.log_workspace_open() from public,anon,authenticated;
grant execute on function public.log_workspace_open() to authenticated;

create function public.get_admin_overview()
returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not public.is_system_admin() then raise exception 'Admin required' using errcode='42501'; end if;
 select jsonb_build_object(
  'checkedAt',now(),'totalPts',(select count(*) from public.profiles where role='pt'),
  'totalTrainees',(select count(*) from public.trainee_profiles),'totalInBodyRecords',(select count(*) from public.inbody_records),
  'authAccounts',(select count(*) from auth.users),'trackingSince',(select min(occurred_at) from public.product_events),
  'financeEntries',coalesce((select jsonb_agg(x) from (select * from public.finance_entries order by occurred_at desc,id desc limit 200) x),'[]'::jsonb),
  'billingRequests',coalesce((select jsonb_agg(x) from (select * from public.billing_requests order by created_at desc,id desc limit 200) x),'[]'::jsonb),
  'activeUsers7d',(select count(distinct actor_id) from public.product_events where not is_test and event_key='workspace_opened' and occurred_at>=now()-interval '7 days'),
  'paidCustomers',(select count(distinct e.customer_id) from public.finance_entries e where e.kind='income' and e.category='subscription' and not e.is_test and not exists(select 1 from public.finance_entries r where r.reverses_id=e.id)),
  'recordedRevenueVnd',(select coalesce(sum(case when e.kind='income' then e.amount_vnd when e.kind='reversal' and o.kind='income' then -e.amount_vnd else 0 end),0) from public.finance_entries e left join public.finance_entries o on o.id=e.reverses_id where not e.is_test),
  'recordedCostVnd',(select coalesce(sum(case when e.kind='expense' then e.amount_vnd when e.kind='reversal' and o.kind='expense' then -e.amount_vnd else 0 end),0) from public.finance_entries e left join public.finance_entries o on o.id=e.reverses_id where not e.is_test),
  'users',coalesce((select jsonb_agg(x) from (select p.id,p.display_name,p.role,p.created_at,
    coalesce((u.raw_user_meta_data->>'synthetic')='true',false) or coalesce(u.email ~* '(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])',false) as is_test
    from public.profiles p join auth.users u on u.id=p.id order by p.created_at desc,p.id limit 200) x),'[]'::jsonb),
  'weeklyEvents',coalesce((select jsonb_agg(x) from (select date_trunc('week',event_day::timestamp)::date as week,event_key,channel,count(*) as events,count(distinct actor_id) as users
    from public.product_events where not is_test group by 1,2,3 order by 1 desc,2,3 limit 200) x),'[]'::jsonb)
 ) into result;
 return result;
end; $$;
revoke all on function public.get_admin_overview() from public,anon,authenticated;
grant execute on function public.get_admin_overview() to authenticated;
