# ADR 003: Android Packaging Path

## Status

Accepted for the local U-01 engineering baseline on 2026-11-25. Issue #42 remains blocked in GitHub pending team dependency and implementation-scope confirmation. The official MAD submission format has not been verified.

## Context

FitSync already has a responsive Next.js web app and a shared backend on Supabase. The core local web journey U-00 passed on draft PR #48 at commit `42573348bfe73ce2ee088b3cb2b7e97b8b31d1f1`. Android U-01 should verify that a second client can read and write through the same backend while preserving the PT–trainee access boundary. It must be testable on a physical phone with synthetic data and the isolated local stack.

The former OC1 proposal prioritized a Trusted Web Activity to package the hosted website. Its Play track and hosted Digital Asset Links goals are historical context. The current EXE201 web decision and this engineering choice leave MAD submission rules open. [Issue #24](https://github.com/Team-SafeTrail/fitsync-app/issues/24) · [Draft PR #48](https://github.com/Team-SafeTrail/fitsync-app/pull/48)

## Decision

Use **Expo with React Native** for the native Android U-01 slice. Build an installable local debug APK and test it on a physical Android device against the pinned local candidate. Use the version-matched local JDK, Android SDK and platform tools. Connect the phone by USB with a loopback-only route to the dedicated local API. Keep any local HTTP allowance debug-only. Record the exact build and install commands in the handoff after verification. [Expo local Android builds](https://docs.expo.dev/guides/local-app-development/)

Native is the better fit for the desired separate client, local hardware verification, and later camera and voice intake. It also carries a second build and UI maintenance cost. A TWA would reuse the hosted web experience but full TWA verification requires a hosted origin and matching Digital Asset Links. Capacitor remains a possible web-wrapper option and would still need a hosted server or a separate client architecture for FitSync's server-rendered web flows. [Trusted Web Activity verification](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start)

## Issue #42 scope for team confirmation

- Use the PR #48 commit above for the **local U-01 test backend**. This does not accept it as a release or production baseline.
- Build only the linked trainee path. Sign in, open Today, see whether today's check-in is due, send one text note, and see the server-confirmed record. The assigned PT opens the web dossier and sees that same note after reload.
- Use an approved versioned mobile contract over existing auth, permitted reads and `submit_daily_checkin`. Keep service credentials server-side and use the existing row-level security boundary. Next.js Server Actions are web entry points.
- After an unknown submission result, check the original Vietnam day before retrying. A new day requires an explicit new-day submission. For `already_submitted`, show the saved row and tell the user if changed text was not saved. The returned date is authoritative.
- Keep photos, invite App Links, guided onboarding, voice, multi-brand report OCR, store distribution and production rollout in follow-up work. The existing web flow handles synthetic account creation and invitation acceptance for this spike.

## Acceptance and release gates

1. Install the debug APK on a physical Android device. Record device, OS, APK/build ID, repo SHA and migration revision.
2. An already-linked synthetic trainee signs in, can open Today, and submits a text check-in. The assigned PT sees the same saved note after reloading the web dossier.
3. A network retry produces at most one record for the original Vietnam day and preserves the draft when the result is unknown. Verify date rollover, sign-out and denial for an unrelated synthetic account.
4. Before treating #42 as ready for implementation, confirm the narrower scope and dependencies with the team. Verify the official MAD rubric before claiming that the local APK meets submission requirements. A signed AAB or Play track, if requested by the rubric, is a separate deliverable.

## Decision history

The previous version of this ADR proposed evaluating a TWA for OC1 and listed a hosted domain, Digital Asset Links, camera testing, and Play Internal Testing as its evidence. The original proposal remains available in Git history.
