-- Keep OCR provider output behind the server-only adapter boundary.

alter table public.ocr_attempts
  add column duration_ms integer not null default 0
  check (duration_ms between 0 and 120000);

revoke insert, update on public.ocr_attempts from authenticated;
grant select, insert, update on public.ocr_attempts to service_role;

drop policy if exists ocr_attempts_insert_assigned_pt on public.ocr_attempts;
drop policy if exists ocr_attempts_update_assigned_pt on public.ocr_attempts;
