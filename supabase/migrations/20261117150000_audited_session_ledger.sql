-- Replace direct mutable session updates with an append-only, locked ledger.
-- Opening records preserve the known balance; they do not invent past sessions.
alter table public.trainee_profiles add column session_version integer not null default 0 check (session_version>=0);
revoke update (total_sessions,remaining_sessions) on public.trainee_profiles from authenticated;

create table public.session_entitlements (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null unique references public.trainee_profiles(id) on delete restrict,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  learner_id uuid references public.profiles(id) on delete restrict,
  opening_total integer not null check(opening_total>=0),
  opening_remaining integer not null check(opening_remaining>=0 and opening_remaining<=opening_total),
  opened_at timestamptz not null default now()
);
create table public.session_ledger (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.session_entitlements(id) on delete restrict,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  client_request_id uuid not null,
  version integer not null check(version>=0),
  kind text not null check(kind in ('opening','adjustment','completion','reversal')),
  delta integer not null,
  balance_after integer not null check(balance_after>=0),
  reason text not null check(length(btrim(reason)) between 3 and 500),
  appointment_id uuid references public.coaching_appointments(id) on delete restrict,
  reverses_id uuid unique references public.session_ledger(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique(entitlement_id,version),
  unique(actor_id,client_request_id),
  check ((kind='completion' and appointment_id is not null and delta in (0,-1)) or (kind<>'completion' and appointment_id is null)),
  check ((kind='reversal')=(reverses_id is not null))
);
create unique index session_one_completion_per_appointment on public.session_ledger(appointment_id) where kind='completion';
alter table public.session_entitlements enable row level security;
alter table public.session_ledger enable row level security;
revoke all on public.session_entitlements,public.session_ledger from public,anon,authenticated;
grant select on public.session_entitlements,public.session_ledger to authenticated;
create policy session_entitlement_current_pair on public.session_entitlements for select to authenticated using (
 exists(select 1 from public.trainee_profiles t join public.profiles actor on actor.id=auth.uid()
 where t.id=trainee_id and t.status<>'archived' and t.assigned_pt_id=pt_id
 and ((actor.role='pt' and auth.uid()=pt_id) or (actor.role='trainee' and auth.uid()=learner_id and t.profile_id=learner_id)))
);
create policy session_ledger_current_pair on public.session_ledger for select to authenticated
using(exists(select 1 from public.session_entitlements e where e.id=entitlement_id));

create function private.attach_first_session_identity() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if old.profile_id is null and new.profile_id is not null then
  update public.session_entitlements set learner_id=new.profile_id where trainee_id=new.id and learner_id is null and pt_id=new.assigned_pt_id;
 end if;
 return new;
end; $$;
revoke all on function private.attach_first_session_identity() from public,anon,authenticated,service_role;
create trigger session_first_learner_identity after update of profile_id on public.trainee_profiles for each row execute function private.attach_first_session_identity();

create function private.lock_session_profile(target uuid) returns public.trainee_profiles
language plpgsql security definer set search_path='' as $$
declare t public.trainee_profiles;
begin
 if (select role from public.profiles where id=auth.uid()) is distinct from 'pt'::public.user_role then raise exception 'Assigned PT required' using errcode='42501'; end if;
 select * into t from public.trainee_profiles where id=target and assigned_pt_id=auth.uid() for update;
 if not found or t.status='archived' then raise exception 'Active assigned trainee required' using errcode='42501'; end if;
 return t;
end; $$;
create function private.open_session_entitlement(t public.trainee_profiles) returns public.session_entitlements
language plpgsql security definer set search_path='' as $$
declare e public.session_entitlements;
begin
 select * into e from public.session_entitlements where trainee_id=t.id;
 if not found then
  insert into public.session_entitlements(trainee_id,pt_id,learner_id,opening_total,opening_remaining)
    values(t.id,t.assigned_pt_id,t.profile_id,t.total_sessions,t.remaining_sessions) returning * into e;
  insert into public.session_ledger(entitlement_id,actor_id,client_request_id,version,kind,delta,balance_after,reason)
    values(e.id,auth.uid(),gen_random_uuid(),0,'opening',t.remaining_sessions,t.remaining_sessions,'Opening snapshot from legacy balance; past attendance not reconstructed');
 elsif e.pt_id is distinct from t.assigned_pt_id or (e.learner_id is not null and e.learner_id is distinct from t.profile_id) then
  raise exception 'Participant identity changed; entitlement review required' using errcode='42501';
 elsif e.learner_id is null and t.profile_id is not null then
  update public.session_entitlements set learner_id=t.profile_id where id=e.id returning * into e;
 end if;
 return e;
end; $$;
revoke all on function private.lock_session_profile(uuid),private.open_session_entitlement(public.trainee_profiles) from public,anon,authenticated,service_role;

create function public.set_session_balance(target_trainee uuid,expected_version integer,new_balance integer,change_reason text,request_nonce uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare t public.trainee_profiles; e public.session_entitlements; previous public.session_ledger;
begin
 t:=private.lock_session_profile(target_trainee);
 if request_nonce is null or new_balance is null or new_balance<0 or new_balance>t.total_sessions
   or change_reason is null or length(btrim(change_reason)) not between 3 and 500 then raise exception 'Invalid balance adjustment' using errcode='22023'; end if;
 e:=private.open_session_entitlement(t);
 select * into previous from public.session_ledger where actor_id=auth.uid() and client_request_id=request_nonce;
 if found then
  if previous.entitlement_id<>e.id or previous.kind<>'adjustment' or previous.balance_after<>new_balance or previous.reason<>btrim(change_reason)
    or previous.version is distinct from expected_version+1 then raise exception 'Nonce already used' using errcode='23505'; end if;
  return previous.version;
 end if;
 if expected_version is distinct from t.session_version then raise exception 'Session balance changed; reload' using errcode='40001'; end if;
 if (select count(*) from public.session_ledger where actor_id=auth.uid() and created_at>=statement_timestamp()-interval '1 day')>=100 then raise exception 'Daily session adjustment limit' using errcode='P0001'; end if;
 insert into public.session_ledger(entitlement_id,actor_id,client_request_id,version,kind,delta,balance_after,reason)
   values(e.id,auth.uid(),request_nonce,t.session_version+1,'adjustment',new_balance-t.remaining_sessions,new_balance,btrim(change_reason));
 update public.trainee_profiles set remaining_sessions=new_balance,session_version=t.session_version+1 where id=t.id;
 return t.session_version+1;
end; $$;

create function public.complete_coaching_appointment(target_appointment uuid,expected_appointment_version integer,expected_session_version integer,
 consume_session boolean,completion_reason text,request_nonce uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; t public.trainee_profiles; e public.session_entitlements; previous public.session_ledger; next_balance integer;
begin
 select * into a from public.coaching_appointments where id=target_appointment;
 t:=private.lock_session_profile(a.trainee_id);
 a:=private.lock_participant_appointment(target_appointment);
 if consume_session is null or request_nonce is null or completion_reason is null or length(btrim(completion_reason)) not between 3 and 500 then raise exception 'Explicit completion decision required' using errcode='22023'; end if;
 e:=private.open_session_entitlement(t);
 select * into previous from public.session_ledger where actor_id=auth.uid() and client_request_id=request_nonce;
 if found then
  if previous.entitlement_id<>e.id or previous.kind<>'completion' or previous.appointment_id is distinct from a.id
    or previous.delta<>(case when consume_session then -1 else 0 end) or previous.reason<>btrim(completion_reason)
    or previous.version is distinct from expected_session_version+1 then raise exception 'Nonce already used' using errcode='23505'; end if;
  return previous.version;
 end if;
 if a.status<>'scheduled' or a.ends_at>statement_timestamp() then raise exception 'Only an elapsed scheduled appointment can be completed' using errcode='23514'; end if;
 if a.version is distinct from expected_appointment_version or t.session_version is distinct from expected_session_version then raise exception 'Appointment or balance changed; reload' using errcode='40001'; end if;
 next_balance:=t.remaining_sessions-(case when consume_session then 1 else 0 end);
 if next_balance<0 then raise exception 'No remaining sessions; do not debit' using errcode='23514'; end if;
 insert into public.session_ledger(entitlement_id,actor_id,client_request_id,version,kind,delta,balance_after,reason,appointment_id)
   values(e.id,auth.uid(),request_nonce,t.session_version+1,'completion',case when consume_session then -1 else 0 end,next_balance,btrim(completion_reason),a.id);
 update public.trainee_profiles set remaining_sessions=next_balance,session_version=t.session_version+1 where id=t.id;
 update public.appointment_change_requests set state='stale',decided_at=statement_timestamp() where appointment_id=a.id and state='pending';
 return t.session_version+1;
end; $$;

create function public.reverse_session_completion(target_entry uuid,expected_session_version integer,change_reason text,request_nonce uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare original public.session_ledger; previous public.session_ledger; e public.session_entitlements; t public.trainee_profiles; next_balance integer;
begin
 select * into original from public.session_ledger where id=target_entry;
 select * into e from public.session_entitlements where id=original.entitlement_id;
 t:=private.lock_session_profile(e.trainee_id);
 e:=private.open_session_entitlement(t);
 if original.kind is distinct from 'completion' or original.entitlement_id is distinct from e.id then raise exception 'Completion unavailable' using errcode='42501'; end if;
 if request_nonce is null or change_reason is null or length(btrim(change_reason)) not between 3 and 500 then raise exception 'Reason required' using errcode='22023'; end if;
 select * into previous from public.session_ledger where actor_id=auth.uid() and client_request_id=request_nonce;
 if found then
  if previous.kind<>'reversal' or previous.reverses_id is distinct from original.id or previous.reason<>btrim(change_reason)
    or previous.version is distinct from expected_session_version+1 then raise exception 'Nonce already used' using errcode='23505'; end if;
  return previous.version;
 end if;
 if t.session_version is distinct from expected_session_version then raise exception 'Balance changed; reload' using errcode='40001'; end if;
 next_balance:=t.remaining_sessions-original.delta;
 if next_balance>t.total_sessions then raise exception 'Reversal would exceed package total; review balance first' using errcode='23514'; end if;
 insert into public.session_ledger(entitlement_id,actor_id,client_request_id,version,kind,delta,balance_after,reason,reverses_id)
   values(e.id,auth.uid(),request_nonce,t.session_version+1,'reversal',-original.delta,next_balance,btrim(change_reason),original.id);
 update public.trainee_profiles set remaining_sessions=next_balance,session_version=t.session_version+1 where id=t.id;
 return t.session_version+1;
end; $$;

-- Completion history cannot silently become a different appointment. Relationship
-- retirement remains possible and never deletes or reverses the ledger.
create function private.guard_completed_appointment_change() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if (new.starts_at is distinct from old.starts_at or new.ends_at is distinct from old.ends_at) and exists(
  select 1 from public.session_ledger s where s.appointment_id=old.id and s.kind='completion'
 ) then raise exception 'Completed appointment cannot be rescheduled' using errcode='23514'; end if;
 return new;
end; $$;
revoke all on function private.guard_completed_appointment_change() from public,anon,authenticated,service_role;
create trigger appointment_completed_time_guard before update on public.coaching_appointments for each row execute function private.guard_completed_appointment_change();
revoke all on function public.set_session_balance(uuid,integer,integer,text,uuid),
 public.complete_coaching_appointment(uuid,integer,integer,boolean,text,uuid),public.reverse_session_completion(uuid,integer,text,uuid) from public,anon,authenticated;
grant execute on function public.set_session_balance(uuid,integer,integer,text,uuid),
 public.complete_coaching_appointment(uuid,integer,integer,boolean,text,uuid),public.reverse_session_completion(uuid,integer,text,uuid) to authenticated;
