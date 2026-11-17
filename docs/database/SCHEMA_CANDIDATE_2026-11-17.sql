


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "private";


ALTER SCHEMA "private" OWNER TO "postgres";


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."fitness_goal" AS ENUM (
    'fat_loss',
    'muscle_gain',
    'recomp'
);


ALTER TYPE "public"."fitness_goal" OWNER TO "postgres";


CREATE TYPE "public"."inbody_source" AS ENUM (
    'manual',
    'ocr'
);


ALTER TYPE "public"."inbody_source" OWNER TO "postgres";


CREATE TYPE "public"."invitation_status" AS ENUM (
    'pending',
    'accepted',
    'revoked',
    'expired'
);


ALTER TYPE "public"."invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."ocr_attempt_status" AS ENUM (
    'pending',
    'success',
    'failed'
);


ALTER TYPE "public"."ocr_attempt_status" OWNER TO "postgres";


CREATE TYPE "public"."subscription_plan" AS ENUM (
    'free',
    'pro',
    'enterprise'
);


ALTER TYPE "public"."subscription_plan" OWNER TO "postgres";


CREATE TYPE "public"."trainee_status" AS ENUM (
    'active',
    'warning',
    'inactive',
    'archived'
);


ALTER TYPE "public"."trainee_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'pt',
    'trainee',
    'admin'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."guard_appointment_creation"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "private"."guard_appointment_creation"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."guard_coaching_note"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare t public.trainee_profiles;
begin
  if new.pt_id is distinct from auth.uid() or (select role from public.profiles where id=auth.uid()) is distinct from 'pt'::public.user_role then
    raise exception 'Not permitted' using errcode='42501';
  end if;
  select * into t from public.trainee_profiles where id=new.trainee_id for share;
  if not found or t.status='archived' or t.assigned_pt_id is distinct from new.pt_id or t.profile_id is distinct from new.learner_id then
    raise exception 'Not permitted' using errcode='42501';
  end if;
  return new;
end;
$$;


ALTER FUNCTION "private"."guard_coaching_note"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "private"."retire_relationship_appointments"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "private"."retire_relationship_appointments"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") RETURNS TABLE("trainee_id" "uuid", "outcome" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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

  -- Guard: if invitation is pending, but this user is already linked to another trainee profile
  if exists (
    select 1 from public.trainee_profiles
    where profile_id = accepting_user_id and id <> invitation_row.trainee_id
  ) then
    return query select null::uuid, 'already_linked'::text;
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


ALTER FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) RETURNS "date"
    LANGUAGE "sql" IMMUTABLE PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select (at_time at time zone 'Asia/Ho_Chi_Minh')::date;
$$;


ALTER FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."application_timezone"() RETURNS "text"
    LANGUAGE "sql" IMMUTABLE PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select 'Asia/Ho_Chi_Minh'::text;
$$;


ALTER FUNCTION "public"."application_timezone"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."capture_product_event"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
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
end; $_$;


ALTER FUNCTION "public"."capture_product_event"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") RETURNS "date"
    LANGUAGE "sql" IMMUTABLE STRICT PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select reference_date + 4;
$$;


ALTER FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."confirm_ocr_inbody_record"("attempt_id" "uuid", "confirmed_weight_kg" numeric, "confirmed_muscle_kg" numeric, "confirmed_fat_kg" numeric, "confirmed_fat_percent" numeric, "confirmed_water_liters" numeric DEFAULT NULL::numeric, "nutrition_calories" integer DEFAULT NULL::integer, "nutrition_protein" integer DEFAULT NULL::integer, "nutrition_carb" integer DEFAULT NULL::integer, "nutrition_fat" integer DEFAULT NULL::integer) RETURNS TABLE("record_id" "uuid", "outcome" "text", "is_manually_edited" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."confirm_ocr_inbody_record"("attempt_id" "uuid", "confirmed_weight_kg" numeric, "confirmed_muscle_kg" numeric, "confirmed_fat_kg" numeric, "confirmed_fat_percent" numeric, "confirmed_water_liters" numeric, "nutrition_calories" integer, "nutrition_protein" integer, "nutrition_carb" integer, "nutrition_fat" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_admin_overview"() RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
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
end; $_$;


ALTER FUNCTION "public"."get_admin_overview"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_assigned_coach_identity"() RETURNS TABLE("id" "uuid", "display_name" "text")
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select p.id, p.display_name
  from public.trainee_profiles t join public.profiles p on p.id = t.assigned_pt_id
  join public.profiles caller on caller.id = auth.uid() and caller.role = 'trainee'
  where t.profile_id = auth.uid() and t.status <> 'archived' and p.role = 'pt';
$$;


ALTER FUNCTION "public"."get_assigned_coach_identity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") RETURNS TABLE("display_name" "text", "email" "text", "expires_at" timestamp with time zone)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select trainee.display_name, invitation.email, invitation.expires_at
  from public.trainee_invitations invitation
  join public.trainee_profiles trainee on trainee.id = invitation.trainee_id
  where invitation.token_hash = invite_token_hash
    and invitation.status = 'pending'
    and invitation.expires_at > now()
    and trainee.profile_id is null
  limit 1;
$$;


ALTER FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."guard_active_trainee_write"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare t public.trainee_profiles%rowtype; caller_role public.user_role;
begin
  if current_setting('role', true) <> 'authenticated' then return new; end if;
  select * into t from public.trainee_profiles where id = new.trainee_id for share;
  select role into caller_role from public.profiles where id = auth.uid();
  if (tg_table_name = 'inbody_records' and caller_role is distinct from 'pt'::public.user_role)
    or (tg_table_name = 'checkins' and caller_role is distinct from 'trainee'::public.user_role) then
    raise exception 'Active linked profile required' using errcode = '42501';
  end if;
  if t.id is null or t.status = 'archived' or (
    (caller_role = 'pt' and t.assigned_pt_id = auth.uid())
    or (caller_role = 'trainee' and t.profile_id = auth.uid())
  ) is not true then raise exception 'Active linked profile required' using errcode = '42501'; end if;
  return new;
end; $$;


ALTER FUNCTION "public"."guard_active_trainee_write"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."guard_roster_plan_limit"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare plan public.subscription_plan; valid_until timestamptz; active_count integer;
begin
 if current_setting('role',true) <> 'authenticated' then return new; end if;
 if (select role from public.profiles where id=auth.uid()) is distinct from 'pt'::public.user_role or new.assigned_pt_id<>auth.uid() then
  raise exception 'PT account required' using errcode='42501'; end if;
 if tg_op='UPDATE' then
  if old.status<>'archived' or new.status='archived' then return new; end if;
 else
  new.created_at:=now(); new.updated_at:=now(); new.roster_version:=1;
  new.archived_at:=case when new.status='archived' then now() else null end;
  if new.total_sessions>500 then raise exception 'Invalid package size' using errcode='22023'; end if;
 end if;
 -- Same row serializes concurrent creates, restores and payment reconciliation.
 select subscription_plan,subscription_valid_until into plan,valid_until from public.pt_profiles where id=new.assigned_pt_id for update;
 if not found then raise exception 'PT account required' using errcode='42501'; end if;
 if tg_op='INSERT' and (select count(*) from public.trainee_profiles where assigned_pt_id=auth.uid() and created_at>=now()-interval '24 hours')>=100 then
  raise exception 'Daily profile creation limit reached' using errcode='54000'; end if;
 if new.status='archived' then return new; end if;
 if plan in ('pro','enterprise') and valid_until>now() then return new; end if;
 select count(*) into active_count from public.trainee_profiles where assigned_pt_id=new.assigned_pt_id and status<>'archived' and id<>new.id;
 if active_count>=3 then raise exception 'Free plan allows three active profiles' using errcode='P0001'; end if;
 return new;
end; $$;


ALTER FUNCTION "public"."guard_roster_plan_limit"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) RETURNS boolean
    LANGUAGE "sql" IMMUTABLE STRICT PARALLEL SAFE
    SET "search_path" TO ''
    AS $$
  select public.application_local_date(at_time) >= public.checkin_warning_starts_on(reference_date);
$$;


ALTER FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_system_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;


ALTER FUNCTION "public"."is_system_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_workspace_open"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
declare synthetic boolean;
begin
 if not exists(select 1 from public.profiles where id=auth.uid() and role in ('pt','trainee')) then raise exception 'Workspace account required' using errcode='42501'; end if;
 select coalesce((raw_user_meta_data->>'synthetic')='true',false) or coalesce(email ~* '(@example\.(test|com)$|^test[.+_-]|^e2e[.+_-]|^demo[.+_-])',false) into synthetic from auth.users where id=auth.uid();
 insert into public.product_events(actor_id,event_key,is_test) values(auth.uid(),'workspace_opened',coalesce(synthetic,true)) on conflict do nothing;
end; $_$;


ALTER FUNCTION "public"."log_workspace_open"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."record_finance_entry"("request_nonce" "uuid", "entry_kind" "text", "entry_category" "text", "amount" bigint, "transaction_reference" "text", "transacted_at" timestamp with time zone, "receipt_path" "text", "receipt_sha256" "text", "description" "text", "test_entry" boolean, "customer" "uuid" DEFAULT NULL::"uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
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
end; $_$;


ALTER FUNCTION "public"."record_finance_entry"("request_nonce" "uuid", "entry_kind" "text", "entry_category" "text", "amount" bigint, "transaction_reference" "text", "transacted_at" timestamp with time zone, "receipt_path" "text", "receipt_sha256" "text", "description" "text", "test_entry" boolean, "customer" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reissue_trainee_invitation"("target_trainee_id" "uuid", "new_token_hash" "text", "new_expires_at" timestamp with time zone) RETURNS TABLE("invitation_id" "uuid", "email" "text", "expires_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
declare
  caller_id uuid := auth.uid();
  trainee_row public.trainee_profiles%rowtype;
  trainee_email text;
  new_invitation_id uuid;
begin
  if caller_id is null or (
    select role from public.profiles where id = caller_id
  ) is distinct from 'pt'::public.user_role or not exists (
    select 1 from public.pt_profiles where id = caller_id
  ) then
    raise exception 'PT account required' using errcode = '42501';
  end if;

  if new_token_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid SHA-256 token hash format' using errcode = '22023';
  end if;

  if new_expires_at <= now() or new_expires_at > now() + interval '30 days' then
    raise exception 'Invitation expiry is outside the allowed window' using errcode = '22023';
  end if;

  select *
  into trainee_row
  from public.trainee_profiles
  where id = target_trainee_id and assigned_pt_id = caller_id
  for update;

  if not found then
    raise exception 'Trainee profile not found or not assigned to PT' using errcode = 'P0002';
  end if;

  if trainee_row.profile_id is not null then
    raise exception 'Trainee has already accepted an invitation' using errcode = '22000';
  end if;

  if trainee_row.status = 'archived' then
    raise exception 'Cannot reissue invitation for archived trainee' using errcode = '22000';
  end if;

  -- Find the email address used for this trainee
  select invitation.email
  into trainee_email
  from public.trainee_invitations invitation
  where invitation.trainee_id = target_trainee_id
  order by invitation.created_at desc
  limit 1;

  if trainee_email is null then
    raise exception 'No prior invitation email found for this trainee' using errcode = 'P0002';
  end if;

  -- Revoke any pending invitations for this trainee
  update public.trainee_invitations
  set status = 'revoked'
  where trainee_id = target_trainee_id and status = 'pending';

  -- Insert the new invitation
  insert into public.trainee_invitations (
    pt_id,
    trainee_id,
    email,
    token_hash,
    expires_at,
    status
  ) values (
    caller_id,
    target_trainee_id,
    trainee_email,
    new_token_hash,
    new_expires_at,
    'pending'
  )
  returning id into new_invitation_id;

  return query select new_invitation_id, trainee_email, new_expires_at;
end;
$_$;


ALTER FUNCTION "public"."reissue_trainee_invitation"("target_trainee_id" "uuid", "new_token_hash" "text", "new_expires_at" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."request_pt_upgrade"("request_nonce" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."request_pt_upgrade"("request_nonce" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reverse_finance_entry"("target_entry" "uuid", "request_nonce" "uuid", "reason" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."reverse_finance_entry"("target_entry" "uuid", "request_nonce" "uuid", "reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."revoke_trainee_invitation"("target_trainee_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  if auth.uid() is null or (select role from public.profiles where id = auth.uid()) is distinct from 'pt'::public.user_role then
    raise exception 'PT account required' using errcode = '42501';
  end if;
  perform 1 from public.trainee_profiles where id = target_trainee_id and assigned_pt_id = auth.uid() and profile_id is null for update;
  if not found then return false; end if;
  update public.trainee_invitations set status = 'revoked' where trainee_id = target_trainee_id and status = 'pending';
  return found;
end; $$;


ALTER FUNCTION "public"."revoke_trainee_invitation"("target_trainee_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_coaching_membership"("target_trainee" "uuid", "request_id" "uuid", "membership_label" "text", "starts_on" "date", "ends_on" "date", "expected_revision" integer) RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
declare
  t public.trainee_profiles;
  previous public.coaching_membership_versions;
  current_revision integer;
  result uuid;
begin
  if (select role from public.profiles where id=auth.uid()) is distinct from 'pt'::public.user_role then
    raise exception 'Not permitted' using errcode='42501';
  end if;
  select * into t from public.trainee_profiles where id=target_trainee for update;
  if not found or t.assigned_pt_id is distinct from auth.uid() or t.profile_id is null or t.status='archived' then
    raise exception 'Not permitted' using errcode='42501';
  end if;
  select * into previous from public.coaching_membership_versions m where m.pt_id=auth.uid() and m.client_request_id=request_id;
  if found then
    if previous.trainee_id<>t.id or previous.learner_id<>t.profile_id or previous.label is distinct from membership_label
      or previous.starts_on is distinct from starts_on or previous.ends_on is distinct from ends_on then
      raise exception 'Request already used' using errcode='23505';
    end if;
    return previous.id;
  end if;
  select coalesce(max(m.revision),0) into current_revision from public.coaching_membership_versions m
    where m.trainee_id=t.id and m.pt_id=auth.uid() and m.learner_id=t.profile_id;
  if expected_revision is distinct from current_revision then
    raise exception 'Membership changed; reload before saving' using errcode='40001';
  end if;
  insert into public.coaching_membership_versions(trainee_id,pt_id,learner_id,revision,client_request_id,label,starts_on,ends_on)
    values(t.id,auth.uid(),t.profile_id,current_revision+1,request_id,membership_label,starts_on,ends_on) returning id into result;
  return result;
end;
$$;


ALTER FUNCTION "public"."save_coaching_membership"("target_trainee" "uuid", "request_id" "uuid", "membership_label" "text", "starts_on" "date", "ends_on" "date", "expected_revision" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_trainee_profile"("target_trainee" "uuid", "expected_version" integer, "trainee_name" "text", "contact_phone" "text", "goal" "public"."fitness_goal") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $_$
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
end; $_$;


ALTER FUNCTION "public"."save_trainee_profile"("target_trainee" "uuid", "expected_version" integer, "trainee_name" "text", "contact_phone" "text", "goal" "public"."fitness_goal") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_trainee_archived"("target_trainee" "uuid", "expected_version" integer, "archive_profile" boolean) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."set_trainee_archived"("target_trainee" "uuid", "expected_version" integer, "archive_profile" boolean) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_trainee_engagement_started_on"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if new.profile_id is null then
    new.engagement_started_on = null;
  elsif new.engagement_started_on is null then
    new.engagement_started_on = public.application_local_date(now());
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."set_trainee_engagement_started_on"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text" DEFAULT NULL::"text", "meal_photo_mime_type" "text" DEFAULT NULL::"text", "meal_photo_size_bytes" integer DEFAULT NULL::integer) RETURNS TABLE("checkin_id" "uuid", "outcome" "text", "local_checkin_date" "date")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
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


ALTER FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text", "meal_photo_mime_type" "text", "meal_photo_size_bytes" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."billing_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "client_nonce" "uuid" NOT NULL,
    "amount_vnd" integer DEFAULT 199000 NOT NULL,
    "state" "text" DEFAULT 'requested'::"text" NOT NULL,
    "finance_entry_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "billing_requests_amount_vnd_check" CHECK (("amount_vnd" = 199000)),
    CONSTRAINT "billing_requests_check" CHECK ((("state" = ANY (ARRAY['reconciled'::"text", 'reversed'::"text"])) = ("finance_entry_id" IS NOT NULL))),
    CONSTRAINT "billing_requests_state_check" CHECK (("state" = ANY (ARRAY['requested'::"text", 'reconciled'::"text", 'withdrawn'::"text", 'reversed'::"text"])))
);


ALTER TABLE "public"."billing_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checkins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "local_checkin_date" "date" NOT NULL,
    "note" "text",
    "submitted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "checkins_note_check" CHECK ((("note" IS NULL) OR (("char_length"("note") >= 1) AND ("char_length"("note") <= 500))))
);


ALTER TABLE "public"."checkins" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coaching_appointments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "client_request_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "kind" "text" NOT NULL,
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "retired_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "coaching_appointments_kind_check" CHECK (("kind" = ANY (ARRAY['training'::"text", 'consultation'::"text"]))),
    CONSTRAINT "coaching_appointments_retirement" CHECK ((("status" = 'retired'::"text") = ("retired_at" IS NOT NULL))),
    CONSTRAINT "coaching_appointments_status_check" CHECK (("status" = ANY (ARRAY['scheduled'::"text", 'retired'::"text"]))),
    CONSTRAINT "coaching_appointments_time_bounds" CHECK (("isfinite"("starts_at") AND "isfinite"("ends_at") AND ("ends_at" > "starts_at") AND (("ends_at" - "starts_at") <= '24:00:00'::interval))),
    CONSTRAINT "coaching_appointments_title_check" CHECK (((("char_length"("title") >= 1) AND ("char_length"("title") <= 100)) AND ("title" = "btrim"("title")) AND ("title" ~ '[^[:space:]]'::"text")))
);


ALTER TABLE "public"."coaching_appointments" OWNER TO "postgres";


COMMENT ON TABLE "public"."coaching_appointments" IS 'Shared appointments; PT creates, current participant pair reads. No session debit. Relationship changes retire slots without transferring private history. Change requests/completion belong to later slices.';



CREATE TABLE IF NOT EXISTS "public"."coaching_membership_versions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "revision" integer NOT NULL,
    "client_request_id" "uuid" NOT NULL,
    "label" "text" NOT NULL,
    "starts_on" "date" NOT NULL,
    "ends_on" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "coaching_membership_versions_check" CHECK (("isfinite"("starts_on") AND "isfinite"("ends_on") AND ("ends_on" >= "starts_on"))),
    CONSTRAINT "coaching_membership_versions_label_check" CHECK (((("char_length"("label") >= 1) AND ("char_length"("label") <= 100)) AND ("label" = "btrim"("label")))),
    CONSTRAINT "coaching_membership_versions_revision_check" CHECK (("revision" > 0))
);


ALTER TABLE "public"."coaching_membership_versions" OWNER TO "postgres";


COMMENT ON TABLE "public"."coaching_membership_versions" IS 'Append-only membership date revisions. Inclusive end date, no session debit/payment/subscription side effects.';



CREATE TABLE IF NOT EXISTS "public"."coaching_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "learner_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "client_message_id" "uuid" NOT NULL,
    "body" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "coaching_messages_body_check" CHECK (((("char_length"("body") >= 1) AND ("char_length"("body") <= 4000)) AND ("body" = "btrim"("body")) AND ("body" ~ '[^[:space:]]'::"text")))
);


ALTER TABLE "public"."coaching_messages" OWNER TO "postgres";


COMMENT ON TABLE "public"."coaching_messages" IS 'Private text messages for the current linked PT/trainee pair. No admin override. Archived/unlinked/reassigned old threads are inaccessible; no deletion workflow is introduced.';



CREATE TABLE IF NOT EXISTS "public"."coaching_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "learner_id" "uuid",
    "client_request_id" "uuid" NOT NULL,
    "visibility" "text" DEFAULT 'private'::"text" NOT NULL,
    "body" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "coaching_notes_body_check" CHECK (((("char_length"("body") >= 1) AND ("char_length"("body") <= 2000)) AND ("body" = "btrim"("body")) AND ("body" ~ '[^[:space:]]'::"text"))),
    CONSTRAINT "coaching_notes_check" CHECK ((("visibility" = 'private'::"text") OR ("learner_id" IS NOT NULL))),
    CONSTRAINT "coaching_notes_visibility_check" CHECK (("visibility" = ANY (ARRAY['private'::"text", 'shared'::"text"])))
);


ALTER TABLE "public"."coaching_notes" OWNER TO "postgres";


COMMENT ON TABLE "public"."coaching_notes" IS 'PT notes private by default. Shared notes require an explicitly bound linked learner. No admin override or ordinary mutation/deletion.';



CREATE TABLE IF NOT EXISTS "public"."finance_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "client_nonce" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "category" "text" NOT NULL,
    "amount_vnd" bigint NOT NULL,
    "customer_id" "uuid",
    "bank_reference" "text",
    "occurred_at" timestamp with time zone NOT NULL,
    "evidence_path" "text" NOT NULL,
    "evidence_sha256" "text" NOT NULL,
    "note" "text" NOT NULL,
    "is_test" boolean DEFAULT false NOT NULL,
    "reverses_id" "uuid",
    "service_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "finance_entries_amount_vnd_check" CHECK ((("amount_vnd" >= 1) AND ("amount_vnd" <= '10000000000'::bigint))),
    CONSTRAINT "finance_entries_category_check" CHECK (("category" = ANY (ARRAY['subscription'::"text", 'marketing'::"text", 'hosting'::"text", 'tools'::"text", 'other'::"text"]))),
    CONSTRAINT "finance_entries_check" CHECK ((("kind" = 'reversal'::"text") = ("reverses_id" IS NOT NULL))),
    CONSTRAINT "finance_entries_check1" CHECK ((("kind" = 'reversal'::"text") OR (("bank_reference" IS NOT NULL) AND (("length"("bank_reference") >= 3) AND ("length"("bank_reference") <= 120))))),
    CONSTRAINT "finance_entries_check2" CHECK ((("category" <> 'subscription'::"text") OR ("customer_id" IS NOT NULL))),
    CONSTRAINT "finance_entries_evidence_sha256_check" CHECK (("evidence_sha256" ~ '^[0-9a-f]{64}$'::"text")),
    CONSTRAINT "finance_entries_kind_check" CHECK (("kind" = ANY (ARRAY['income'::"text", 'expense'::"text", 'reversal'::"text"]))),
    CONSTRAINT "finance_entries_note_check" CHECK ((("length"("btrim"("note")) >= 5) AND ("length"("btrim"("note")) <= 500)))
);


ALTER TABLE "public"."finance_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inbody_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "weight_kg" numeric(5,2) NOT NULL,
    "skeletal_muscle_mass_kg" numeric(5,2) NOT NULL,
    "body_fat_mass_kg" numeric(5,2) NOT NULL,
    "percent_body_fat" numeric(4,1) NOT NULL,
    "total_body_water_liters" numeric(5,2),
    "target_calories" integer,
    "target_protein_grams" integer,
    "target_carb_grams" integer,
    "target_fat_grams" integer,
    "source" "public"."inbody_source" DEFAULT 'manual'::"public"."inbody_source" NOT NULL,
    "is_manually_edited" boolean DEFAULT false NOT NULL,
    "verified_by" "uuid" NOT NULL,
    "recorded_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "inbody_components_within_weight" CHECK ((("skeletal_muscle_mass_kg" + "body_fat_mass_kg") <= "weight_kg")),
    CONSTRAINT "inbody_cross_field_check" CHECK (("abs"(((("body_fat_mass_kg" / "weight_kg") * (100)::numeric) - "percent_body_fat")) <= (2)::numeric)),
    CONSTRAINT "inbody_fat_mass_within_weight" CHECK (("body_fat_mass_kg" <= "weight_kg")),
    CONSTRAINT "inbody_pt_verifier_match" CHECK (("pt_id" = "verified_by")),
    CONSTRAINT "inbody_records_body_fat_mass_kg_check" CHECK ((("body_fat_mass_kg" >= (2)::numeric) AND ("body_fat_mass_kg" <= (100)::numeric))),
    CONSTRAINT "inbody_records_percent_body_fat_check" CHECK ((("percent_body_fat" >= (3)::numeric) AND ("percent_body_fat" <= (60)::numeric))),
    CONSTRAINT "inbody_records_skeletal_muscle_mass_kg_check" CHECK ((("skeletal_muscle_mass_kg" >= (10)::numeric) AND ("skeletal_muscle_mass_kg" <= (75)::numeric))),
    CONSTRAINT "inbody_records_target_calories_check" CHECK ((("target_calories" IS NULL) OR (("target_calories" >= 800) AND ("target_calories" <= 6000)))),
    CONSTRAINT "inbody_records_target_carb_grams_check" CHECK ((("target_carb_grams" IS NULL) OR (("target_carb_grams" >= 0) AND ("target_carb_grams" <= 1000)))),
    CONSTRAINT "inbody_records_target_fat_grams_check" CHECK ((("target_fat_grams" IS NULL) OR (("target_fat_grams" >= 0) AND ("target_fat_grams" <= 300)))),
    CONSTRAINT "inbody_records_target_protein_grams_check" CHECK ((("target_protein_grams" IS NULL) OR (("target_protein_grams" >= 0) AND ("target_protein_grams" <= 500)))),
    CONSTRAINT "inbody_records_total_body_water_liters_check" CHECK ((("total_body_water_liters" IS NULL) OR (("total_body_water_liters" >= (10)::numeric) AND ("total_body_water_liters" <= (100)::numeric)))),
    CONSTRAINT "inbody_records_weight_kg_check" CHECK ((("weight_kg" >= (30)::numeric) AND ("weight_kg" <= (220)::numeric))),
    CONSTRAINT "inbody_water_within_weight" CHECK ((("total_body_water_liters" IS NULL) OR ("total_body_water_liters" <= "weight_kg")))
);


ALTER TABLE "public"."inbody_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meal_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "checkin_id" "uuid" NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "private_photo_path" "text" NOT NULL,
    "photo_mime_type" "text" NOT NULL,
    "photo_size_bytes" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "meal_logs_photo_mime_type_check" CHECK (("photo_mime_type" = ANY (ARRAY['image/jpeg'::"text", 'image/png'::"text", 'image/webp'::"text"]))),
    CONSTRAINT "meal_logs_photo_size_bytes_check" CHECK ((("photo_size_bytes" >= 1) AND ("photo_size_bytes" <= 5242880))),
    CONSTRAINT "meal_photo_path_scoped" CHECK (("private_photo_path" ~~ (("trainee_id")::"text" || '/%'::"text")))
);


ALTER TABLE "public"."meal_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ocr_attempts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "private_image_path" "text" NOT NULL,
    "image_mime_type" "text" NOT NULL,
    "image_size_bytes" integer NOT NULL,
    "status" "public"."ocr_attempt_status" DEFAULT 'pending'::"public"."ocr_attempt_status" NOT NULL,
    "error_code" "text",
    "provider" "text" NOT NULL,
    "provider_version" "text" NOT NULL,
    "raw_draft" "jsonb",
    "inbody_record_id" "uuid",
    "is_confirmed" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "duration_ms" integer DEFAULT 0 NOT NULL,
    CONSTRAINT "ocr_attempt_confirmed_consistent" CHECK (((("is_confirmed" = true) AND ("inbody_record_id" IS NOT NULL) AND ("status" = 'success'::"public"."ocr_attempt_status")) OR ("is_confirmed" = false))),
    CONSTRAINT "ocr_attempt_path_scoped" CHECK (("private_image_path" ~~ (("trainee_id")::"text" || '/%'::"text"))),
    CONSTRAINT "ocr_attempt_status_error_consistent" CHECK (((("status" = 'failed'::"public"."ocr_attempt_status") AND ("error_code" IS NOT NULL)) OR ("status" <> 'failed'::"public"."ocr_attempt_status"))),
    CONSTRAINT "ocr_attempts_duration_ms_check" CHECK ((("duration_ms" >= 0) AND ("duration_ms" <= 120000))),
    CONSTRAINT "ocr_attempts_error_code_check" CHECK ((("error_code" IS NULL) OR ("error_code" = ANY (ARRAY['unsupported_type'::"text", 'file_too_large'::"text", 'signature_mismatch'::"text", 'provider_timeout'::"text", 'provider_unavailable'::"text", 'unreadable_document'::"text", 'missing_fields'::"text", 'invalid_values'::"text", 'inconsistent_values'::"text", 'processing_error'::"text"])))),
    CONSTRAINT "ocr_attempts_image_mime_type_check" CHECK (("image_mime_type" = ANY (ARRAY['image/jpeg'::"text", 'image/png'::"text", 'image/webp'::"text"]))),
    CONSTRAINT "ocr_attempts_image_size_bytes_check" CHECK ((("image_size_bytes" >= 1) AND ("image_size_bytes" <= 10485760))),
    CONSTRAINT "ocr_attempts_provider_check" CHECK ((("char_length"("provider") >= 1) AND ("char_length"("provider") <= 50))),
    CONSTRAINT "ocr_attempts_provider_version_check" CHECK ((("char_length"("provider_version") >= 1) AND ("char_length"("provider_version") <= 50)))
);


ALTER TABLE "public"."ocr_attempts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "event_key" "text" NOT NULL,
    "subject_id" "uuid",
    "channel" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "is_test" boolean NOT NULL,
    "event_day" "date" DEFAULT "public"."application_local_date"("now"()) NOT NULL,
    "occurred_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "product_events_channel_check" CHECK (("channel" = ANY (ARRAY['unknown'::"text", 'direct'::"text", 'facebook'::"text", 'tiktok'::"text", 'zalo'::"text", 'referral'::"text"]))),
    CONSTRAINT "product_events_event_key_check" CHECK (("event_key" = ANY (ARRAY['registered'::"text", 'workspace_opened'::"text", 'trainee_created'::"text", 'invitation_accepted'::"text", 'inbody_confirmed'::"text", 'checkin_submitted'::"text", 'chat_sent'::"text", 'appointment_created'::"text", 'upgrade_requested'::"text"])))
);


ALTER TABLE "public"."product_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "role" "public"."user_role" DEFAULT 'pt'::"public"."user_role" NOT NULL,
    "display_name" "text" NOT NULL,
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_display_name_check" CHECK ((("char_length"("display_name") >= 2) AND ("char_length"("display_name") <= 100))),
    CONSTRAINT "profiles_phone_check" CHECK ((("phone" IS NULL) OR (("char_length"("phone") >= 8) AND ("char_length"("phone") <= 20))))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pt_profiles" (
    "id" "uuid" NOT NULL,
    "gym_affiliation" "text",
    "subscription_plan" "public"."subscription_plan" DEFAULT 'free'::"public"."subscription_plan" NOT NULL,
    "subscription_valid_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "pt_profiles_gym_affiliation_check" CHECK ((("gym_affiliation" IS NULL) OR ("char_length"("gym_affiliation") <= 150)))
);


ALTER TABLE "public"."pt_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainee_invitations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pt_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "token_hash" "text" NOT NULL,
    "status" "public"."invitation_status" DEFAULT 'pending'::"public"."invitation_status" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "accepted_by" "uuid",
    "accepted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "trainee_id" "uuid",
    CONSTRAINT "invitation_acceptance_consistent" CHECK (((("status" = 'accepted'::"public"."invitation_status") AND ("accepted_by" IS NOT NULL) AND ("accepted_at" IS NOT NULL)) OR (("status" <> 'accepted'::"public"."invitation_status") AND ("accepted_by" IS NULL) AND ("accepted_at" IS NULL)))),
    CONSTRAINT "invitation_email_normalized" CHECK (("email" = "lower"(TRIM(BOTH FROM "email")))),
    CONSTRAINT "invitation_expiry_after_creation" CHECK (("expires_at" > "created_at")),
    CONSTRAINT "invitation_has_trainee" CHECK ((("trainee_id" IS NOT NULL) OR ("status" = 'revoked'::"public"."invitation_status"))),
    CONSTRAINT "invitation_token_is_sha256" CHECK (("token_hash" ~ '^[0-9a-f]{64}$'::"text"))
);


ALTER TABLE "public"."trainee_invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainee_profile_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainee_id" "uuid" NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "kind" "text" NOT NULL,
    "roster_version" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "trainee_profile_events_kind_check" CHECK (("kind" = ANY (ARRAY['edited'::"text", 'archived'::"text", 'restored'::"text"])))
);


ALTER TABLE "public"."trainee_profile_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainee_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "assigned_pt_id" "uuid" NOT NULL,
    "primary_goal" "public"."fitness_goal" DEFAULT 'fat_loss'::"public"."fitness_goal" NOT NULL,
    "status" "public"."trainee_status" DEFAULT 'active'::"public"."trainee_status" NOT NULL,
    "total_sessions" integer DEFAULT 12 NOT NULL,
    "remaining_sessions" integer DEFAULT 12 NOT NULL,
    "last_checkin_date" "date",
    "archived_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "profile_id" "uuid",
    "display_name" "text" NOT NULL,
    "phone" "text",
    "engagement_started_on" "date",
    "roster_version" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "remaining_sessions_within_total" CHECK (("remaining_sessions" <= "total_sessions")),
    CONSTRAINT "trainee_display_name_length" CHECK ((("char_length"("display_name") >= 2) AND ("char_length"("display_name") <= 100))),
    CONSTRAINT "trainee_engagement_date_consistent" CHECK (((("profile_id" IS NULL) AND ("engagement_started_on" IS NULL)) OR (("profile_id" IS NOT NULL) AND ("engagement_started_on" IS NOT NULL)))),
    CONSTRAINT "trainee_phone_length" CHECK ((("phone" IS NULL) OR (("char_length"("phone") >= 8) AND ("char_length"("phone") <= 20)))),
    CONSTRAINT "trainee_profiles_remaining_sessions_check" CHECK (("remaining_sessions" >= 0)),
    CONSTRAINT "trainee_profiles_roster_version_check" CHECK (("roster_version" > 0)),
    CONSTRAINT "trainee_profiles_total_sessions_check" CHECK (("total_sessions" >= 0))
);


ALTER TABLE "public"."trainee_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."billing_requests"
    ADD CONSTRAINT "billing_requests_customer_id_client_nonce_key" UNIQUE ("customer_id", "client_nonce");



ALTER TABLE ONLY "public"."billing_requests"
    ADD CONSTRAINT "billing_requests_finance_entry_id_key" UNIQUE ("finance_entry_id");



ALTER TABLE ONLY "public"."billing_requests"
    ADD CONSTRAINT "billing_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checkins"
    ADD CONSTRAINT "checkins_one_per_local_day" UNIQUE ("trainee_id", "local_checkin_date");



ALTER TABLE ONLY "public"."checkins"
    ADD CONSTRAINT "checkins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_learner_overlap" EXCLUDE USING "gist" ("learner_id" WITH =, "tstzrange"("starts_at", "ends_at", '[)'::"text") WITH &&) WHERE (("status" = 'scheduled'::"text"));



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_pt_overlap" EXCLUDE USING "gist" ("pt_id" WITH =, "tstzrange"("starts_at", "ends_at", '[)'::"text") WITH &&) WHERE (("status" = 'scheduled'::"text"));



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_retry_key" UNIQUE ("pt_id", "client_request_id");



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_pt_id_client_request_id_key" UNIQUE ("pt_id", "client_request_id");



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_trainee_id_pt_id_learner_id_re_key" UNIQUE ("trainee_id", "pt_id", "learner_id", "revision");



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_sender_retry_key" UNIQUE ("sender_id", "client_message_id");



ALTER TABLE ONLY "public"."coaching_notes"
    ADD CONSTRAINT "coaching_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coaching_notes"
    ADD CONSTRAINT "coaching_notes_pt_id_client_request_id_key" UNIQUE ("pt_id", "client_request_id");



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_actor_id_client_nonce_key" UNIQUE ("actor_id", "client_nonce");



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_reverses_id_key" UNIQUE ("reverses_id");



ALTER TABLE ONLY "public"."inbody_records"
    ADD CONSTRAINT "inbody_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meal_logs"
    ADD CONSTRAINT "meal_logs_checkin_id_key" UNIQUE ("checkin_id");



ALTER TABLE ONLY "public"."meal_logs"
    ADD CONSTRAINT "meal_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meal_logs"
    ADD CONSTRAINT "meal_logs_private_photo_path_key" UNIQUE ("private_photo_path");



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_inbody_record_id_key" UNIQUE ("inbody_record_id");



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_private_image_path_key" UNIQUE ("private_image_path");



ALTER TABLE ONLY "public"."product_events"
    ADD CONSTRAINT "product_events_actor_id_event_key_subject_id_key" UNIQUE ("actor_id", "event_key", "subject_id");



ALTER TABLE ONLY "public"."product_events"
    ADD CONSTRAINT "product_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pt_profiles"
    ADD CONSTRAINT "pt_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainee_invitations"
    ADD CONSTRAINT "trainee_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainee_invitations"
    ADD CONSTRAINT "trainee_invitations_token_hash_key" UNIQUE ("token_hash");



ALTER TABLE ONLY "public"."trainee_profile_events"
    ADD CONSTRAINT "trainee_profile_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainee_profile_events"
    ADD CONSTRAINT "trainee_profile_events_trainee_id_roster_version_key" UNIQUE ("trainee_id", "roster_version");



ALTER TABLE ONLY "public"."trainee_profiles"
    ADD CONSTRAINT "trainee_profiles_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "billing_one_pending_per_pt" ON "public"."billing_requests" USING "btree" ("customer_id") WHERE ("state" = 'requested'::"text");



CREATE INDEX "checkins_trainee_date_idx" ON "public"."checkins" USING "btree" ("trainee_id", "local_checkin_date" DESC, "submitted_at" DESC);



CREATE INDEX "coaching_appointments_learner_agenda_idx" ON "public"."coaching_appointments" USING "btree" ("learner_id", "starts_at");



CREATE INDEX "coaching_appointments_pt_agenda_idx" ON "public"."coaching_appointments" USING "btree" ("pt_id", "starts_at");



CREATE INDEX "coaching_appointments_trainee_idx" ON "public"."coaching_appointments" USING "btree" ("trainee_id");



CREATE INDEX "coaching_messages_learner_idx" ON "public"."coaching_messages" USING "btree" ("learner_id");



CREATE INDEX "coaching_messages_pt_idx" ON "public"."coaching_messages" USING "btree" ("pt_id");



CREATE INDEX "coaching_messages_thread_idx" ON "public"."coaching_messages" USING "btree" ("trainee_id", "pt_id", "learner_id", "created_at" DESC, "id" DESC);



CREATE INDEX "finance_entries_date_idx" ON "public"."finance_entries" USING "btree" ("occurred_at" DESC, "id" DESC);



CREATE UNIQUE INDEX "finance_reference_once" ON "public"."finance_entries" USING "btree" ("bank_reference") WHERE ("kind" <> 'reversal'::"text");



CREATE INDEX "inbody_records_trainee_date_idx" ON "public"."inbody_records" USING "btree" ("trainee_id", "recorded_at" DESC);



CREATE INDEX "meal_logs_trainee_created_idx" ON "public"."meal_logs" USING "btree" ("trainee_id", "created_at" DESC);



CREATE INDEX "membership_learner_idx" ON "public"."coaching_membership_versions" USING "btree" ("learner_id");



CREATE INDEX "membership_pt_idx" ON "public"."coaching_membership_versions" USING "btree" ("pt_id");



CREATE INDEX "notes_learner_idx" ON "public"."coaching_notes" USING "btree" ("learner_id");



CREATE INDEX "notes_pt_idx" ON "public"."coaching_notes" USING "btree" ("pt_id");



CREATE INDEX "notes_trainee_history_idx" ON "public"."coaching_notes" USING "btree" ("trainee_id", "created_at" DESC, "id" DESC);



CREATE INDEX "ocr_attempts_pt_idx" ON "public"."ocr_attempts" USING "btree" ("pt_id", "created_at" DESC);



CREATE INDEX "ocr_attempts_record_idx" ON "public"."ocr_attempts" USING "btree" ("inbody_record_id") WHERE ("inbody_record_id" IS NOT NULL);



CREATE INDEX "ocr_attempts_trainee_idx" ON "public"."ocr_attempts" USING "btree" ("trainee_id", "created_at" DESC);



CREATE UNIQUE INDEX "pending_invitation_email_per_pt_idx" ON "public"."trainee_invitations" USING "btree" ("pt_id", "email") WHERE ("status" = 'pending'::"public"."invitation_status");



CREATE INDEX "product_event_week_idx" ON "public"."product_events" USING "btree" ("event_day", "event_key") WHERE (NOT "is_test");



CREATE INDEX "trainee_invitations_trainee_idx" ON "public"."trainee_invitations" USING "btree" ("trainee_id", "created_at" DESC);



CREATE INDEX "trainee_profiles_assigned_pt_idx" ON "public"."trainee_profiles" USING "btree" ("assigned_pt_id") WHERE ("archived_at" IS NULL);



CREATE INDEX "trainee_profiles_last_checkin_idx" ON "public"."trainee_profiles" USING "btree" ("assigned_pt_id", "last_checkin_date");



CREATE UNIQUE INDEX "trainee_profiles_profile_id_idx" ON "public"."trainee_profiles" USING "btree" ("profile_id") WHERE ("profile_id" IS NOT NULL);



CREATE INDEX "trainee_profiles_warning_reference_idx" ON "public"."trainee_profiles" USING "btree" ("assigned_pt_id", "last_checkin_date", "engagement_started_on") WHERE (("archived_at" IS NULL) AND ("profile_id" IS NOT NULL));



CREATE UNIQUE INDEX "workspace_daily_event_once" ON "public"."product_events" USING "btree" ("actor_id", "event_key", "event_day") WHERE ("event_key" = 'workspace_opened'::"text");



CREATE OR REPLACE TRIGGER "checkin_active_profile" BEFORE INSERT ON "public"."checkins" FOR EACH ROW EXECUTE FUNCTION "public"."guard_active_trainee_write"();



CREATE OR REPLACE TRIGGER "coaching_appointments_guard_create" BEFORE INSERT ON "public"."coaching_appointments" FOR EACH ROW EXECUTE FUNCTION "private"."guard_appointment_creation"();



CREATE OR REPLACE TRIGGER "coaching_notes_guard" BEFORE INSERT ON "public"."coaching_notes" FOR EACH ROW EXECUTE FUNCTION "private"."guard_coaching_note"();



CREATE OR REPLACE TRIGGER "event_appointment_created" AFTER INSERT ON "public"."coaching_appointments" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_chat_sent" AFTER INSERT ON "public"."coaching_messages" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_checkin_submitted" AFTER INSERT ON "public"."checkins" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_inbody_confirmed" AFTER INSERT ON "public"."inbody_records" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_invitation_accepted" AFTER UPDATE OF "profile_id" ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_registered" AFTER INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_trainee_created" AFTER INSERT ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "event_upgrade_requested" AFTER INSERT ON "public"."billing_requests" FOR EACH ROW EXECUTE FUNCTION "public"."capture_product_event"();



CREATE OR REPLACE TRIGGER "inbody_active_profile" BEFORE INSERT OR UPDATE ON "public"."inbody_records" FOR EACH ROW EXECUTE FUNCTION "public"."guard_active_trainee_write"();



CREATE OR REPLACE TRIGGER "ocr_attempts_set_updated_at" BEFORE UPDATE ON "public"."ocr_attempts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_set_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "pt_profiles_set_updated_at" BEFORE UPDATE ON "public"."pt_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trainee_invitations_set_updated_at" BEFORE UPDATE ON "public"."trainee_invitations" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trainee_plan_insert" BEFORE INSERT ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."guard_roster_plan_limit"();



CREATE OR REPLACE TRIGGER "trainee_plan_restore" BEFORE UPDATE OF "status" ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."guard_roster_plan_limit"();



CREATE OR REPLACE TRIGGER "trainee_profiles_retire_appointments" AFTER UPDATE OF "status", "assigned_pt_id", "profile_id" ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "private"."retire_relationship_appointments"();



CREATE OR REPLACE TRIGGER "trainee_profiles_set_engagement_started_on" BEFORE INSERT OR UPDATE OF "profile_id", "engagement_started_on" ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_trainee_engagement_started_on"();



CREATE OR REPLACE TRIGGER "trainee_profiles_set_updated_at" BEFORE UPDATE ON "public"."trainee_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."billing_requests"
    ADD CONSTRAINT "billing_requests_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."billing_requests"
    ADD CONSTRAINT "billing_requests_finance_entry_id_fkey" FOREIGN KEY ("finance_entry_id") REFERENCES "public"."finance_entries"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."checkins"
    ADD CONSTRAINT "checkins_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_appointments"
    ADD CONSTRAINT "coaching_appointments_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_membership_versions"
    ADD CONSTRAINT "coaching_membership_versions_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_messages"
    ADD CONSTRAINT "coaching_messages_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."coaching_notes"
    ADD CONSTRAINT "coaching_notes_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_notes"
    ADD CONSTRAINT "coaching_notes_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."coaching_notes"
    ADD CONSTRAINT "coaching_notes_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."finance_entries"
    ADD CONSTRAINT "finance_entries_reverses_id_fkey" FOREIGN KEY ("reverses_id") REFERENCES "public"."finance_entries"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."inbody_records"
    ADD CONSTRAINT "inbody_records_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."inbody_records"
    ADD CONSTRAINT "inbody_records_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."inbody_records"
    ADD CONSTRAINT "inbody_records_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."meal_logs"
    ADD CONSTRAINT "meal_logs_checkin_id_fkey" FOREIGN KEY ("checkin_id") REFERENCES "public"."checkins"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meal_logs"
    ADD CONSTRAINT "meal_logs_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_inbody_record_id_fkey" FOREIGN KEY ("inbody_record_id") REFERENCES "public"."inbody_records"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ocr_attempts"
    ADD CONSTRAINT "ocr_attempts_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_events"
    ADD CONSTRAINT "product_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pt_profiles"
    ADD CONSTRAINT "pt_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainee_invitations"
    ADD CONSTRAINT "trainee_invitations_accepted_by_fkey" FOREIGN KEY ("accepted_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."trainee_invitations"
    ADD CONSTRAINT "trainee_invitations_pt_id_fkey" FOREIGN KEY ("pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainee_invitations"
    ADD CONSTRAINT "trainee_invitations_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainee_profile_events"
    ADD CONSTRAINT "trainee_profile_events_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."trainee_profile_events"
    ADD CONSTRAINT "trainee_profile_events_trainee_id_fkey" FOREIGN KEY ("trainee_id") REFERENCES "public"."trainee_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."trainee_profiles"
    ADD CONSTRAINT "trainee_profiles_assigned_pt_id_fkey" FOREIGN KEY ("assigned_pt_id") REFERENCES "public"."pt_profiles"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."trainee_profiles"
    ADD CONSTRAINT "trainee_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "billing_read_own_or_admin" ON "public"."billing_requests" FOR SELECT TO "authenticated" USING ((("customer_id" = "auth"."uid"()) OR "public"."is_system_admin"()));



ALTER TABLE "public"."billing_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checkins" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checkins_select_related" ON "public"."checkins" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."id" = "checkins"."trainee_id") AND (("trainee"."profile_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("trainee"."assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")))))));



ALTER TABLE "public"."coaching_appointments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "coaching_appointments_create_pt" ON "public"."coaching_appointments" FOR INSERT TO "authenticated" WITH CHECK ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM ("public"."trainee_profiles" "t"
     JOIN "public"."profiles" "actor" ON (("actor"."id" = ( SELECT "auth"."uid"() AS "uid"))))
  WHERE (("t"."id" = "coaching_appointments"."trainee_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND ("t"."assigned_pt_id" = "coaching_appointments"."pt_id") AND ("t"."profile_id" = "coaching_appointments"."learner_id") AND ("actor"."role" = 'pt'::"public"."user_role"))))));



CREATE POLICY "coaching_appointments_read_participants" ON "public"."coaching_appointments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."trainee_profiles" "t"
     JOIN "public"."profiles" "actor" ON (("actor"."id" = ( SELECT "auth"."uid"() AS "uid"))))
  WHERE (("t"."id" = "coaching_appointments"."trainee_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND ("t"."assigned_pt_id" = "coaching_appointments"."pt_id") AND ("t"."profile_id" = "coaching_appointments"."learner_id") AND ((("actor"."role" = 'pt'::"public"."user_role") AND ("actor"."id" = "t"."assigned_pt_id")) OR (("actor"."role" = 'trainee'::"public"."user_role") AND ("actor"."id" = "t"."profile_id")))))));



ALTER TABLE "public"."coaching_membership_versions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."coaching_messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "coaching_messages_read_participants" ON "public"."coaching_messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "t"
  WHERE (("t"."id" = "coaching_messages"."trainee_id") AND ("t"."assigned_pt_id" = "coaching_messages"."pt_id") AND ("t"."profile_id" = "coaching_messages"."learner_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND (EXISTS ( SELECT 1
           FROM "public"."profiles" "actor"
          WHERE (("actor"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ((("actor"."role" = 'pt'::"public"."user_role") AND ("actor"."id" = "t"."assigned_pt_id")) OR (("actor"."role" = 'trainee'::"public"."user_role") AND ("actor"."id" = "t"."profile_id"))))))))));



CREATE POLICY "coaching_messages_send_participants" ON "public"."coaching_messages" FOR INSERT TO "authenticated" WITH CHECK ((("sender_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "t"
  WHERE (("t"."id" = "coaching_messages"."trainee_id") AND ("t"."assigned_pt_id" = "coaching_messages"."pt_id") AND ("t"."profile_id" = "coaching_messages"."learner_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND (EXISTS ( SELECT 1
           FROM "public"."profiles" "actor"
          WHERE (("actor"."id" = ( SELECT "auth"."uid"() AS "uid")) AND ((("actor"."role" = 'pt'::"public"."user_role") AND ("actor"."id" = "t"."assigned_pt_id")) OR (("actor"."role" = 'trainee'::"public"."user_role") AND ("actor"."id" = "t"."profile_id")))))))))));



ALTER TABLE "public"."coaching_notes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "finance_admin_read" ON "public"."finance_entries" FOR SELECT TO "authenticated" USING ("public"."is_system_admin"());



ALTER TABLE "public"."finance_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inbody_records" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "inbody_records_insert_by_assigned_pt" ON "public"."inbody_records" FOR INSERT TO "authenticated" WITH CHECK ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("verified_by" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."id" = "inbody_records"."trainee_id") AND ("trainee"."assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("trainee"."profile_id" IS NOT NULL))))));



CREATE POLICY "inbody_records_select_related" ON "public"."inbody_records" FOR SELECT TO "authenticated" USING ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) OR (EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."id" = "inbody_records"."trainee_id") AND ("trainee"."profile_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "inbody_records_update_by_owner_pt" ON "public"."inbody_records" FOR UPDATE TO "authenticated" USING (("pt_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("verified_by" = ( SELECT "auth"."uid"() AS "uid"))));



ALTER TABLE "public"."meal_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "meal_logs_select_related" ON "public"."meal_logs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."id" = "meal_logs"."trainee_id") AND (("trainee"."profile_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("trainee"."assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "membership_read_participants" ON "public"."coaching_membership_versions" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."trainee_profiles" "t"
     JOIN "public"."profiles" "actor" ON (("actor"."id" = ( SELECT "auth"."uid"() AS "uid"))))
  WHERE (("t"."id" = "coaching_membership_versions"."trainee_id") AND ("t"."assigned_pt_id" = "coaching_membership_versions"."pt_id") AND ("t"."profile_id" = "coaching_membership_versions"."learner_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND ((("actor"."role" = 'pt'::"public"."user_role") AND ("actor"."id" = "coaching_membership_versions"."pt_id")) OR (("actor"."role" = 'trainee'::"public"."user_role") AND ("actor"."id" = "coaching_membership_versions"."learner_id")))))));



CREATE POLICY "notes_create_pt" ON "public"."coaching_notes" FOR INSERT TO "authenticated" WITH CHECK ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM ("public"."trainee_profiles" "t"
     JOIN "public"."profiles" "actor" ON (("actor"."id" = ( SELECT "auth"."uid"() AS "uid"))))
  WHERE (("t"."id" = "coaching_notes"."trainee_id") AND ("t"."assigned_pt_id" = "coaching_notes"."pt_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND ("actor"."role" = 'pt'::"public"."user_role") AND (NOT ("coaching_notes"."learner_id" IS DISTINCT FROM "t"."profile_id")))))));



CREATE POLICY "notes_read_participants" ON "public"."coaching_notes" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."trainee_profiles" "t"
     JOIN "public"."profiles" "actor" ON (("actor"."id" = ( SELECT "auth"."uid"() AS "uid"))))
  WHERE (("t"."id" = "coaching_notes"."trainee_id") AND ("t"."assigned_pt_id" = "coaching_notes"."pt_id") AND ("t"."status" <> 'archived'::"public"."trainee_status") AND ((("actor"."role" = 'pt'::"public"."user_role") AND ("actor"."id" = "coaching_notes"."pt_id") AND ((NOT ("coaching_notes"."learner_id" IS DISTINCT FROM "t"."profile_id")) OR (("coaching_notes"."learner_id" IS NULL) AND ("coaching_notes"."visibility" = 'private'::"text")))) OR (("actor"."role" = 'trainee'::"public"."user_role") AND ("actor"."id" = "coaching_notes"."learner_id") AND ("coaching_notes"."learner_id" = "t"."profile_id") AND ("coaching_notes"."visibility" = 'shared'::"text")))))));



ALTER TABLE "public"."ocr_attempts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ocr_attempts_select_assigned_pt" ON "public"."ocr_attempts" FOR SELECT TO "authenticated" USING ((("pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND (EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."id" = "ocr_attempts"."trainee_id") AND ("trainee"."assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")))))));



ALTER TABLE "public"."product_events" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_events_admin_read" ON "public"."product_events" FOR SELECT TO "authenticated" USING ("public"."is_system_admin"());



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_assigned_trainee" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "trainee"
  WHERE (("trainee"."profile_id" = "profiles"."id") AND ("trainee"."assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid"))))));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



ALTER TABLE "public"."pt_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pt_profiles_select_own" ON "public"."pt_profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "pt_profiles_update_own" ON "public"."pt_profiles" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "trainee_events_read_owner" ON "public"."trainee_profile_events" FOR SELECT TO "authenticated" USING ((("actor_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."trainee_profiles" "t"
  WHERE (("t"."id" = "trainee_profile_events"."trainee_id") AND ("t"."assigned_pt_id" = "auth"."uid"()))))));



ALTER TABLE "public"."trainee_invitations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trainee_invitations_select_own" ON "public"."trainee_invitations" FOR SELECT TO "authenticated" USING (("pt_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."trainee_profile_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainee_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "trainee_profiles_insert_assigned" ON "public"."trainee_profiles" FOR INSERT TO "authenticated" WITH CHECK ((("assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")) AND ("profile_id" IS NULL)));



CREATE POLICY "trainee_profiles_select_related" ON "public"."trainee_profiles" FOR SELECT TO "authenticated" USING ((("profile_id" = ( SELECT "auth"."uid"() AS "uid")) OR ("assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "trainee_profiles_update_by_pt" ON "public"."trainee_profiles" FOR UPDATE TO "authenticated" USING (("assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("assigned_pt_id" = ( SELECT "auth"."uid"() AS "uid")));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "private"."guard_appointment_creation"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "private"."guard_coaching_note"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "private"."retire_relationship_appointments"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."accept_trainee_invitation"("invite_token_hash" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."application_local_date"("at_time" timestamp with time zone) TO "service_role";



REVOKE ALL ON FUNCTION "public"."application_timezone"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."application_timezone"() TO "anon";
GRANT ALL ON FUNCTION "public"."application_timezone"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."application_timezone"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."capture_product_event"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."capture_product_event"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."checkin_warning_starts_on"("reference_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."confirm_ocr_inbody_record"("attempt_id" "uuid", "confirmed_weight_kg" numeric, "confirmed_muscle_kg" numeric, "confirmed_fat_kg" numeric, "confirmed_fat_percent" numeric, "confirmed_water_liters" numeric, "nutrition_calories" integer, "nutrition_protein" integer, "nutrition_carb" integer, "nutrition_fat" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."confirm_ocr_inbody_record"("attempt_id" "uuid", "confirmed_weight_kg" numeric, "confirmed_muscle_kg" numeric, "confirmed_fat_kg" numeric, "confirmed_fat_percent" numeric, "confirmed_water_liters" numeric, "nutrition_calories" integer, "nutrition_protein" integer, "nutrition_carb" integer, "nutrition_fat" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_trainee_with_invitation"("trainee_display_name" "text", "trainee_goal" "public"."fitness_goal", "trainee_phone" "text", "package_total" integer, "package_remaining" integer, "invite_email" "text", "invite_token_hash" "text", "invite_expires_at" timestamp with time zone) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_admin_overview"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_admin_overview"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_admin_overview"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_assigned_coach_identity"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_assigned_coach_identity"() TO "service_role";
GRANT ALL ON FUNCTION "public"."get_assigned_coach_identity"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_invitation_preview"("invite_token_hash" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."guard_active_trainee_write"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."guard_active_trainee_write"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."guard_roster_plan_limit"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."guard_roster_plan_limit"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_checkin_warning_due"("reference_date" "date", "at_time" timestamp with time zone) TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_system_admin"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_system_admin"() TO "service_role";
GRANT ALL ON FUNCTION "public"."is_system_admin"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."log_workspace_open"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."log_workspace_open"() TO "service_role";
GRANT ALL ON FUNCTION "public"."log_workspace_open"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."record_finance_entry"("request_nonce" "uuid", "entry_kind" "text", "entry_category" "text", "amount" bigint, "transaction_reference" "text", "transacted_at" timestamp with time zone, "receipt_path" "text", "receipt_sha256" "text", "description" "text", "test_entry" boolean, "customer" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."record_finance_entry"("request_nonce" "uuid", "entry_kind" "text", "entry_category" "text", "amount" bigint, "transaction_reference" "text", "transacted_at" timestamp with time zone, "receipt_path" "text", "receipt_sha256" "text", "description" "text", "test_entry" boolean, "customer" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."record_finance_entry"("request_nonce" "uuid", "entry_kind" "text", "entry_category" "text", "amount" bigint, "transaction_reference" "text", "transacted_at" timestamp with time zone, "receipt_path" "text", "receipt_sha256" "text", "description" "text", "test_entry" boolean, "customer" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."reissue_trainee_invitation"("target_trainee_id" "uuid", "new_token_hash" "text", "new_expires_at" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."reissue_trainee_invitation"("target_trainee_id" "uuid", "new_token_hash" "text", "new_expires_at" timestamp with time zone) TO "service_role";
GRANT ALL ON FUNCTION "public"."reissue_trainee_invitation"("target_trainee_id" "uuid", "new_token_hash" "text", "new_expires_at" timestamp with time zone) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."request_pt_upgrade"("request_nonce" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."request_pt_upgrade"("request_nonce" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."request_pt_upgrade"("request_nonce" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."reverse_finance_entry"("target_entry" "uuid", "request_nonce" "uuid", "reason" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."reverse_finance_entry"("target_entry" "uuid", "request_nonce" "uuid", "reason" "text") TO "service_role";
GRANT ALL ON FUNCTION "public"."reverse_finance_entry"("target_entry" "uuid", "request_nonce" "uuid", "reason" "text") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."revoke_trainee_invitation"("target_trainee_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."revoke_trainee_invitation"("target_trainee_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."revoke_trainee_invitation"("target_trainee_id" "uuid") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."save_coaching_membership"("target_trainee" "uuid", "request_id" "uuid", "membership_label" "text", "starts_on" "date", "ends_on" "date", "expected_revision" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."save_coaching_membership"("target_trainee" "uuid", "request_id" "uuid", "membership_label" "text", "starts_on" "date", "ends_on" "date", "expected_revision" integer) TO "service_role";
GRANT ALL ON FUNCTION "public"."save_coaching_membership"("target_trainee" "uuid", "request_id" "uuid", "membership_label" "text", "starts_on" "date", "ends_on" "date", "expected_revision" integer) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."save_trainee_profile"("target_trainee" "uuid", "expected_version" integer, "trainee_name" "text", "contact_phone" "text", "goal" "public"."fitness_goal") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."save_trainee_profile"("target_trainee" "uuid", "expected_version" integer, "trainee_name" "text", "contact_phone" "text", "goal" "public"."fitness_goal") TO "service_role";
GRANT ALL ON FUNCTION "public"."save_trainee_profile"("target_trainee" "uuid", "expected_version" integer, "trainee_name" "text", "contact_phone" "text", "goal" "public"."fitness_goal") TO "authenticated";



REVOKE ALL ON FUNCTION "public"."set_trainee_archived"("target_trainee" "uuid", "expected_version" integer, "archive_profile" boolean) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_trainee_archived"("target_trainee" "uuid", "expected_version" integer, "archive_profile" boolean) TO "service_role";
GRANT ALL ON FUNCTION "public"."set_trainee_archived"("target_trainee" "uuid", "expected_version" integer, "archive_profile" boolean) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."set_trainee_engagement_started_on"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_trainee_engagement_started_on"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_trainee_engagement_started_on"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_trainee_engagement_started_on"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text", "meal_photo_mime_type" "text", "meal_photo_size_bytes" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text", "meal_photo_mime_type" "text", "meal_photo_size_bytes" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text", "meal_photo_mime_type" "text", "meal_photo_size_bytes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."submit_daily_checkin"("checkin_note" "text", "meal_photo_path" "text", "meal_photo_mime_type" "text", "meal_photo_size_bytes" integer) TO "service_role";



GRANT ALL ON TABLE "public"."billing_requests" TO "service_role";
GRANT SELECT ON TABLE "public"."billing_requests" TO "authenticated";



GRANT ALL ON TABLE "public"."checkins" TO "service_role";
GRANT SELECT ON TABLE "public"."checkins" TO "authenticated";



GRANT ALL ON TABLE "public"."coaching_appointments" TO "service_role";
GRANT SELECT ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("trainee_id") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("pt_id") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("learner_id") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("client_request_id") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("title") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("kind") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("starts_at") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT INSERT("ends_at") ON TABLE "public"."coaching_appointments" TO "authenticated";



GRANT ALL ON TABLE "public"."coaching_membership_versions" TO "service_role";
GRANT SELECT ON TABLE "public"."coaching_membership_versions" TO "authenticated";



GRANT ALL ON TABLE "public"."coaching_messages" TO "service_role";
GRANT SELECT ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("trainee_id") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("pt_id") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("learner_id") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("sender_id") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("client_message_id") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT INSERT("body") ON TABLE "public"."coaching_messages" TO "authenticated";



GRANT ALL ON TABLE "public"."coaching_notes" TO "service_role";
GRANT SELECT ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("trainee_id") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("pt_id") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("learner_id") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("client_request_id") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("visibility") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT INSERT("body") ON TABLE "public"."coaching_notes" TO "authenticated";



GRANT ALL ON TABLE "public"."finance_entries" TO "service_role";
GRANT SELECT ON TABLE "public"."finance_entries" TO "authenticated";



GRANT ALL ON TABLE "public"."inbody_records" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."inbody_records" TO "authenticated";



GRANT UPDATE("target_calories") ON TABLE "public"."inbody_records" TO "authenticated";



GRANT UPDATE("target_protein_grams") ON TABLE "public"."inbody_records" TO "authenticated";



GRANT UPDATE("target_carb_grams") ON TABLE "public"."inbody_records" TO "authenticated";



GRANT UPDATE("target_fat_grams") ON TABLE "public"."inbody_records" TO "authenticated";



GRANT ALL ON TABLE "public"."meal_logs" TO "service_role";
GRANT SELECT ON TABLE "public"."meal_logs" TO "authenticated";



GRANT ALL ON TABLE "public"."ocr_attempts" TO "service_role";
GRANT SELECT ON TABLE "public"."ocr_attempts" TO "authenticated";



GRANT ALL ON TABLE "public"."product_events" TO "service_role";
GRANT SELECT ON TABLE "public"."product_events" TO "authenticated";



GRANT ALL ON TABLE "public"."profiles" TO "service_role";
GRANT SELECT ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("display_name") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("phone") ON TABLE "public"."profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."pt_profiles" TO "service_role";
GRANT SELECT ON TABLE "public"."pt_profiles" TO "authenticated";



GRANT UPDATE("gym_affiliation") ON TABLE "public"."pt_profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."trainee_invitations" TO "service_role";
GRANT SELECT ON TABLE "public"."trainee_invitations" TO "authenticated";



GRANT ALL ON TABLE "public"."trainee_profile_events" TO "service_role";
GRANT SELECT ON TABLE "public"."trainee_profile_events" TO "authenticated";



GRANT ALL ON TABLE "public"."trainee_profiles" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."trainee_profiles" TO "authenticated";



GRANT UPDATE("total_sessions") ON TABLE "public"."trainee_profiles" TO "authenticated";



GRANT UPDATE("remaining_sessions") ON TABLE "public"."trainee_profiles" TO "authenticated";



GRANT UPDATE("last_checkin_date") ON TABLE "public"."trainee_profiles" TO "authenticated";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







