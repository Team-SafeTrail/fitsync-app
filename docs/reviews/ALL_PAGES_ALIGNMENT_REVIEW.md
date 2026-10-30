# FitSync — all-pages alignment review and fixes

2026-10-30, branch codex/apply-approved-coaching-design. Owner requested review of landing completeness, business direction and coherent PT/trainee pages, beyond colors.

## Finding

The approved visual world is coherent, but the previous rollout did not complete product alignment. Palette/type passed before several task-continuity problems were resolved. A public demo is not the authenticated product. Technical checks are not evidence of customer value, commercial readiness or the best possible design.

## References and provenance

DESIGN.md and the retained design-language research record the earlier Gentler Stories, Craft, Attio and related observations. They informed visual composition, not FitSync's product requirements. Landing copy is derived from the owner interview and recorded product truth, not conversion research or competitor customer data. This pass did not perform a new competitor study or usability trial. No Gentler assets were copied.

Lead impeccable, existing visual world preserved. Engine0.1.17 SHA256 verified against bundled checksum before context/static detector; no hook auto-enabled or download/install. Independent assessment A looked at render before assessment B entered the parent synthesis; B ran fresh browser/axe checks. Static detector returned two bounce advisories: one class occurrence and one CSS rule disabling that class. They were reviewed against rendered CSS; no hard detector finding. No live overlay detector was injected; this is a technical/visual review with documented limits, not a completed overlay-backed Impeccable critique or certification. Questions skipped: owner explicitly requested implementation; business direction was already clarified in chat.

## Observations and repairs

| Surface | Before / evidence | Repair | Coverage |
| --- | --- | --- | --- |
| Landing | Visual appointment seemed operational; business discussion absent from page; long decision-support tail | Local sample/concept label, sample appointment action, compact offer relationship block naming proposed payer and no payment yet; capability details remain progressively disclosed | Actual rendered desktop/mobile; interactive state checks |
| Public PT | English table, no profile opener, wide phone table, Zalo optimistic copy/open | Vietnamese labels/goals, desktop name→dossier sheet, phone summary rows→same dossier, clipboard success/error truthful and no automatic external opening | Render + E2E/profile keyboard tests |
| Public trainee | Header said Coach Nam; nutrition/streak dominated; mixed English; preview URL leaked | Correct learner identity, PT companion context and available daily-task action, localized meal labels, objectURL cleanup | Render + role/modal/navigation tests |
| Shared sample frame | Different icon tile/wordmark, collapsed icon nav lacked names/current state | Same Brand component, explicit accessible names/current page, expanded state | Browser/accessibility + source; final home-link naming followed up separately |
| Login/register | Same approved auth shell; service unavailable locally | Retained usable sample fallback, no fake registration success | Unavailable state only, not configured forms |
| Invitation | Auth shell uses same system | Existing invalid-token recovery retained | Invalid token only; valid acceptance not exercised |
| Workspace PT | Has current roster/search/progress integration | Kept real server identity/query boundaries; added separate navigation component with correct current route and sample destination per role | Source/type/build; unauth redirects only |
| Workspace trainee | Role navigation did not point to daily activity/progress | Added anchored activity/progress navigation, sample link goes to trainee tour | Source/type/build; no authenticated render claim |
| PT trainee detail | Same shared records/progress; no chat/calendar | Kept existing protected detail; overview nav no longer falsely marks detail as current overview | Source/build/redirect only |
| Admin | Some orange/blue marketing accents survived light theme | Mapped relevant icon/navigation backgrounds to shared semantic tokens, normalized controls, kept system-admin/coursework sample distinction | Source/build; login redirect only |
| Privacy/terms | Described entire project as accountless demo | Corrected factual boundary public /app versus configured account workspace, dated change | Actual rendered reading surface; not a launch-ready legal policy/review |
| 404 | Shared brand and recovery already present | Retained | Browser response and recovery |

## Current business position

Owner has a previous model and requested reconsideration after mentor feedback. Do not say no model was ever chosen. BUSINESS_MODEL_REVIEW.md compares baseline Free3/Pro199k with PT subscription by roster band and separate AI cost control. Recommendation is a hypothesis, not a new approved price: PT pays, trainee joins with no separate platform charge; no per-message/check-in fee. Landing now names this as direction under review, with no live checkout/renewal. Specific prices/active-seat thresholds/AI quotas/trial length still need decision and evidence.

Profitability depends on contribution after AI/storage/support/payment/refunds and acquisition/retention, not simply 199k versus299k. Business model document contains assumptions and sample arithmetic, not measured FitSync economics. Customer interviews, real use and renewals remain necessary; no advertisements/outreach/tracking/payment launched here.

## Checks actually executed

- Production Next14 build PASS, includes lint and typecheck; explicit tsc PASS. Installed Next14 has no node_modules/next/dist/docs; existing documented Next14 patterns retained, no package upgrade.
- Vitest36/36 PASS, 4 files; no coverage run.
- Public Playwright15/15 PASS, repeated against final build including new dossier and role-identity tests at1440/768/390/320. Existing test assertions retained.
- Two fresh browser audit passes each68 combinations, 12 routes and expanded states across1440/768/390/320. Final pass: no confirmed selected axe A/AA violation, page overflow, pageerror or5xx. Incomplete entries retained. Redirected URLs recorded; no pretending redirects are authenticated screen audits.
- Viewed final representative public PT/trainee mobile screenshots, independent visual review looked landing/tours/auth/legal at1440/390. No physical device test or screen-reader user testing.
- Follow-up native dossier and collapsed-nav axe scans: five states PASS, no overflow; clipboard-denied recovery also PASS. Found and fixed a real 768px pointer interception: sidebar remained visible while max-width768 CSS removed content margin. Aligned the breakpoint at767 and added the 768px dossier interaction regression; repeated final build,15 E2E and68-state audit after fixing it.
- Static detector and diff check executed. Not a full security audit. Auth/server actions/SQL/RLS/provider untouched.

Ignored evidence under .agents/audit/ui/full-alignment/: assessment-b.json(before), assessment-final.json(after), screenshots, impeccable-final.json. Review source and render together; screenshots by themselves do not establish persistence.

## Still required, in dependency order

1. Authenticated test environment with synthetic users; current shell has no configured Supabase, Docker or Supabase CLI. Validate all credential/invite/roster/progress/admin states before treating core as ready.
2. Actual shared chat with membership authorization, history, delivery/retry states and privacy rules.
3. Shared calendar/requested reschedule, optional workout assignment, consistent appointment references from thread and profile.
4. Membership dates distinct from attendance and PT ledger; idempotent session deduction, agreed cancellation/no-show rules.
5. Complete image/PDF/body-composition data and benchmarked provider, mandatory PT review retained. Food AI and voice require separate correctness/consent gates; Android actual-device delivery still absent.
6. Commercial onboarding/offer/payment/support/deletion policies and evidence before publishing a finalized price or claiming operation. Contact channel and customer proof must be real, not placeholders.

Landing is sufficient to explain/evaluate the current concept, not a complete commercial launch funnel. Do not add more feature blocks as a substitute for these missing workflows. Keep and test the approved design while implementing the next vertical slices in COACHING_PRODUCT_FOLLOWUP.md.
