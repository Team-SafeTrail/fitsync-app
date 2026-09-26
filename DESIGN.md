---
version: 1.0.0
name: FitSync Enterprise Precision
description: Clean, high-density, professional enterprise B2B design system for FitSync. Pure white background, razor-sharp borders, zero AI-slop gradients, focused on institutional data clarity and fitness CRM operations.
colors:
  background: "#FFFFFF"
  canvas: "#F8FAFC"
  surface: "#FFFFFF"
  surface_muted: "#F1F5F9"
  border: "#E2E8F0"
  border_strong: "#CBD5E1"
  text_primary: "#0F172A"
  text_secondary: "#475569"
  text_muted: "#94A3B8"
  primary: "#1E40AF"
  primary_hover: "#1D4ED8"
  primary_light: "#EFF6FF"
  primary_foreground: "#FFFFFF"
  accent: "#0F766E"
  accent_light: "#F0FDFA"
  success: "#15803D"
  success_light: "#F0FDF4"
  warning: "#B45309"
  warning_light: "#FFFBEB"
  destructive: "#B91C1C"
  destructive_light: "#FEF2F2"
typography:
  font_family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font_family_mono: "'JetBrains Mono', 'SF Mono', Consolas, monospace"
  headings:
    h1: { size: "28px", weight: 700, line_height: "36px", letter_spacing: "-0.02em" }
    h2: { size: "22px", weight: 600, line_height: "28px", letter_spacing: "-0.015em" }
    h3: { size: "18px", weight: 600, line_height: "24px", letter_spacing: "-0.01em" }
    h4: { size: "15px", weight: 600, line_height: "20px", letter_spacing: "-0.005em" }
  body:
    base: { size: "14px", weight: 400, line_height: "20px" }
    medium: { size: "14px", weight: 500, line_height: "20px" }
    small: { size: "12px", weight: 400, line_height: "16px" }
    small_medium: { size: "12px", weight: 500, line_height: "16px" }
    caption: { size: "11px", weight: 500, line_height: "14px", text_transform: "uppercase", letter_spacing: "0.05em" }
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
rounded:
  sm: "4px"
  base: "6px"
  md: "8px"
  lg: "10px"
  full: "9999px"
shadows:
  xs: "0 1px 2px 0 rgba(15, 23, 42, 0.05)"
  sm: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)"
  md: "0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07)"
  dropdown: "0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)"
---

# FitSync Design Specification (DESIGN.md)

> **Design Theme:** Enterprise Precision & Institutional Health CRM  
> **Aesthetic Philosophy:** Clean White Background, High Information Density, Zero Gradients, Zero "AI-Slop" Tropes.  
> **Benchmark Invocations:** Stripe Dashboard, Linear, Epic Systems, Vercel Enterprise.

---

## 1. Overview & Core Design Principles

1. **Enterprise Pragmatism over Flash:** No iridescent purple gradients, no fuzzy glassmorphism, no dark gamer themes. FitSync is a serious operational tool used by fitness professionals to run their livelihood and manage human biometric health data.
2. **High-Contrast Readability:** Built on a pure white (`#FFFFFF`) and slate canvas (`#F8FAFC`). Crisp charcoal/slate typography (`#0F172A`) ensures rapid scanning on gym laptops under glaring overhead lights and on mobile screens on gym floors.
3. **Data Density & Structural Hierarchy:** Information is structured in disciplined grid cells, high-clarity data tables, and bordered cards with micro 1px borders (`#E2E8F0`).
4. **Color as Semantic Function, Not Decoration:** Blue is used strictly for primary action anchors; Forest Teal for health metrics; Green, Amber, and Red for unambiguous compliance states.

---

## 2. Color System & Semantic Usage

### 2.1 Backgrounds & Surfaces
* **Canvas Background (`#F8FAFC`):** The neutral, soft-gray foundational backdrop of the web application.
* **Surface White (`#FFFFFF`):** High-priority operational cards, tables, modals, and input fields.
* **Surface Muted (`#F1F5F9`):** Table header strips, inactive pill buttons, badge backgrounds.
* **Border Default (`#E2E8F0`):** Crisp 1px division between all cards, columns, and data rows.
* **Border Strong (`#CBD5E1`):** Active input field borders, selected table row outlines.

### 2.2 Brand & Interaction Accents
* **Primary Enterprise Blue (`#1E40AF`):** The signature primary color. Represents stability, medical trustworthiness, and SaaS rigor. Used for primary CTAs, active tab indicators, and key metric charts.
* **Primary Hover (`#1D4ED8`):** Immediate interactive feedback on hover.
* **Primary Light Surface (`#EFF6FF`):** Background for selected items, active navigation links, and info callouts.
* **Clinical Teal (`#0F766E`):** Secondary accent for biometric data (e.g. Muscle Mass, Lean Body Mass).

### 2.3 Semantic Status Colors
* **Compliant / Healthy (`#15803D`, BG: `#F0FDF4`, Border: `#BBF7D0`):** Daily check-in complete, macro target achieved, active package.
* **Warning / Alert (`#B45309`, BG: `#FFFBEB`, Border: `#FDE68A`):** $\ge 3$ days without check-in, package below 3 sessions remaining.
* **Critical / Non-Compliant (`#B91C1C`, BG: `#FEF2F2`, Border: `#FECACA`):** Package expired, urgent coach action needed.

---

## 3. Typography: Inter Sans

Typography is standard enterprise `Inter`, loaded via Google Fonts. All text rendering uses antialiasing and tight tabular numerals for financial and biometric alignment.

```
H1:  28px / 36px | Bold (700)      | Page Headers (e.g. "Client Roster")
H2:  22px / 28px | SemiBold (600)  | Card Titles, Section Headers
H3:  18px / 24px | SemiBold (600)  | Subsections, Metric Numbers
H4:  15px / 20px | SemiBold (600)  | Table Column Groups, Modal Titles
Body:14px / 20px | Regular (400)   | Standard Body, Inputs, Table Cells
Sub: 12px / 16px | Medium (500)    | Meta information, timestamps, tooltips
Cap: 11px / 14px | Bold (700) Uppercase | Table Headers, Status Badges
```

---

## 4. Layout Architecture: Desktop CRM vs Mobile PWA

```
DESKTOP VIEW (1920x1080 - 1280x720)              MOBILE PWA VIEW (375x812)
┌──────────┬─────────────────────────────┐       ┌────────────────────────┐
│ SideNav  │ TopBar: Search, PT Profile  │       │ TopBar: FitSync [Alert]│
│ (240px)  ├─────────────────────────────┤       ├────────────────────────┤
│          │ KPI Metric Strip (4 Cards)  │       │ Today's Compliance     │
│ • Home   ├──────────────┬──────────────┤       │ [85% Targets Met]      │
│ • Clients│ Client Table │ Quick InBody │       ├────────────────────────┤
│ • Scans  │ (Roster,     │ OCR Upload & │       │ Client Alerts (2)      │
│ • Meals  │  Compliance, │ Verification │       ├────────────────────────┤
│ • Finance│  Sessions)   │ Drawer       │       │ InBody Quick Scan CTA  │
│          │              │              │       ├────────────────────────┤
│          │              │              │       │ Bottom Nav Bar (54px)  │
└──────────┴──────────────┴──────────────┘       │ [Home] [Clients] [Scan]│
                                                 └────────────────────────┘
```

* **Desktop View (PT Focus):** Persistent 240px left-sidebar navigation, top breadcrumb bar, multi-column workspace designed to manage 20+ clients simultaneously without horizontal scrolling.
* **Mobile PWA View (PT on Floor & Trainee):** High-density vertical card stack, 54px fixed bottom navigation bar with large thumb-friendly touch targets ($\ge 44\text{px}$).

---

## 5. UI Component Specifications

### 5.1 Primary Buttons
* **Base Style:** Background `#1E40AF`, Text `#FFFFFF`, Border-radius `6px`, Height `38px`, Padding `0 16px`, Font `14px SemiBold`.
* **Hover:** Background `#1D4ED8`, Box-shadow `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
* **Focus:** `2px outline #2563EB`, offset `2px`.
* **Disabled:** Background `#E2E8F0`, Text `#94A3B8`, Cursor `not-allowed`.

### 5.2 Secondary / Outlined Buttons
* **Base Style:** Background `#FFFFFF`, Text `#0F172A`, Border `1px solid #CBD5E1`, Height `38px`, Padding `0 16px`.
* **Hover:** Background `#F8FAFC`, Border-color `#94A3B8`.

### 5.3 Data Tables (Client Roster)
* **Header Row:** Background `#F8FAFC`, Height `36px`, Border-bottom `1px solid #E2E8F0`, Text `#475569`, Font `11px Bold Uppercase`.
* **Row Striping / Hover:** Background `#FFFFFF`, Hover `#F8FAFC`, Height `48px`, Transition `background-color 0.15s ease`.
* **Numeric Columns:** Font Mono (`JetBrains Mono`), right-aligned with tabular figures.

### 5.4 The InBody OCR Review Modal
* **Purpose:** Allows PT to inspect raw OCR extraction side-by-side with original scan image before committing to database.
* **Modal Surface:** Flat pure white `#FFFFFF` modal, `1px solid #E2E8F0`, subtle shadow `shadows.dropdown`.
* **Data Cells:** Inline editable inputs with subtle border `#E2E8F0`; turns `#1E40AF` on focus.
* **Validation Indicator:** Green badge `Confidence: 98%` or Amber badge `Check SMM reading`.

### 5.5 Status Badges
* **Pill Style:** Height `22px`, Padding `2px 8px`, Rounded `9999px`, Font `11px SemiBold`.
* **Active:** Text `#15803D`, Background `#F0FDF4`, Border `1px solid #BBF7D0`.
* **3-Day Alert:** Text `#B45309`, Background `#FFFBEB`, Border `1px solid #FDE68A`.
* **Inactive:** Text `#B91C1C`, Background `#FEF2F2`, Border `1px solid #FECACA`.

---

## 6. Strict Do's and Don'ts

### ❌ Strict Don'ts (Banned Patterns)
* **NO Multi-Color Rainbow/Iridescent Gradients:** Do not use `linear-gradient(to right, #8B5CF6, #EC4899)`.
* **NO Dark Mode Neon Glowing Borders:** Do not use `box-shadow: 0 0 15px rgba(245, 158, 11, 0.8)`.
* **NO Frosted Glass / Heavy Blur:** Do not use `backdrop-filter: blur(20px)` on primary operational panels; keep surfaces flat and crisp.
* **NO Decorative Non-Functional AI Illustrations:** Do not generate random floating AI robots, stars, or cyber particles.
* **NO Vague Rounded Blobs:** Stick strictly to structured geometric border radii ($4\text{px}, 6\text{px}, 8\text{px}$).

### ✅ Strict Do's (Enterprise Standards)
* **DO Use Pure White & Subtle Slate:** Ground the interface in clean `#FFFFFF` with `#F8FAFC` canvas backgrounds.
* **DO Emphasize 1px Crisp Dividers:** Use `#E2E8F0` borders to structure data cleanly.
* **DO Provide High Data Density:** Allow PTs to see status, days since last scan, remaining sessions, and macro compliance without unnecessary whitespace padding.
* **DO Support Clear Tabular Alignment:** Align all numbers, weights, calories, and dates strictly with monospaced tabular numerals.
