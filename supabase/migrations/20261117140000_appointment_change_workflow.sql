-- Calendar changes are versioned and preserve the original slot until accepted.
-- No booking, change or cancellation debits sessions or transfers money.
alter table public.coaching_appointments add column version integer not null default 1 check (version > 0);

create table public.appointment_change_requests (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.coaching_appointments(id) on delete restrict,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  client_request_id uuid not null,
  base_version integer not null check (base_version > 0),
  kind text not null check (kind in ('reschedule','cancel')),
  proposed_starts_at timestamptz,
  proposed_ends_at timestamptz,
  reason text not null check (length(btrim(reason)) between 3 and 500),
  state text not null default 'pending' check (state in ('pending','accepted','rejected','withdrawn','stale')),
  decision_request_id uuid,
  decided_by uuid references public.profiles(id) on delete restrict,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique (requested_by,client_request_id),
  constraint appointment_change_range check (
    (kind='cancel' and proposed_starts_at is null and proposed_ends_at is null)
    or (kind='reschedule' and proposed_starts_at is not null and proposed_ends_at is not null
      and isfinite(proposed_starts_at) and isfinite(proposed_ends_at)
      and proposed_ends_at > proposed_starts_at and proposed_ends_at-proposed_starts_at <= interval '24 hours')
  )
);
create unique index appointment_one_pending_change on public.appointment_change_requests(appointment_id) where state='pending';

create table public.appointment_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.coaching_appointments(id) on delete restrict,
  version integer not null,
  actor_id uuid references public.profiles(id) on delete restrict,
  kind text not null check (kind in ('created','rescheduled','retired')),
  previous_starts_at timestamptz,
  previous_ends_at timestamptz,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (appointment_id,version)
);
alter table public.appointment_change_requests enable row level security;
alter table public.appointment_events enable row level security;
revoke all on public.appointment_change_requests, public.appointment_events from public,anon,authenticated;
grant select on public.appointment_change_requests, public.appointment_events to authenticated;
create policy appointment_requests_current_pair on public.appointment_change_requests for select to authenticated
using (exists(select 1 from public.coaching_appointments a where a.id=appointment_id));
create policy appointment_events_current_pair on public.appointment_events for select to authenticated
using (exists(select 1 from public.coaching_appointments a where a.id=appointment_id));

-- Lock relationship before appointment, matching the archive trigger's order.
create function private.lock_participant_appointment(target uuid) returns public.coaching_appointments
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; t public.trainee_profiles; actor_role public.user_role;
begin
  select * into a from public.coaching_appointments where id=target;
  if not found then raise exception 'Appointment unavailable' using errcode='42501'; end if;
  select * into t from public.trainee_profiles where id=a.trainee_id for share;
  select role into actor_role from public.profiles where id=auth.uid();
  if t.id is null or t.status='archived' or t.assigned_pt_id is distinct from a.pt_id
    or t.profile_id is distinct from a.learner_id or (
      (actor_role='pt' and auth.uid()=a.pt_id) or (actor_role='trainee' and auth.uid()=a.learner_id)
    ) is not true then raise exception 'Current participant required' using errcode='42501'; end if;
  select * into a from public.coaching_appointments where id=target for update;
  return a;
end; $$;
revoke all on function private.lock_participant_appointment(uuid) from public,anon,authenticated,service_role;

create function private.audit_appointment_revision() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_op='UPDATE' then
    new.version:=old.version+1;
    update public.appointment_change_requests set state='stale',decided_at=statement_timestamp()
      where appointment_id=new.id and state='pending';
  end if;
  insert into public.appointment_events(appointment_id,version,actor_id,kind,previous_starts_at,previous_ends_at,starts_at,ends_at)
    values(new.id,new.version,auth.uid(),case when tg_op='INSERT' then 'created' when new.status='retired' then 'retired' else 'rescheduled' end,
      case when tg_op='UPDATE' then old.starts_at end,case when tg_op='UPDATE' then old.ends_at end,new.starts_at,new.ends_at);
  return new;
end; $$;
revoke all on function private.audit_appointment_revision() from public,anon,authenticated,service_role;
-- AFTER INSERT makes the event FK valid; BEFORE UPDATE assigns the next version.
create trigger appointment_created_event after insert on public.coaching_appointments for each row execute function private.audit_appointment_revision();
create trigger appointment_revision_event before update on public.coaching_appointments for each row execute function private.audit_appointment_revision();

create function public.request_appointment_change(target_appointment uuid,expected_version integer,change_kind text,
  proposed_start timestamptz default null,proposed_end timestamptz default null,change_reason text default null,request_nonce uuid default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; r public.appointment_change_requests; result uuid;
begin
  a:=private.lock_participant_appointment(target_appointment);
  if auth.uid() is distinct from a.learner_id then raise exception 'Learner required' using errcode='42501'; end if;
  if request_nonce is null or change_reason is null or length(btrim(change_reason)) not between 3 and 500
    or change_kind is null or change_kind not in ('reschedule','cancel') then raise exception 'Invalid change request' using errcode='22023'; end if;
  select * into r from public.appointment_change_requests where requested_by=auth.uid() and client_request_id=request_nonce;
  if found then
    if r.appointment_id<>a.id or r.kind<>change_kind or r.proposed_starts_at is distinct from proposed_start
      or r.proposed_ends_at is distinct from proposed_end or r.reason<>btrim(change_reason) or r.base_version is distinct from expected_version
      then raise exception 'Nonce already used' using errcode='23505'; end if;
    return r.id;
  end if;
  if a.status<>'scheduled' or expected_version is distinct from a.version then raise exception 'Appointment changed' using errcode='40001'; end if;
  if (select count(*) from public.appointment_change_requests where requested_by=auth.uid() and created_at>=statement_timestamp()-interval '1 day')>=100
    then raise exception 'Daily change request limit' using errcode='P0001'; end if;
  if change_kind='reschedule' and (proposed_start is null or proposed_start<=statement_timestamp()) then raise exception 'Choose a future start' using errcode='23514'; end if;
  insert into public.appointment_change_requests(appointment_id,requested_by,client_request_id,base_version,kind,proposed_starts_at,proposed_ends_at,reason)
    values(a.id,auth.uid(),request_nonce,a.version,change_kind,proposed_start,proposed_end,btrim(change_reason)) returning id into result;
  return result;
end; $$;

create function public.resolve_appointment_change(target_request uuid,decision text,expected_version integer,request_nonce uuid) returns text
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; r public.appointment_change_requests; appointment uuid;
begin
  select appointment_id into appointment from public.appointment_change_requests where id=target_request;
  a:=private.lock_participant_appointment(appointment);
  if auth.uid() is distinct from a.pt_id then raise exception 'Assigned PT required' using errcode='42501'; end if;
  if request_nonce is null or decision is null or decision not in ('accepted','rejected') then raise exception 'Invalid decision' using errcode='22023'; end if;
  select * into r from public.appointment_change_requests where id=target_request for update;
  if r.state=decision and r.decided_by=auth.uid() and r.decision_request_id=request_nonce then return r.state; end if;
  if r.state<>'pending' or a.status<>'scheduled' or expected_version is distinct from a.version or r.base_version<>a.version
    then raise exception 'Request changed; reload' using errcode='40001'; end if;
  if decision='accepted' then
    if r.kind='reschedule' then
      if r.proposed_starts_at<=statement_timestamp() then raise exception 'Requested start is no longer in the future' using errcode='23514'; end if;
      update public.coaching_appointments set starts_at=r.proposed_starts_at,ends_at=r.proposed_ends_at where id=a.id;
    else
      update public.coaching_appointments set status='retired',retired_at=statement_timestamp() where id=a.id;
    end if;
  end if;
  -- Revision trigger marked pending requests stale; this exact one is now decided.
  update public.appointment_change_requests set state=decision,decided_by=auth.uid(),decision_request_id=request_nonce,decided_at=statement_timestamp() where id=r.id;
  return decision;
end; $$;

create function public.withdraw_appointment_change(target_request uuid,request_nonce uuid) returns text
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; r public.appointment_change_requests; appointment uuid;
begin
  select appointment_id into appointment from public.appointment_change_requests where id=target_request;
  a:=private.lock_participant_appointment(appointment);
  select * into r from public.appointment_change_requests where id=target_request for update;
  if auth.uid() is distinct from a.learner_id or r.requested_by is distinct from auth.uid() then raise exception 'Request owner required' using errcode='42501'; end if;
  if request_nonce is null then raise exception 'Nonce required' using errcode='22023'; end if;
  if r.state='withdrawn' and r.decision_request_id=request_nonce then return r.state; end if;
  if r.state<>'pending' then raise exception 'Request no longer pending' using errcode='40001'; end if;
  update public.appointment_change_requests set state='withdrawn',decided_by=auth.uid(),decision_request_id=request_nonce,decided_at=statement_timestamp() where id=r.id;
  return 'withdrawn';
end; $$;

create function public.change_coaching_appointment(target_appointment uuid,expected_version integer,change_kind text,
  proposed_start timestamptz default null,proposed_end timestamptz default null,change_reason text default null,request_nonce uuid default null) returns integer
language plpgsql security definer set search_path='' as $$
declare a public.coaching_appointments; r public.appointment_change_requests;
begin
  a:=private.lock_participant_appointment(target_appointment);
  if auth.uid() is distinct from a.pt_id then raise exception 'Assigned PT required' using errcode='42501'; end if;
  if request_nonce is null or change_reason is null or length(btrim(change_reason)) not between 3 and 500
    or change_kind is null or change_kind not in ('reschedule','cancel') then raise exception 'Invalid change' using errcode='22023'; end if;
  select * into r from public.appointment_change_requests where requested_by=auth.uid() and client_request_id=request_nonce;
  if found then
    if r.appointment_id<>a.id or r.kind<>change_kind or r.base_version is distinct from expected_version
      or r.proposed_starts_at is distinct from proposed_start or r.proposed_ends_at is distinct from proposed_end or r.reason<>btrim(change_reason)
      then raise exception 'Nonce already used' using errcode='23505'; end if;
    return r.base_version+1;
  end if;
  if a.status<>'scheduled' or expected_version is distinct from a.version then raise exception 'Appointment changed' using errcode='40001'; end if;
  if change_kind='reschedule' then
    if proposed_start is null or proposed_start<=statement_timestamp() or proposed_end is null or not isfinite(proposed_start) or not isfinite(proposed_end)
      or proposed_end<=proposed_start or proposed_end-proposed_start>interval '24 hours' then raise exception 'Invalid future time range' using errcode='23514'; end if;
    update public.coaching_appointments set starts_at=proposed_start,ends_at=proposed_end where id=a.id;
  else
    if proposed_start is not null or proposed_end is not null then raise exception 'Cancel has no proposed time' using errcode='22023'; end if;
    update public.coaching_appointments set status='retired',retired_at=statement_timestamp() where id=a.id;
  end if;
  insert into public.appointment_change_requests(appointment_id,requested_by,client_request_id,base_version,kind,proposed_starts_at,proposed_ends_at,reason,state,decided_by,decided_at,decision_request_id)
    values(a.id,auth.uid(),request_nonce,a.version,change_kind,proposed_start,proposed_end,btrim(change_reason),'accepted',auth.uid(),statement_timestamp(),request_nonce);
  return a.version+1;
end; $$;

revoke all on function public.request_appointment_change(uuid,integer,text,timestamptz,timestamptz,text,uuid),
  public.resolve_appointment_change(uuid,text,integer,uuid),public.withdraw_appointment_change(uuid,uuid),
  public.change_coaching_appointment(uuid,integer,text,timestamptz,timestamptz,text,uuid) from public,anon,authenticated;
grant execute on function public.request_appointment_change(uuid,integer,text,timestamptz,timestamptz,text,uuid),
  public.resolve_appointment_change(uuid,text,integer,uuid),public.withdraw_appointment_change(uuid,uuid),
  public.change_coaching_appointment(uuid,integer,text,timestamptz,timestamptz,text,uuid) to authenticated;
