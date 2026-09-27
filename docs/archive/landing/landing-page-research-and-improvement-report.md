# FitSync landing page: research and improvement report

Research date: 27 September 2026
Status: strategy implemented and verified after M2 delivery
Scope: the public landing page in `fitsync-app/`, including its demo and conversion journey.

## 1. Main recommendation

Make the verified coaching experience visible and connect it to real activation. The current page has a consistent dark palette and functioning sample interactions, but its primary path still ends in a fixture-backed dashboard. M2 now provides stronger evidence: a PT can register, create and invite a trainee, validate and confirm a manual InBody record, and the trainee can read that verified record under tested RLS boundaries.

The recommended direction remains **a product-led coaching website with human context**, but the product proof must now come from the real M2 workflow rather than simulated future breadth. Retain FitSync’s charcoal and amber identity, show readable coach and trainee views, organize the page around a connected workflow, and support every promise with evidence.

Design read: a marketing website for Vietnamese independent personal trainers and small studios, combining clear software demonstrations with the warmth of real coaching.

The five highest-value changes are now:

1. Make `/register` the visually primary path into the real PT workspace.
2. Keep `/app/*` as a clearly labeled secondary product tour, not the conversion goal.
3. Show the verified M2 sequence: roster → invitation → manual InBody confirmation → trainee view.
4. Move simulated OCR, hypothetical ROI, and proposed pricing below verified product evidence.
5. Add consented pilot proof when it exists; until then, use qualified research evidence without implying customer outcomes.

### Post-M2 acquisition decision

The public demo is useful for coursework demonstrations and low-commitment exploration, so it should not be deleted. It is not necessary as the primary landing action. A visitor who is ready to act should enter the real product through PT registration, while a visitor who only wants to inspect the interface may choose the secondary fixture-backed tour.

FitSync must not copy mature competitors' “free trial” language yet. Registration works, but trial duration, support operations, entitlement rules, and pilot evidence are not defined. The truthful primary label is “Tạo workspace PT”; “Xem bản mẫu” is the secondary label.

## 2. Research method and limits

This report combines inspection of the current source code, the existing design specification and redesign report, the local survey summary, web searches, and direct retrieval of official product websites. A post-M2 follow-up added TrueCoach and PT Distinction to the original reference set and rechecked the current Everfit and ABC Trainerize acquisition paths.

External observations below concern page content, exposed product examples, information structure, and conversion paths visible in retrieved pages. This was not a rendered browser screenshot audit: precise spacing, colors, animation behavior, responsive layouts, and measured performance of those sites were not independently verified. Local visual diagnoses are inferred from JSX and CSS, rather than a live screenshot review. No conversion uplift is claimed, and no competitor marketing metric is treated as independently verified research.

Recommendations are design hypotheses to test. They do not establish that a feature exists in FitSync’s backend or that a proposed claim is ready to publish.

## 3. Current FitSync audit

### What already works

- The charcoal, amber, and ivory palette provides a recognizable starting point.
- The hero includes an interactive coach/client composition, explicit sample-data labeling, and a relevant administrative promise.
- The fixture-backed `/app` routes are visually aligned with the landing page and clearly identify themselves as a public sample.
- `/register` leads into the real authenticated M2 workspace, whose core PT/trainee workflow is covered by database, unit, and browser tests.
- The page already includes qualified survey evidence, product-scope disclosures, responsive navigation, legal pages, focus styling, and reduced-motion handling.
- Simulated OCR, ROI, and proposed pricing are disclosed rather than presented as verified production outcomes.

### Conversion gaps addressed by the checkpoint

| Pre-checkpoint finding and source | Consequence | Implemented treatment |
|---|---|---|
| `HeroSection.tsx` sent the amber primary button to `/app/dashboard` | Ready visitors were sent to fixtures while the working product appeared secondary | `/register` is now primary and “Xem bản mẫu” is secondary |
| `ProductPreview.tsx` emphasized check-ins, inactivity, meals, and session alerts | The first proof foregrounded M3 concepts instead of the verified M2 loop | The preview now shows roster, connection state, verified InBody data, and trainee read-only access |
| `page.tsx` placed survey evidence and simulated OCR before the broader product story | Visitors saw research and future capability before current product evidence | The verified three-step workflow and paired product views now come first |
| `ProductScope.tsx` described secure roles and manual confirmation as planned scope | Verified M2 behavior was understated while OCR/check-ins appeared equally current | The scope section now distinguishes locally verified M2, next M3, and later work |
| Repeated landing CTAs used the public sample destination | The page lacked a consistent acquisition action despite working registration | Navigation, hero, offer, and final CTA now repeat real registration |
| Pricing and ROI occupied substantial space before pilot validation | Commercial hypotheses distracted from the narrow product wedge | They remain lower on the page with explicit hypothesis and estimate labels |

### Credibility and interaction gaps

These directly affect whether a polished website feels trustworthy:

| Current behavior or claim | Evidence | Required treatment |
|---|---|---|
| OCR interaction uses local `scanFixtures` and timers | It does not call a live extraction service | Retain its simulation label and move it below verified product proof |
| The time estimator calculates user-editable assumptions | It is illustrative and does not establish saved time or revenue | Keep the formula and disclaimer; reduce prominence until pilot measurements exist |
| Survey counts are aggregate research submissions | The form did not collect publication consent for named endorsements | Keep the denominator and methodology; never present respondents as customers or testimonials |
| Local RLS and E2E verification are not production deployment evidence | No production environment or privacy operations are documented as released | Say “verified locally” where relevant and avoid production-security or compliance claims |

Source: [local survey summary](../../../../fitsync-docs/docs/04-market-research/SURVEY_INSIGHTS.md). This is an internal summary, not a fresh validation of its raw dataset.

## 4. What to learn from established websites

The following comparisons separate observations from proposed adaptations. Their relevance is based on useful patterns, not a ranking of popularity or measured conversion performance.

| Reference | Observed on the official page | Adaptation for FitSync | Avoid copying |
|---|---|---|---|
| [TrueCoach](https://truecoach.co/) | Leads with reduced administration, visible product capabilities, customer evidence, and a repeated 14-day no-card trial | Lead with the specific PT outcome, show working M2 screens, and repeat one truthful activation path | Its mature customer counts, testimonials, feature breadth, or trial promise |
| [Everfit](https://everfit.io/) | Organizes capabilities around coaching, engagement, management, and scale; includes branded app imagery and named customer stories | Demonstrate both coach and client experiences, then connect functions to a coaching outcome | Its entire feature catalog, customer counts, or large-company navigation |
| [ABC Trainerize](https://www.trainerize.com/) | Connects training, engagement, and business administration to benefits; repeats a clear trial offer; distinguishes independent trainers and larger organizations | Write benefit-led sections and make the next step consistent across the page | Enterprise breadth and unsupported “all-in-one” promises |
| [PT Distinction](https://beta.ptdistinction.com/) | Pairs a free-trial action with a lower-commitment “How it works” path, then supports it with product features and user evidence | Use real activation as the primary action and the sample tour as the explanatory alternative | Its automation breadth, AI claims, or community proof |
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
Navigation: Product / How it works / Evidence / FAQ / Create PT workspace

Hero: specific coaching promise + verified M2 product preview
                 ↓
Connected workflow: Create trainee → Invite → Verify record
                 ↓
Coach workspace: roster + confirmed InBody record
                 ↓
Trainee experience: the same verified record on mobile
                 ↓
Evidence: verified research or one real pilot story
                 ↓
Secondary fixture tour + clearly labeled roadmap/hypotheses
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
> Tạo hồ sơ, mời học viên và xác nhận chỉ số InBody trong một luồng rõ ràng.
>
> Tạo workspace PT · Xem bản mẫu

The second sentence invites exploration rather than asserting that every integration is production-ready. For an English variant: “Less admin. More time with your clients.” Support it with a concrete explanation of scan review and client follow-up.

Desktop composition: approximately five columns for copy and seven for a product scene. Show a cropped coach workspace with one important client state and a companion phone view. Label fixtures as sample data. Keep the primary action visible without requiring a visitor to finish an animation.

Mobile composition: headline, short explanation, CTA, then one readable phone or coach-task preview. Do not preserve overlapping desktop device frames at the expense of readability.

### Signature interaction: one client, two perspectives

Use one clearly fictional sample trainee consistently throughout the page. The visitor can switch between “PT view” and “Trainee view,” seeing the same confirmed InBody record from each authorized perspective. This connects directly to verified M2 behavior.

Keep the interaction local and bounded. It should not require a login or accept personal health information. Show a good static default before JavaScript is ready, make controls keyboard-accessible, and provide a reduced-motion state.

### Create → Invite → Verify

Use the verified M2 workflow as the main story with three visible artifacts:

1. **Create:** a synthetic trainee appears in the PT roster with goal and session context.
2. **Invite:** a secure, expiring, single-use invitation connects the trainee account.
3. **Verify:** the PT validates and confirms five manual InBody metrics; the trainee sees the same verified result.

Use synthetic values and avoid exposing real invitation tokens or health data. If the existing OCR fixture remains on the page, label it “Interactive sample; results are simulated” and position it after the verified workflow.

### Coach workspace

Headline concept: “One place for every trainee record.”

Show a sanitized product composition based on the real workspace: roster status, invitation state, and a verified record. Use labels as well as color. Future check-in warnings and Zalo follow-up remain outside this first proof until M3 is verified.

### Trainee experience

Headline concept: “Your trainee sees the record you confirmed.”

Show the focused mobile trainee view with identity, coach connection, five verified metrics, and nutrition drafts. Only show available interactions as real product capability. Explain browser access accurately; a responsive page alone is not evidence of an installable PWA.

### Evidence and human context

Before pilot evidence is available, use a short research story: the problem studied, who participated, and what informed the product. Verify the raw survey and denominator before quoting percentages. The internal summary mixes audience categories, so avoid broad claims about all Vietnamese trainers.

After a pilot, replace or supplement this with one consented case study: coach context, previous workflow, observed change, measurement period, and a genuine quotation. Do not add invented testimonials, partner logos, ratings, or customer counts to fill space. A research participant is not automatically an endorser.

### Pricing and the next step

The current landing page presents a Freemium direction and a Pro hypothesis at 199,000 VND/month. Treat both as research hypotheses, not a confirmed commercial offer. Resolve the product offer before publishing checkout or trial copy.

Keep proposed plan limits and prices explicitly hypothetical. Use “Tạo workspace PT” for the working registration path. Use “Start trial,” “Join pilot,” or lead-form success language only when those operations actually exist. Add annual billing only after both price arithmetic and billing support are defined.

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

The original redesign and the smaller post-M2 conversion checkpoint are complete. Their implementation and verification are consolidated in `docs/HANDOFF.md`; the original checklist remains available in Git history:

1. Reverse the CTA hierarchy so `/register` is primary and the public tour is secondary.
2. Reframe the hero and first product proof around the verified M2 workflow.
3. Demote future-facing OCR, ROI, and pricing material while preserving honest labels.
4. Keep survey evidence qualified and do not invent pilot proof.
5. Update the public-journey browser test for the new intent and both CTA destinations.
6. Validate lint, types, production build, and desktop/mobile browser rendering.

Keep the existing Next.js/React stack and scoped landing styles. This checkpoint does not require database changes, new authentication behavior, analytics, OCR, payments, or M3 engagement work.

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

The [earlier master report](fitsync-landing-redesign-master-report.md) remains historical context. This report should guide the next landing-page proposal because it separates current implementation from aspirations and supplies directly inspected sources.

Specific corrections:

- Dark styling is already implemented; the next investment should be visual product explanation and credibility.
- Unequal feature-card widths are already implemented; the remaining repetition is structural.
- “104 active coaches” is not supported by the inspected survey summary.
- The current pricing differs from the earlier proposed tiers.
- The current OCR experience is a fixture simulation, not demonstrated live extraction.
- Current dashboard routes differ from the earlier architecture diagram.
- PWA, messaging, payment, and trial claims require implementation checks.
- A report title saying “approved” does not establish approval for this new proposal.

The landing now uses verified M2 behavior in the hero, real registration as the primary path, and the public sample as a clearly secondary tour. Desktop and mobile browser verification passed, so product work returns to M3.
