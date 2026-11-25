# FitSync Android U-01 Local Prototype (`mobile/`)

Scoped local Expo / React Native prototype for **U-01** (already-linked synthetic trainee signs in on Android, opens **Hôm nay**, submits a text check-in via `submit_daily_checkin`, and displays the saved record + server-confirmed Vietnam date; the assigned PT verifies the same note on web after reload).

This directory is intentionally isolated from the root npm workspace (`apps/*`) so Android dependencies and `mobile/package-lock.json` do not mutate `apps/web` or root lockfiles. It implements the local engineering decision in [`docs/architecture/adr-003-android-packaging-path.md`](../docs/architecture/adr-003-android-packaging-path.md) and does **not** claim GitHub issue #42 closure, MAD submission readiness, or production release readiness.

## Out of scope in U-01

- Meal photos / media uploads, camera permissions, deep links / App Links, trainee invite onboarding, voice intake, InBody OCR, calendar/chat tabs, EAS/cloud builds, signed release AAB, and hosted/production Supabase targets.

## Pinned toolchain & SDK requirements

| Requirement | Pinned / Verified Version | Notes |
| --- | --- | --- |
| Expo SDK | `58.0.26` | Verified via `npx expo install --check` and `npx expo prebuild --platform android` |
| React / React Native | `19.3.0` / `0.88.1` | Official Expo SDK 58 versions |
| Node.js / npm | Node `>=22.13` / `24.3+` / `26+` (tested on `v26.13.1`, npm `11.20.0`) | Matches `expo@58.0.26` `engines.node` |
| JDK | **JDK 17** | Required by Gradle `9.4.1` and AGP 9 |
| Gradle | `9.4.1` | Managed by prebuilt `mobile/android/gradle/wrapper/gradle-wrapper.properties` |
| Android Compile / Target / Min SDK | `compileSdk 37`, `targetSdk 36`, `minSdk 24` | Install `platforms;android-37` |
| Android Build Tools | `37.0.0` | Install `build-tools;37.0.0` |
| Android NDK | `27.1.12297006` | Install `ndk;27.1.12297006` |
| Android Platform Tools | Latest `platform-tools` | Provides `adb` and USB `adb reverse` |
| Android Application ID | `com.safetrail.fitsync.debug` | Local debug-only package |

## Security & backend boundary

- **Single Supabase client** (`src/lib/supabase.ts`) using caller session only (`@supabase/supabase-js@2.100.0`, matching `apps/web`).
- **Platform-backed session storage** (`src/lib/secure-storage.ts`) wrapping `expo-secure-store` (Android Keystore-backed) with UTF-8 byte-safe chunking below 2048 bytes and `AppState`-aware token auto-refresh.
- **Debug-only loopback target** (`src/lib/config.ts` + `plugins/withDebugLoopbackNetworkConfig.js`):
  - Only `http://127.0.0.1:<port>` or `http://localhost:<port>` is permitted in debug builds (`__DEV__ === true`).
  - No hosted fallback, no LAN HTTP, and no `service_role` / `sb_secret_` keys accepted.
  - Main/release Android manifest enforces `cleartextTrafficPermitted="false"`; only the Android `debug` resource overlay permits cleartext to `127.0.0.1` and `localhost`.
- **Direct RLS + RPC contract** (no Next.js Server Actions, no schema changes):
  - Reads own `profiles`, own `trainee_profiles`, own `checkins`, and calls `get_assigned_coach_identity()`.
  - Writes check-ins exclusively through `submit_daily_checkin(checkin_note)` using the caller's JWT.
  - Matches PostgreSQL note validation (`nullif(trim(checkin_note), '')` trimming only ASCII space `0x20`, UTF-8 Unicode scalar `char_length <= 500`, rejecting NUL bytes).
  - On unknown submission outcome, reads the original Vietnam day first before any retry; if the Vietnam day rolled over, never silently submits the original draft to the new day and requires explicit new-day confirmation.

## Local setup & checks (JS/TS + prebuild)

```powershell
cd mobile
npm.cmd install
npm.cmd run check:deps
npm.cmd run typecheck
npm.cmd test
```

## Building and installing the local debug APK (coordinator / Android host)

1. Ensure the isolated local FitSync web + Supabase stack is running on the host (from repo root, see [`docs/DEMO_WORKFLOW.md`](../docs/DEMO_WORKFLOW.md)):
   ```powershell
   npm.cmd run demo:plan
   npm.cmd run demo:prepare
   npm.cmd run demo:start
   ```
   Retrieve the local Supabase **anon** key (never `service_role`) from the local Supabase runtime status.

2. Create `mobile/.env.local` from `mobile/.env.example`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<local-supabase-anon-key>
   ```

3. Export `JAVA_HOME` (JDK 17) and `ANDROID_HOME` (with `platforms;android-37`, `build-tools;37.0.0`, `ndk;27.1.12297006`, `platform-tools`), then prebuild and assemble the debug APK:
   ```powershell
   cd mobile
   npx.cmd expo prebuild --platform android --clean
   Push-Location android
   .\gradlew.bat assembleDebug
   Pop-Location
   ```
   Output APK path: `mobile/android/app/build/outputs/apk/debug/app-debug.apk`.

4. Start an Android emulator with an ABI-matched debug APK, or connect a physical Android device with USB debugging. Pick its serial from `adb devices -l`, then set up loopback and run Metro:
   ```powershell
   adb devices -l
   $serial = 'emulator-5554' # Replace with the serial shown by adb.
   adb -s $serial reverse tcp:54321 tcp:54321
   adb -s $serial reverse tcp:8081 tcp:8081
   adb -s $serial install -r mobile\android\app\build\outputs\apk\debug\app-debug.apk
   cd mobile
   npx.cmd expo start --localhost --port 8081
   ```
   *(If building a standalone debug APK without Metro, bundle JS with `android/app/build.gradle` or use `npx.cmd expo run:android --no-bundler` after bundling; keep `adb reverse tcp:54321 tcp:54321` active for Supabase loopback.)*

The verified Windows build used SDK package `platforms;android-37.0`, short paths for the checkout, Gradle cache and SDK, and a CMake object-path limit of 220 in the generated Android project's app CMake arguments. This was a temporary build workaround for Windows Ninja path limits. An x86_64 emulator uses an APK built with `-PreactNativeArchitectures=x86_64`. Issue #42 retains its separate physical-device acceptance.

## Reproducing U-01 Android check-in → PT web readback

1. **Prepare a linked synthetic pair on local web (`http://127.0.0.1:3000`):**
   - Use a seeded synthetic PT + linked trainee account from the local demo runtime (or register a new synthetic PT on `/register`, create a synthetic trainee, copy the invite link, and accept it in a separate browser profile so the trainee account is linked).
   - Confirm the trainee has not yet checked in for today's Vietnam date (`Asia/Ho_Chi_Minh`).
2. **Sign in & submit on Android:**
   - Launch **FitSync** on the USB-connected Android device.
   - Verify invalid credentials show an inline form error.
   - Sign in with the linked synthetic trainee account. Confirm **Hôm nay** shows the trainee's display name, assigned PT name, session balance, Vietnam date, and **Check-in hôm nay** due.
   - Tap **Check-in hôm nay**, enter a synthetic Vietnamese note (e.g. `Hoàn thành buổi chân, năng lượng tốt`), and tap **Gửi check-in**.
   - Confirm the confirmation screen displays the saved note and the server-confirmed Vietnam date, then return to **Hôm nay** and confirm **Đã check-in hôm nay** appears.
3. **Verify PT web readback:**
   - Open `http://127.0.0.1:3000` signed in as the assigned PT.
   - Open the trainee's dossier (`/workspace/trainees/<traineeId>`) and hard-reload the page.
   - Confirm the exact check-in note and Vietnam local date submitted on Android appear in the trainee's check-in activity list.
4. **Verify boundary and failure cases:**
   - **Retry / `already_submitted`**: Attempting another submission for the same Vietnam day displays the existing saved row and explicitly warns if revised text was not applied.
   - **Sign-out & non-trainee / unlinked / archived**: Signing in as a PT shows the non-trainee screen; an unlinked trainee shows the unlinked screen; an archived trainee shows the archived screen with no check-in button; signing out clears the SecureStore session and returns to Sign-in.
   - **Isolation**: Sign in on web as an unrelated synthetic PT and confirm that trainee's dossier/check-in cannot be read.
