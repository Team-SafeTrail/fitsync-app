# Landing conversion alignment

**Status:** Complete and verified on 2026-09-27

## Goal

Make FitSync's verified M2 workflow the main public product proof, send ready PTs into real registration, and retain the fixture-backed `/app` tour as a clearly secondary option before returning to M3.

## Scope boundary

This checkpoint changes the public landing presentation and its browser coverage only. It does not add analytics, lead capture, trial rules, OCR, payments, database migrations, or M3 engagement features. All public copy remains Vietnamese.

## Tasks

- [x] Consult the installed Next.js guidance relevant to the App Router, links, images, and server/client component boundaries before editing landing code. → Verified against the official versioned Next.js 14 documentation because the installed `14.2.21` package does not include `dist/docs`.
- [x] Reverse the CTA hierarchy in `HeroSection.tsx`, `LandingNav.tsx`, `PricingSection.tsx`, and `Footer.tsx`: primary “Tạo workspace PT” → `/register`; secondary “Xem bản mẫu” → `/app/dashboard`. → Verified through Playwright, including the visible focus state.
- [x] Reframe the hero and first product composition around the verified M2 sequence—roster, invitation, manual five-metric validation/confirmation, and trainee read-only access—using synthetic data. → Verified in desktop and mobile browser captures.
- [x] Reorder or condense `OCRDemoSection`, `ROICalculator`, `PricingSection`, and product-scope copy so simulated or hypothetical material follows verified product evidence and retains explicit status labels. → Verified by copy review and rendered-page inspection.
- [x] Preserve `/app/dashboard` and `/app/trainee` as functional fixture tours with persistent sample-data labeling and a path to `/register`. → Verified in the public Playwright journey.
- [x] Update `public-journey.spec.ts` for the new CTA intent and cover 1440px desktop plus 390px mobile rendering, keyboard-visible actions, correct destinations, and no horizontal overflow. → Verified with Chromium.
- [x] Run `npm run lint`, `npm run typecheck`, `npm run build`, and the focused public Playwright flow; then update `docs/HANDOFF.md` and mark this plan complete. → All required checks passed on 2026-09-27.

## Done when

- [x] `/register` is the clear primary action throughout the landing page.
- [x] The first product proof shows only verified M2 behavior with synthetic data.
- [x] `/app/*` remains available, honest, and visually secondary.
- [x] Desktop/mobile browser checks and the repository quality gates pass.
- [x] No M3, OCR, payment, Expo, or database scope entered this checkpoint.
