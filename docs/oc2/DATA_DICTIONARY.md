# OC2 data dictionary

This dictionary describes the final schema after all five migrations. `PK` means primary key, `FK` foreign key, and `UK` unique key. Every listed public table has RLS enabled.

## `profiles`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, FK → `auth.users.id`, cascade delete | Authenticated identity. |
| `role` | `user_role` | Required; `pt`, `trainee`, `admin`; default `pt` | Authorization role. Ordinary users cannot change it. |
| `display_name` | `text` | Required; 2–100 characters | User-facing name. |
| `phone` | `text` | Optional; 8–20 characters | Optional contact number. |
| `created_at`, `updated_at` | `timestamptz` | Required; automatic timestamps | Audit timestamps. |

Access: users can read/update their own allowed profile fields; a PT can read the linked trainee profile. Admin-wide reads must happen through a server-only, role-checked boundary.

## `pt_profiles`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK, FK → `profiles.id`, cascade delete | One-to-one PT extension. |
| `gym_affiliation` | `text` | Optional; max 150 characters | Gym or independent affiliation. |
| `subscription_plan` | `subscription_plan` | Required; `free`, `pro`, `enterprise` | Current product-plan state; not payment proof. |
| `subscription_valid_until` | `timestamptz` | Optional | Plan expiry when known. |
| `created_at`, `updated_at` | `timestamptz` | Required | Audit timestamps. |

Access: a PT reads and updates only their own permitted fields.

## `trainee_profiles`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | Durable trainee record, allowed before login exists. |
| `profile_id` | `uuid` | Optional FK → `profiles.id`; unique when present | Linked trainee login after invitation acceptance. |
| `assigned_pt_id` | `uuid` | Required FK → `pt_profiles.id`, restrict delete | Owning PT/tenant boundary. |
| `display_name` | `text` | Required; 2–100 characters | Roster display name. |
| `phone` | `text` | Optional; 8–20 characters | Optional contact number. |
| `primary_goal` | `fitness_goal` | Required; `fat_loss`, `muscle_gain`, `recomp` | Coaching goal. |
| `status` | `trainee_status` | Required | Active/warning/inactive/archived state. |
| `total_sessions` | `integer` | ≥ 0 | Purchased or assigned sessions. |
| `remaining_sessions` | `integer` | 0…`total_sessions` | Remaining session balance. |
| `engagement_started_on` | `date` | Required only after profile link | Warning baseline when no check-in exists. |
| `last_checkin_date` | `date` | Optional | Latest application-local check-in date. |
| `archived_at` | `timestamptz` | Optional | Soft-archive timestamp. |
| `created_at`, `updated_at` | `timestamptz` | Required | Audit timestamps. |

Access: assigned PT and linked trainee can read; only the assigned PT can change roster/session fields.

## `trainee_invitations`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | Invitation record. |
| `pt_id` | `uuid` | FK → `pt_profiles.id` | Issuing PT. |
| `trainee_id` | `uuid` | FK → `trainee_profiles.id` | Roster record being linked. |
| `email` | `text` | Required; lowercase/trimmed | Intended recipient. |
| `token_hash` | `text` | UK; exactly 64 lowercase hex characters | SHA-256 hash; raw token is never stored. |
| `status` | `invitation_status` | `pending`, `accepted`, `revoked`, `expired` | Lifecycle state. |
| `expires_at` | `timestamptz` | Must be after creation | Expiry deadline. |
| `accepted_by` | `uuid` | Optional FK → `profiles.id` | Linked identity after acceptance. |
| `accepted_at` | `timestamptz` | Optional; consistent with accepted state | Acceptance audit time. |
| `created_at`, `updated_at` | `timestamptz` | Required | Audit timestamps. |

Access: PT reads only their invitations; creation and acceptance use validated database functions.

## `inbody_records`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | Verified record. |
| `trainee_id` | `uuid` | FK → `trainee_profiles.id` | Subject. |
| `pt_id`, `verified_by` | `uuid` | FK → `pt_profiles.id`; values must match | Owning and confirming PT. |
| `weight_kg` | `numeric(5,2)` | 30–220 | Verified weight. |
| `skeletal_muscle_mass_kg` | `numeric(5,2)` | 10–75; muscle + fat ≤ weight | Verified skeletal muscle mass. |
| `body_fat_mass_kg` | `numeric(5,2)` | 2–100; ≤ weight | Verified fat mass. |
| `percent_body_fat` | `numeric(4,1)` | 3–60; within 2 points of derived value | Verified body-fat percentage. |
| `total_body_water_liters` | `numeric(5,2)` | Optional; 10–100 and ≤ weight | Optional total body water. |
| nutrition targets | integers | Optional bounded coaching drafts | Calories/protein/carb/fat draft targets. |
| `source` | `inbody_source` | `manual` or `ocr` | Entry origin. |
| `is_manually_edited` | `boolean` | Required | Whether OCR draft was corrected. |
| `recorded_at`, `created_at` | `timestamptz` | Required | Measurement and persistence times. |

Access: assigned PT and linked trainee can read. Only the assigned PT can create/adjust permitted fields; OCR confirmation is atomic and explicit.

## `checkins`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | Daily check-in. |
| `trainee_id` | `uuid` | FK → `trainee_profiles.id` | Submitting trainee. |
| `local_checkin_date` | `date` | UK with trainee | One check-in per `Asia/Ho_Chi_Minh` application day. |
| `note` | `text` | Optional; 1–500 characters | Trainee note. |
| `submitted_at`, `created_at` | `timestamptz` | Required | Submission/audit timestamps. |

Access: only linked trainee and assigned PT can read; submission uses the validated database function.

## `meal_logs`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | Meal attachment record. |
| `checkin_id` | `uuid` | FK → `checkins.id`, UK | At most one meal image per check-in. |
| `trainee_id` | `uuid` | FK → `trainee_profiles.id` | Owner/scope. |
| `private_photo_path` | `text` | UK; must start with `trainee_id/` | Private storage object path. |
| `photo_mime_type` | `text` | JPEG/PNG/WebP only | Server-validated media type. |
| `photo_size_bytes` | `integer` | 1…5 MiB | Server-validated file size. |
| `created_at` | `timestamptz` | Required | Audit timestamp. |

Access: linked trainee and assigned PT can read. Objects live in the private `meal-media` bucket and use short-lived signed URLs.

## `ocr_attempts`

| Field | Type | Key / constraint | Business meaning |
| --- | --- | --- | --- |
| `id` | `uuid` | PK; generated | OCR processing attempt. |
| `trainee_id` | `uuid` | FK → `trainee_profiles.id` | Report subject. |
| `pt_id` | `uuid` | FK → `pt_profiles.id` | Assigned PT. |
| `private_image_path` | `text` | UK; must start with `trainee_id/` | Private source path. |
| `image_mime_type` | `text` | JPEG/PNG/WebP only | Validated source type. |
| `image_size_bytes` | `integer` | 1…10 MiB | Validated source size. |
| `status` | `ocr_attempt_status` | `pending`, `success`, `failed` | Attempt state. |
| `error_code` | `text` | Bounded allow-list; required on failure | Recoverable failure reason. |
| `provider`, `provider_version` | `text` | Required; 1–50 characters | Provider provenance. |
| `raw_draft` | `jsonb` | Optional | Normalized untrusted draft, never a verified record. |
| `inbody_record_id` | `uuid` | Optional UK FK → `inbody_records.id` | Explicit confirmation result. |
| `is_confirmed` | `boolean` | True only for successful linked record | Confirmation gate. |
| `created_at`, `updated_at` | `timestamptz` | Required | Audit timestamps. |

Access: assigned PT can read. Authenticated clients cannot forge provider writes after the M4 backend-gate migration; server-only service role persists validated attempts.
