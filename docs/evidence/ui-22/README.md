# UI/04 authenticated workspace surfaces

Issue: [#22](https://github.com/Team-SafeTrail/fitsync-app/issues/22)

This evidence set covers the Adaptive FitSync remake of the real, Supabase-backed PT and trainee workspace. All records shown are synthetic. Images were captured from the production build at `127.0.0.1:3001` on 11 October 2026, then the synthetic accounts and dependent records were removed.

## Representative viewports and states

| Surface | Viewport | Appearance | Evidence |
| --- | ---: | --- | --- |
| PT empty roster and onboarding | 1440 × 1000 | Light | [`pt-empty-light-desktop.png`](./pt-empty-light-desktop.png) |
| PT populated roster | 1440 × 1000 | Light | [`pt-roster-light-desktop.png`](./pt-roster-light-desktop.png) |
| PT populated roster | 390 × 844 | Dark | [`pt-roster-dark-mobile.png`](./pt-roster-dark-mobile.png) |
| Trainee check-in home | 390 × 844 | Dark | [`trainee-home-dark-mobile.png`](./trainee-home-dark-mobile.png) |
| Linked trainee detail and session balance | 1024 × 900 | Light | [`trainee-detail-light-tablet.png`](./trainee-detail-light-tablet.png) |
| OCR rejection with manual fallback | 1024 × 900 | Light | [`ocr-fallback-light-tablet.png`](./ocr-fallback-light-tablet.png) |

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test` (36 tests)
- `npm run db:test` (111 tests)
- `npx supabase db lint --local` (exit 0; only the existing pgTAP `extensions` diagnostics were reported)
- `NEXT_PUBLIC_E2E_TEST=true npm run build` (14 routes generated)
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run test:e2e --workspace @fitsync/web -- --reporter=line` (11 tests passed)
- M2 vertical slice: PT registration, invitation, trainee acceptance, physiological validation, manual InBody confirmation, nutrition update, role isolation, responsive checks, and 44-pixel mobile targets (passed)
- M3 engagement: private meal media, daily check-in, session updates, warning threshold, deliberate follow-up actions, storage isolation, and mobile presentation (passed)
- M4 OCR: private upload, deterministic draft, PT correction, explicit confirmation, invalid-file rejection, and manual fallback (passed)
- Evidence capture and the full end-to-end suite completed without browser console errors.
- Synthetic cleanup removed all matching `m2-*`, `m3-*`, `m4-*`, and `ui22-*` users after their dependent trainee rows and private test objects were removed; zero matching users remain.

## Behavior and security preserved

- Existing server actions, field validation, authentication redirects, role routing, RLS, and storage boundaries remain intact.
- The authenticated shell now says `Dữ liệu thật`; the fixture tour remains separately labeled `Bản mẫu công khai`.
- OCR is presented as experimental and untrusted. A draft requires PT review and explicit confirmation, and manual entry remains visible after failures.
- InBody history identifies whether a record came from manual entry or an OCR draft reviewed by the PT.
- Follow-up actions continue to copy text or deliberately open Zalo. FitSync does not claim to send messages automatically.
