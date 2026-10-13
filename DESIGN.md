---
version: 4.0.0
name: FitSync Adaptive Interface
description: Calm, direct, adaptive interface system for a trust-sensitive Vietnamese coaching workspace. Warm neutral surfaces, restrained amber action color, system-led UI typography, honest state language, and accessible motion/material fallbacks.
colors:
  light-canvas: "#F7F4EE"
  light-surface: "#FFFEFA"
  light-surface-raised: "#FFFFFF"
  light-surface-muted: "#EEEAE2"
  light-text-primary: "#211F1B"
  light-text-secondary: "#554F46"
  light-text-muted: "#6B6358"
  light-border: "#C9C1B5"
  light-border-strong: "#82786B"
  light-brand: "#8A4F00"
  light-brand-hover: "#6E3E00"
  light-brand-soft: "#F5E4C7"
  light-on-brand: "#FFFFFF"
  light-success: "#217A4A"
  light-success-soft: "#E4F2E9"
  light-warning: "#805600"
  light-warning-soft: "#F8EBCB"
  light-danger: "#B42318"
  light-danger-soft: "#FBE8E5"
  light-on-danger: "#FFFFFF"
  dark-canvas: "#11110F"
  dark-surface: "#1C1B18"
  dark-surface-raised: "#26231F"
  dark-surface-muted: "#171613"
  dark-text-primary: "#F5F1E8"
  dark-text-secondary: "#CBC3B7"
  dark-text-muted: "#A79E91"
  dark-border: "#474139"
  dark-border-strong: "#81786B"
  dark-brand: "#F2A33A"
  dark-brand-hover: "#FFB85C"
  dark-brand-soft: "#332412"
  dark-on-brand: "#211406"
  dark-success: "#62CF8D"
  dark-success-soft: "#173323"
  dark-warning: "#F5BD55"
  dark-warning-soft: "#382B13"
  dark-danger: "#FF9389"
  dark-danger-soft: "#3B1D1A"
  dark-on-danger: "#21110F"
typography:
  display-lg:
    fontFamily: "Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 3.5rem
    fontWeight: 650
    lineHeight: 1.04
    letterSpacing: -0.035em
  display-md:
    fontFamily: "Space Grotesk, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 2.5rem
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: -0.025em
  heading-lg:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  heading-md:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 1.5rem
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: -0.015em
  heading-sm:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 1.125rem
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: -0.008em
  body-lg:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0em
  body-md:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.005em
  label-md:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 0.875rem
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: 0.005em
  label-sm:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: 0.012em
  data-md:
    fontFamily: "JetBrains Mono, SFMono-Regular, Consolas, monospace"
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0em
spacing:
  2xs: 0.25rem
  xs: 0.5rem
  sm: 0.75rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  3xl: 4rem
  section: 6rem
rounded:
  none: 0px
  sm: 0.375rem
  md: 0.625rem
  lg: 0.875rem
  xl: 1.25rem
  full: 9999px
components:
  button-primary-light:
    backgroundColor: "{colors.light-brand}"
    textColor: "{colors.light-on-brand}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 2.75rem
    padding: 0.75rem
  button-primary-dark:
    backgroundColor: "{colors.dark-brand}"
    textColor: "{colors.dark-on-brand}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 2.75rem
    padding: 0.75rem
  field-light:
    backgroundColor: "{colors.light-surface}"
    textColor: "{colors.light-text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 2.75rem
    padding: 0.75rem
  field-dark:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-text-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 2.75rem
    padding: 0.75rem
---

# FitSync Design Specification — Adaptive Interface v4.0

## Overview

FitSync is a mobile-first coaching workspace for independent Vietnamese PTs managing roughly 5–20 trainees. It should feel calm, precise, trustworthy, and physically responsive. It is not a fitness social network, a medical product, or an Apple website clone.

The interface follows eight priorities: purpose, agency, responsibility, familiarity, flexibility, simplicity, craft, and earned delight. Product truth and health-data legibility outrank decoration.

Design dials:

- `DESIGN_VARIANCE: 4/10` — preserve verified information architecture and brand recognition.
- `MOTION_INTENSITY: 3/10` — immediate task feedback, no ornamental motion.
- `VISUAL_DENSITY: 5/10` — efficient PT workflows with readable labels and progressive disclosure on phones.

The public tour remains visibly fixture-backed. The authenticated workspace remains real and role-aware. OCR remains an experimental, untrusted draft until a PT reviews, corrects, and explicitly confirms it.

### Carbon v3.1 reconciliation

| Carbon v3.1 rule | v4.0 decision | Reason |
|---|---|---|
| Dark-only anthracite canvas | Superseded by light, dark, and system themes | PTs use FitSync across bright and dark environments; accessibility needs both |
| Inter for all body/UI text | Superseded by the platform system stack | Faster, more native, and better matched to the approved direction |
| Space Grotesk for headings broadly | Narrowed to brand/display moments | Keeps continuity without making operational UI feel promotional |
| Amber `#F5A623` everywhere | Replaced by accessible theme-specific amber tokens | One hue cannot provide reliable contrast on both themes |
| Muted text `#5C5A55` | Removed | Audit ratios around 2.56–2.73:1 fail normal-text contrast |
| No `backdrop-filter` | Superseded only for functional floating navigation/sheets | Material may communicate hierarchy, but must have opaque fallbacks |
| Every section reveals on scroll | Removed | Mandatory entrance motion delays reading and conflicts with restraint |
| Hover scale/glow as default | Replaced by immediate press feedback and restrained hover | Pointer-down response matters more than decorative expansion |
| Grain overlay on every page | Removed from the foundation | Texture must not reduce health-data clarity or add paint cost |
| Monospace for every number | Narrowed to comparable metrics and tabular data | Dates and prose numbers should inherit readable UI typography |

## Colors

The warm-neutral light theme uses parchment canvas and ink text. The dark theme uses warm graphite rather than blue-black. CSS media queries follow `prefers-color-scheme`; explicit `data-theme="light|dark"` is allowed for future user preference controls.

- Primary, secondary, and muted text meet WCAG AA on their intended canvases.
- Strong control borders meet at least 3:1 against adjacent surfaces.
- Theme-specific brand colors remain amber but change luminance to retain contrast.
- Amber means primary action, active selection, or focus. It is not decorative wallpaper.
- Green, ochre, and red remain semantic success, warning, and danger colors.
- Never use status color alone; pair it with text, icon, or shape.

The legacy `--color-*` Carbon aliases remain temporarily available only to prevent unfinished route migrations. New work uses `--fs-*` semantic variables. Each later route issue removes its legacy dependencies.

## Typography

UI and body text use the platform system stack. Space Grotesk is reserved for the FitSync wordmark, selected landing display lines, and rare campaign-level statements. JetBrains Mono is reserved for side-by-side biometrics, prices, session counts, and other values where tabular comparison helps.

- Default body: 16px/1.5. Do not shrink operational text below 14px.
- Labels: 14px/1.35 with modest positive tracking.
- Large headings tighten leading and tracking as size increases.
- Use `rem`, `em`, and `clamp()` so browser zoom and larger text reflow naturally.
- Use `font-variant-numeric: tabular-nums` only for comparable data columns.
- Vietnamese diacritics must remain clear at every supported weight.

## Layout

- Base spacing is 4px; the primary rhythm is 8px.
- Touch targets are at least 44×44 CSS px even when the visible icon is smaller.
- Marketing can breathe; PT workspaces prioritize scanning and comparison; trainee mobile surfaces prioritize one clear action at a time.
- Desktop is not a stretched phone. Mobile is not a compressed desktop table.
- Prefer `100dvh` for viewport shells and include safe-area insets for fixed mobile chrome.
- Preserve information on mobile through compact secondary lines or disclosure; do not hide decision-critical counts.
- Main content has a stable skip-link target and one primary landmark.

## Elevation & Depth

Hierarchy comes first from spacing, tonal surfaces, and borders. Shadows are quiet and limited to floating layers.

- Cards do not automatically elevate on hover.
- Modal tasks use a scrim and one raised surface.
- Translucency is allowed only for functional floating navigation, toolbars, or sheets.
- `prefers-reduced-transparency: reduce` removes blur and uses opaque surfaces.
- `prefers-contrast: more` uses opaque surfaces, stronger borders, and more prominent focus rings.
- Content must remain legible when blur, animation, or advanced effects are unavailable.

## Shapes

- Controls use a sober 10px radius.
- Panels use 14px; large sheets may use 20px where the size communicates a separate layer.
- Pills are reserved for statuses, filters, and compact segmented controls.
- Avoid nested rounded-card soup. Prefer grouping by spacing and dividers.

## Components

### Button and icon button

- Minimum target: 44×44px.
- Primary actions use theme-specific amber with a tested foreground.
- Secondary actions use a strong border; ghost actions retain a visible hover/focus state.
- Press feedback begins on pointer-down with a restrained `scale(0.98)` and remains interruptible.
- Disabled state is conveyed by native `disabled`, reduced emphasis, and cursor behavior.
- Icon-only buttons require an accessible name.

### Field and file upload

- Every control has a persistent label.
- Hint and error text use stable IDs through `aria-describedby`; errors use `aria-invalid`.
- File upload names accepted formats and size limits before selection and exposes the selected filename.
- Focus uses a high-contrast outer ring, not only a border-color change.

### Alert and status

- `status` is polite; validation/fatal errors use `alert` only when interruption is warranted.
- Status color is paired with a heading or direct message.
- Copy states what happened and the next safe action.

### Dialog and sheet

- Initial focus enters the task, Tab/Shift+Tab remain inside, Escape dismisses when permitted, and focus returns to the trigger.
- Background scrolling is contained while a modal is open.
- Entry and exit share the same spatial path; ordinary dialogs use restrained opacity/translate transitions, not springs.
- Sheets may use translucent material only with opaque reduced-transparency and increased-contrast fallbacks.

### Empty, loading, recoverable error, and fatal error

- Empty states explain what belongs here and offer one truthful next step.
- Loading preserves layout where possible and never invents progress.
- Recoverable errors keep entered data and offer retry or fallback.
- Fatal errors provide a safe exit and do not expose internal details.

## Do's and Don'ts

### Do

- Keep Vietnamese product language natural and consistent.
- Preserve explicit real-data versus fixture-data labeling.
- Keep OCR labeled experimental and draft until confirmation.
- Use immediate press feedback, visible keyboard focus, and direct labels.
- Respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast`.
- Use local assets, Lucide icons, and existing dependencies unless a documented need proves otherwise.
- Keep Server Components as the default and isolate interactive client primitives.

### Don't

- Do not fabricate outcomes, customers, pricing, trials, OCR capability, Zalo automation, medical advice, or mobile-app availability.
- Do not use decorative glass, aurora/mesh gradients, fake device mockups, or mandatory page-entry animation.
- Do not use `transition-all`, looping bounce, or motion that locks input.
- Do not rely on hover or color alone.
- Do not hide critical PT decision data on mobile.
- Do not expose tokens, private paths, signed URLs, provider payloads, or real health information in UI evidence.
- Do not change authorization, RLS, server validation, domain rules, or database behavior for visual convenience.
