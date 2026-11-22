-- Owner decision 17 Nov: Free = 3 non-archived profiles (pending invitations
-- reserve a slot); current Pro/Enterprise = unlimited profiles. No row is deleted
-- or downgraded by this migration, including existing rosters above the limit.
create function public.guard_roster_plan_limit()
returns trigger language plpgsql security definer set search_path='' as $$
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
revoke all on function public.guard_roster_plan_limit() from public,anon,authenticated;
create trigger trainee_plan_insert before insert on public.trainee_profiles for each row execute function public.guard_roster_plan_limit();
create trigger trainee_plan_restore before update of status on public.trainee_profiles for each row execute function public.guard_roster_plan_limit();
