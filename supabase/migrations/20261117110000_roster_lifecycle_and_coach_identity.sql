-- Additive roster lifecycle. No existing profiles, roles or health rows are rewritten.
-- Learners receive only their coach's display identity, never a whole profile row.
drop policy profiles_select_assigned_coach on public.profiles;
drop policy pt_profiles_select_assigned_coach on public.pt_profiles;

create function public.get_assigned_coach_identity()
returns table (id uuid, display_name text)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.display_name
  from public.trainee_profiles t join public.profiles p on p.id = t.assigned_pt_id
  join public.profiles caller on caller.id = auth.uid() and caller.role = 'trainee'
  where t.profile_id = auth.uid() and t.status <> 'archived' and p.role = 'pt';
$$;
revoke all on function public.get_assigned_coach_identity() from public, anon, authenticated;
grant execute on function public.get_assigned_coach_identity() to authenticated;

alter table public.trainee_profiles add column roster_version integer not null default 1 check (roster_version > 0);
-- Profile/contact/archive changes must go through versioned, audited RPCs.
revoke update (display_name, phone, primary_goal, status, archived_at) on public.trainee_profiles from authenticated;

create table public.trainee_profile_events (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete restrict,
  actor_id uuid not null references public.profiles(id) on delete restrict,
  kind text not null check (kind in ('edited', 'archived', 'restored')),
  roster_version integer not null,
  created_at timestamptz not null default now(),
  unique (trainee_id, roster_version)
);
alter table public.trainee_profile_events enable row level security;
revoke all on public.trainee_profile_events from public, anon, authenticated;
grant select on public.trainee_profile_events to authenticated;
create policy trainee_events_read_owner on public.trainee_profile_events for select to authenticated
using (actor_id = auth.uid() and exists (
  select 1 from public.trainee_profiles t where t.id = trainee_id and t.assigned_pt_id = auth.uid()
));

create function public.save_trainee_profile(target_trainee uuid, expected_version integer, trainee_name text, contact_phone text, goal public.fitness_goal)
returns integer language plpgsql security definer set search_path = '' as $$
declare t public.trainee_profiles%rowtype; actor uuid := auth.uid();
begin
  if actor is null or (select role from public.profiles where id = actor) is distinct from 'pt'::public.user_role then
    raise exception 'PT account required' using errcode = '42501';
  end if;
  select * into t from public.trainee_profiles where id = target_trainee and assigned_pt_id = actor for update;
  if not found then raise exception 'Trainee unavailable' using errcode = '42501'; end if;
  if expected_version is null or expected_version <> t.roster_version then raise exception 'Profile changed; reload before saving' using errcode = '40001'; end if;
  if t.status = 'archived' then raise exception 'Restore profile before editing' using errcode = '22023'; end if;
  if trainee_name is null or length(btrim(trainee_name)) not between 2 and 100 or goal is null
    or (nullif(btrim(contact_phone), '') is not null and (length(btrim(contact_phone)) not between 8 and 20 or btrim(contact_phone) !~ '^[0-9+ ().-]+$')) then
    raise exception 'Invalid profile fields' using errcode = '22023';
  end if;
  update public.trainee_profiles set display_name = btrim(trainee_name), phone = nullif(btrim(contact_phone), ''),
    primary_goal = goal, roster_version = t.roster_version + 1 where id = t.id;
  insert into public.trainee_profile_events(trainee_id, actor_id, kind, roster_version) values (t.id, actor, 'edited', t.roster_version + 1);
  return t.roster_version + 1;
end; $$;

-- Existing security-definer intake/check-in functions still pass through this
-- boundary, so archived records cannot be written through the direct API either.
create function public.guard_active_trainee_write()
returns trigger language plpgsql security definer set search_path = '' as $$
declare t public.trainee_profiles%rowtype; caller_role public.user_role;
begin
  if current_setting('role', true) <> 'authenticated' then return new; end if;
  select * into t from public.trainee_profiles where id = new.trainee_id;
  select role into caller_role from public.profiles where id = auth.uid();
  if t.id is null or t.status = 'archived' or not (
    (caller_role = 'pt' and t.assigned_pt_id = auth.uid())
    or (caller_role = 'trainee' and t.profile_id = auth.uid())
  ) then raise exception 'Active linked profile required' using errcode = '42501'; end if;
  return new;
end; $$;
revoke all on function public.guard_active_trainee_write() from public, anon, authenticated;
create trigger inbody_active_profile before insert or update on public.inbody_records for each row execute function public.guard_active_trainee_write();
create trigger checkin_active_profile before insert on public.checkins for each row execute function public.guard_active_trainee_write();

create function public.set_trainee_archived(target_trainee uuid, expected_version integer, archive_profile boolean)
returns integer language plpgsql security definer set search_path = '' as $$
declare t public.trainee_profiles%rowtype; actor uuid := auth.uid();
begin
  if actor is null or (select role from public.profiles where id = actor) is distinct from 'pt'::public.user_role then
    raise exception 'PT account required' using errcode = '42501';
  end if;
  select * into t from public.trainee_profiles where id = target_trainee and assigned_pt_id = actor for update;
  if not found then raise exception 'Trainee unavailable' using errcode = '42501'; end if;
  if expected_version is null or expected_version <> t.roster_version then raise exception 'Profile changed; reload before saving' using errcode = '40001'; end if;
  if archive_profile is null then raise exception 'Archive decision required' using errcode = '22023'; end if;
  if (t.status = 'archived') = archive_profile then return t.roster_version; end if;
  update public.trainee_profiles set status = case when archive_profile then 'archived'::public.trainee_status else 'active'::public.trainee_status end,
    archived_at = case when archive_profile then now() else null end, roster_version = t.roster_version + 1 where id = t.id;
  if archive_profile then
    update public.trainee_invitations set status = 'revoked' where trainee_id = t.id and status = 'pending';
  end if;
  insert into public.trainee_profile_events(trainee_id, actor_id, kind, roster_version)
    values (t.id, actor, case when archive_profile then 'archived' else 'restored' end, t.roster_version + 1);
  return t.roster_version + 1;
end; $$;
revoke all on function public.save_trainee_profile(uuid, integer, text, text, public.fitness_goal) from public, anon, authenticated;
revoke all on function public.set_trainee_archived(uuid, integer, boolean) from public, anon, authenticated;
grant execute on function public.save_trainee_profile(uuid, integer, text, text, public.fitness_goal) to authenticated;
grant execute on function public.set_trainee_archived(uuid, integer, boolean) to authenticated;

-- Serialise revoke with reissue/archive on the same profile. Acceptance still
-- locks its invitation; a revoked token cannot subsequently be accepted.
create or replace function public.revoke_trainee_invitation(target_trainee_id uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or (select role from public.profiles where id = auth.uid()) is distinct from 'pt'::public.user_role then
    raise exception 'PT account required' using errcode = '42501';
  end if;
  perform 1 from public.trainee_profiles where id = target_trainee_id and assigned_pt_id = auth.uid() and profile_id is null for update;
  if not found then return false; end if;
  update public.trainee_invitations set status = 'revoked' where trainee_id = target_trainee_id and status = 'pending';
  return found;
end; $$;
