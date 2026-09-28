# FitSync documentation and landing-page alignment review

Review date: 2026-09-27

## Decision

FitSync is a mobile-first, responsive B2B SaaS workspace for Vietnamese personal trainers, with a connected client experience. The paying user is primarily an independent PT managing roughly 5 to 20 clients. The trainee is the secondary end user. The core product loop is:

1. A coach captures an InBody or supported smart-scale result.
2. The system extracts five biometric fields and computes draft nutrition targets.
3. The coach reviews and corrects the values before saving.
4. The client sees daily targets and records meal/check-in activity.
5. The coach sees inactivity and remaining-session signals and follows up.
6. Coach and client review biometric and behavior trends over time.

The current codebase contains two deliberately separate surfaces. `/workspace` implements and locally verifies the M2 loop with persisted accounts, Supabase RLS, secure invitations, manual biometric validation, and authorized PT/trainee views. `/app/*` remains a fixture-backed public tour. The repository still does not prove a live OCR service, production deployment, private media storage, VietQR payment, automatic renewal, uptime, OCR accuracy, or real customer outcomes.

## Documents reviewed

All 14 Markdown documents in `fitsync-docs` were reviewed.

| Document | Role in this review | Landing-page consequence |
| --- | --- | --- |
| `README.md` | Repository overview and original product pitch | Useful summary, but its performance and validation statements are targets rather than implementation evidence |
| `docs/README.md` | Documentation index | Establishes intended source categories; it does not independently validate claims |
| `docs/01-product/PRD.md` | Approved product baseline | Primary source for personas, MVP boundaries, workflows, and non-goals |
| `docs/01-product/GAMIFICATION_AND_RETENTION.md` | Post-MVP retention direction | Streaks, anonymous leaderboards, before/after photos, and urgency alerts must be labeled roadmap concepts |
| `docs/02-architecture/API_SPECIFICATION.md` | Intended REST contracts | API examples and production URLs are specifications, not proof of deployed endpoints |
| `docs/02-architecture/DESIGN.md` | Operational-product design system | Applies most strongly to dashboard/PWA surfaces; the marketing site can be more expressive while preserving clarity |
| `docs/02-architecture/OCR_PIPELINE_SPEC.md` | Intended OCR behavior and fixtures | Supports five metrics and five report targets; latency and accuracy remain targets |
| `docs/02-architecture/SYSTEM_DESIGN.md` | Intended production architecture | Supports the unified web/PWA direction, role model, and data relationships; not current deployment evidence |
| `docs/03-coursework/EXE201_SUBMISSIONS.md` | Coursework submission copy | Contains plans and claimed progress that require external evidence before publication |
| `docs/04-market-research/SURVEY_INSIGHTS.md` | Internal survey interpretation | Useful context, but the raw workbook is the stronger source where totals or audience descriptions differ |
| `docs/05-business/BUSINESS_MODEL_AND_GTM.md` | Pricing and GTM hypothesis | Supports Free, Pro, and Enterprise hypotheses; prices and unit economics are not a current offer |
| `docs/06-quality-and-devops/QA_TEST_PLAN.md` | Intended acceptance criteria | Defines desired behavior, including manual correction and offline queueing; it does not show those tests currently pass |
| `docs/06-quality-and-devops/SECURITY_AND_COMPLIANCE.md` | Intended security controls | RLS, signed URLs, rate limits, and webhook validation must not be advertised as active until implemented and verified |
| `EXE201_Full_Guide.md` | Broad coursework plan and pitch material | Lowest authority for live product claims because it mixes goals, scripts, forecasts, and statements of completion |

## Source-of-truth order

When documents disagree, the landing page now follows this order:

1. Current executable code for what visitors can use today.
2. Approved PRD for intended product scope.
3. OCR, system, API, QA, and security specifications for planned implementation details.
4. Raw survey workbook for respondent counts.
5. Business model document for commercial hypotheses.
6. Coursework submissions and the full guide as planning context only.

## Material conflicts found

### Research sample

The survey summary calls all 104 respondents verified fitness professionals and trainees, while some pitch copy calls them 104 active coaches. The raw workbook contains 104 submissions; 93 self-identify as a PT, coach, gym owner, gym manager, or related coaching role. The landing page therefore says 104 submissions and explains the 93-person professional subset. It does not call the sample 104 active coaches or customers.

### Product status

Coursework documents say the landing page, live OCR, Play Store app, early leads, pilots, and channel results are complete in some passages, while other passages schedule them as future work. The current repository substantiates a locally verified authenticated M2 workflow plus a separate fixture-backed public tour. The landing page must distinguish verified M2 behavior, public samples, and roadmap scope.

### Platform

The PRD and system design specify a responsive PWA. The full guide also commits to a packaged Play Store application. The current app has no demonstrated installable PWA or store distribution. The website now says the browser experience is available in the prototype and that PWA support is a direction.

### Pricing

Documents mention 99,000 VND early-bird pricing, 199,000 VND Pro pricing, 1,000,000 to 1,500,000 VND studio pricing, a Free tier, and a 14- or 30-day trial. The consistent baseline is Free up to three clients and Pro at 199,000 VND per month. The page presents both as hypotheses under validation and does not offer checkout or a trial.

### Visual direction

The operational design spec requires white/slate enterprise surfaces and dense data. The full guide includes an older dark-mode direction, while the landing redesign uses a dark athletic editorial system. This is acceptable because the marketing surface and operational application have different jobs. Product previews retain structured tables, status labels, and tabular data rather than turning the app itself into a decorative concept.

### Performance and security

The docs contain targets of under 3.5 or 5 seconds, at least 96% OCR accuracy, 99.5% uptime, TLS 1.3, RLS, encrypted/private storage, signed URLs, rate limiting, and verified payment webhooks. None should appear as current facts without deployed-system evidence. The landing page avoids those claims.

## Changes made to the landing page

- Refined the hero around the primary user: an independent PT managing records, packages, and progress across fragmented tools.
- Added a three-stage product-scope section: current prototype, approved MVP loop, and post-MVP roadmap.
- Named the five MVP biometric fields in FAQ copy and emphasized mandatory coach review before saving.
- Replaced the generic smart-scale sample label with Xiaomi Smart Scale 2 and named all five target report types in the demo disclaimer.
- Added the documented Free-tier hypothesis alongside the 199,000 VND Pro hypothesis, while retaining the clear no-checkout disclaimer.
- Kept the raw-workbook-backed survey counts and methodology note.
- Kept product boundaries explicit: the authenticated M2 workspace persists local data, while the public tour is fixture-backed and live OCR, payment, store apps, and installable PWA behavior remain unverified.
- After M2 verification, changed the acquisition decision: real PT registration is the intended primary action and the public tour is secondary.

## What the landing page should not claim yet

- “96% accurate,” “under five seconds,” or “under 60 seconds” as measured product performance.
- “104 active coaches,” “customers,” or “verified professionals.”
- Any number of paid users, pilots, leads, installs, visits, or conversions without supporting analytics or receipts.
- Automatic Zalo delivery; the current dashboard only prepares/copies a message.
- A live PWA, Play Store/App Store app, offline queue, or device integration.
- Production RLS, encryption, private storage, signed URLs, or Decree 13 compliance.
- Live VietQR checkout, payment reconciliation, subscriptions, or refunds.
- Medical conclusions or guaranteed health outcomes.
- Unlimited OCR, support response times, income gains, time savings, or ROI as guaranteed results.

## Recommended evidence needed before launch claims change

1. Record product capability status in one shared table with `prototype`, `implemented`, `verified`, and `roadmap` states.
2. Run an OCR benchmark on consented, representative report photos and publish the sample definition, metric, and error rate.
3. Verify the five critical QA flows end to end, including manual correction, inactivity logic, access isolation, and failed uploads.
4. Perform a privacy and Decree 13 review before accepting real biometric or meal-photo data.
5. Use the working PT registration flow as the primary activation path; add a separate lead or waitlist claim only after its persistence and operations exist.
6. Validate pricing with recorded offers and paid conversions before calling any tier final.
7. Replace AI editorial imagery with consented local coaching photography when available.

## Overall assessment

The landing page now leads with verified M2 product evidence and real PT registration while retaining the fixture tour as an explicitly secondary path. OCR, commercial, pilot, and production claims remain constrained by the evidence requirements above.
