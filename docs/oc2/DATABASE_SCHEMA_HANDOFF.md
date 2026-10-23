# OC2 database schema handoff

**Source:** the five executable migrations under `supabase/migrations/` at GitHub Issue #27.

**Scope:** the eight tables explicitly requested by the OC2 card.
**Data policy:** use synthetic records unless the documented consent and governance gate has been approved.

## Relationship diagram source

Toàn can import or redraw this Mermaid ERD into the final Carbon-style PNG/PDF. The exported image must be checked against the migrations, not against screenshots or planning documents.

```mermaid
erDiagram
  profiles ||--o| pt_profiles : "PT extension"
  profiles o|--o| trainee_profiles : "optional linked login"
  pt_profiles ||--o{ trainee_profiles : "assigned coach"
  pt_profiles ||--o{ trainee_invitations : "creates"
  trainee_profiles ||--o{ trainee_invitations : "invited record"
  trainee_profiles ||--o{ inbody_records : "has verified records"
  pt_profiles ||--o{ inbody_records : "records and verifies"
  trainee_profiles ||--o{ checkins : "submits"
  checkins ||--o| meal_logs : "optional meal image"
  trainee_profiles ||--o{ meal_logs : "owns"
  trainee_profiles ||--o{ ocr_attempts : "source report"
  pt_profiles ||--o{ ocr_attempts : "runs review"
  inbody_records o|--o| ocr_attempts : "optional confirmation"

  profiles {
    uuid id PK
    user_role role
    text display_name
    text phone
  }
  pt_profiles {
    uuid id PK_FK
    text gym_affiliation
    subscription_plan subscription_plan
    timestamptz subscription_valid_until
  }
  trainee_profiles {
    uuid id PK
    uuid profile_id FK
    uuid assigned_pt_id FK
    text display_name
    fitness_goal primary_goal
    trainee_status status
  }
  trainee_invitations {
    uuid id PK
    uuid pt_id FK
    uuid trainee_id FK
    text email
    text token_hash
    invitation_status status
  }
  inbody_records {
    uuid id PK
    uuid trainee_id FK
    uuid pt_id FK
    numeric weight_kg
    numeric skeletal_muscle_mass_kg
    numeric body_fat_mass_kg
    numeric percent_body_fat
    uuid verified_by FK
  }
  checkins {
    uuid id PK
    uuid trainee_id FK
    date local_checkin_date
    text note
  }
  meal_logs {
    uuid id PK
    uuid checkin_id FK_UK
    uuid trainee_id FK
    text private_photo_path UK
    text photo_mime_type
  }
  ocr_attempts {
    uuid id PK
    uuid trainee_id FK
    uuid pt_id FK
    text private_image_path UK
    ocr_attempt_status status
    jsonb raw_draft
    uuid inbody_record_id FK_UK
  }
```

## Security boundaries to show in the graphic

- `auth.users` owns identities but is outside the eight-table public schema view.
- PT/trainee access is enforced by RLS and assignment relationships, not by UI filters.
- `meal-media` and `inbody-media` are private storage buckets; object paths are scoped by `trainee_id`.
- OCR output is an untrusted draft. Only explicit PT confirmation can create the linked verified `inbody_records` row.
- Invitation tokens are stored only as 64-character SHA-256 hashes.

## Export acceptance checklist

- [ ] PNG is at least 2560 px wide and legible at 100% zoom.
- [ ] PDF text remains selectable or vector-based.
- [ ] PK, FK, unique, optional, and one-to-many relationships match this source.
- [ ] No password, token, connection string, signed URL, real health report, or private object path appears.
- [ ] A second reviewer compares the export to the five migrations before the Drive link is shared.
