create or replace function public.application_timezone()
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select 'Asia/Ho_Chi_Minh'::text;
$$;

create or replace function public.application_local_date(at_time timestamptz)
returns date
language sql
immutable
parallel safe
set search_path = ''
as $$
  select (at_time at time zone 'Asia/Ho_Chi_Minh')::date;
$$;

create or replace function public.checkin_warning_starts_on(reference_date date)
returns date
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select reference_date + 4;
$$;

create or replace function public.is_checkin_warning_due(
  reference_date date,
  at_time timestamptz
)
returns boolean
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select public.application_local_date(at_time) >= public.checkin_warning_starts_on(reference_date);
$$;

alter table public.trainee_profiles
  add column engagement_started_on date;

update public.trainee_profiles
set engagement_started_on = coalesce(
  last_checkin_date,
  public.application_local_date(updated_at)
)
where profile_id is not null;

create or replace function public.set_trainee_engagement_started_on()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.profile_id is null then
    new.engagement_started_on = null;
  elsif new.engagement_started_on is null then
    new.engagement_started_on = public.application_local_date(now());
  end if;
  return new;
end;
$$;

create trigger trainee_profiles_set_engagement_started_on
before insert or update of profile_id, engagement_started_on on public.trainee_profiles
for each row execute function public.set_trainee_engagement_started_on();

alter table public.trainee_profiles
  add constraint trainee_engagement_date_consistent check (
    (profile_id is null and engagement_started_on is null)
    or (profile_id is not null and engagement_started_on is not null)
  );

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  local_checkin_date date not null,
  note text check (note is null or char_length(note) between 1 and 500),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint checkins_one_per_local_day unique (trainee_id, local_checkin_date)
);

create table public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null unique references public.checkins(id) on delete cascade,
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  private_photo_path text not null unique,
  photo_mime_type text not null check (photo_mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  photo_size_bytes integer not null check (photo_size_bytes between 1 and 5242880),
  created_at timestamptz not null default now(),
  constraint meal_photo_path_scoped check (
    private_photo_path like trainee_id::text || '/%'
  )
);

create index checkins_trainee_date_idx
  on public.checkins(trainee_id, local_checkin_date desc, submitted_at desc);
create index meal_logs_trainee_created_idx
  on public.meal_logs(trainee_id, created_at desc);
create index trainee_profiles_warning_reference_idx
  on public.trainee_profiles(assigned_pt_id, last_checkin_date, engagement_started_on)
  where archived_at is null and profile_id is not null;

alter table public.checkins enable row level security;
alter table public.meal_logs enable row level security;

create policy checkins_select_related on public.checkins
for select to authenticated using (
  exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = checkins.trainee_id
      and (
        trainee.profile_id = (select auth.uid())
        or trainee.assigned_pt_id = (select auth.uid())
      )
  )
);

create policy meal_logs_select_related on public.meal_logs
for select to authenticated using (
  exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = meal_logs.trainee_id
      and (
        trainee.profile_id = (select auth.uid())
        or trainee.assigned_pt_id = (select auth.uid())
      )
  )
);

revoke all on public.checkins, public.meal_logs from anon, authenticated;
grant select on public.checkins, public.meal_logs to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'meal-media',
  'meal-media',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
);

create policy meal_media_insert_own on storage.objects
for insert to authenticated with check (
  bucket_id = 'meal-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.profile_id = (select auth.uid())
      and trainee.id::text = (storage.foldername(name))[1]
  )
);

create policy meal_media_select_related on storage.objects
for select to authenticated using (
  bucket_id = 'meal-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id::text = (storage.foldername(name))[1]
      and (
        trainee.profile_id = (select auth.uid())
        or trainee.assigned_pt_id = (select auth.uid())
      )
  )
);

create policy meal_media_delete_own on storage.objects
for delete to authenticated using (
  bucket_id = 'meal-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.profile_id = (select auth.uid())
      and trainee.id::text = (storage.foldername(name))[1]
  )
);

create or replace function public.submit_daily_checkin(
  checkin_note text,
  meal_photo_path text default null,
  meal_photo_mime_type text default null,
  meal_photo_size_bytes integer default null
)
returns table (
  checkin_id uuid,
  outcome text,
  local_checkin_date date
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  viewer_id uuid := auth.uid();
  trainee_row public.trainee_profiles%rowtype;
  today date := public.application_local_date(now());
  new_checkin_id uuid;
  normalized_note text := nullif(trim(checkin_note), '');
begin
  select *
  into trainee_row
  from public.trainee_profiles trainee
  where trainee.profile_id = viewer_id
  for update;

  if viewer_id is null or not found then
    raise exception 'Linked trainee account required' using errcode = '42501';
  end if;

  if normalized_note is not null and char_length(normalized_note) > 500 then
    raise exception 'Check-in note is too long' using errcode = '22023';
  end if;

  if (meal_photo_path is null) <> (meal_photo_mime_type is null)
    or (meal_photo_path is null) <> (meal_photo_size_bytes is null) then
    raise exception 'Meal photo metadata must be supplied together' using errcode = '22023';
  end if;

  if meal_photo_path is not null then
    if meal_photo_path not like trainee_row.id::text || '/%'
      or meal_photo_mime_type not in ('image/jpeg', 'image/png', 'image/webp')
      or meal_photo_size_bytes not between 1 and 5242880 then
      raise exception 'Meal photo metadata is invalid' using errcode = '22023';
    end if;

    if not exists (
      select 1
      from storage.objects object
      where object.bucket_id = 'meal-media'
        and object.name = meal_photo_path
    ) then
      raise exception 'Meal photo object not found' using errcode = '22023';
    end if;
  end if;

  if exists (
    select 1
    from public.checkins existing
    where existing.trainee_id = trainee_row.id
      and existing.local_checkin_date = today
  ) then
    return query
      select existing.id, 'already_submitted'::text, existing.local_checkin_date
      from public.checkins existing
      where existing.trainee_id = trainee_row.id
        and existing.local_checkin_date = today
      limit 1;
    return;
  end if;

  insert into public.checkins (trainee_id, local_checkin_date, note)
  values (trainee_row.id, today, normalized_note)
  returning id into new_checkin_id;

  if meal_photo_path is not null then
    insert into public.meal_logs (
      checkin_id,
      trainee_id,
      private_photo_path,
      photo_mime_type,
      photo_size_bytes
    ) values (
      new_checkin_id,
      trainee_row.id,
      meal_photo_path,
      meal_photo_mime_type,
      meal_photo_size_bytes
    );
  end if;

  update public.trainee_profiles
  set last_checkin_date = today
  where id = trainee_row.id;

  return query select new_checkin_id, 'created'::text, today;
exception
  when unique_violation then
    return query
      select existing.id, 'already_submitted'::text, existing.local_checkin_date
      from public.checkins existing
      where existing.trainee_id = trainee_row.id
        and existing.local_checkin_date = today
      limit 1;
end;
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
  set
    profile_id = accepting_user_id,
    engagement_started_on = public.application_local_date(now())
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

revoke all on function public.application_timezone() from public;
revoke all on function public.application_local_date(timestamptz) from public;
revoke all on function public.checkin_warning_starts_on(date) from public;
revoke all on function public.is_checkin_warning_due(date, timestamptz) from public;
revoke all on function public.set_trainee_engagement_started_on() from public;
revoke all on function public.submit_daily_checkin(text, text, text, integer) from public;

grant execute on function public.application_timezone() to authenticated;
grant execute on function public.application_local_date(timestamptz) to authenticated;
grant execute on function public.checkin_warning_starts_on(date) to authenticated;
grant execute on function public.is_checkin_warning_due(date, timestamptz) to authenticated;
grant execute on function public.submit_daily_checkin(text, text, text, integer) to authenticated;
