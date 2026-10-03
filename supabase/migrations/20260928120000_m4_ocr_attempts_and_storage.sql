-- M4 OCR attempts, private InBody source storage, and RLS policies

create type public.ocr_attempt_status as enum ('pending', 'success', 'failed');

create table public.ocr_attempts (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  private_image_path text not null unique,
  image_mime_type text not null check (image_mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  image_size_bytes integer not null check (image_size_bytes between 1 and 10485760),
  status public.ocr_attempt_status not null default 'pending',
  error_code text check (
    error_code is null or error_code in (
      'unsupported_type',
      'file_too_large',
      'signature_mismatch',
      'provider_timeout',
      'provider_unavailable',
      'unreadable_document',
      'missing_fields',
      'invalid_values',
      'inconsistent_values',
      'processing_error'
    )
  ),
  provider text not null check (char_length(provider) between 1 and 50),
  provider_version text not null check (char_length(provider_version) between 1 and 50),
  raw_draft jsonb,
  inbody_record_id uuid unique references public.inbody_records(id) on delete set null,
  is_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ocr_attempt_path_scoped check (
    private_image_path like trainee_id::text || '/%'
  ),
  constraint ocr_attempt_status_error_consistent check (
    (status = 'failed' and error_code is not null)
    or (status <> 'failed')
  ),
  constraint ocr_attempt_confirmed_consistent check (
    (is_confirmed = true and inbody_record_id is not null and status = 'success')
    or (is_confirmed = false)
  )
);

create index ocr_attempts_trainee_idx on public.ocr_attempts(trainee_id, created_at desc);
create index ocr_attempts_pt_idx on public.ocr_attempts(pt_id, created_at desc);
create index ocr_attempts_record_idx on public.ocr_attempts(inbody_record_id) where inbody_record_id is not null;

create trigger ocr_attempts_set_updated_at
before update on public.ocr_attempts
for each row execute function public.set_updated_at();

alter table public.ocr_attempts enable row level security;

create policy ocr_attempts_select_assigned_pt on public.ocr_attempts
for select to authenticated using (
  pt_id = (select auth.uid())
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = ocr_attempts.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
  )
);

create policy ocr_attempts_insert_assigned_pt on public.ocr_attempts
for insert to authenticated with check (
  pt_id = (select auth.uid())
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = ocr_attempts.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
      and trainee.profile_id is not null
  )
);

create policy ocr_attempts_update_assigned_pt on public.ocr_attempts
for update to authenticated using (
  pt_id = (select auth.uid())
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = ocr_attempts.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
  )
) with check (
  pt_id = (select auth.uid())
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.id = ocr_attempts.trainee_id
      and trainee.assigned_pt_id = (select auth.uid())
  )
);

revoke all on public.ocr_attempts from anon, authenticated;
grant select, insert, update on public.ocr_attempts to authenticated;

-- Storage bucket for private InBody source media
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'inbody-media',
  'inbody-media',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
);

-- InBody media storage RLS
create policy inbody_media_insert_assigned_pt on storage.objects
for insert to authenticated with check (
  bucket_id = 'inbody-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.assigned_pt_id = (select auth.uid())
      and trainee.id::text = (storage.foldername(name))[1]
      and trainee.profile_id is not null
  )
);

create policy inbody_media_select_assigned_pt on storage.objects
for select to authenticated using (
  bucket_id = 'inbody-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.assigned_pt_id = (select auth.uid())
      and trainee.id::text = (storage.foldername(name))[1]
  )
);

create policy inbody_media_delete_assigned_pt on storage.objects
for delete to authenticated using (
  bucket_id = 'inbody-media'
  and exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.assigned_pt_id = (select auth.uid())
      and trainee.id::text = (storage.foldername(name))[1]
  )
);

-- Atomic confirmation function for OCR InBody records
create or replace function public.confirm_ocr_inbody_record(
  attempt_id uuid,
  confirmed_weight_kg numeric(5,2),
  confirmed_muscle_kg numeric(5,2),
  confirmed_fat_kg numeric(5,2),
  confirmed_fat_percent numeric(4,1),
  confirmed_water_liters numeric(5,2) default null,
  nutrition_calories integer default null,
  nutrition_protein integer default null,
  nutrition_carb integer default null,
  nutrition_fat integer default null
)
returns table (
  record_id uuid,
  outcome text,
  is_manually_edited boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  viewer_id uuid := auth.uid();
  attempt_row public.ocr_attempts%rowtype;
  trainee_row public.trainee_profiles%rowtype;
  new_record_id uuid;
  manually_edited boolean := false;
  extracted_weight numeric(5,2);
  extracted_muscle numeric(5,2);
  extracted_fat numeric(5,2);
  extracted_percent numeric(4,1);
  extracted_water numeric(5,2);
begin
  if viewer_id is null then
    raise exception 'Authenticated PT required' using errcode = '42501';
  end if;

  select *
  into attempt_row
  from public.ocr_attempts
  where id = attempt_id
  for update;

  if not found then
    raise exception 'OCR attempt not found' using errcode = 'P0002';
  end if;

  if attempt_row.pt_id <> viewer_id then
    raise exception 'Permission denied for this OCR attempt' using errcode = '42501';
  end if;

  if attempt_row.is_confirmed and attempt_row.inbody_record_id is not null then
    return query select attempt_row.inbody_record_id, 'already_confirmed'::text, false;
    return;
  end if;

  if attempt_row.status <> 'success' then
    raise exception 'Cannot confirm an unfulfilled or failed OCR attempt' using errcode = '22023';
  end if;

  select *
  into trainee_row
  from public.trainee_profiles
  where id = attempt_row.trainee_id and assigned_pt_id = viewer_id;

  if not found or trainee_row.profile_id is null then
    raise exception 'Trainee not active or not assigned to PT' using errcode = '42501';
  end if;

  -- Ensure private source image still exists
  if not exists (
    select 1
    from storage.objects
    where bucket_id = 'inbody-media'
      and name = attempt_row.private_image_path
  ) then
    raise exception 'OCR source image missing from storage' using errcode = '22023';
  end if;

  -- Check differences against normalized draft to derive is_manually_edited
  if attempt_row.raw_draft ? 'metrics' then
    extracted_weight := (attempt_row.raw_draft -> 'metrics' ->> 'weight_kg')::numeric;
    extracted_muscle := (attempt_row.raw_draft -> 'metrics' ->> 'skeletal_muscle_mass_kg')::numeric;
    extracted_fat := (attempt_row.raw_draft -> 'metrics' ->> 'body_fat_mass_kg')::numeric;
    extracted_percent := (attempt_row.raw_draft -> 'metrics' ->> 'percent_body_fat')::numeric;
    extracted_water := (attempt_row.raw_draft -> 'metrics' ->> 'total_body_water_liters')::numeric;

    if confirmed_weight_kg is distinct from extracted_weight
      or confirmed_muscle_kg is distinct from extracted_muscle
      or confirmed_fat_kg is distinct from extracted_fat
      or confirmed_fat_percent is distinct from extracted_percent
      or confirmed_water_liters is distinct from extracted_water then
      manually_edited := true;
    end if;
  else
    manually_edited := true;
  end if;

  -- Insert atomic verified inbody record with source = 'ocr'
  insert into public.inbody_records (
    trainee_id,
    pt_id,
    weight_kg,
    skeletal_muscle_mass_kg,
    body_fat_mass_kg,
    percent_body_fat,
    total_body_water_liters,
    target_calories,
    target_protein_grams,
    target_carb_grams,
    target_fat_grams,
    source,
    is_manually_edited,
    verified_by
  ) values (
    trainee_row.id,
    viewer_id,
    confirmed_weight_kg,
    confirmed_muscle_kg,
    confirmed_fat_kg,
    confirmed_fat_percent,
    confirmed_water_liters,
    nutrition_calories,
    nutrition_protein,
    nutrition_carb,
    nutrition_fat,
    'ocr',
    manually_edited,
    viewer_id
  )
  returning id into new_record_id;

  update public.ocr_attempts
  set
    inbody_record_id = new_record_id,
    is_confirmed = true,
    updated_at = now()
  where id = attempt_row.id;

  return query select new_record_id, 'confirmed'::text, manually_edited;
end;
$$;

revoke all on function public.confirm_ocr_inbody_record from anon, authenticated;
grant execute on function public.confirm_ocr_inbody_record to authenticated;
