# FitSync — application of the approved coaching design

Date: 2026-10-30. Branch: `codex/apply-approved-coaching-design`.
The owner explicitly approved the coaching specimen and requested application to
main pages plus a lasting DESIGN.md. This is local implementation, not a deployment.

## Applied surfaces

| Route / surface | Change | Runtime evidence |
| --- | --- | --- |
| `/` | React implementation of approved hero, connected appointment motif, PT/trainee dossier, source/review sheet, truthful readiness FAQ and real signup/sample links | Production browser desktop/tablet/phone, sample interactions and screenshot review |
| `/login`, `/register` | Shared photo/brand/type, readable form styles and unavailable-service state with sample navigation | Current unavailable-service state; configured credential submission not exercised |
| `/invite/*` | Same auth shell; token/data/accept action unchanged | Invalid-token surface only; a valid invitation requires configured backend |
| `/app/dashboard` | Quiet app frame, roster, statistics computed from fixture clients, consistent dialogs and search | Search, modal/focus/Escape, responsive layout, accessibility |
| `/app/trainee` | Shared type, surfaces and navigation; nutrition copy labeled as sample; original meal flow preserved | Meal dialog, keyboard/close, responsive layout and accessibility |
| `/workspace` and trainee detail | Shared workspace frame, roster/record surfaces, form hierarchy, metadata and brand; existing actions/queries preserved | Auth redirect verified; authenticated page data/rendering not exercised |
| `/admin` | Shared admin frame/type/brand, readable data surfaces; kept system-admin distinction from future gym-owner dashboard | Auth redirect verified; admin-data rendering not exercised |
| `/privacy`, `/terms`, not found | Shared reading layout and brand; existing policy content retained | Browser rendering, accessibility and 404 home action |

Root [`DESIGN.md`](../../DESIGN.md) is now v4, the approved visual source of truth.
Previous Carbon v3.1 is retained in `docs/archive/landing/DESIGN-carbon-v3.1.md`.
This does not renew old persona/price/B2B/milestone assumptions.

## Implementation choices

- Shared semantic CSS variables and Tailwind aliases; brand is forest/jade with
  apricot CTA on the photo, not amber-on-carbon. Auth/admin/workspace follow the same system.
- Native dialogs with Tab/Shift-Tab containment, Escape and return focus. The
  original public sample logic remains; real OCR confirmation is unchanged.
- `next/font/local` uses existing Be Vietnam Pro weights and retains OFL/source.
  No Google-font build request or package upgrade. `next/image` uses a project-local
  WebP, 173132 bytes from a 2217490-byte PNG; caption identifies fictional AI imagery.
- Landing now leads to `/register`, while `/app/*` stays clearly fixture-backed.
  Sample chat/appointment snippets are labeled as concepts, not real shared services.
  Links name the destination that exists; they do not promise an absent chat/calendar page.
- Removed old landing composition that advertised 24/7, placeholder phone/APK,
  prices and time-savings. Coursework/team information is in an explicit disclosure.
  Legacy components are retained as source history but are not rendered by the new landing.
- PT tour statistics now describe the actual fixture roster, not invented revenue
  or time saved. No real health data, migrations, auth-action or RLS changes.

## Checks actually run

| Check | Result |
| --- | --- |
| Next 14 production build | PASS, all 15 static pages generated; landing route 6.63 kB / 106 kB first-load JS |
| TypeScript `tsc --noEmit` | PASS |
| Next lint | PASS, no warnings/errors |
| Vitest | PASS, 33 tests in 3 files |
| Playwright targeted E2E | PASS, 7 tests; repeated against final production build |
| Axe A/AA selected tags | 48 state/viewport combinations PASS after contrast fix; no confirmed violation or page overflow |
| Final root follow-up | 4 more root scans after phone-image crop correction, all PASS; 320/390 photo region exactly 302px |
| Reduced motion, no-JS reading, 404 | PASS in targeted browser follow-up |
| Runtime page errors / server 5xx | 0 in the accessibility run |
| Scoped source scan | 30 changed/new source files checked; no console.log/debug, dangerous HTML injection or credential-like pattern found |
| Diff / protected boundaries | `git diff --check` PASS; no diff in supabase, features, middleware, auth actions or auth identity helper |

Coverage was not measured: coverage-v8 is not installed and no coverage dependency
or arbitrary new threshold was added. The scan is narrow and is not a security audit.
Axe incomplete entries remain in local evidence; this is not WCAG certification.

Commands used installed CLI entries directly with Node (npm is absent from this
session PATH). NEXT_TELEMETRY_DISABLED=1 avoided a Windows EXDEV error in Next's
telemetry config; no global config or telemetry tracking was installed. The required
node_modules/next/dist/docs directory is absent in installed Next 14.2.21; checked
installed package/types and official [Next 14 fonts](https://nextjs.org/docs/14/app/building-your-application/optimizing/fonts)
and [images](https://nextjs.org/docs/14/app/building-your-application/optimizing/images) guidance.

## Test updates and fixes

- Updated only the old title/sidebar-color assertions in M2 vertical-slice test.
  Its invitation, isolation and persistence checks are retained. That backend test
  was not executed because this checkout has no Supabase configuration.
- Replaced an old OC2 test that required fake phone/APK claims with checks that
  team/course context remains accessible and unsupported claims are absent.
- Added approved-design tests for role switching, mandatory sample review gate,
  sample search, native dialog closing/focus and navigation.
- Found light-theme amber text at 4.32:1 / 2.74:1 on trainee sample; changed to
  semantic warning ink and reran all 48 scans.
- Found next/image fill's inline height affecting phone crop; constrained the phone
  image height and checked all four widths after the final production build.

## Observed and unverified

Opened actual production-rendered landing/auth/PT-tour/trainee-tour/legal/invalid
invitation pages at 1440/768/390/320. Looked at final desktop/mobile hero, auth photo,
PT/trainee screens and legal reading views. Browser evidence is under
`.agents/audit/ui/2026-10-30-main-rollout/` (ignored).

Supabase URL/configuration and a local backend are absent. No authentic PT/trainee/admin
session was manufactured or bypassed to obtain screenshots. Real signup/login,
valid invite, persisted CRUD, OCR provider execution, RLS/database tests and real
admin queries are **not verified in this rollout**. Their server code and policies
are unchanged. Existing legal wording was restyled, not rewritten as a launch-ready policy.

The public tour's original functional scope remains distinct from the future
product described by the owner. This rollout does not implement real chat, shared
scheduling, voice intake, a gym-owner dashboard or native Android/iPhone delivery.
Original rollout performed no reset, push or deploy. Original dirty files, videos
and private data are preserved. The owner subsequently authorized a focused commit
and push of this design rollout to `codex/apply-approved-coaching-design` on
2026-10-30. This remains a review branch, not a deployment or merge to main.

## Local review

- [Main website](http://127.0.0.1:3000/)
- [PT public tour](http://127.0.0.1:3000/app/dashboard)
- [Trainee public tour](http://127.0.0.1:3000/app/trainee)
- [Approved specimen retained](http://127.0.0.1:3102/coaching/)

Production preview is bound to 127.0.0.1. Main server: run Next start from apps/web
after build. Prototype server 3102 remains separate, not a deployment of the app.
