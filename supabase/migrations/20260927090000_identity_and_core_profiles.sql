create type public.user_role as enum ('pt', 'trainee', 'admin');
create type public.subscription_plan as enum ('free', 'pro', 'enterprise');
create type public.trainee_status as enum ('active', 'warning', 'inactive', 'archived');
create type public.fitness_goal as enum ('fat_loss', 'muscle_gain', 'recomp');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked', 'expired');
create type public.inbody_source as enum ('manual', 'ocr');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'pt',
  display_name text not null check (char_length(display_name) between 2 and 100),
  phone text check (phone is null or char_length(phone) between 8 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pt_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  gym_affiliation text check (gym_affiliation is null or char_length(gym_affiliation) <= 150),
  subscription_plan public.subscription_plan not null default 'free',
  subscription_valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainee_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  assigned_pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  primary_goal public.fitness_goal not null default 'fat_loss',
  status public.trainee_status not null default 'active',
  total_sessions integer not null default 12 check (total_sessions >= 0),
  remaining_sessions integer not null default 12 check (remaining_sessions >= 0),
  last_checkin_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint remaining_sessions_within_total check (remaining_sessions <= total_sessions)
);

create table public.trainee_invitations (
  id uuid primary key default gen_random_uuid(),
  pt_id uuid not null references public.pt_profiles(id) on delete cascade,
  email text not null,
  token_hash text not null unique,
  status public.invitation_status not null default 'pending',
  expires_at timestamptz not null,
  accepted_by uuid references public.profiles(id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invitation_email_normalized check (email = lower(trim(email))),
  constraint invitation_expiry_after_creation check (expires_at > created_at),
  constraint invitation_acceptance_consistent check (
    (status = 'accepted' and accepted_by is not null and accepted_at is not null)
    or (status <> 'accepted' and accepted_by is null and accepted_at is null)
  )
);

create table public.inbody_records (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  weight_kg numeric(5,2) not null check (weight_kg between 30 and 220),
  skeletal_muscle_mass_kg numeric(5,2) not null check (skeletal_muscle_mass_kg between 10 and 75),
  body_fat_mass_kg numeric(5,2) not null check (body_fat_mass_kg between 2 and 100),
  percent_body_fat numeric(4,1) not null check (percent_body_fat between 3 and 60),
  total_body_water_liters numeric(5,2) check (total_body_water_liters is null or total_body_water_liters between 10 and 100),
  target_calories integer check (target_calories is null or target_calories between 800 and 6000),
  target_protein_grams integer check (target_protein_grams is null or target_protein_grams between 0 and 500),
  target_carb_grams integer check (target_carb_grams is null or target_carb_grams between 0 and 1000),
  target_fat_grams integer check (target_fat_grams is null or target_fat_grams between 0 and 300),
  source public.inbody_source not null default 'manual',
  is_manually_edited boolean not null default false,
  verified_by uuid not null references public.pt_profiles(id) on delete restrict,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint inbody_pt_verifier_match check (pt_id = verified_by),
  constraint inbody_cross_field_check check (
    abs(((body_fat_mass_kg / weight_kg) * 100) - percent_body_fat) <= 5
  )
);

create index trainee_profiles_assigned_pt_idx on public.trainee_profiles(assigned_pt_id) where archived_at is null;
create index trainee_profiles_last_checkin_idx on public.trainee_profiles(assigned_pt_id, last_checkin_date);
create unique index pending_invitation_email_per_pt_idx on public.trainee_invitations(pt_id, email) where status = 'pending';
create index inbody_records_trainee_date_idx on public.inbody_records(trainee_id, recorded_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger pt_profiles_set_updated_at before update on public.pt_profiles
for each row execute function public.set_updated_at();
create trigger trainee_profiles_set_updated_at before update on public.trainee_profiles
for each row execute function public.set_updated_at();
create trigger trainee_invitations_set_updated_at before update on public.trainee_invitations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
begin
  requested_name := coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1));

  insert into public.profiles (id, role, display_name)
  values (new.id, 'pt', requested_name);

  insert into public.pt_profiles (id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pt_profiles enable row level security;
alter table public.trainee_profiles enable row level security;
alter table public.trainee_invitations enable row level security;
alter table public.inbody_records enable row level security;

create policy profiles_select_own on public.profiles
for select to authenticated using ((select auth.uid()) = id);
create policy profiles_select_assigned_trainee on public.profiles
for select to authenticated using (
  exists (
    select 1 from public.trainee_profiles trainee
    where trainee.id = profiles.id and trainee.assigned_pt_id = (select auth.uid())
  )
);
create policy profiles_update_own on public.profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy pt_profiles_select_own on public.pt_profiles
for select to authenticated using ((select auth.uid()) = id);
create policy pt_profiles_update_own on public.pt_profiles
for update to authenticated using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy trainee_profiles_select_related on public.trainee_profiles
for select to authenticated using (
  id = (select auth.uid()) or assigned_pt_id = (select auth.uid())
);
create policy trainee_profiles_insert_assigned on public.trainee_profiles
for insert to authenticated with check (assigned_pt_id = (select auth.uid()));
create policy trainee_profiles_update_related on public.trainee_profiles
for update to authenticated using (
  id = (select auth.uid()) or assigned_pt_id = (select auth.uid())
) with check (
  assigned_pt_id = (select auth.uid())
);

create policy trainee_invitations_manage_own on public.trainee_invitations
for all to authenticated using (pt_id = (select auth.uid()))
with check (pt_id = (select auth.uid()));

create policy inbody_records_select_related on public.inbody_records
for select to authenticated using (
  trainee_id = (select auth.uid()) or pt_id = (select auth.uid())
);
create policy inbody_records_insert_by_assigned_pt on public.inbody_records
for insert to authenticated with check (
  pt_id = (select auth.uid())
  and verified_by = (select auth.uid())
  and exists (
    select 1 from public.trainee_profiles trainee
    where trainee.id = inbody_records.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
  )
);
create policy inbody_records_update_by_owner_pt on public.inbody_records
for update to authenticated using (pt_id = (select auth.uid()))
with check (
  pt_id = (select auth.uid())
  and verified_by = (select auth.uid())
);

revoke all on public.profiles, public.pt_profiles, public.trainee_profiles, public.trainee_invitations, public.inbody_records from anon;
revoke all on public.profiles, public.pt_profiles, public.trainee_profiles, public.trainee_invitations, public.inbody_records from authenticated;
grant select on public.profiles, public.pt_profiles to authenticated;
grant update (display_name, phone) on public.profiles to authenticated;
grant update (gym_affiliation) on public.pt_profiles to authenticated;
grant select, insert, update on public.trainee_profiles, public.trainee_invitations, public.inbody_records to authenticated;
