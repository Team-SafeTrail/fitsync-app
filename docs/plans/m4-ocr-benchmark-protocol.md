# M4 OCR benchmark protocol

**Status:** Required gate before M4 provider selection or public OCR claims

**Document layout:** InBody 270 only

**Supported output:** weight, skeletal muscle mass, body fat mass, body-fat percentage, and optional total body water

## 1. Data admission gate

Use synthetic reports by default. A real report may enter the corpus only after the project has an accountable data owner and written handling for consent, permitted use, access, retention, deletion, and incident response. The consent must cover provider processing and the provider's processing region where applicable.

Keep source images in access-controlled private storage, never in Git. Remove names, contact details, QR/barcodes, member identifiers, and other unnecessary identifiers before upload when doing so does not alter the five measured fields. Use a pseudonymous sample ID in every benchmark artifact. Record the deletion date and responsible owner in the private manifest.

Do not send a real report to any provider until its data-processing terms and retention behavior have been reviewed. Do not place images, signed URLs, biometric values, raw extracted text, or provider payloads in application logs.

## 2. Corpus and split

Start with at least 30 distinct report captures from distinct source reports:

| Capture stratum | Minimum | Examples |
| --- | ---: | --- |
| Clean | 10 | scanner-like, flat, evenly lit |
| Typical handheld | 10 | modest rotation, ordinary indoor light, visible page boundary |
| Degraded but human-readable | 10 | glare, shadow, perspective, mild crop or blur |

Assign 20 reports to a development set and 10 to a locked holdout before tuning. A source report and all of its recaptures or transformations must stay in one split. Do not inspect provider-specific holdout output while changing prompts, crops, preprocessing, parsing, or thresholds. A materially changed pipeline requires a new version and another locked evaluation.

Two people independently transcribe and reconcile the five-field ground truth from the original report. Store values in the same normalized units and decimal representation accepted by the application validator. Missing total body water is a valid optional-field ground truth; missing values in the other four fields make a sample ineligible unless the benchmark is explicitly measuring unreadable-document rejection.

Thirty reports are enough for an internal engineering gate, not a public accuracy claim. Grow and re-lock the corpus before making external claims or adding another report layout.

## 3. Candidate execution

Evaluate at least two provider/pipeline candidates through the same adapter result shape. Record:

- adapter, provider model/version, region, configuration, and preprocessing version;
- sample ID, run timestamp, normalized draft values, confidence or confidence-unavailable status, and bounded failure code;
- end-to-end duration and estimated per-attempt cost;
- whether existing physiological and cross-field validation accepts the draft;
- whether each incorrect or missing field was visibly flagged for review.

Run the deterministic fake separately for application behavior tests. Fake results are not benchmark evidence. Benchmark execution must never write a verified `inbody_records` row.

## 4. Metrics

Report the denominator and a 95% confidence interval where useful; never report a percentage without its sample count.

| Metric | Definition |
| --- | --- |
| Field coverage | Eligible fields for which the pipeline returns a parseable normalized value |
| Exact field accuracy | Returned value exactly equals reconciled ground truth after permitted formatting normalization |
| All-required-fields exact | Weight, muscle mass, body fat mass, and body-fat percentage are all exact for one report |
| Optional-field exact | Total body water is exact when present, or correctly absent when not present |
| Flagged-error recall | Incorrect or missing fields visibly marked low-confidence/inconsistent divided by all incorrect or missing fields |
| Unflagged invalid count | Returned, unflagged values rejected by existing physiological or cross-field validation |
| Recoverable failure rate | Failed attempts that preserve manual entry and do not create a verified record |
| Latency | End-to-end p50 and p95 duration measured from the server operation |
| Cost | Estimated provider cost per attempted and per all-fields-exact report |

Near-match tolerances may be reported as diagnostic information, but do not replace exact normalized matching. The application stores the PT-confirmed value, never a tolerance-adjusted OCR value.

## 5. Internal release gates

Every mandatory safety gate must pass:

- 100% of attempts require explicit PT confirmation before a verified record exists.
- 100% of failures, timeouts, missing fields, and invalid drafts retain a usable manual-entry path.
- 100% of cross-tenant database, mutation, signed-URL, and object-download checks are denied.
- Zero raw provider payloads, full extracted text, biometric values, or signed URLs appear in logs.
- Zero unflagged extracted values violate the existing physiological or cross-field rules.
- Repeat confirmation creates no duplicate record.

Use these initial quality gates on the locked holdout:

- at least 90% all-required-fields exact;
- at least 85% exact accuracy for each required field;
- at least 95% flagged-error recall;
- p95 end-to-end latency no more than 15 seconds under the recorded local test conditions.

These are internal pilot gates, not marketing claims. A candidate that misses a quality gate may still be retained as an experiment, but it must not be presented as completed M4. Cost does not override a failed safety or isolation gate.

## 6. Failure taxonomy

Use bounded codes that are safe to expose in application diagnostics:

- `unsupported_type`
- `file_too_large`
- `signature_mismatch`
- `provider_timeout`
- `provider_unavailable`
- `unreadable_document`
- `missing_fields`
- `invalid_values`
- `inconsistent_values`

Unexpected provider details stay out of user-facing errors and ordinary logs. Monitoring may count code, provider version, duration, and request correlation ID without including health data.

## 7. Required evidence and selection record

The final private benchmark package contains the pseudonymous manifest, split assignment, reconciled ground truth, pipeline version/configuration, per-sample normalized result, aggregate calculation, error review, cost note, consent or synthetic provenance, retention/deletion record, and reviewer sign-off. Only the redacted aggregate report may be committed.

Select a provider only after the holdout run. Record the chosen provider/version, observed limitations, date, corpus denominator, and reason for selection in the M4 handoff. If no candidate passes, ship no OCR claim and retain the already working manual workflow.
