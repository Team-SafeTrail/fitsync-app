# UI/03 public sample tour

Issue: [#20](https://github.com/Team-SafeTrail/fitsync-app/issues/20)

This evidence set covers the Adaptive FitSync remake of the fixture-backed PT and trainee tour. Every view keeps the public-sample disclosure visible and separates local interactions from the authenticated workspace. Images were captured from the production build at `127.0.0.1:3001` on 11 October 2026.

## Representative viewports

| Surface | Viewport | Appearance | Evidence |
| --- | ---: | --- | --- |
| PT roster overview | 1440 × 1000 | Light | [`pt-tour-light-desktop.png`](./pt-tour-light-desktop.png) |
| PT overview and mobile navigation | 390 × 844 | Dark | [`pt-tour-dark-mobile.png`](./pt-tour-dark-mobile.png) |
| Trainee nutrition and check-in view | 1024 × 900 | Light | [`trainee-tour-light-tablet.png`](./trainee-tour-light-tablet.png) |
| Trainee priority view | 390 × 844 | Dark | [`trainee-tour-dark-mobile.png`](./trainee-tour-dark-mobile.png) |
| InBody review dialog | 1024 × 900 | Light | [`inbody-review-light-tablet.png`](./inbody-review-light-tablet.png) |
| Meal check-in sheet | 390 × 844 | Dark | [`meal-review-dark-mobile.png`](./meal-review-dark-mobile.png) |

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test` (36 tests)
- `npm run build` (14 routes generated)
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/e2e/public-journey.spec.ts tests/e2e/public-tour.spec.ts --reporter=dot` (4 tests)
- Both tour routes were checked at 390, 1024, and 1440 pixels for horizontal overflow and 44-pixel visible interactive targets.
- Separate browser contexts verified system light/dark appearance and reduced-motion behavior.
- Production evidence capture completed without browser console errors.

## Behavior and product truth

- Fixture data remains in client-side sample state and is not written to the authenticated workspace.
- The InBody flow still loads local fixtures, allows review and correction, and requires explicit confirmation.
- The meal flow still supports photo-preview simulation, quick picks, manual fields, and local list updates.
- Reminder text is copied for the PT; the tour no longer implies that FitSync automatically sends or opens Zalo.
- Registration remains the primary route out of the public tour.
