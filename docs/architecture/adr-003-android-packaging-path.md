# ADR 003: Android Packaging Path for Play Store

## Status
Narrowed by [ADR-004](adr-004-unified-coaching-timeline-and-mobile-client.md)

This ADR now covers only a short-term TWA evaluation for Android/Play evidence. It does not define the long-term FitSync mobile architecture. The approved long-term client is Expo/React Native for iOS and Android, with Next.js retained for the full PT web workspace.

## Context
As part of the M4 milestone (OC1), there is a course requirement to distribute the FitSync application via the Google Play Store. 
FitSync is currently built as a Next.js responsive web application utilizing server-side rendering (SSR), Supabase authentication (likely cookie-based for SSR), and server actions for mutations (e.g., InBody record creation). 

We must identify the **smallest viable Android packaging path** that satisfies Play Store policies while supporting our current technical requirements:
- **Authentication**: Managing Supabase sessions securely.
- **Server connectivity**: Connecting to Next.js server actions and API routes.
- **Camera/Upload**: Accessing the device camera for OCR uploads.
- **Build and Release**: Overhead of maintaining the Play Store pipeline.

We evaluated three primary paths: React Native (Expo), Capacitor, and Trusted Web Activity (TWA).

## Options Evaluated

### Option 1: Trusted Web Activity (TWA) / Bubblewrap
A TWA runs the existing hosted Next.js web application inside a full-screen, chromeless Chrome browser instance packaged as an Android APK/AAB.

- **Authentication & Connectivity**: Highly compatible. Since it renders the actual hosted website, Next.js Server Components, Server Actions, and cookie-based Supabase auth work seamlessly as they do in a desktop browser.
- **Camera/Upload**: Uses standard HTML5 `<input type="file" accept="image/*" capture="environment">`, which triggers the native Android camera.
- **Play Policy**: Google Play permits TWAs as long as the web app meets quality standards (responsive, functional, handles offline gracefully) and proves ownership via `.well-known/assetlinks.json`.
- **Effort (Smallest Viable)**: Very low. Requires no changes to the Next.js codebase other than a manifest file and asset links. Android build can be generated via Google's `bubblewrap` CLI or PWABuilder with minimal configuration.

### Option 2: Capacitor (Ionic)
Capacitor packages web assets into a native Android WebView. 

- **Authentication & Connectivity**: High friction. Capacitor requires Next.js to be statically exported (`output: 'export'`). This strictly forbids Next.js Server Actions, SSR, and API routes. We would have to heavily refactor FitSync into a pure Single Page Application (SPA) and decouple the Supabase backend.
- **Camera/Upload**: Requires native Capacitor plugins for camera access.
- **Play Policy**: Generally accepted for Play Store distribution.
- **Effort**: High. Requires significant architectural changes to our current Next.js "modular monolith" setup.

### Option 3: React Native (Expo)
Rebuilding the mobile application natively using Expo.

- **Authentication & Connectivity**: Requires using Supabase JS client directly on the native side.
- **Camera/Upload**: Native Expo Camera modules.
- **Play Policy**: Generally accepted and provides the highest quality native feel.
- **Effort**: Very High. Requires rewriting the entire UI and maintaining a parallel codebase (or setting up complex React Native Web configurations). Violates the "smallest viable path" constraint for the current milestone.

## Decision
We may evaluate Option 1: Trusted Web Activity (TWA) as the smallest short-term Android packaging candidate.

TWA preserves the current Next.js Server Actions and SSR architecture without requiring a large refactor. It may fulfill an early Play Store evidence requirement with minimal overhead. Chat, push notifications, secure mobile sessions, deep links, bounded offline retry, and the phone-first trainee experience remain responsibilities of the Expo client selected in ADR-004.

### Evidence Requirements & Next Steps
Before TWA can be confirmed as the final solution for OC1, the following evidence must be demonstrated:
1. **Lighthouse PWA Validation**: The Next.js app must pass baseline PWA requirements, specifically robust offline fallback behavior.
2. **Digital Asset Links Verification**: Host `assetlinks.json` on our domain and successfully verify ownership with the built APK/AAB.
3. **Hardware Integration Proof**: Conduct physical device testing to verify that `<input type="file" capture="environment">` correctly triggers the native camera within the TWA shell.
4. **Play Console Pipeline Proof**: Deploy the packaged TWA to the Play Store Internal Testing track. 

Only successful installation and camera verification from the Internal Testing track can establish TWA as evidence for the short-term Android packaging constraint. Do not present that result as proof that the long-term mobile companion is complete. `apps/mobile` is added only with its first Expo vertical slice; no empty mobile project is scaffolded.
