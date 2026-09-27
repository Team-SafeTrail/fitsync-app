# ADR-001: Monorepo with a modular monolith backend

## Status

Accepted on 2026-09-27.

## Context

FitSync has one five-person student team, a short MVP timeline, a responsive Next.js prototype, a future store-distributed mobile client, shared health-data rules, and no proven scale that requires distributed services. Web and mobile must use the same authentication, records, nutrition rules, and API contracts.

## Options considered

| Option | Benefits | Costs |
| --- | --- | --- |
| Separate repositories per surface | Independent release permissions and histories | Duplicated contracts, harder coordinated changes, more setup and CI overhead |
| Monorepo with independent services | Strong service boundaries | Operational complexity before traffic or team ownership requires it |
| Monorepo with modular monolith | Shared contracts, atomic changes, one team workflow, simple deployment | Repository and build scope must be kept disciplined |

## Decision

Use one npm-workspace monorepo. Keep the public site and authenticated responsive product in `apps/web`. Add `apps/mobile` when the first Expo workflow is implemented. Keep backend operations in the web/server and Supabase layers during MVP, behind module boundaries for auth, OCR, storage, and billing. Add shared packages only when at least two applications consume the code.

## Trade-offs

The web application remains a larger deployment unit, and mobile work can affect shared workspace tooling. Root validation commands and ownership conventions mitigate those costs. Avoiding premature services gives the team more time to validate the end-to-end workflow and security policies.

## Consequences

- A web or mobile change can update shared contracts atomically.
- Supabase migrations become the authoritative schema history.
- OCR and payment providers remain replaceable server-side adapters.
- Empty packages and a placeholder mobile project are intentionally avoided.

## Revisit triggers

Reconsider service or repository separation when independent teams need separate release authority, one workload requires distinct scaling or compliance controls, or monorepo build times materially slow delivery.
