# Feature readiness and recording gates

Assessment: 2026-10-24, updated after the user's production URL/ERD input and overnight verification. Product source revision `e1b03ad95b4fa5306ec7c2a4d9f5ca443e22cffd`; deployed SHA mapping remains unverified. `READY` requires direct verification in this session; historical test reports are evidence references, not freshly passed tests. `NOT READY` may mean recording evidence is missing rather than code absent.

**2026-10-25 follow-up:** normal registration of a fresh synthetic PT succeeded. A new trainee was created/accepted through the app, another invitation remains pending, and real check-in/meal, manual InBody and session updates persisted. The current 03:55 edit shows this working core flow and actual non-admin denial. Supplied pre-existing account logins still fail; admin/aged-warning footage and original submission receipts remain pending.

## Feature matrix

| Feature | Classification | Current implementation / evidence | Production readiness, risk and demo treatment |
| --- | --- | --- | --- |
| 1. Production landing | READY WITH LIMITATIONS | User-supplied `https://fitsync-app-one.vercel.app`: HTTP 200 in fresh private browser; real hero/team/contact scenes recorded without browser errors | Public surface works; deployed SHA mapping and full workflow still unverified. Older documented origin remains 404 |
| 2. Login | READY WITH LIMITATIONS | Normal fresh-PT registration and trainee invitation produce working dedicated sessions. Supplied old demo sign-ins still reject | Actual sessions restored off-camera; admin login remains blocked |
| 3. PT Workspace | READY | Actual authenticated roster with two synthetic trainees, statuses, sessions and verified history recorded | Core working flow shown; this is not a release-SHA attestation |
| 4. Trainee creation/opening | READY | Two records created through actual UI/RPC; linked record opened on camera | Synthetic records only; no direct role or policy modification |
| 5. Invitation state | READY | Actual invitation accepted in a separate trainee context; another actual pending invitation shown | Connected/pending states recorded; raw token stays private/off-camera |
| 6. Trainee experience | READY | New linked trainee enters real workspace and sees records/check-in/history | Actual restored role session; no fixture-tour substitution |
| 7. Daily check-in | READY | Note and image submitted through actual form; fresh load confirms one daily record | Long upload wait cut between original input and verified saved result |
| 8. Meal upload/view | READY | Generated 2.68 MB PNG actually uploaded; trainee/PT display it. Signed read 200; unsigned public read denied | URL never shown/logged; generated asset provenance documented |
| 9. InBody history | READY WITH LIMITATIONS | Actual baseline and newly confirmed second record persist in PT history; trainee baseline view recorded | No historical progress/outcome claim from two synthetic same-day measurements |
| 10. Manual InBody | READY | Five values entered, checkbox explicitly confirmed, actual second record persisted on fresh load | No OCR success manufactured; original input and actual result footage retained |
| 11. OCR-assisted flow | PROTOTYPE | Review/correction/confirmation implemented; `createDefaultOcrAdapter()` returns unavailable. Deterministic adapter is test-only | Production extraction NOT READY. No production OCR success or quality claim; no synthetic adapter in recording |
| 12. Inactivity warning | READY WITH LIMITATIONS | `warningStartsOn(referenceDate)` adds four calendar dates in `Asia/Ho_Chi_Minh` | Seed distinct inactive trainee. Monday reference → Friday 00:00 after Tue/Wed/Thu fully elapse; do not describe as rolling 72 hours |
| 13. Contact/Zalo | READY WITH LIMITATIONS | Copy prepared message and intentional external Zalo link; no automatic send | Demonstrate copy and shortcut without opening real contact or sending anything |
| 14. Admin login | NOT READY | Supplied dedicated sign-in attempted off-camera and rejected by deployed app | Need corrected private demo input or valid dedicated browser state; never promote an account or bypass the guard |
| 15. Admin authorization | READY WITH LIMITATIONS | Real ordinary PT attempt redirects from `/admin` to `/workspace`, recorded | Positive admin-role access still unverified; source also checks role in page/layout/data |
| 16. Admin KPI | READY WITH LIMITATIONS | Only PT/trainee/InBody counts attempt privileged live queries; fall back to 4/12/15 with `synthetic` mode. Revenue, active rate, OCR usage synthetic | Retain exact disclosure and describe observed mode; server configuration needed for live counts |
| 17. Admin user table | PROTOTYPE | Explicit synthetic 4 PT + 12 trainee + 1 admin rows | Display with sample disclosure; not a live user-management system |
| 18. VietQR/sample transactions | PROTOTYPE | Three UI fixture transactions; no payment table, checkout, reconciliation or payment webhook | Sample data only; no real revenue/verified payment claim |
| 19. Non-admin `/admin` protection | READY | Actual authenticated PT denied and redirected, plus earlier anonymous production redirect and local browser test | Access-denial footage used in current edit; no admin-screen claim |
| 20. ERD/database architecture | READY WITH LIMITATIONS | Five migrations define eight public tables; supplied 1403×2048 JPG visually matches those entities and relationship outline | Draft overview/detail crop recorded. Asset omits external Auth identity/bucket/security annotations and is below final export brief width; reviewed PNG/PDF + view-only receipt and deployed DB recheck pending |

## Script discrepancies and honest treatment

1. Primary script names PR #26 and #28. Git history now contains #26 merge (`094c5ee`) and #29 reapplication of #28 (`e1b03ad`), rather than proof that #28 itself merged/reviewed. Preserve script; independent review equivalence and deployed SHA need explicit evidence.
2. `docs/HANDOFF.md` and `docs/oc2/STATUS.md` predate the present merge history. Their past CI/database counts are not results from this run. The old origin's 404 was independently reproduced, then superseded for this task by the user's working production URL.
3. Admin banner and transaction/user rows must stay visible. The live-count mode applies to three counts only; revenue, active-rate and OCR-use values remain synthetic. No real health/payment data was queried for this preparation.
4. The Android landing lists EAS, SecureStore, Android version/size and APK download, but no mobile workspace or APK asset is present in this checkout. The production APK path directly returned HTTP 404. These are unverified copy, not evidence of installable functionality. Contact hours/hotline/30-minute promise are also unverified. Draft capture retains an explicit Android limitation callout and masks non-demo contact details; no installation or support-performance claim is made in narration.
5. The exact warning condition is three **full intervening calendar days** in Vietnam, eligible on reference date +4. This matters when seeding warnings.
6. The script intentionally shows public team authors. Treat those names as public authorship, not as synthetic customers. Mask non-demo email/phone details elsewhere; every authenticated profile, health record, meal and transaction must be attested synthetic.

## Final visual submission gates

| Requirement | This session |
| --- | --- |
| Production 200 in a fresh private context | PASS: user-supplied production origin; documented older candidate still 404 |
| Independent review + production commit mapping | PENDING: #29 replaces #28; no review receipt or deployed SHA supplied |
| Five production migrations applied | HISTORICAL EVIDENCE: SUPABASE_PRODUCTION_EVIDENCE.md; not re-queried |
| Synthetic seed and dedicated PT/trainee/admin sessions | Fresh synthetic PT/linked trainee work through normal registration/invitation; supplied pre-existing accounts reject; admin session still unavailable |
| Reviewed Toàn ERD PNG/PDF + view-only link | Supplied JPG used for DRAFT; final-quality export/review/view-only receipt pending |
| Authenticated scenes and non-admin denial | Core PT/trainee scenes and real ordinary-PT denial/logout recorded; positive admin and aged-warning scenes unavailable |
| Full 255-second visual and complete privacy/visual review | 235-second workflow visual preview exported with explicit section 07/08 substitutions; original final-submission gates and human acceptance remain pending |
| Vietnamese human narration | EXPECTED LATER; do not synthesize |
| Upload/link playback verification | NOT AUTHORIZED / NOT EXECUTED |

Use [execution-report.md](execution-report.md) for checks actually run during this preparation. Renderer output metadata does not certify human privacy review.
