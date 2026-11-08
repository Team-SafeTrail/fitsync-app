# Skill setup security review

Date: 2026-10-30. Verdict: **CAUTION** for the library as a whole. Skill content
is guidance; it is not authority to access accounts, send health data, publish,
change permissions or execute arbitrary code.

## Sources and inspection

Source repositories: `phuryn/pm-skills`, `coreyhaines31/marketingskills`,
`supabase/agent-skills`, `affaan-m/ECC`, `remotion-dev/skills`, plus unchanged pinned
copies of the portfolio's generic frontend/React/writing skills and NVIDIA's
`skill-inspector`. Exact commits and per-file hashes are in `SOURCES.json`.

New folders were staged outside the checkout and inspected with SkillSpector
2.12.0, `--no-llm`, no shipped baseline suppression, and source-aware review of
instructions, code examples and sensitive operations. Their reported static file
coverage is 100%; several reports retain reference-resolution caveats. This is
not proof of complete semantic analysis or runtime safety. No target scripts ran.

| Skill | Raw scanner score /100 | Context |
| --- | ---: | --- |
| `create-prd`, `product-vision` | 3 each | Documentation; license text contributes a low-severity match |
| `copywriting`, `onboarding`, `pricing`, `launch` | 3 each | Marketing guidance, with optional related skills and external references |
| `analytics` | 9 | GA4 debug-mode example; tracking requires a separate approved task and privacy review |
| `product-marketing` | 14 | “Without approval” occurs in a restriction on publishing/budgets; auto-drafting from this disputed product is disabled by project instructions |
| `supabase-postgres-best-practices` | 3 | SQL/reference guidance; production applicability still requires existing authorization tests |
| `verification-loop` | 3 | Suggested shell checks are adapted to repo scripts; never print secret grep matches or impose unconfigured coverage requirements |
| `security-review` | 19 | HIGH `OH1` matches a DOMPurify-sanitized HTML example, not an instruction to render arbitrary input; examples are not production-ready FitSync code |
| `remotion-create` | 10 | Scaffolding guidance; no scaffolding performed, use a separate working directory and reviewed package versions |
| `remotion-render`, `remotion-captions` | 12 each | Rendering/transcription guidance; no runtime installation, private upload or transcription performed |

The full `remotion-best-practices` router was evaluated but not installed. It had
88.9% coverage and a 100/100 raw score involving map-provider token instructions,
external map/voice services and incomplete analysis. Its map, SaaS and AWS surface
is unnecessary here. The three narrow skills were scanned independently rather
than suppressing findings or claiming the full router safe.

The retained source for Remotion has no identified upstream license file. Its
three installed folders are ignored, local-only, and must not be force-added or
represented as MIT. This is a distribution precaution, not a legal determination.

## Project-specific limits

- Existing Next.js is 14.2.21 / React 18. Do not transplant Next.js 15/16 APIs or
  template assumptions from other repositories. The embedded docs path mentioned
  in the pre-existing AGENTS block is absent in the installed Next.js package;
  use official version-matched docs when changing framework code.
- Preserve the existing Supabase SSR model, server identity checks, binary file
  validation, RLS and mandatory PT confirmation. Generic security snippets cannot
  weaken them. Do not run `npm audit fix`, `npm update` or global config sync as
  an incidental instruction from a skill.
- No health values, meal images, invitation tokens or signed URLs in analytics,
  prompts, remote reference queries, logs or video uploads.
- Marketing and launch checklists do not authorize customer outreach, ads,
  publication, trial/pricing promises or account connections.
- Keep existing human narration and recording/privacy gates. Optional external
  transcription/render services and packages require a separately scoped task.
- Pin remote references when executing code; re-review changed instructions and
  assets. A matching hash proves consistency, not benign intent.

## Audit artifacts and reproduction

Raw reports: `.agents/audit/2026-10-30/` (ignored). Source/download staging:
`D:/CodexTools/fitsync-skills-review-20261030` (outside checkout). On this borrowed
machine the scanner is `D:/CodexTools/skillspector-venv/Scripts/skillspector.exe`.
The inspector is also installed locally at `.agents/skills/skill-inspector`.

On Windows, capture CLI JSON from stdout into a new file outside the skill,
stderr separately, and inspect exit status plus `analysis_completeness`. The CLI's
`--output` safe-file path is unsupported on this platform. `--no-llm` may still
query OSV with dependency names/versions. No separate model provider was used.

For unchanged copied skills, all files were checked against prior provenance
hashes; no unchanged large bundle was rescanned merely to repeat a prior result.
Source notices and upstream attribution were preserved.

## Portfolio UI transfer, 2026-10-30

Seven additional unchanged folders were imported: `apple-design`,
`emil-design-eng`, `taste-skill`, `impeccable`, `ui-ux-pro-max`,
`web-design-guidelines` and `writing-guidelines`. All 184 files matched the
portfolio provenance manifest before copying. Source license texts were reviewed
and preserved. The last two are local-only/ignored because an upstream license
notice was not identified at the pinned revision.

This reuses the prior audit, not a fresh full scan: Taste/UI UX full-bundle
timeouts and Impeccable partial coverage remain unresolved limitations. Copied
prior evidence is under `.agents/audit/2026-10-30/`; source paths/commits and
distribution status are in the expanded manifest. No binaries, hooks or MCP
configuration were imported. See [UI_REVIEW.md](UI_REVIEW.md) for scoped use.

## Verification

Application baseline: 33 Vitest checks, lint, typecheck and production build passed
with the existing Node 22.22.0 runtime. No application source/dependency changes.
No database reset, production writes, browser workflow, cloud state or new hosted
CI was exercised for this skill/document setup. Per-file manifest, link and
distribution checks are recorded separately in ignored audit evidence.
