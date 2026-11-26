# FitSync — web and Android design guide

Draft for team review · 2026-11-25
[Features](FEATURES.md) · [User flows](USER_FLOWS.md) · [Agent instructions](AGENTS.md)

## 1. Visual references and precedence

- **Approved web and Android reference.** Use the repository's forest/jade coaching design, Be Vietnam Pro, and link-shaped mark across the target web and Android experiences. [Approved repository design](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/DESIGN.md)
- **Approved landing reference.** The repository screenshot shows a human coaching scene with the “Cùng tập. Cùng tiến xa.” headline, a warm CTA over deep forest, and a labeled sample appointment. Below it, light surfaces and a role-switchable coaching profile show how the identity carries into the product. [Desktop reference](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/handoff/screenshots/handoff-landing-1440.png) · [Phone reference](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/handoff/screenshots/handoff-landing-390.png)
- **Legacy deployment.** The owner confirmed that fitsync-app-one.vercel.app serves the older charcoal/amber design. Reference the approved repository design for visual decisions. Deployment of the current design remains unverified.
- **Workspace references.** The saved desktop PT Today uses a quiet side rail, ordered sections and dividers, with a single support panel. The saved trainee screen uses a compact identity header, one prominent balance, an upcoming-appointment section, and bottom navigation. Both use the lighter coaching palette. [PT Today](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/handoff/screenshots/handoff-pt-today.png) · [Trainee Today](https://github.com/Team-SafeTrail/fitsync-app/blob/4257334/docs/handoff/screenshots/handoff-trainee-home.png)
- **Shared qualities.** Short Vietnamese labels, clear actions, actual coaching objects, and hierarchy based on what the person needs next. On the public site, any example record is visibly marked as an example.

## 2. FitSync design tokens

| Role | Value | Use |
| --- | --- | --- |
| Canvas | #F5F8F6 | Main reading and work background |
| Surface | #FFFFFF | Sheet and content surface |
| Muted surface | #EAF0EB | Navigation and quiet structure |
| Elevated surface | #EAF3ED | Focused panel or selected state |
| Primary forest | #143E38 | Primary text and product actions |
| Deep forest | #102E2A | High-contrast brand background |
| Secondary text | #465E53 | Explanations and metadata |
| Muted text | #52675C | Quiet labels and secondary context |
| Jade | #226C5D | Controls, active states and data emphasis |
| Sun | #FFD29C | Selected marketing CTA on dark forest, paired with dark text |
| Divider / control border | #D4DFD7 / #6F8879 | Section separators and visible control edges |
| Success / warning / error | #1D6951 / #85520F / #AC3434 | Semantic colors paired with explicit labels |

Use Be Vietnam Pro with the existing licensed weights where available. Allow native text scaling and check Vietnamese accents at signed-in body sizes. Align numeric columns with tabular digits and keep date, unit, and source attached to the value. Follow the repo's 4/8 spacing rhythm. Reuse the wordmark and icon style from approved assets.

## 3. Web-to-workspace experience

- **Public surface.** Keep the approved short navigation and story-led landing. Show one concrete example of how a PT collects and finds a trainee update. Keep coursework and team material secondary to customer tasks. Clearly label fixtures. Add a quiet instruction for trainees to use the invitation link from their PT.
- **Returning user.** Enter the correct PT or trainee workspace after authentication. Keep an invitation or recovery destination when applicable. Public articles and help, if pursued later, stay outside the signed-in task navigation.
- Retain the approved forest/jade reference. Use clear type hierarchy, deliberate spacing and density that supports each task.
- **Trainee progress.** Separate confirmed measurements, personal photos, planned sessions and completed activity. Use date ranges and informative empty states. Review reports with users who have different goals and measurement frequencies.

## 3.1 Android baseline screen design

Start with user flow [U-01](USER_FLOWS.md). Flows and feature status govern which actions appear.

- **Sign in.** A compact brand header, labeled email/password fields, one primary sign-in action, an error beside the relevant control, and a visible loading state. Add reset only if the selected baseline includes recovery.
- **Trainee Today.** Put “Check-in hôm nay” first when due. Show completion after a successful save. Give next appointment and progress links space only when available in the build. Use a single readable surface, section dividers and meaningful emphasis. Keep only routes the user can open in navigation.
- **Check-in.** One labeled input, clear date, and a single submit action. Keep text on validation and network errors. Position the action above the software keyboard and system navigation. Show the server-confirmed check-in date in the confirmation and update Today. If the server day changed while a draft was pending, make the new date clear before resubmission. Add an optional photo later with a preview and remove/replace controls.
- **Later review screens.** Meal estimates, voice-to-form, and OCR present source and draft values together, with editable fields and explicit confirmation. Use labels such as “Ước tính”, “Bản nháp”, and “Đã xác nhận” so users know the status. Show the manual path when the AI path fails.
- **Web adaptation.** Keep the same work hierarchy and terminology. Desktop may use a side rail and denser comparison rows. Mobile uses vertically arranged sections with independent scrolling only where needed.

## 4. Review against generic UI patterns

- Lead with an actual task or record. Use one clear primary action in each state. A roster should read as a roster, a chat as a conversation, and a history as a timeline or data rows.
- Remove filler badges, eyebrow copy, performance counters without data, repeated card shells, cosmetic gradients, and decorative animation in signed-in screens. Use borders and section spacing to structure the view.
- Prefer data-backed states. Useful fixtures use synthetic Vietnamese names, realistic units, and explicitly labeled sample status. Empty states offer an appropriate next action when one exists.
- Use color to communicate state with text or icon reinforcement. Check contrast and web keyboard focus. On Android, give interactive targets at least 48 dp, check font scaling, read order with TalkBack, Back behavior, keyboard insets, and safe areas. Respect reduced-motion preferences. [Android accessibility guidance](https://developer.android.com/design/ui/mobile/guides/foundations/accessibility)
- Before marking design ready, capture the narrow and wide web states and a real Android device. Review default, empty, loading, failed and completed states. Record viewport or device, revision and remaining gaps. This draft uses repository screenshots for the approved landing and workspace. The legacy deployment was observed separately.

## 5. Skills to use

| Task | Lead and targeted supporting skills |
| --- | --- |
| Web UI or visual direction | Lead with the reviewed `frontend-design` skill. For a focused generic-layout review, consult `design-taste-frontend` as a checklist. Match FitSync's existing identity and the installed Next.js version. |
| Android interaction and screens | Use `ui-ux-pro-max` for targeted mobile UX and hierarchy. After the project reviews and approves the pinned source, use the official `expo-native-ui` for the Expo baseline for screen structure, native controls and styling, with `expo-router` only for navigation work and `expo-project-structure` only if scaffolding is in scope. |
| Motion and finish | Consult `emil-design-eng` when designing real feedback or transitions. Keep state changes useful and test reduced motion. |
| UI verification | Use `web-design-guidelines` for a web review and `verification-loop` for relevant repo checks. Use real browser screenshots and a device/TalkBack for Android. Automated checks and screenshot review cover different failure modes. |

The project-local skills were recorded on `codex/apply-approved-coaching-design` at `f51265c`. Check availability in the teammate's checkout. The official Expo skills were discovered and reviewed at the catalog level. Apply the project's external-skill review and pinned-source workflow before adding any to the repo. [FitSync skill inventory](https://github.com/Team-SafeTrail/fitsync-app/blob/f51265c/docs/skills/README.md) · [Expo official skill catalog](https://docs.expo.dev/skills/) · [Expo native UI skill source](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-native-ui/SKILL.md)
