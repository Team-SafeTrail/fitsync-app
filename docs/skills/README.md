# Project skills

Installed 2026-10-30 for FitSync's product, engineering, marketing and demo work.
Start with [the alignment scan](../PROJECT_ALIGNMENT_SCAN.md). Installation does
not approve the current product direction or execute a campaign.

## Task routing

| Task | Lead skills | Expected use |
| --- | --- | --- |
| Recover direction and define scope | `product-vision`, `create-prd` | Alternatives and a brief grounded in owner input; never silently replace the existing plan |
| Visual direction | `frontend-design` OR `design-taste-frontend` (folder `taste-skill`) | One lead workflow; references and concrete proposals fitted to FitSync |
| Layout, tools and data displays | `ui-ux-pro-max` | Targeted lookup for SaaS/mobile workflows, typography and charts |
| Motion and interaction polish | `apple-design`, `emil-design-eng` | State transitions, feedback and motion with reduced-motion support |
| Interface review | `impeccable`, `web-design-guidelines` | Targeted hierarchy/accessibility/responsive review with rendered evidence |
| React and writing | `react-best-practices`, `humanizer`, `writing-guidelines` | Installed framework version and concise, evidence-backed UI copy |
| Database and authorization | `supabase-postgres-best-practices`, `security-review` | SQL/RLS review, with the existing server identity, private storage and health-data rules preserved |
| Verify changes | `verification-loop` | Existing npm, database and browser gates; commands adapted to Windows and monorepo scripts |
| Positioning and copy | `product-marketing`, `copywriting` | Evidence-backed messaging after alignment; no auto-draft from disputed current copy |
| Activation and measurement | `onboarding`, `analytics` | Propose the first-value flow and a privacy-safe event plan; tracking is not installed by adding a skill |
| Business hypotheses | `pricing`, `launch` | Validate willingness to pay and prepare a scoped launch; no invented traction or automatic outreach |
| Video (local-only) | `remotion-create`, `remotion-render`, `remotion-captions` | Optional future video work; retain existing capture/FFmpeg pipeline and real narration |
| Review new skills | `skill-inspector` | Static scan plus source-aware review, not a safety certificate |

Only load the skills required for the current task. Related skills mentioned by
upstream authors are optional references, not an instruction to install everything.
Consult the version-matched official documentation when a referenced skill is not
installed; do not silently install its package or plugin.

## What was installed

- 25 local skill directories: 20 with retained license notices, plus 5 local-only
  folders excluded from Git pending license review (3 Remotion and 2 Vercel guideline skills).
- 14 newly downloaded skill folders were scanned before installation; 11 unchanged
  skills reuse the pinned, hash-verified portfolio/inspector source and prior audit.
- Commits, original paths, distribution status and every installed file's SHA-256
  are in [SOURCES.json](../../.agents/skills/SOURCES.json).
- No new npm dependency, Remotion runtime, MCP server, global config, hook,
  background service, cloud renderer or account connection was installed.

ECC contributes `verification-loop` and `security-review` only. Its full agent
harness, memory and configuration were not imported. Supabase guidance does not
replace migrations or pgTAP. Video skills do not make an Android app exist.

## Portability

The 20 trackable skills will be available after these changes are committed and
the branch is shared; this setup has not been committed or pushed. The five
local-only directories and raw audit evidence are not included in Git. To recreate
them on another machine, use the skill-installer with the exact repository, commit
and paths in `SOURCES.json`, scan them again and keep their distribution status
until licensing is clarified. Do not use `--force` or overwrite local edits.

See [security review](SECURITY.md) for caveats, scanner location and actual checks.
See [the UI review workflow](UI_REVIEW.md) to select the design/motion/checking
skills without running competing workflows or importing portfolio branding.
