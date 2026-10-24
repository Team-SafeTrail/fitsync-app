# Supabase production evidence — Outcome 2

**Verified:** 2026-10-24

**Project:** `fitsync-prod`

**Project ref:** `uqjqkvalzdrcvxayhtre`

**Region:** Singapore (`ap-southeast-1`)

**Status:** `ACTIVE_HEALTHY`

No password, access token, API key, connection string, signed URL, or real health record is included in this evidence.

## Migration verification

Dry-run listed exactly these five migrations before deployment:

1. `20260927090000_identity_and_core_profiles.sql`
2. `20260927110000_m2_vertical_slice.sql`
3. `20260927220000_m3_engagement.sql`
4. `20260928120000_m4_ocr_attempts_and_storage.sql`
5. `20261002150000_fix_m4_ocr_backend_gates.sql`

After `db push`, `supabase migration list --linked` reported matching local and remote timestamps for all five migrations.

## RLS and policy verification

Read-only production catalog queries confirmed RLS enabled on all eight requested tables:

- `profiles`
- `pt_profiles`
- `trainee_profiles`
- `trainee_invitations`
- `inbody_records`
- `checkins`
- `meal_logs`
- `ocr_attempts`

Policy counts were non-zero for every table and for `storage.objects`.

## Storage verification

| Bucket | Public | Limit | Allowed MIME types |
| --- | --- | --- | --- |
| `meal-media` | No | 5 MiB | JPEG, PNG, WebP |
| `inbody-media` | No | 10 MiB | JPEG, PNG, WebP |

## Synthetic seed verification

The guarded seed helper completed with `applied: true` and printed no credentials. Independent read-only production queries returned:

| Record | Verified count |
| --- | ---: |
| Admin profiles | 1 |
| PT profiles | 4 |
| Trainee profiles | 12 |
| Warning trainees | 2 |
| InBody records | 15 |
| Check-ins | 8 |
| Meal logs | 8 |
| Objects in `meal-media` | 8 |

The demo admin profile has role `admin` and a confirmed email. Authentication credentials remain outside the repository and evidence pack.

No payment rows were seeded because the accepted schema has no payment table. UI-only VietQR examples remain explicitly synthetic and are not revenue evidence.

## Remaining acceptance evidence

- [ ] Sign in as the demo admin through the deployed app in an Incognito window.
- [ ] Confirm a non-admin user is redirected away from `/admin`.
- [ ] Invite the official instructor email with the approved least-privilege role and record redacted acceptance status.
- [ ] Run the repository pgTAP suite when Docker or Podman is available; the current workstation lacks both. Direct production catalog checks above passed.
- [x] Production revision locked to `e1b03ad` after PR #26 and PR #29 merged in the required order.
- [ ] Add the Vercel deployment URL and HTTP 200 evidence after Huy deploys `e1b03ad`.
