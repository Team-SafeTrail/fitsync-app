-- FitSync Migration: Auth Delivery & Lifecycle (Issue #33)
-- 1. Scoped Coach Display Identity for Learner
-- 2. Reissue & Revoke Trainee Invitations
-- 3. Deterministic Acceptance Handling (already_linked protection)

-- 1. Scoped coach profile access for authenticated learners
create policy profiles_select_assigned_coach on public.profiles
for select to authenticated using (
  exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.profile_id = (select auth.uid())
      and trainee.assigned_pt_id = profiles.id
      and trainee.status <> 'archived'
  )
);

create policy pt_profiles_select_assigned_coach on public.pt_profiles
for select to authenticated using (
  exists (
    select 1
    from public.trainee_profiles trainee
    where trainee.profile_id = (select auth.uid())
      and trainee.assigned_pt_id = pt_profiles.id
      and trainee.status <> 'archived'
  )
);

-- 2. Reissue Trainee Invitation RPC
create or replace function public.reissue_trainee_invitation(
  target_trainee_id uuid,
  new_token_hash text,
  new_expires_at timestamptz
)
returns table (
  invitation_id uuid,
  email text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  trainee_row public.trainee_profiles%rowtype;
  trainee_email text;
  new_invitation_id uuid;
begin
  if caller_id is null or not exists (
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
$$;

revoke all on function public.reissue_trainee_invitation(uuid, text, timestamptz) from public;
grant execute on function public.reissue_trainee_invitation(uuid, text, timestamptz) to authenticated;

-- 3. Revoke Trainee Invitation RPC
create or replace function public.revoke_trainee_invitation(
  target_trainee_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null or not exists (
    select 1 from public.pt_profiles where id = caller_id
  ) then
    raise exception 'PT account required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.trainee_profiles
    where id = target_trainee_id and assigned_pt_id = caller_id and profile_id is null
  ) then
    return false;
  end if;

  update public.trainee_invitations
  set status = 'revoked'
  where trainee_id = target_trainee_id and status = 'pending';

  return true;
end;
$$;

revoke all on function public.revoke_trainee_invitation(uuid) from public;
grant execute on function public.revoke_trainee_invitation(uuid) to authenticated;

-- 4. Update accept_trainee_invitation with already_linked guard
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
