# UI/02 public and access surfaces

Issue: [#18](https://github.com/Team-SafeTrail/fitsync-app/issues/18)

This evidence set covers the Adaptive FitSync remake for the public landing page, authentication entry points, invalid invitation state, legal copy, and the global not-found page. All images were captured from the production build at `127.0.0.1:3001` on 11 October 2026.

## Representative viewports

| Surface | Viewport | Appearance | Evidence |
| --- | ---: | --- | --- |
| Landing hero and interactive product preview | 1440 × 1000 | Light | [`landing-light-desktop.png`](./landing-light-desktop.png) |
| Landing navigation open | 390 × 844 | Dark | [`landing-dark-mobile-menu.png`](./landing-dark-mobile-menu.png) |
| PT registration | 1024 × 900 | Light | [`register-light-tablet.png`](./register-light-tablet.png) |
| Invalid invitation recovery | 390 × 844 | Light | [`invite-invalid-light-mobile.png`](./invite-invalid-light-mobile.png) |
| Privacy document | 390 × 844 | Dark | [`privacy-dark-mobile.png`](./privacy-dark-mobile.png) |
| Not-found recovery | 390 × 844 | Dark | [`not-found-dark-mobile.png`](./not-found-dark-mobile.png) |

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test` (36 tests)
- `npm run build` (14 routes generated)
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npx playwright test tests/e2e/public-journey.spec.ts tests/e2e/public-surfaces.spec.ts --reporter=dot` (3 tests)
- Automated landing checks at 390, 1024, and 1440 pixels confirmed no horizontal overflow and at least 44 pixels of height for visible interactive targets. The visually hidden skip link is measured after focus through the existing keyboard journey instead.
- Light and dark system appearances were checked in separate browser contexts.
- The only expected browser-level failed response during evidence capture is the deliberate HTTP 404 used for the not-found surface.

## Behavior preserved

- Existing routes and server actions remain unchanged.
- PT registration and login keep their original fields and validation behavior.
- Invitation acceptance keeps its token-driven success, failure, and recovery paths.
- Landing product previews still link to the existing PT and trainee sample workspaces.
