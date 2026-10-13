# Unified coaching timeline delivery plan

## Goal

Make FitSync the single private workspace where a PT and trainee communicate, log meals, exchange workouts, review InBody progress, and act on coaching alerts across PT web and an Expo mobile companion.

## Tasks

- [ ] Define conversation, message, read-state, timeline-event, and idempotency contracts; add migrations and deny-by-default RLS. → Verify with pgTAP cross-PT, cross-trainee, forged-reference, pagination, and retry cases.
- [ ] Deliver the PT web inbox and trainee web conversation with text, validated private images, unread/read state, and stable pagination. → Verify two-party realtime delivery and unrelated-user denial in Playwright.
- [ ] Evolve engagement storage into one daily summary plus multiple typed meal entries, created atomically with timeline cards. → Verify multiple same-day meals, timezone rules, private media, and no message parsing for analytics.
- [ ] Add basic workout templates, assignments, ordered exercises, completion, actual performance, and feedback as structured timeline cards. → Verify PT assignment, trainee completion, immutable completed history, and tenant isolation.
- [ ] Create the first `apps/mobile` Expo vertical slice with secure Supabase session storage, inbox, conversation, camera meal entry, and current workout. → Verify on physical Android and iPhone devices with large text, dark mode, poor network, and revoked sessions.
- [ ] Add generic push notifications, notification preferences, deep links, device revocation, and bounded idempotent retry. → Verify no sensitive notification payloads, correct conversation routing, and no delivery to revoked devices.
- [ ] Add unified progress views, search/filter, retention/deletion operations, and content-free funnel analytics. → Verify deletion/retention behavior and analytics payload allowlists before pilot use.
- [ ] Package the Android app for Play Internal Testing, run the consented pilot, then add manually verified VietQR entitlement. → Verify store installation, release smoke tests, consented usage evidence, and reconciled transactions.

## Done when

- [ ] A PT can onboard, message, assign, review, and follow up with a trainee without leaving FitSync for the core coaching loop.
- [ ] A trainee can complete the daily mobile loop on iPhone or Android and the PT sees the same durable structured history on web and mobile.
- [ ] RLS, private media, notifications, analytics, retention, and deletion pass their documented privacy and isolation gates.

## Notes

- Complete the active M4 OCR safety and benchmark gates; do not weaken manual fallback or explicit PT confirmation.
- TWA may provide short-term Play evidence but is not the long-term mobile client.
- `xtool` is not on the React Native/App Store critical path; reconsider it only for a future isolated SwiftPM-native extension.
