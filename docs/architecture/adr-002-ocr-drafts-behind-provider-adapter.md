# ADR-002: OCR drafts behind a server-only provider adapter

## Status

Accepted for M4 implementation on 2026-09-28. The provider remains unselected after the 2026-10-10 synthetic benchmark because independent two-person ground-truth reconciliation is still pending.

## Context

M4 adds OCR-assisted entry for InBody 270 reports. These reports contain health data, OCR output is fallible, and FitSync already has a server-validated five-field manual entry and explicit PT confirmation workflow. The team is small, anticipated pilot volume is low, and there is no evidence that an asynchronous service or generalized document platform is needed.

The design must preserve tenant isolation, keep source images private, make extraction failures recoverable, and avoid treating a vendor response as verified health data. It must also allow the team to compare providers without coupling the review experience or database model to one vendor.

## Options considered

| Option | Benefits | Costs and risks |
| --- | --- | --- |
| Let OCR create verified records | Fewest PT interactions | An OCR error becomes trusted health data; bypasses the existing validation and confirmation boundary |
| Put vendor OCR calls in the browser | Direct upload and simple server code | Exposes provider coupling or credentials, weakens validation control, and complicates consistent audit behavior |
| Add a separate OCR service and queue now | Independent scaling and resilient long jobs | Operational complexity without proven volume; another authorization and deployment boundary |
| Use a server-only adapter in the modular monolith and persist reviewable drafts | Reuses ownership checks and validation; vendor remains replaceable; failures stay local and recoverable | A request may wait for provider latency; the web deployment owns the integration |

## Decision

Keep OCR inside the existing modular monolith behind a server-only provider adapter. For MVP volume, extraction is a bounded synchronous server operation with explicit timeout and failure states. A deterministic fake implements the same contract for local and browser tests. Provider selection is a benchmark result, not an architectural prerequisite.

An OCR attempt belongs to one assigned PT and trainee and references one object in a dedicated private InBody-source bucket. Its persisted draft contains only the normalized five supported metrics, per-field confidence metadata, bounded status/error information, timing, provider identifier/version, and an optional link to the confirmed record. Do not persist raw vendor responses or full extracted report text.

The extraction action verifies authentication, assignment, file type, size, and binary signature; writes an attempt; and returns either a draft or a recoverable failure. It cannot insert an `inbody_records` row. The review UI reuses the existing five-field validation and nutrition-draft flow. Only a separate explicit confirmation action may atomically create one `source = 'ocr'` record and link the attempt, after repeating server-side ownership and domain validation. Confirmation is idempotent. `is_manually_edited` is derived by comparing normalized extracted and confirmed values.

Source images remain private and use short-lived signed URLs only for the assigned PT's review. Trainees may view the confirmed metrics under existing policies but do not need source-image access. Manual entry is available before upload and after every extraction failure.

## Consequences

- OCR output is untrusted input until PT confirmation.
- Existing validation rules remain the single domain boundary for manual and OCR-assisted entry.
- Vendor changes affect one adapter and benchmark configuration rather than UI or record semantics.
- Attempts provide an auditable failure history without turning raw OCR payloads into a second health-data store.
- Synchronous latency is acceptable for the pilot but must be measured; the UI needs clear pending, timeout, failure, draft, and confirmed states.
- The benchmark corpus and its source images require stricter access, retention, and deletion controls than ordinary test fixtures.

## Rejected for M4

- Background queues, webhooks, and an OCR microservice.
- Automatic record creation or confirmation based on confidence.
- Generalized parsing for InBody models other than 270.
- Client-side provider credentials or direct vendor calls.
- Public accuracy or latency claims derived from a development set or a small internal holdout.

## Revisit triggers

Reconsider asynchronous jobs or service separation when measured provider latency exceeds the interaction budget, synchronous requests become unreliable, sustained volume needs independent scaling, or compliance ownership requires a separate processing boundary. Expand document support only with a versioned parser and a representative locked benchmark for each layout.
