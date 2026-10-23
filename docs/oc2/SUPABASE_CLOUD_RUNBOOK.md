# Supabase Cloud runbook for OC2

This runbook completes the reproducible part of the former Hưng task. It deliberately does not contain passwords, project refs, connection strings, keys, or the instructor's email.

## Required human inputs

- A team-owned Supabase account with permission to create/manage the project.
- The approved organization ID and billing choice.
- A database password stored in the team's secret manager.
- The official instructor email and approved Dashboard role.
- `OC2_ADMIN_EMAIL` and `OC2_ADMIN_PASSWORD` shared through the approved secret channel.

Do not paste these values into Trello, Discord, GitHub, screenshots, shell history, or this repository.

## 1. Authenticate interactively

Run this in a normal interactive terminal owned by Việt:

```powershell
npx supabase login --name oc2-viet
npx supabase projects list -o table
```

The automated agent environment is non-TTY and cannot complete this login. Do not send the resulting access token in chat.

## 2. Create or select the project

Preferred: create `fitsync-prod` in the Supabase Dashboard, choose Singapore (`ap-southeast-1`), and save the database password in the secret manager. This avoids exposing a password in terminal history.

Then link the repository:

```powershell
npx supabase link --project-ref <PROJECT_REF>
npx supabase migration list --linked
npx supabase db push --linked --dry-run
npx supabase db push --linked
npx supabase migration list --linked
```

Expected migration count: five. Review the dry run before the real push.

## 3. Verify database and storage gates

In the Dashboard, record redacted evidence that:

- all five migrations appear in remote migration history;
- RLS is enabled for the eight OC2 tables;
- `meal-media` is private, 5 MiB max, JPEG/PNG/WebP;
- `inbody-media` is private, 10 MiB max, JPEG/PNG/WebP;
- the production service-role key is present only in the deployment secret manager;
- no anonymous request can read profiles or private objects.

Do not include project keys or signed URLs in evidence.

## 4. Plan and apply synthetic seed

Inspect the plan first:

```powershell
npm run seed:oc2:plan
```

The plan contains 1 admin, 4 synthetic PTs, 12 synthetic trainees, 15 InBody records, 8 meal check-ins, and 2 warning-state trainees. It intentionally creates no payment proof because the accepted schema has no `payment_records` table.

Set secrets only in the current secure terminal/session or secret manager, then apply:

```powershell
$env:SUPABASE_URL='<cloud project URL>'
$env:SUPABASE_SERVICE_ROLE_KEY='<server-only key>'
$env:OC2_ADMIN_EMAIL='<approved demo admin email>'
$env:OC2_ADMIN_PASSWORD='<approved strong password>'
$env:OC2_SEED_CONFIRM='synthetic-only'
npm run seed:oc2:apply
```

Clear terminal-scoped variables after use. Never copy their values into a report.

## 5. Instructor access

1. Confirm the official instructor email out of band.
2. Invite that email through Supabase Dashboard organization/project access using the least privilege accepted by the course.
3. Ask the instructor to accept the invitation; do not create or share a reusable team password as a substitute.
4. Capture only the invitation status, role, timestamp, and redacted email as evidence.

Direct database connection strings and service-role keys must not be emailed. If database inspection is required, prefer Dashboard access with the approved least-privilege role.

## 6. Acceptance evidence

- [ ] Project/region screenshot with project ref redacted where appropriate.
- [ ] Five remote migrations listed.
- [ ] Eight tables and two private buckets visible.
- [ ] Seed command summary shows minimum counts without credentials.
- [ ] Incognito login succeeds for the approved admin account.
- [ ] Non-admin access to `/admin` is rejected.
- [ ] Instructor invitation is accepted or explicitly reported pending.
- [ ] Reviewer Huy signs off independently on Trello/GitHub.
