-- CALENDAR-01: linked participants, read/create only. No session debit.
create extension if not exists btree_gist with schema extensions;
create schema if not exists private;

create table public.coaching_appointments (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  learner_id uuid not null references public.profiles(id) on delete restrict,
  client_request_id uuid not null,
  title text not null check (char_length(title) between 1 and 100 and title = btrim(title) and title ~ '[^[:space:]]'),
  kind text not null check (kind in ('training', 'consultation')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'retired')),
  retired_at timestamptz,
  created_at timestamptz not null default now(),
  constraint coaching_appointments_time_bounds check (
    isfinite(starts_at) and isfinite(ends_at) and ends_at > starts_at
    and ends_at - starts_at <= interval '24 hours'
  ),
  constraint coaching_appointments_retirement check ((status = 'retired') = (retired_at is not null)),
  constraint coaching_appointments_retry_key unique (pt_id, client_request_id),
  constraint coaching_appointments_pt_overlap exclude using gist (
    pt_id extensions.gist_uuid_ops with =, tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status = 'scheduled'),
  constraint coaching_appointments_learner_overlap exclude using gist (
    learner_id extensions.gist_uuid_ops with =, tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status = 'scheduled')
);

create index coaching_appointments_pt_agenda_idx on public.coaching_appointments(pt_id, starts_at);
create index coaching_appointments_learner_agenda_idx on public.coaching_appointments(learner_id, starts_at);
create index coaching_appointments_trainee_idx on public.coaching_appointments(trainee_id);
alter table public.coaching_appointments enable row level security;
revoke all on public.coaching_appointments from public, anon, authenticated;
grant select on public.coaching_appointments to authenticated;
grant insert (trainee_id, pt_id, learner_id, client_request_id, title, kind, starts_at, ends_at)
  on public.coaching_appointments to authenticated;

create policy coaching_appointments_read_participants on public.coaching_appointments
for select to authenticated using (
  exists (
    select 1 from public.trainee_profiles t
    join public.profiles actor on actor.id = (select auth.uid())
    where t.id = coaching_appointments.trainee_id and t.status <> 'archived'
      and t.assigned_pt_id = coaching_appointments.pt_id and t.profile_id = coaching_appointments.learner_id
      and ((actor.role = 'pt' and actor.id = t.assigned_pt_id)
        or (actor.role = 'trainee' and actor.id = t.profile_id))
  )
);

create policy coaching_appointments_create_pt on public.coaching_appointments
for insert to authenticated with check (
  pt_id = (select auth.uid()) and exists (
    select 1 from public.trainee_profiles t
    join public.profiles actor on actor.id = (select auth.uid())
    where t.id = coaching_appointments.trainee_id and t.status <> 'archived'
      and t.assigned_pt_id = coaching_appointments.pt_id and t.profile_id = coaching_appointments.learner_id
      and actor.role = 'pt'
  )
);

-- Lock the relationship before checking it. An archive/unlink/reassignment racing
-- with creation must either reject the insert or subsequently retire its slot.
create function private.guard_appointment_creation() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  relation public.trainee_profiles;
begin
  if new.pt_id is distinct from auth.uid()
    or (select role from public.profiles where id = auth.uid()) is distinct from 'pt'::public.user_role then
    raise exception 'Appointment creation is not permitted' using errcode = '42501';
  end if;
  select * into relation from public.trainee_profiles where id = new.trainee_id for share;
  if not found or relation.status = 'archived' or relation.profile_id is null
    or relation.assigned_pt_id is distinct from new.pt_id or relation.profile_id is distinct from new.learner_id then
    raise exception 'Appointment creation is not permitted' using errcode = '42501';
  end if;
  if new.starts_at <= statement_timestamp() then
    raise exception 'New appointments must start in the future' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function private.guard_appointment_creation() from public, anon, authenticated, service_role;
create trigger coaching_appointments_guard_create before insert on public.coaching_appointments
for each row execute function private.guard_appointment_creation();

-- This internal trigger cannot be called through the public API. Its scope comes
-- only from the relationship row that was updated under the existing policies.
create function private.retire_relationship_appointments() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (new.status = 'archived' and old.status is distinct from new.status)
    or new.assigned_pt_id is distinct from old.assigned_pt_id
    or new.profile_id is distinct from old.profile_id then
    update public.coaching_appointments set status = 'retired', retired_at = statement_timestamp()
    where trainee_id = old.id and status = 'scheduled';
  end if;
  return new;
end;
$$;
revoke all on function private.retire_relationship_appointments() from public, anon, authenticated, service_role;
create trigger trainee_profiles_retire_appointments after update of status, assigned_pt_id, profile_id
on public.trainee_profiles for each row execute function private.retire_relationship_appointments();

comment on table public.coaching_appointments is
  'Shared appointments; PT creates, current participant pair reads. No session debit. Relationship changes retire slots without transferring private history. Change requests/completion belong to later slices.';
