# Data dictionary — implemented public schema

Sinh từ apps/web/src/types/database.ts của DB test (sau migration20261030210000). Đây là semantic types của client; xem schema-v1.sql/migrations cho precision, constraints, grants và RLS. `string` có thể là uuid/date/timestamptz/text; không suy ra quyền ghi từ generated Insert/Update. Không có giá trị dữ liệu người dùng trong tệp này.

## checkins

| Cột | Client type |
| --- | --- |
| created_at | `string` |
| id | `string` |
| local_checkin_date | `string` |
| note | `string | null` |
| submitted_at | `string` |
| trainee_id | `string` |

## coaching_appointments

| Cột | Client type |
| --- | --- |
| client_request_id | `string` |
| created_at | `string` |
| ends_at | `string` |
| id | `string` |
| kind | `string` |
| learner_id | `string` |
| pt_id | `string` |
| retired_at | `string | null` |
| starts_at | `string` |
| status | `string` |
| title | `string` |
| trainee_id | `string` |

## coaching_membership_versions

| Cột | Client type |
| --- | --- |
| client_request_id | `string` |
| created_at | `string` |
| ends_on | `string` |
| id | `string` |
| label | `string` |
| learner_id | `string` |
| pt_id | `string` |
| revision | `number` |
| starts_on | `string` |
| trainee_id | `string` |

## coaching_messages

| Cột | Client type |
| --- | --- |
| body | `string` |
| client_message_id | `string` |
| created_at | `string` |
| id | `string` |
| learner_id | `string` |
| pt_id | `string` |
| sender_id | `string` |
| trainee_id | `string` |

## coaching_notes

| Cột | Client type |
| --- | --- |
| body | `string` |
| client_request_id | `string` |
| created_at | `string` |
| id | `string` |
| learner_id | `string | null` |
| pt_id | `string` |
| trainee_id | `string` |
| visibility | `string` |

## inbody_records

| Cột | Client type |
| --- | --- |
| body_fat_mass_kg | `number` |
| created_at | `string` |
| id | `string` |
| is_manually_edited | `boolean` |
| percent_body_fat | `number` |
| pt_id | `string` |
| recorded_at | `string` |
| skeletal_muscle_mass_kg | `number` |
| source | `Database["public"]['Enums']["inbody_source"]` |
| target_calories | `number | null` |
| target_carb_grams | `number | null` |
| target_fat_grams | `number | null` |
| target_protein_grams | `number | null` |
| total_body_water_liters | `number | null` |
| trainee_id | `string` |
| verified_by | `string` |
| weight_kg | `number` |

## meal_logs

| Cột | Client type |
| --- | --- |
| checkin_id | `string` |
| created_at | `string` |
| id | `string` |
| photo_mime_type | `string` |
| photo_size_bytes | `number` |
| private_photo_path | `string` |
| trainee_id | `string` |

## ocr_attempts

| Cột | Client type |
| --- | --- |
| created_at | `string` |
| duration_ms | `number` |
| error_code | `string | null` |
| id | `string` |
| image_mime_type | `string` |
| image_size_bytes | `number` |
| inbody_record_id | `string | null` |
| is_confirmed | `boolean` |
| private_image_path | `string` |
| provider | `string` |
| provider_version | `string` |
| pt_id | `string` |
| raw_draft | `Json | null` |
| status | `Database["public"]['Enums']["ocr_attempt_status"]` |
| trainee_id | `string` |
| updated_at | `string` |

## profiles

| Cột | Client type |
| --- | --- |
| created_at | `string` |
| display_name | `string` |
| id | `string` |
| phone | `string | null` |
| role | `Database["public"]['Enums']["user_role"]` |
| updated_at | `string` |

## pt_profiles

| Cột | Client type |
| --- | --- |
| created_at | `string` |
| gym_affiliation | `string | null` |
| id | `string` |
| subscription_plan | `Database["public"]['Enums']["subscription_plan"]` |
| subscription_valid_until | `string | null` |
| updated_at | `string` |

## trainee_invitations

| Cột | Client type |
| --- | --- |
| accepted_at | `string | null` |
| accepted_by | `string | null` |
| created_at | `string` |
| email | `string` |
| expires_at | `string` |
| id | `string` |
| pt_id | `string` |
| status | `Database["public"]['Enums']["invitation_status"]` |
| token_hash | `string` |
| trainee_id | `string | null` |
| updated_at | `string` |

## trainee_profiles

| Cột | Client type |
| --- | --- |
| archived_at | `string | null` |
| assigned_pt_id | `string` |
| created_at | `string` |
| display_name | `string` |
| engagement_started_on | `string | null` |
| id | `string` |
| last_checkin_date | `string | null` |
| phone | `string | null` |
| primary_goal | `Database["public"]['Enums']["fitness_goal"]` |
| profile_id | `string | null` |
| remaining_sessions | `number` |
| status | `Database["public"]['Enums']["trainee_status"]` |
| total_sessions | `number` |
| updated_at | `string` |
