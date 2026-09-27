alter table public.trainee_profiles
  drop constraint trainee_profiles_id_fkey;

alter table public.trainee_profiles
  alter column id set default gen_random_uuid(),
  add column profile_id uuid references public.profiles(id) on delete cascade,
  add column display_name text,
  add column phone text;

update public.trainee_profiles trainee
set
  profile_id = profile.id,
  display_name = profile.display_name,
  phone = profile.phone
from public.profiles profile
where profile.id = trainee.id;

alter table public.trainee_profiles
  alter column display_name set not null,
  add constraint trainee_display_name_length check (char_length(display_name) between 2 and 100),
  add constraint trainee_phone_length check (phone is null or char_length(phone) between 8 and 20);

create unique index trainee_profiles_profile_id_idx
  on public.trainee_profiles(profile_id)
  where profile_id is not null;

alter table public.trainee_invitations
  add column trainee_id uuid references public.trainee_profiles(id) on delete cascade;

update public.trainee_invitations invitation
set trainee_id = trainee.id
from public.trainee_profiles trainee
where trainee.profile_id = invitation.accepted_by;

update public.trainee_invitations
set status = 'revoked'
where trainee_id is null;

alter table public.trainee_invitations
  add constraint invitation_has_trainee check (trainee_id is not null or status = 'revoked'),
  add constraint invitation_token_is_sha256 check (token_hash ~ '^[0-9a-f]{64}$');

create index trainee_invitations_trainee_idx
  on public.trainee_invitations(trainee_id, created_at desc);

alter table public.inbody_records
  drop constraint inbody_cross_field_check,
  add constraint inbody_fat_mass_within_weight check (body_fat_mass_kg <= weight_kg),
  add constraint inbody_components_within_weight check (
    skeletal_muscle_mass_kg + body_fat_mass_kg <= weight_kg
  ),
  add constraint inbody_water_within_weight check (
    total_body_water_liters is null or total_body_water_liters <= weight_kg
  ),
  add constraint inbody_cross_field_check check (
    abs(((body_fat_mass_kg / weight_kg) * 100) - percent_body_fat) <= 2
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
  requested_role public.user_role;
begin
  requested_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    split_part(new.email, '@', 1)
  );
  requested_role := case
    when new.raw_user_meta_data ->> 'role' = 'trainee' then 'trainee'::public.user_role
    else 'pt'::public.user_role
  end;

  insert into public.profiles (id, role, display_name)
  values (new.id, requested_role, requested_name);

  if requested_role = 'pt' then
    insert into public.pt_profiles (id) values (new.id);
  end if;

  return new;
end;
$$;

drop policy profiles_select_assigned_trainee on public.profiles;
create policy profiles_select_assigned_trainee on public.profiles
for select to authenticated using (
  exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.profile_id = profiles.id
      and trainee.assigned_pt_id = (select auth.uid())
  )
);

drop policy trainee_profiles_select_related on public.trainee_profiles;
drop policy trainee_profiles_insert_assigned on public.trainee_profiles;
drop policy trainee_profiles_update_related on public.trainee_profiles;

create policy trainee_profiles_select_related on public.trainee_profiles
for select to authenticated using (
  profile_id = (select auth.uid()) or assigned_pt_id = (select auth.uid())
);
create policy trainee_profiles_insert_assigned on public.trainee_profiles
for insert to authenticated with check (
  assigned_pt_id = (select auth.uid()) and profile_id is null
);
create policy trainee_profiles_update_by_pt on public.trainee_profiles
for update to authenticated using (assigned_pt_id = (select auth.uid()))
with check (assigned_pt_id = (select auth.uid()));

drop policy trainee_invitations_manage_own on public.trainee_invitations;
create policy trainee_invitations_select_own on public.trainee_invitations
for select to authenticated using (pt_id = (select auth.uid()));

drop policy inbody_records_select_related on public.inbody_records;
drop policy inbody_records_insert_by_assigned_pt on public.inbody_records;
drop policy inbody_records_update_by_owner_pt on public.inbody_records;

create policy inbody_records_select_related on public.inbody_records
for select to authenticated using (
  pt_id = (select auth.uid())
  or exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = inbody_records.trainee_id
      and trainee.profile_id = (select auth.uid())
  )
);
create policy inbody_records_insert_by_assigned_pt on public.inbody_records
for insert to authenticated with check (
  pt_id = (select auth.uid())
  and verified_by = (select auth.uid())
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = inbody_records.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
      and trainee.profile_id is not null
  )
);
create policy inbody_records_update_by_owner_pt on public.inbody_records
for update to authenticated using (pt_id = (select auth.uid()))
with check (
  pt_id = (select auth.uid())
  and verified_by = (select auth.uid())
);

revoke insert, update on public.trainee_invitations from authenticated;
revoke update on public.trainee_profiles from authenticated;
revoke update on public.inbody_records from authenticated;

grant update (
  display_name,
  phone,
  primary_goal,
  status,
  total_sessions,
  remaining_sessions,
  last_checkin_date,
  archived_at
) on public.trainee_profiles to authenticated;
grant update (
  target_calories,
  target_protein_grams,
  target_carb_grams,
  target_fat_grams
) on public.inbody_records to authenticated;

create or replace function public.create_trainee_with_invitation(
  trainee_display_name text,
  trainee_goal public.fitness_goal,
  trainee_phone text,
  package_total integer,
  package_remaining integer,
  invite_email text,
  invite_token_hash text,
  invite_expires_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  new_trainee_id uuid;
begin
  if owner_id is null or not exists (
    select 1 from public.pt_profiles where id = owner_id
  ) then
    raise exception 'PT account required' using errcode = '42501';
  end if;

  if invite_expires_at <= now() or invite_expires_at > now() + interval '30 days' then
    raise exception 'Invitation expiry is outside the allowed window' using errcode = '22023';
  end if;

  insert into public.trainee_profiles (
    assigned_pt_id,
    display_name,
    phone,
    primary_goal,
    total_sessions,
    remaining_sessions
  ) values (
    owner_id,
    trim(trainee_display_name),
    nullif(trim(trainee_phone), ''),
    trainee_goal,
    package_total,
    package_remaining
  )
  returning id into new_trainee_id;

  insert into public.trainee_invitations (
    pt_id,
    trainee_id,
    email,
    token_hash,
    expires_at
  ) values (
    owner_id,
    new_trainee_id,
    lower(trim(invite_email)),
    invite_token_hash,
    invite_expires_at
  );

  return new_trainee_id;
end;
$$;

create or replace function public.get_invitation_preview(invite_token_hash text)
returns table (
  display_name text,
  email text,
  expires_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select trainee.display_name, invitation.email, invitation.expires_at
  from public.trainee_invitations invitation
  join public.trainee_profiles trainee on trainee.id = invitation.trainee_id
  where invitation.token_hash = invite_token_hash
    and invitation.status = 'pending'
    and invitation.expires_at > now()
    and trainee.profile_id is null
  limit 1;
$$;

create or replace function public.accept_trainee_invitation(invite_token_hash text)
returns table (
  trainee_id uuid,
  outcome text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  accepting_user_id uuid := auth.uid();
  accepting_email text;
  accepting_role public.user_role;
  invitation_row public.trainee_invitations%rowtype;
  trainee_row public.trainee_profiles%rowtype;
begin
  if accepting_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select lower(email)
  into accepting_email
  from auth.users
  where id = accepting_user_id;

  select role
  into accepting_role
  from public.profiles
  where id = accepting_user_id;

  if accepting_role <> 'trainee' then
    return query select null::uuid, 'account_role'::text;
    return;
  end if;

  select *
  into invitation_row
  from public.trainee_invitations
  where token_hash = invite_token_hash
  for update;

  if not found then
    return query select null::uuid, 'invalid'::text;
    return;
  end if;

  if invitation_row.status <> 'pending' then
    return query select null::uuid, 'used'::text;
    return;
  end if;

  if invitation_row.expires_at <= now() then
    update public.trainee_invitations
    set status = 'expired'
    where id = invitation_row.id;
    return query select null::uuid, 'expired'::text;
    return;
  end if;

  if accepting_email is null or accepting_email <> invitation_row.email then
    return query select null::uuid, 'email_mismatch'::text;
    return;
  end if;

  select *
  into trainee_row
  from public.trainee_profiles
  where id = invitation_row.trainee_id
  for update;

  if not found or trainee_row.profile_id is not null then
    return query select null::uuid, 'used'::text;
    return;
  end if;

  update public.profiles
  set
    display_name = trainee_row.display_name,
    phone = trainee_row.phone
  where id = accepting_user_id;

  update public.trainee_profiles
  set profile_id = accepting_user_id
  where id = trainee_row.id;

  update public.trainee_invitations
  set
    status = 'accepted',
    accepted_by = accepting_user_id,
    accepted_at = now()
  where id = invitation_row.id;

  return query select trainee_row.id, 'accepted'::text;
end;
$$;

revoke all on function public.create_trainee_with_invitation(
  text,
  public.fitness_goal,
  text,
  integer,
  integer,
  text,
  text,
  timestamptz
) from public;
revoke all on function public.get_invitation_preview(text) from public;
revoke all on function public.accept_trainee_invitation(text) from public;

grant execute on function public.create_trainee_with_invitation(
  text,
  public.fitness_goal,
  text,
  integer,
  integer,
  text,
  text,
  timestamptz
) to authenticated;
grant execute on function public.get_invitation_preview(text) to anon, authenticated;
grant execute on function public.accept_trainee_invitation(text) to authenticated;
