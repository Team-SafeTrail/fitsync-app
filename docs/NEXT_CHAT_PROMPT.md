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

Treat docs/HANDOFF.md as the compact session state and docs/MVP_EXECUTION_PLAN.md as the active product source of truth. Inspect the current implementation and git status before editing. M0, M1, M2, and the post-M2 landing conversion checkpoint are verified; do not repeat them or the completed market research and landing redesign.

Now complete M3 engagement:

Trainee signs in -> submits one daily check-in with an optional note and meal photo -> the PT sees the activity in the linked trainee view -> PT can update the explicit remaining-session balance -> after three full calendar days without a check-in, the trainee appears in a warning queue -> the PT may copy a prepared follow-up message or intentionally open Zalo, but FitSync never sends it automatically.

Preserve the landing CTA hierarchy: `/register` is primary and `/app/*` is a clearly labeled secondary fixture tour. Extend the existing Next.js + Supabase modular monolith with versioned migrations, generated types, server-side write validation, private storage for meal media, and RLS. Define and test the application timezone used by the three-full-calendar-day rule. Do not start OCR, payments, Expo/mobile, analytics, or unrelated engagement features during M3.

Follow AGENTS.md before writing Next.js code and consult the installed Next.js docs it points to. Use Node 20 or newer. Supabase may already be running locally. If Docker access fails in the current shell, use sg docker -c '<command>' or open a fresh login shell. Never print or document values from apps/web/.env.local.

Work autonomously through the complete milestone. Add meaningful pgTAP/RLS and domain-test coverage plus one browser E2E flow covering authorized check-in creation, PT visibility, warning timing, session changes, media privacy, cross-tenant denial, and desktop/mobile rendering. Regenerate database types after schema changes. Run database checks, unit tests, lint, typecheck, production build, and E2E; fix failures introduced by M3. Update `docs/HANDOFF.md` with the verified final state before reporting completion.

M3 is done only when activity persists after reload, the linked PT sees it, unrelated users cannot read or mutate it, private media cannot be fetched across tenants, the warning date is correct at calendar boundaries, no automatic message is sent, and the complete flow is demonstrated in a browser.
```
