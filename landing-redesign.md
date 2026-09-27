# Landing redesign

Goal: deliver the report's product-led Vietnamese landing page using the existing stack.

- [x] Update design specification and landing-scoped visual system.
- [x] Build hero, interactive coach/client product preview, and local imagery.
- [x] Build an editable, explicitly simulated scan workflow.
- [x] Rework benefits, pricing, estimator, FAQ, and consistent sample-app CTAs.
- [x] Verify lint, types, production build, desktop/mobile rendering, keyboard navigation, and demo edge cases.

The app is a prototype. Public actions must not claim live onboarding, OCR, or payment processing. Existing dashboard and trainee routes remain available.

## Verification

- `npm run lint`: no warnings or errors.
- `npx tsc --noEmit`: passes.
- `npm run build`: static production build passes.
- Chromium: coach/client selection, sample switching, scan completion, weight correction, invalid input, reset and rapid-switch cancellation pass.
- Estimator, native FAQ, menu/Escape, reduced motion, and dashboard navigation pass.
- No horizontal overflow at 360, 390, 768, 1024, and 1440 pixels; no page runtime errors.
- Desktop and mobile screenshots inspected, including lazy-loaded editorial imagery.

No live account creation, payment integration, or OCR service was added. Those existing mock promises were replaced with accurate sample-product actions. No new runtime dependencies.

Final production build was verified after moving stale generated `.next` output aside. Local preview: http://127.0.0.1:3100.

## Evidence and launch-readiness pass

- Added aggregate research evidence from the 104-row EXE101 survey workbook, with denominator and sample limitations visible on the page.
- Added a four-week fictional progress journey that connects scan, review, coach follow-up, and progress review.
- Replaced the three-tier pricing wall with a clear distinction between the available prototype and launch direction.
- Added `/privacy`, `/terms`, and a branded 404 page.
- Corrected mock dashboard and trainee copy so file selection, AI analysis, confidence, and verification are not misrepresented.
- Added dark browser chrome metadata, touch behavior, and meaningful names/input modes for landing controls.
- Preserved the generated coaching illustration with an explicit AI caption; replacement with released original photography remains a content-production task.

Validation after this pass: ESLint, TypeScript, production build, static accessibility audit, desktop/mobile browser interactions, five viewport widths, `/privacy`, `/terms`, and 404 response.
