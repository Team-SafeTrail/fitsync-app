# ADR 004: Unified coaching timeline and Expo mobile client

## Status

Proposed

## Context

FitSync exists to reduce the administrative fragmentation experienced by independent PTs. The verified web product currently stores trainees, InBody records, daily check-ins, one optional meal image, session balances, and inactivity warnings, but follow-up still leaves the product through copied text or Zalo. That preserves the same split between messaging, spreadsheets, notes, and fitness tools that FitSync is intended to remove.

The approved product direction requires:

- a private one-to-one communication space for every assigned PT–trainee pair;
- meal, check-in, workout, InBody, nutrition, and session activity in one understandable history;
- structured data for validation, trends, adherence, analytics, and authorization;
- a phone-first experience for trainees and an effective mobile companion for PTs;
- a full web workspace for PT operations;
- push notifications, deep links, camera actions, and bounded poor-network recovery;
- continued RLS isolation and private media handling.

The expected initial scale is a small SaaS pilot: a five-person team, PTs managing roughly 5–20 trainees each, and substantially fewer than 1,000 concurrent users. A modular monolith is therefore preferable to microservices or a dedicated event-streaming platform.

## Options considered

### A. Separate chat, meals, workouts, and progress modules

This keeps each domain simple but forces users to switch contexts. It does not fully solve the original tool-fragmentation problem and makes PT intervention slower.

### B. Chat-only records

Meals, workouts, and health updates could be encoded directly in message payloads. This provides one interface but makes validation, analytics, trends, corrections, and authorization depend on parsing mutable conversational content.

### C. Unified timeline over structured domain records

Human messages remain durable messages. Coaching actions remain authoritative domain records and produce lightweight timeline events that reference them. Clients merge both streams into one chronological coaching experience.

This adds a projection/aggregation concern, but it preserves domain integrity while meeting the one-workspace product promise.

## Decision

Choose **Option C: a Unified Coaching Timeline over structured domain records**.

1. Each active PT–trainee relationship has one private conversation in V1.
2. User-authored text and media are stored as messages.
3. Meal logs, daily check-ins, workout assignments/completions, verified InBody records, nutrition changes, and session changes remain in dedicated domain tables.
4. Append-only timeline events reference those records using bounded event types and identifiers. They do not duplicate sensitive health or message content.
5. PostgreSQL commits are authoritative. Supabase Realtime accelerates delivery but is not a message queue or source of truth.
6. RLS derives membership from the assigned relationship. The client cannot choose arbitrary participants or forge a domain reference.
7. The first mobile client is `apps/mobile` using Expo/React Native. It serves iOS and Android from the shared backend while Next.js remains the full PT web client.
8. Safe RLS-backed reads may use Supabase directly. Privileged, atomic, or multi-record writes use reviewed PostgreSQL functions or server endpoints with versioned request/response contracts.
9. Push notifications use generic content and deep-link metadata only. Sensitive content is fetched after authenticated app launch.
10. Offline V1 caches a bounded recent view and retries idempotent text/check-in submissions. General multi-device conflict resolution is deferred.

## Mobile packaging consequence

[ADR-003](adr-003-android-packaging-path.md) remains useful only for evaluating a short-term TWA build that may satisfy a Play testing requirement quickly. It no longer defines the long-term mobile product architecture because a chat- and notification-centered trainee companion benefits from native secure storage, push handling, deep links, background lifecycle integration, and camera APIs.

[`xtool`](https://github.com/xtool-org/xtool) is not part of the FitSync critical path. As of this decision, its official scope is building, signing, and installing SwiftPM-native iOS apps. Its upstream [React Native/Flutter build request](https://github.com/xtool-org/xtool/issues/28) and [App Store upload workflow](https://github.com/xtool-org/xtool/issues/117) remain unresolved. It may be reevaluated for a future isolated Swift/SwiftUI extension, but it does not replace the Expo build and submission path.

## Trade-offs accepted

- Web and mobile require two presentation codebases.
- The backend needs contracts that do not depend on Next.js Server Components, Server Actions, or browser cookies.
- Timeline aggregation and idempotent event creation add schema and test work.
- Push, device revocation, deep links, and store builds add operational responsibilities.
- Expo limits some platform-specific control compared with separate SwiftUI and Kotlin applications, but the shared team skill set and initial scale favor one cross-platform client.

## Consequences

### Positive

- PTs can complete the core coaching loop inside FitSync.
- Trainees receive a coherent phone-first daily companion.
- Meals, workouts, and biometrics remain measurable and safe to validate.
- The same relationship history appears consistently on PT web and both mobile platforms.
- The architecture stays within the current Supabase/PostgreSQL modular monolith.

### Negative

- Existing one-meal-per-daily-check-in storage must evolve before multiple meal cards are real.
- Realtime and notification security need additional RLS, device, and delivery tests.
- Mobile delivery must wait for a working vertical slice; empty scaffolding is still prohibited.
- TWA work may become disposable if used only to satisfy an early Play milestone.

### Mitigations

- Deliver one vertical slice at a time: text conversation, structured meals, basic workouts, then Expo mobile and push.
- Use append-only events and idempotency keys instead of a distributed event bus.
- Keep message and notification analytics content-free.
- Test cross-tenant reads, realtime subscriptions, signed media, deep links, retry, and revoked devices before pilot use.
- Preserve the responsive web experience as a fallback during mobile rollout.

## Revisit triggers

Reconsider this decision if any of the following becomes true:

- measured concurrent usage exceeds the practical Supabase Realtime or database-change delivery envelope;
- studio/group coaching becomes a verified pilot requirement;
- Expo cannot support a required device capability or store policy;
- regulatory or retention requirements require a separate messaging subsystem;
- a native iOS extension becomes valuable enough to justify a SwiftPM-specific toolchain.
