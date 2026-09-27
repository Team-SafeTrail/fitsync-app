# Prompt for the next FitSync development chat

Copy the block below into a new chat. Attach or open the `fitsync-app` folder as the working repository.

```text
Continue implementing FitSync in:
/home/hei/everything/Code/Organization/SafeTrail/fitsync-app

This is an existing dirty working tree with intentional, uncommitted work. Do not reset, clean, discard, or recreate it. Start by reading these files in order:

1. AGENTS.md
2. docs/HANDOFF.md
3. docs/MVP_EXECUTION_PLAN.md
4. docs/architecture/adr-001-monorepo-and-modular-monolith.md
5. DESIGN.md when changing UI

Treat docs/HANDOFF.md as the compact session state and docs/MVP_EXECUTION_PLAN.md as the active product source of truth. Inspect the current implementation and git status before editing. Do not repeat the completed market research, landing redesign, monorepo migration, or M1 identity work.

Now complete M2, the first real-data vertical slice:

PT signs in -> sees a role-aware workspace and roster -> creates a trainee -> receives a secure single-use expiring invitation -> trainee accepts and creates credentials -> PT manually enters the five InBody metrics -> the system validates bounds and cross-field consistency -> nutrition values remain editable coaching drafts -> PT explicitly confirms the record -> trainee signs in and sees only their own verified record.

Preserve the public landing page and fixture-backed /app demo. Build real authenticated features under /workspace. Use the existing Next.js + Supabase modular-monolith architecture, migrations, generated database types, server-side write validation, and RLS. Store only invitation token hashes and enforce expiry and one-time use. Do not start OCR, payments, Expo/mobile, or unrelated engagement features before M2 passes.

Follow AGENTS.md before writing Next.js code and consult the installed Next.js docs it points to. Use Node 20 or newer. Supabase may already be running locally. If Docker access fails in the current shell, use sg docker -c '<command>' or open a fresh login shell. Never print or document values from apps/web/.env.local.

Work autonomously through the complete milestone. Add meaningful pgTAP/RLS coverage and one browser E2E flow, including cross-tenant denial and desktop/mobile viewport verification. Regenerate database types after schema changes. Run the relevant database checks, lint, typecheck, and production build. Fix failures you introduce. Update docs/HANDOFF.md with the verified final state before reporting completion.

M2 is done only when data persists after reload, the PT sees the linked trainee and verified record, the trainee sees their own record, unrelated users cannot read or mutate it, invalid biometric data cannot be silently saved, and the full workflow is demonstrated in a browser.
```
