---
version: 3.0.0
name: FitSync Carbon Interface
description: Dark data-forward design system for FitSync. Rich anthracite background, amber-gold accent, warm ivory typography, oversized hero type, asymmetric layouts, scroll-driven animations. Premium health-tech aesthetic that communicates trust and technical capability.
colors:
  background: "#0E0E12"
  surface: "#18181D"
  surface_elevated: "#1F1F25"
  surface_muted: "#13131A"
  border: "#28282E"
  border_strong: "#3A3A42"
  border_accent: "rgba(245, 166, 35, 0.2)"
  text_primary: "#ECEAE6"
  text_secondary: "#9A968F"
  text_muted: "#5C5A55"
  primary: "#F5A623"
  primary_hover: "#FFB83D"
  primary_light: "rgba(245, 166, 35, 0.1)"
  primary_foreground: "#0E0E12"
  accent: "#34D399"
  accent_light: "rgba(52, 211, 153, 0.1)"
  success: "#34D399"
  success_light: "rgba(52, 211, 153, 0.08)"
  warning: "#F59E0B"
  warning_light: "rgba(245, 158, 11, 0.08)"
  destructive: "#EF4444"
  destructive_light: "rgba(239, 68, 68, 0.08)"
  glow_primary: "rgba(245, 166, 35, 0.05)"
  glow_accent: "rgba(52, 211, 153, 0.05)"
typography:
  font_family_display: "'Space Grotesk', 'Inter', sans-serif"
  font_family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font_family_mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace"
  headings:
    hero: { size: "clamp(40px, 7vw, 72px)", weight: 700, line_height: 1.05, letter_spacing: "-0.04em" }
    h1: { size: "36px", weight: 700, line_height: "44px", letter_spacing: "-0.03em" }
    h2: { size: "28px", weight: 700, line_height: "36px", letter_spacing: "-0.025em" }
    h3: { size: "20px", weight: 600, line_height: "28px", letter_spacing: "-0.015em" }
    h4: { size: "16px", weight: 600, line_height: "24px", letter_spacing: "-0.01em" }
  body:
    base: { size: "15px", weight: 400, line_height: "24px" }
    medium: { size: "15px", weight: 500, line_height: "24px" }
    small: { size: "13px", weight: 400, line_height: "20px" }
    small_medium: { size: "13px", weight: 500, line_height: "20px" }
    caption: { size: "11px", weight: 700, line_height: "14px", text_transform: "uppercase", letter_spacing: "0.08em" }
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "96px"
rounded:
  none: "0px"
  sm: "4px"
  base: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
shadows:
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)"
  sm: "0 2px 4px 0 rgba(0, 0, 0, 0.25)"
  md: "0 4px 12px -2px rgba(0, 0, 0, 0.3)"
  lg: "0 8px 24px -4px rgba(0, 0, 0, 0.4)"
  glow: "0 0 40px rgba(245, 166, 35, 0.08)"
  glow_accent: "0 0 30px rgba(52, 211, 153, 0.06)"
---

# FitSync Design Specification — Carbon Interface v2.0

> **Design Theme:** Carbon Interface — Dark Data-Forward
> **Aesthetic Philosophy:** Premium warmth via amber-gold on dark anthracite. Oversized typography-first hero. Asymmetric layouts. Scroll-driven reveals. Product-led composition, readable contrast, and locally served editorial imagery.
> **Benchmark Invocations:** Linear.app (density), Vercel.com (dark craft), Stripe Terminal (data aesthetic), Raycast (warm dark).

---

## 1. Overview & Core Design Principles

1. **Dark ≠ Gloomy:** Rich anthracite `#0E0E12` with warm undertones — never cold blue-black or pure `#000000`. The warmth comes from amber accents and off-white ivory text.
2. **Product and people lead:** Pair strong Space Grotesk headings with readable, interactive sample product views and editorial coaching imagery. Mark generated illustrations and sample data honestly.
3. **Amber Gold as Trust Signal:** `#F5A623` conveys warmth, trustworthiness, and premium quality — appropriate for a health-data platform. Reserved for CTAs, active states, and data highlights.
4. **Depth Without Blur:** Grain texture overlays, subtle radial glows at 5% opacity, and elevation through border + shadow — never `backdrop-filter: blur()`.
5. **Motion as Narrative:** Scroll-driven CSS animations (GPU-accelerated) with spring easing. Every section reveals on scroll. `prefers-reduced-motion` always respected.

---

## 2. Color System & Semantic Usage

### 2.1 Backgrounds & Surfaces
* **Base Background (`#0E0E12`):** The foundational anthracite. All pages start here.
* **Surface (`#18181D`):** Card backgrounds, modal surfaces, input fields.
* **Surface Elevated (`#1F1F25`):** Hovered cards, active states, dropdown menus.
* **Surface Muted (`#13131A`):** Subtle recessed areas, code blocks, OCR terminal view.
* **Border Default (`#28282E`):** 1px crisp dividers between cards and sections.
* **Border Strong (`#3A3A42`):** Active input borders, focused elements.
* **Border Accent (`rgba(245, 166, 35, 0.2)`):** Highlighted/recommended card borders.

### 2.2 Brand & Interaction Accents
* **Amber Gold (`#F5A623`):** The signature accent. Used for primary CTAs, active indicators, progress bars, slider thumbs, and key metric highlights.
* **Amber Hover (`#FFB83D`):** Immediate interactive feedback.
* **Amber Glow (`rgba(245, 166, 35, 0.05)`):** Subtle radial behind hero headline and recommended pricing card.
* **Seafoam (`#34D399`):** Health metrics, biometric data, success states, feature checkmarks.

### 2.3 Semantic Status Colors
* **Success (`#34D399`):** Healthy/compliant. BG: `rgba(52, 211, 153, 0.08)`.
* **Warning (`#F59E0B`):** Attention needed. BG: `rgba(245, 158, 11, 0.08)`.
* **Destructive (`#EF4444`):** Critical/error. BG: `rgba(239, 68, 68, 0.08)`.

### 2.4 Text Hierarchy
* **Primary (`#ECEAE6`):** Warm ivory. Headlines and body text. Never pure `#FFFFFF`.
* **Secondary (`#9A968F`):** Warm mid-gray. Subtitles, descriptions, labels.
* **Muted (`#5C5A55`):** Low-emphasis. Captions, timestamps, tertiary info.

---

## 3. Typography

### 3.1 Font Stack
* **Display / Headlines:** Space Grotesk (Google Fonts) — tech-forward, geometric, sharp character.
* **Body / UI:** Inter — crisp, professional, excellent tabular numerals.
* **Monospace / Data:** JetBrains Mono — for pricing, metrics, biometric values.

### 3.2 Scale
```
Hero:  clamp(40px,7vw,72px) / 1.05  | Bold (700)   | Page Hero Headline
H1:   36px / 44px                   | Bold (700)    | Section Headers
H2:   28px / 36px                   | Bold (700)    | Card Titles
H3:   20px / 28px                   | SemiBold (600)| Subsections
H4:   16px / 24px                   | SemiBold (600)| Small Headers
Body: 15px / 24px                   | Regular (400) | Standard Body
Small:13px / 20px                   | Medium (500)  | Labels, Meta
Cap:  11px / 14px                   | Bold (700) UC | Section Tags, Badges
Mono: 14px / 20px                   | SemiBold (600)| Metrics, Prices, Data
```

---

## 4. Layout Architecture

### 4.1 Landing Page Flow
```
┌─────────────────────────────────────────────────────┐
│ STICKY NAV: Dark transparent → solid on scroll      │
│ FitSync ⚡ | Features  Demo  ROI  Pricing | CTA    │
├─────────────────────────────────────────────────────┤
│ HERO: Oversized headline + subtitle + CTAs          │
│ + Interactive sample coach and client workspace   │
│ + Subtle radial amber glow behind headline          │
├─────────────────────────────────────────────────────┤
│ FEATURES: Asymmetric triptych (45% | 30% | 25%)    │
│ Staggered scroll-reveal, hover glow borders         │
├─────────────────────────────────────────────────────┤
│ OCR DEMO: Terminal-style processing visualization   │
│ Split-panel results, editable fields with amber     │
├─────────────────────────────────────────────────────┤
│ ROI CALCULATOR: Amber slider, animated counters     │
│ Full-width dark card with comparison bar             │
├─────────────────────────────────────────────────────┤
│ PRICING: 3 cards, recommended has amber glow border │
│ VietQR modal (dark themed)                          │
├─────────────────────────────────────────────────────┤
│ FOOTER: Minimal dark, FitSync branding              │
└─────────────────────────────────────────────────────┘
```

### 4.2 Max Widths & Spacing
* **Container:** `max-width: 1200px` with `padding: 0 24px`
* **Section padding:** `96px 0` (desktop) / `64px 0` (mobile)
* **Card padding:** `24px` (desktop) / `20px` (mobile)
* **Card gap:** `20px`

---

## 5. UI Component Specifications

### 5.1 Primary Buttons
* **Base:** Background `#F5A623`, Text `#0E0E12`, Border-radius `8px`, Height `44px`, Padding `0 24px`, Font `15px SemiBold`.
* **Hover:** Background `#FFB83D`, Box-shadow `0 0 20px rgba(245, 166, 35, 0.15)`.
* **Focus:** `2px outline #F5A623`, offset `2px`.
* **Disabled:** Background `#28282E`, Text `#5C5A55`, Cursor `not-allowed`.

### 5.2 Secondary / Ghost Buttons
* **Base:** Background `transparent`, Text `#ECEAE6`, Border `1px solid #3A3A42`, Height `44px`, Padding `0 24px`, Border-radius `8px`.
* **Hover:** Background `#1F1F25`, Border-color `#5C5A55`.

### 5.3 Cards (Landing Page)
* **Base:** Background `#18181D`, Border `1px solid #28282E`, Border-radius `12px`, Padding `24px`.
* **Hover:** Border-color `#3A3A42`, Box-shadow `0 4px 12px -2px rgba(0,0,0,0.3)`.
* **Highlighted:** Border `1px solid rgba(245, 166, 35, 0.3)`, Box-shadow `0 0 40px rgba(245, 166, 35, 0.06)`.

### 5.4 Input Fields
* **Base:** Background `#13131A`, Border `1px solid #28282E`, Border-radius `8px`, Height `44px`, Color `#ECEAE6`.
* **Focus:** Border-color `#F5A623`, Box-shadow `0 0 0 2px rgba(245, 166, 35, 0.1)`.
* **Placeholder:** Color `#5C5A55`.

### 5.5 Section Tags (Captions)
* **Style:** `11px`, `700 weight`, `uppercase`, `0.08em letter-spacing`, Color `#F5A623`.

### 5.6 Status Badges
* **Pill:** Height `24px`, Padding `4px 10px`, Rounded `9999px`, Font `11px SemiBold`.
* **Success:** Text `#34D399`, BG `rgba(52, 211, 153, 0.1)`, Border `1px solid rgba(52, 211, 153, 0.2)`.
* **Warning:** Text `#F59E0B`, BG `rgba(245, 158, 11, 0.1)`, Border `1px solid rgba(245, 158, 11, 0.2)`.
* **Destructive:** Text `#EF4444`, BG `rgba(239, 68, 68, 0.1)`, Border `1px solid rgba(239, 68, 68, 0.2)`.

---

## 6. Animation & Motion System

### 6.1 Scroll-Driven Reveals
```css
.reveal {
  animation: revealUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 6.2 Staggered Reveals
Children use `animation-delay` at `150ms` intervals for triptych/pricing cards.

### 6.3 Micro-Interactions
* **Button hover:** `scale(1.02)` + subtle glow, `0.2s ease-out`
* **Card hover:** border-color transition + elevation increase, `0.25s ease`
* **Slider interaction:** thumb scales up, track fills with amber gradient
* **Number counters:** CSS `@property` animated count-up on viewport entry

### 6.4 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Strict Do's and Don'ts

### ❌ Strict Don'ts (Banned Patterns)
* **NO Pure White Background:** Do not use `#FFFFFF` as any section background.
* **NO Purple/Violet:** No `#8B5CF6`, no indigo, no magenta. Not even as a subtle tint.
* **NO Glassmorphism:** Do not use `backdrop-filter: blur()` on any landing page element.
* **Asset integrity:** Use local product captures or functional sample views. Coaching imagery may be original or generated editorial illustration, never presented as a customer endorsement.
* **NO Equal-Width Feature Cards:** The 3-column equal grid is a template trap. Use asymmetric widths.
* **NO Cold Blue-Black Background:** Background must be warm-tinted anthracite, never cold.
* **NO Mesh/Aurora Gradients:** No floating colored blobs.

### ✅ Strict Do's
* **DO Use Warm Ivory Text:** `#ECEAE6` for primary text, never pure `#FFFFFF`.
* **DO Add Grain Texture:** Subtle noise overlay at 3-5% opacity for tactile depth.
* **DO Animate on Scroll:** Every section must reveal with scroll-driven animation.
* **DO Use Amber for Focus States:** All interactive focus indicators use the amber accent.
* **DO Support `prefers-reduced-motion`:** All animations must be disabled for accessibility.
* **DO Use Monospace for Data:** All numbers, prices, and biometric values in JetBrains Mono.


## Landing implementation v3

The 2026-09-27 research report guides this revision. The marketing page uses scoped `.fs-landing` styles so dashboard styling is preserved. Keep charcoal and amber, 1240px containers, 20px mobile gutters, 44–80px responsive display type, and 16–18px marketing body copy. Use a substantial interactive sample workspace in the hero, a Scan → Review → Coach workflow, editorial coaching imagery, distinct coach/client feature compositions, transparent proposed pricing, an assumption-based time estimator, native FAQ disclosures, and sample-dashboard CTAs. Green is semantic status only. Existing fonts and Lucide icons remain.

All marketing copy is Vietnamese. The public primary action is “Khám phá bản mẫu” linking to the clearly labeled fixture-backed `/app/dashboard`; this does not create accounts or imply live onboarding. “Tạo workspace PT” is the secondary activation path linking to `/register`. OCR uses clearly labeled local fixtures. Do not show payment QR codes, invented customer proof, unsupported accuracy claims, or fake submission success.

Research evidence must show its denominator and describe the source as survey submissions, never customers or verified coaches. Publish aggregate counts only unless a separate consent record explicitly permits a named quotation, image, or testimonial. Survey evidence establishes the problem; it does not establish product outcomes.

Use CSS for control transitions and a short initial entrance, with reduced-motion support. Content remains visible without animation. Images require responsive sizes and dimensions. Interactive previews are working, accessible sample UI rather than screenshots of nonexistent capabilities.
