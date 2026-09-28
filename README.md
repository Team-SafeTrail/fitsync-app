# FitSync

FitSync is a mobile-first coaching workspace for independent Vietnamese personal trainers and their trainees. This repository contains the public website and the authenticated responsive web application built with Next.js and Supabase.

## Current product status

The web baseline is implemented and verified through M3:

- PT registration, sign-in, protected workspace, and tenant-isolated profiles;
- trainee creation and single-use invitation acceptance;
- manual five-field InBody validation, confirmation, history, and nutrition drafts;
- trainee daily check-ins with optional notes and private meal photos;
- PT activity review, remaining-session updates, and a deterministic inactivity queue;
- responsive browser coverage for PT and trainee workflows.

M4 OCR-assisted InBody entry is next. OCR is not live yet, and every future extraction must remain a draft until explicit PT confirmation. Payment processing, analytics, an installable Android application, and Play Store distribution are also not implemented.

## Quick start

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Docker for the local Supabase stack

### Run locally

```bash
npm ci
npm run db:start
npm run dev
```

Create `apps/web/.env.local` locally with these variable names:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
```

Use the values from the local Supabase project and `http://127.0.0.1:3000` as the local site URL. Never commit or paste environment values into documentation, issues, or pull requests.

The application is available at `http://127.0.0.1:3000`. If the current shell cannot access Docker, run Supabase commands through `sg docker -c '<command>'` or open a fresh login shell.

## Product surfaces

| Route | Purpose | Data source |
| --- | --- | --- |
| `/` | Public Vietnamese landing page | Static product content and synthetic examples |
| `/register` | Primary PT activation path | Supabase authentication |
| `/login` | PT and trainee sign-in | Supabase authentication |
| `/app/*` | Clearly labeled public product tour | Fixtures only |
| `/invite/[token]` | Single-use trainee invitation acceptance | Authenticated server workflow |
| `/workspace/*` | Real PT and trainee product | PostgreSQL, private storage, and RLS |

Fixture data under `/app/*` must never be mixed with authenticated workspace data.

## Repository structure

```text
fitsync-app/
├── apps/web/              Next.js marketing site and authenticated web product
├── supabase/              Configuration, migrations, seed data, and pgTAP tests
├── docs/                  Product plan, handoff, ADRs, active plans, and evidence
├── .github/               Pull-request template and Node 20 CI
├── AGENTS.md              Required Next.js agent instructions
├── CONTRIBUTING.md        Team workflow, ownership, and validation rules
└── DESIGN.md              FitSync interface tokens and design rationale
```

The MVP remains a modular monolith. Add a mobile application or shared package only when its first working workflow is implemented; do not create empty scaffolds.

## Documentation

Start with [the documentation index](docs/README.md). The most important documents are:

- [MVP execution plan](docs/MVP_EXECUTION_PLAN.md) — active product scope and milestone order
- [Project handoff](docs/HANDOFF.md) — latest verified implementation state
- [M4 OCR plan](docs/plans/m4-ocr-architecture-and-benchmark-plan.md) — next milestone checklist
- [Architecture decisions](docs/architecture/) — durable technical decisions
- [Design specification](DESIGN.md) — visual system and interface rules
- [Contributing guide](CONTRIBUTING.md) — branches, checks, security, and ownership
- [Team and agent playbook](docs/TEAM_PLAYBOOK.md) — identity-based task discovery and reviewed delivery
- [EXE202 delivery plan](exe202-delivery-plan.md) — Week 4–14 ownership, Trello workflow, Discord routing, and evidence gates

When documents disagree, executable behavior and tests come first, followed by the MVP execution plan and accepted architecture decisions.

## Validation

Run the application quality gates from the repository root:

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

For database, authorization, storage, or migration changes:

```bash
npm run db:reset
npm run db:test
npm run db:types
npx supabase db lint --local
```

For changed user workflows:

```bash
npm run test:e2e
```

Pull requests run the domain tests, lint, typecheck, and production build in GitHub Actions. Database and browser suites remain required locally when their areas change.

## Team ownership

| Area | Primary owners |
| --- | --- |
| Product coordination and OCR direction | Việt (`Am2uocVi3t`) |
| OCR dataset, preprocessing, and evaluation | Hưng (`hei1sme`) |
| Web/mobile UI and Play Store packaging | Khai (`DiepKhai`) |
| Supabase, server integration, and payments | Huy (`huydqse180459-art`) |
| UI/UX and growth evidence | Toàn (GitHub account pending) |

Use feature branches and pull requests. The private organization plan does not currently provide branch protection, so the team must enforce the no-direct-push rule by convention.

When working with a coding agent, a teammate may state only their name. The agent follows the team playbook to discover assigned `agent-ready` issues, recommends one, and waits for confirmation before editing. Agents may deliver through a pull request but never merge their own work.

## Data safety

Use synthetic identities, biometric reports, meal images, and payment examples in source control and automated tests. Do not process real health reports until consent, permitted use, access, retention, deletion, incident response, and provider-processing responsibilities have named owners.
