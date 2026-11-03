-- Additive text-chat slice. Apply only after review and isolated database tests.
-- No existing records, roles, or policies are modified.
create table public.coaching_messages (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid not null references public.trainee_profiles(id) on delete cascade,
  pt_id uuid not null references public.pt_profiles(id) on delete restrict,
  learner_id uuid not null references public.profiles(id) on delete restrict,
  sender_id uuid not null references public.profiles(id) on delete restrict,
  client_message_id uuid not null,
  body text not null check (
    char_length(body) between 1 and 4000 and body = btrim(body)
    and body ~ '[^[:space:]]'
  ),
  created_at timestamptz not null default now(),
  constraint coaching_messages_sender_retry_key unique (sender_id, client_message_id)
);

create index coaching_messages_thread_idx
  on public.coaching_messages (trainee_id, pt_id, learner_id, created_at desc, id desc);
create index coaching_messages_learner_idx on public.coaching_messages (learner_id);
create index coaching_messages_pt_idx on public.coaching_messages (pt_id);

alter table public.coaching_messages enable row level security;
revoke all on public.coaching_messages from public, anon, authenticated;
grant select on public.coaching_messages to authenticated;
-- Clients cannot forge server timestamps/IDs or mutate/delete message history.
grant insert (trainee_id, pt_id, learner_id, sender_id, client_message_id, body)
  on public.coaching_messages to authenticated;

create policy coaching_messages_read_participants
on public.coaching_messages for select to authenticated using (
  exists (
    select 1 from public.trainee_profiles t
    where t.id = coaching_messages.trainee_id
      and t.assigned_pt_id = coaching_messages.pt_id
      and t.profile_id = coaching_messages.learner_id and t.status <> 'archived'
      and exists (
        select 1 from public.profiles actor
        where actor.id = (select auth.uid())
          and ((actor.role = 'pt' and actor.id = t.assigned_pt_id)
            or (actor.role = 'trainee' and actor.id = t.profile_id))
      )
  )
);

create policy coaching_messages_send_participants
on public.coaching_messages for insert to authenticated with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.trainee_profiles t
    where t.id = coaching_messages.trainee_id
      and t.assigned_pt_id = coaching_messages.pt_id
      and t.profile_id = coaching_messages.learner_id and t.status <> 'archived'
      and exists (
        select 1 from public.profiles actor
        where actor.id = (select auth.uid())
          and ((actor.role = 'pt' and actor.id = t.assigned_pt_id)
            or (actor.role = 'trainee' and actor.id = t.profile_id))
      )
  )
);

comment on table public.coaching_messages is
  'Private text messages for the current linked PT/trainee pair. No admin override. Archived/unlinked/reassigned old threads are inaccessible; no deletion workflow is introduced.';
