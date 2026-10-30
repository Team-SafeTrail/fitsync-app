# Landing content restoration — 2026-10-30

Work resumed from D:/Hung_will_delete/fitsync-app after owner-confirmed relocation. Lead frontend-design, preserving approved DESIGN.md tokens/layout language.

Restored intake sequence, aggregate research with limitations (source docs/research/survey-evidence.md), explicit capability status and team responsibilities from TEAM_PLAYBOOK. Retained existing hero/profile/plot/sheets. Report sample now offers three generic synthetic datasets, an editable weight, invalid-state handling, review invalidation after edit, confirmation and reset. No OCR, persistence or nutrition prescription is implied. Pricing/ROI/APK/support promises remain excluded. Team identities/contact details beyond existing published names were not added.

Follow-up plan: ../plans/COACHING_PRODUCT_FOLLOWUP.md. This is a scoped implementation proposal grounded in the owner interview, not approval of all UX/schema or replacement for the missing original PRD. No new chat/calendar/membership/backend/provider/mobile implementation in this change.

Executed after this code change: Next14 production build PASS including lint/types, explicit tsc PASS, Vitest 33/33 PASS, targeted Playwright 11/11 PASS. New tests exercise edit-invalid-review-confirm-reset at 1440/768/390/320, existing role/focus/navigation tests retained. Diff check PASS. Viewed actual production screenshot sections at desktop1440 and phone390; browser tests check no horizontal overflow. Screenshots ignored under .agents/audit/ui/content-restoration. No fresh axe audit or database/RLS/authenticated test run in this change; do not reuse earlier scans as new results. Auth configuration remains unavailable locally.

Main production preview http://127.0.0.1:3000/. Original dirty skills/video/plans and other unrelated changes preserved. No database, auth, server-action or RLS changes. Feature-branch push only, no main merge/deployment.
