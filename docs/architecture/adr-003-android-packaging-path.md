# ADR 003: Android Packaging Path for Play Store

## Status
Proposed

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

## Recommendation
**We recommend Option 1: Trusted Web Activity (TWA)**.

It is the only path that preserves our Next.js Server Actions and SSR architecture without requiring a massive refactor. It fulfills the Play Store distribution requirement with minimal overhead, allowing the team to focus entirely on the OCR business logic and product quality rather than native mobile bridging.

### Implementation Implications
If approved, the delivery path will be:
1. Ensure the Next.js app passes Lighthouse PWA requirements, especially robust offline/failure behavior for the web app.
2. Host `assetlinks.json` on our domain (Digital Asset Links) and complete app signing for TWA verification.
3. Prepare Play Store listings including Privacy Policy and Google Play Data Safety forms.
4. Conduct physical device testing to verify camera uploads and viewport behaviors.
5. Provide testing-track evidence (Internal/Closed Testing releases) before determining that TWA fully satisfies OC1 constraints.
6. Submit to Google Play Console for review.

No empty Expo, Capacitor, or Flutter projects will be scaffolded.
