# FitSync landing page: research and improvement report

Research date: 27 September 2026
Status: proposed redesign brief, not an approved implementation specification
Scope: the public landing page in `fitsync-app/`, including its demo and conversion journey.

## 1. Main recommendation

Make the coaching experience visible. The current page has a consistent dark palette and functioning sample interactions, but its presentation relies heavily on headings, small icons, bullets, and bordered panels. Visitors must imagine the product. A stronger page should let them see a coach review a scan, notice a client who needs attention, and understand what that client sees on a phone.

The recommended direction is **a product-led coaching website with human context**: retain FitSync’s charcoal and amber identity, introduce large authentic product views, organize the page around a connected coaching workflow, and support its promises with evidence. More gradients, more cards, and a larger headline alone will not resolve the problem.

Design read: a marketing website for Vietnamese independent personal trainers and small studios, combining clear software demonstrations with the warmth of real coaching.

The five highest-value changes are:

1. Put a substantial coach dashboard and client mobile preview in the hero.
2. Replace the three text-heavy feature cards with a connected, visual product story.
3. Make the scan demonstration show its source, review step, and resulting client view.
4. Align every CTA, form, pricing promise, and demo label with the actual product stage.
5. Add verifiable research or customer evidence, practical FAQs, and a complete footer.

## 2. Research method and limits

This report combines inspection of the current source code, the existing design specification and redesign report, the local survey summary, web searches, and direct retrieval of seven official product websites. The reference set deliberately includes fitness, productivity, collaboration, and mental wellness products.

External observations below concern page content, exposed product examples, information structure, and conversion paths visible in retrieved pages. This was not a rendered browser screenshot audit: precise spacing, colors, animation behavior, responsive layouts, and measured performance of those sites were not independently verified. Local visual diagnoses are inferred from JSX and CSS, rather than a live screenshot review. No conversion uplift is claimed, and no competitor marketing metric is treated as independently verified research.

Recommendations are design hypotheses to test. They do not establish that a feature exists in FitSync’s backend or that a proposed claim is ready to publish.

## 3. Current FitSync audit

### What already works

- The charcoal, amber, and ivory palette provides a recognizable starting point.
- Space Grotesk, Inter, and numeric typography already supply a useful hierarchy. Replacing every font is unnecessary.
- The hero communicates a relevant administrative problem.
- The OCR section already supports selecting fixtures and editing biometric fields to recalculate nutrition.
- The ROI slider offers something to interact with.
- Pricing, a mobile navigation menu, a skip link, focus styling, reduced-motion handling, and scroll-animation fallback styles already exist.

### Why it still feels simple

| Finding and source | Consequence | Recommended improvement |
|---|---|---|
| `HeroSection.tsx`: centered badge, headline, paragraph, CTAs, and three metrics; no product image or preview | The first impression could belong to many SaaS products | Give the actual coaching interface comparable visual weight to the headline |
| `FeaturesSection.tsx`: three cards use the same icon → title → paragraph → bullets structure, despite unequal widths | Changing column widths has not created a richer story | Use a dashboard scene, a scan comparison, and a mobile journey with different compositions |
| `page.tsx`: hero → features → OCR → ROI → pricing → footer | Visitors see claims before clear product evidence, then are asked to evaluate money | Move a concise workflow demonstration immediately after the hero |
| Multiple sections repeat centered headers, small uppercase tags, generous identical padding, and dark cards | The page has little change in scale or visual emphasis | Alternate a large product stage, compact process explanation, editorial proof block, and purchase comparison |
| `public/`: default framework SVG assets, with no product marketing image set in the inspected inventory | No asset library supports a distinctive identity | Produce screenshots from FitSync and a small set of original contextual assets |
| `Footer.tsx`: branding and coursework attribution only | The page ends without resolving practical concerns | Add support, privacy, terms, product-stage information, and FAQs above the footer |
| `layout.tsx`: `lang="vi"`, while most landing copy is English | Language metadata and reader experience disagree | Ship complete Vietnamese copy first, or use correct English metadata until translated |
| `globals.css`: muted text is `#5C5A55` on very dark surfaces | Secondary information risks being difficult to read | Increase essential-label contrast and test every surface pairing |

The existing `DESIGN.md` reinforces some limitations: it explicitly makes typography the main visual and prohibits photos of people or gyms. It also describes a glass-style proof strip while prohibiting glassmorphism elsewhere. The next design revision should resolve those contradictions and allow real product imagery and consented original coaching photography.

### Credibility and interaction gaps

These directly affect whether a polished website feels trustworthy:

| Current behavior or claim | Evidence | Required treatment |
|---|---|---|
| “104 Coaches Surveyed” | The local survey summary lists 104 fitness professionals **and trainees**, including 15 general trainees | Use an accurately qualified research statement after verifying the underlying survey; never convert respondents into active customers |
| “90%+ Faster,” “96%+ extraction accuracy,” and processing-time promises | Strings exist in landing components; this review did not establish a benchmark dataset | Supply measurement methodology or remove/qualify the numbers |
| “Real-time biometric extraction” | `OCRDemoSection.tsx` loads `scanFixtures` through timers | Label it a sample simulation; do not imply that a live OCR service processed a document |
| Trial activation and a Zalo response within 24 hours | Hero form submission only calls `setSubmitted(true)` | Connect real lead persistence and operations before promising either outcome |
| Payment presentation | Pricing contains a manually drawn QR-style SVG | Do not present it as a verified payment instrument; use a tested payment flow when ready |
| Large revenue/ROI results | Calculator assumes 2.85 saved hours per client, 3.3 hours per additional session, and 500,000 VND per session | Expose assumptions, allow editing, and distinguish saved time from earned revenue |
| Product availability claims such as PWA and Zalo integration | Marketing text is not implementation evidence | Check each capability end to end before advertising it as available |

Source: [local survey summary](../../fitsync-docs/docs/04-market-research/SURVEY_INSIGHTS.md). This is an internal summary, not a fresh validation of its raw dataset.

## 4. What to learn from established websites

The following comparisons separate observations from proposed adaptations. Their relevance is based on useful patterns, not a ranking of popularity or measured conversion performance.

| Reference | Observed on the official page | Adaptation for FitSync | Avoid copying |
|---|---|---|---|
| [Everfit](https://everfit.io/) | Organizes capabilities around coaching, engagement, management, and scale; includes branded app imagery and named customer stories | Demonstrate both coach and client experiences, then connect functions to a coaching outcome | Its entire feature catalog, customer counts, or large-company navigation |
| [ABC Trainerize](https://www.trainerize.com/) | Connects training, engagement, and business administration to benefits; repeats a clear trial offer; distinguishes independent trainers and larger organizations | Write benefit-led sections and make the next step consistent across the page | Enterprise breadth and unsupported “all-in-one” promises |
| [Apple Fitness+](https://www.apple.com/apple-fitness-plus/) | Pairs routine and motivation messaging with specific iPhone/Watch examples, plan choices, and explained trial terms | Show the client’s daily experience and make devices explain a real workflow | Hardware-style spectacle, unrelated device compatibility, or subscription terms |
| [Linear](https://linear.app/) | Exposes detailed issue, planning, and workflow examples as part of its product explanation | Make a believable client roster and follow-up decision the centerpiece of the coach story | Developer terminology, dense tiny text, or a charcoal palette as a substitute for product evidence |
| [Raycast](https://www.raycast.com/) | Makes keyboard interaction central to its explanation and shows concrete extension/task examples | Build one memorable interaction around reviewing a scan and seeing the result change | Keyboard-centric behavior that is awkward for coaches on phones |
| [Notion](https://www.notion.com/) | Groups capabilities around jobs such as capturing knowledge, finding answers, and automating work; provides concrete scenarios and two distinct acquisition paths | Organize FitSync around “review a scan,” “know who needs attention,” and “keep the client on track” | Its broad AI positioning and many competing audience paths |
| [Headspace](https://www.headspace.com/) | Leads with an emotional need and offers clear paths to particular services, with expertise and help resources available | Tie administrative relief to being more present with clients; make support easy to find | Therapy language, clinical claims, or a playful identity disconnected from FitSync |

### Synthesis

The transferable pattern is specific benefit → visible product example → supporting evidence → clear action. Our design inference is that FitSync needs to strengthen each link, especially visible product evidence. The research does not justify claiming that dark websites convert better, that every section needs motion, or that asymmetrical grids inherently outperform simple layouts.

## 5. Creative direction and alternatives

| Direction | Character | Benefits | Trade-off |
|---|---|---|---|
| **Recommended: product-led coaching** | Existing charcoal/amber brand, large software scenes, occasional original coaching photography | Preserves identity while adding clarity, substance, and human relevance | Requires good screenshots and disciplined content production |
| Human-first studio brand | Coaching portraits and documentary scenes lead; software supports | Strong emotional connection and local character | Can resemble a gym service instead of a software product |
| Interactive software showroom | Product demonstrations dominate every major section | Tangible capability and a strong sense of craft | Higher development cost and greater mobile/performance risk |

Use the first direction with one signature interaction from the third. Photography is optional; clear product imagery is essential. Avoid a collection of disconnected visual tricks.

### Visual rules for the recommended direction

- Keep `#0E0E12` canvas, `#18181D` surfaces, amber actions, and warm ivory text as the initial palette. Green should communicate a real status rather than decorate whole sections.
- Retain the current display/body families initially. Use a proposed hero range of 44–76 px, section titles of 30–44 px, and body copy of 16–18 px; adjust after testing Vietnamese line breaks.
- Use a 1200–1280 px content width, a 12-column desktop grid, and 20–24 px mobile gutters. These are starting design values, not findings about competitors.
- Reserve bordered cards for objects that need grouping: a client record, a plan, an editable result. Let ordinary copy sit directly on the canvas.
- Build depth through the product composition, deliberate cropping, surface contrast, and a clear foreground. Keep readable UI mostly front-facing.
- Use one substantial screenshot at a time. Do not scatter five tiny dashboard fragments around a headline.
- Keep real screen text legible. On mobile, use a purpose-made crop or simplified preview instead of shrinking a desktop screen to illegibility.
- Original photos should show a real coaching action: reviewing a result together, checking a phone between sessions, or discussing a plan. Avoid generic bodybuilder stock imagery.

## 6. Proposed page structure

```text
Navigation: Product / How it works / Pricing / FAQ / Request early access

Hero: specific coaching promise + substantial product preview
                 ↓
Connected workflow: Scan → Review → Coach
                 ↓
Coach workspace: one clear follow-up decision
                 ↓
Client experience: a readable mobile check-in journey
                 ↓
Evidence: verified research or one real pilot story
                 ↓
Pricing + optional transparent time-savings estimate
                 ↓
FAQ → final CTA → complete footer
```

The small estimator can sit beneath pricing as supporting information. It should not interrupt product comprehension with a large speculative revenue claim.

### Navigation

Keep four section links at most. Use the same primary acquisition label as the hero. If the dashboard is a public prototype, label its link “Explore sample dashboard,” rather than making it appear to be a normal account login. Retain `/app/dashboard` and `/app/trainee` as the actual inspected routes; the previous report’s `/coach` and `/client` paths are proposals, not current routes.

### Hero

Suggested Vietnamese copy, subject to product readiness:

> Bớt việc quản lý. Thêm thời gian huấn luyện.
>
> Xem cách FitSync giúp bạn kiểm tra chỉ số, theo dõi học viên và quản lý buổi tập.
>
> Đăng ký trải nghiệm · Xem bản demo

The second sentence invites exploration rather than asserting that every integration is production-ready. For an English variant: “Less admin. More time with your clients.” Support it with a concrete explanation of scan review and client follow-up.

Desktop composition: approximately five columns for copy and seven for a product scene. Show a cropped coach workspace with one important client state and a companion phone view. Label fixtures as sample data. Keep the primary action visible without requiring a visitor to finish an animation.

Mobile composition: headline, short explanation, CTA, then one readable phone or coach-task preview. Do not preserve overlapping desktop device frames at the expense of readability.

### Signature interaction: one client, two perspectives

Use one clearly fictional sample client consistently throughout the page. The visitor can switch between “Coach view” and “Client view,” seeing how a reviewed value or planned action appears to each person. This is a proposed FitSync-specific synthesis of workflow demonstrations and multi-device storytelling, not a feature observed on every reference site.

Keep the interaction local and bounded. It should not require a login or accept personal health information. Show a good static default before JavaScript is ready, make controls keyboard-accessible, and provide a reduced-motion state.

### Scan → Review → Coach

Replace the technical processing terminal as the main story with three visible artifacts:

1. **Scan:** an anonymized or synthetic sample sheet with a readable highlighted field.
2. **Review:** the extracted value, units, and an editable confirmation step.
3. **Coach:** the corresponding client record or sample target view.

Use the label “Interactive sample; results are simulated” while fixtures drive the experience. Keep internal processing stages secondary. A coach’s question is whether the information is correct and useful, not which computer-vision stage ran.

Provide start, processing, complete, correction, reset, and explanatory failure states. Cancel earlier timers when switching examples so an old simulation cannot overwrite the new selection. Numeric correction should reject invalid values and preserve units. Do not describe a calculation as a personalized meal plan unless that capability is implemented and appropriate.

### Coach workspace

Headline concept: “Know who needs your attention today.”

Show a real screenshot from the sample dashboard with one inactivity state and one session-balance state, using labels as well as color. Explain the next action in a short caption. If Zalo messaging is not connected, demonstrate preparing or copying a message only if that action exists; do not depict automatic delivery.

### Client experience

Headline concept: “A daily check-in your clients can understand.”

Use two or three sequential mobile views: today’s target, a meal/check-in entry, and progress. Only show available interactions as real product capability. Explain browser access accurately; a responsive page alone is not evidence of an installable PWA.

### Evidence and human context

Before pilot evidence is available, use a short research story: the problem studied, who participated, and what informed the product. Verify the raw survey and denominator before quoting percentages. The internal summary mixes audience categories, so avoid broad claims about all Vietnamese trainers.

After a pilot, replace or supplement this with one consented case study: coach context, previous workflow, observed change, measurement period, and a genuine quotation. Do not add invented testimonials, partner logos, ratings, or customer counts to fill space. A research participant is not automatically an endorser.

### Pricing and the next step

Current `mock-data.ts` displays Free, Pro at 199,000 VND/month, and Enterprise Studio at 1,500,000 VND/month. The old report proposed different plans and prices. Treat current values as prototype configuration, not a confirmed commercial decision. Resolve the product offer before publishing new copy.

Explain who each plan suits, client limits, scan limits, included support, and what happens next. Use “Request early access” consistently while onboarding remains manual. Use “Start trial” only when that action actually starts a trial. Add annual billing only after both price arithmetic and billing support are defined.

The lead form should ask for the minimum needed: a name and preferred contact, plus optional role/client count. Preserve entries on failure, prevent duplicate submissions, and confirm success only after persistence. The current four required fields can be tested against this shorter alternative.

### Time-savings estimator

Replace fixed revenue certainty with an editable estimate:

`Monthly hours saved = active clients × admin minutes per client per week × assumed reduction × 4.33 / 60`

Illustrative defaults, explicitly labeled: 14 clients × 15 minutes × 50% × 4.33 / 60 ≈ 7.6 hours/month. These numbers are examples, not measured FitSync performance. Allow changes to the assumptions. Keep any “value of time” calculation separate from additional income; availability does not guarantee paid bookings.

### FAQ, final CTA, and footer

Answer: Is this a live product or a sample? Which sheets are supported? Can I correct a scan? How do clients access it? What happens after registration? What do plans include? Where can I get help? What happens to uploaded information?

Write answers from verified behavior. Do not fill gaps with invented policies or delivery commitments. End with the same primary CTA and links to real contact, privacy, and terms pages when available. Keep coursework attribution secondary to the customer-facing identity.

## 7. Asset and content production brief

| Asset | Purpose | Production requirement |
|---|---|---|
| Coach dashboard hero capture | Show the product immediately | Capture the real interface with synthetic data; export desktop and mobile crops |
| Client mobile captures | Explain the other side of coaching | Use a consistent sample person and coherent values across all screens |
| Sample body-composition sheet | Make scanning tangible | Synthetic or properly anonymized; no copied patient information |
| Review-state close-up | Demonstrate human correction | Show readable units and a real field state, not invented output |
| Optional original coaching photo | Add local human context | Permission, clear usage rights, uncluttered composition, no text baked into image |
| Optional short screen recording | Explain the workflow | User-initiated playback, captions, static poster, no sound autoplay |
| Research note or pilot case study | Support trust | Named evidence owner, source, date, denominator, and publication permission |
| Social share image | Make shared links recognizable | FitSync branding, short promise, and a real product crop |

Never reuse competitors’ screenshots as FitSync assets. Use their storytelling principles, not their artwork or exact composition.

## 8. Motion, accessibility, and performance

Use motion to show causality: a selected source field becomes a reviewed value; a tab reveals the corresponding client view. Proposed timings: 150–220 ms for control feedback and 250–400 ms for view changes. Avoid scroll hijacking, endless scanning loops, moving CTAs, and mandatory intro sequences.

Keep all content available when animations or JavaScript fail. Preserve the existing reduced-motion and scroll-timeline fallbacks. The report does not recommend adding an animation library for simple fades and tabs.

Acceptance targets:

- Essential normal text meets 4.5:1 contrast; qualifying large text meets 3:1. Test captions and input placeholders as well as headlines. These are WCAG thresholds, not a claim that the current design passes. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Menus expose expanded state; dialogs manage initial focus, containment, Escape, and return focus. The current overlay key handler alone does not establish complete dialog behavior.
- Controls have descriptive names, visible focus, and generously sized touch targets; use 44 px as a project design target.
- At 360, 390, 768, 1024, and 1440 px widths, check overflow, navigation wrapping, readable previews, and CTA visibility. Test zoom and long Vietnamese labels.
- Target LCP ≤2.5 seconds, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile once field data exists. Lab testing before launch is diagnostic, not proof of field performance. [Google Web Vitals guidance](https://web.dev/articles/vitals).
- Serve responsive optimized images with explicit dimensions, load lower-page media lazily, and avoid downloading a large video before interaction. Keep static sections server-rendered where practical.

## 9. Implementation roadmap

Effort sizes are relative and exclude unknown backend work. No production code was changed for this report.

| Priority | Deliverable | Main files or assets | Relative effort | Completion evidence |
|---|---|---|---|---|
| P0 | Reconcile product claims, sample labels, prices, and CTA intent | Landing components, `mock-data.ts`, approved content sheet | Small–medium | Every public promise maps to evidence or an explicit sample label |
| P0 | Make lead capture truthful and functional | Shared lead form and real persistence integration | Backend-dependent | Success, failure, retry, and duplicate-submit paths verified |
| P1 | Produce product assets and redesign hero | `HeroSection.tsx`, `public/`, revised `DESIGN.md` | Medium | Desktop/mobile captures demonstrate the product and readable hierarchy |
| P1 | Build the connected workflow demo | `OCRDemoSection.tsx`, shared fixtures | Medium | Selection, correction, reset, and rapid switching behave consistently |
| P1 | Replace text-card feature presentation | `FeaturesSection.tsx`, coach/client preview sections | Medium | Each main benefit has a concrete product scene |
| P1 | Unify navigation, pricing, FAQ, footer | `LandingNav.tsx`, `PricingSection.tsx`, `Footer.tsx`, `page.tsx` | Medium | Every CTA has an accurate destination and matching result |
| P2 | Add verified research/pilot proof and Vietnamese content | Evidence section, copy, metadata | Evidence-dependent | Claims reviewed; language and page metadata agree |
| P2 | Rework optional estimator | `ROICalculator.tsx` | Small–medium | Inputs, units, formula, and assumptions are visible |
| P2 | Add restrained motion and finish QA | `globals.css`, interactive leaf components | Medium | Keyboard, reduced motion, responsive, and performance checks recorded |

Keep the existing Next.js/React/Tailwind stack. A framework migration is not needed for this redesign. Consolidate duplicated lead forms into one component when implementing the shared flow. Avoid turning the whole marketing page into a client component to support a few interactions.

Update `DESIGN.md` before UI implementation so it permits product imagery and resolves its current contradictions. Preserve existing uncommitted work while implementing; the inspected repository already contains landing-page modifications.

## 10. Validation and success measurement

Start with five representative Vietnamese trainers as a qualitative comprehension round, not a statistically representative study. After a brief exposure, ask them to explain the audience, the product’s main benefit, whether they saw real or sample data, and what clicking the primary button does. Then ask them to review a sample scan and find pricing/support.

Record misunderstandings, task completion, and points of hesitation. An attractive screenshot is insufficient if users cannot explain the product or mistake a simulation for production capability.

Suggested funnel events: hero CTA click, demo start, demo completion, coach/client view selection, pricing view, form start, confirmed submission, and submission error. Do not send names, contact details, or biometric values in analytics events.

Use confirmed lead submissions per eligible landing visit as the initial primary conversion measure; report counts and traffic sources alongside rates. Demo completion and form abandonment are diagnostic measures. Establish a baseline before claiming improvement. With small traffic, prioritize interviews and error monitoring over underpowered A/B tests.

Release checklist:

- Product visuals are visible near the top and readable on phones.
- Main sections use distinct compositions while retaining a coherent identity.
- Sample data and simulated behavior are obvious.
- All acquisition actions work and success messages are accurate.
- Published claims, prices, and support commitments have an owner and evidence.
- FAQs and contact paths resolve real purchase questions.
- Keyboard, responsive, motion, contrast, and performance checks are documented.

## 11. How this differs from the earlier report

The [earlier master report](fitsync_landing_redesign_master_report.md) remains historical context. This report should guide the next landing-page proposal because it separates current implementation from aspirations and supplies directly inspected sources.

Specific corrections:

- Dark styling is already implemented; the next investment should be visual product explanation and credibility.
- Unequal feature-card widths are already implemented; the remaining repetition is structural.
- “104 active coaches” is not supported by the inspected survey summary.
- The current pricing differs from the earlier proposed tiers.
- The current OCR experience is a fixture simulation, not demonstrated live extraction.
- Current dashboard routes differ from the earlier architecture diagram.
- PWA, messaging, payment, and trial claims require implementation checks.
- A report title saying “approved” does not establish approval for this new proposal.

The first implementation milestone should deliver a compelling hero, one connected sample workflow, and an accurate CTA path. Those changes address the strongest first-impression and trust gaps before optional visual flourishes are added.
