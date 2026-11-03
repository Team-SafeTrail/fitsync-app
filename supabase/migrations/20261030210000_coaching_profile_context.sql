-- Web handoff v1: immutable membership revisions and explicitly shared notes.
-- Membership is a date range, not an entitlement/session ledger or a payment.
create table public.coaching_membership_versions (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  learner_id uuid not null references public.profiles(id) on delete restrict,
  revision integer not null check (revision > 0),
  client_request_id uuid not null,
  label text not null check (char_length(label) between 1 and 100 and label = btrim(label)),
  starts_on date not null,
  ends_on date not null,
  created_at timestamptz not null default now(),
  check (isfinite(starts_on) and isfinite(ends_on) and ends_on >= starts_on),
  unique (trainee_id, pt_id, learner_id, revision),
  unique (pt_id, client_request_id)
);
create index membership_pt_idx on public.coaching_membership_versions(pt_id);
create index membership_learner_idx on public.coaching_membership_versions(learner_id);

create table public.coaching_notes (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  learner_id uuid references public.profiles(id) on delete restrict,
  client_request_id uuid not null,
  visibility text not null default 'private' check (visibility in ('private','shared')),
  body text not null check (char_length(body) between 1 and 2000 and body=btrim(body) and body ~ '[^[:space:]]'),
  created_at timestamptz not null default now(),
  check (visibility='private' or learner_id is not null),
  unique (pt_id,client_request_id)
);
create index notes_trainee_history_idx on public.coaching_notes(trainee_id,created_at desc,id desc);
create index notes_pt_idx on public.coaching_notes(pt_id);
create index notes_learner_idx on public.coaching_notes(learner_id);

alter table public.coaching_membership_versions enable row level security;
alter table public.coaching_notes enable row level security;
revoke all on public.coaching_membership_versions,public.coaching_notes from public,anon,authenticated;
grant select on public.coaching_membership_versions,public.coaching_notes to authenticated;
grant insert (trainee_id,pt_id,learner_id,client_request_id,visibility,body) on public.coaching_notes to authenticated;

create policy membership_read_participants on public.coaching_membership_versions for select to authenticated using (
  exists (select 1 from public.trainee_profiles t join public.profiles actor on actor.id=(select auth.uid())
    where t.id=trainee_id and t.assigned_pt_id=pt_id and t.profile_id=learner_id and t.status<>'archived'
    and ((actor.role='pt' and actor.id=pt_id) or (actor.role='trainee' and actor.id=learner_id)))
);
create policy notes_read_participants on public.coaching_notes for select to authenticated using (
  exists (select 1 from public.trainee_profiles t join public.profiles actor on actor.id=(select auth.uid())
    where t.id=trainee_id and t.assigned_pt_id=pt_id and t.status<>'archived'
    and ((actor.role='pt' and actor.id=pt_id and (learner_id is not distinct from t.profile_id or (learner_id is null and visibility='private')))
      or (actor.role='trainee' and actor.id=learner_id and learner_id=t.profile_id and visibility='shared')))
);
create policy notes_create_pt on public.coaching_notes for insert to authenticated with check (
  pt_id=(select auth.uid()) and exists (
    select 1 from public.trainee_profiles t join public.profiles actor on actor.id=(select auth.uid())
    where t.id=trainee_id and t.assigned_pt_id=pt_id and t.status<>'archived' and actor.role='pt'
      and learner_id is not distinct from t.profile_id)
);

create function private.guard_coaching_note() returns trigger
language plpgsql security definer set search_path='' as $$
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
revoke all on function private.guard_coaching_note() from public,anon,authenticated,service_role;
create trigger coaching_notes_guard before insert on public.coaching_notes for each row execute function private.guard_coaching_note();

create function public.save_coaching_membership(
  target_trainee uuid, request_id uuid, membership_label text, starts_on date, ends_on date, expected_revision integer
) returns uuid language plpgsql security definer set search_path='' as $$
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
revoke all on function public.save_coaching_membership(uuid,uuid,text,date,date,integer) from public,anon,authenticated;
grant execute on function public.save_coaching_membership(uuid,uuid,text,date,date,integer) to authenticated;

comment on table public.coaching_membership_versions is 'Append-only membership date revisions. Inclusive end date, no session debit/payment/subscription side effects.';
comment on table public.coaching_notes is 'PT notes private by default. Shared notes require an explicitly bound linked learner. No admin override or ordinary mutation/deletion.';
