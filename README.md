# FitSync

FitSync is a coaching workspace for Vietnamese personal trainers and their trainees. This repository contains the public website, responsive web product, future mobile application, product documentation, and eventually shared domain packages.

## Repository structure

```text
apps/
  web/                   Next.js landing page and product prototype
packages/                Shared code only when consumed by multiple apps
docs/
  MVP_EXECUTION_PLAN.md  Active implementation source of truth
  HANDOFF.md             Compact state for resuming in a new chat
  NEXT_CHAT_PROMPT.md    Copy-ready continuation prompt
  architecture/          Architecture decision records
```

The historical research and coursework repository remains in the sibling `fitsync-docs` repository. When it conflicts with the active execution plan or executable code, it is not an implementation source of truth.

## Local development

Use Node.js 20 or newer.

If this machine continues to report Node 18 inside the Conda base environment, install the supported runtime with `conda install -c conda-forge nodejs=20`, then open a new shell and confirm with `node -v`.

```bash
npm install
npm run db:start
npm run dev
```

The web application runs at `http://localhost:3000` by default.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm run db:test
```

Local Supabase requires Docker access. Copy `apps/web/.env.example` to `apps/web/.env.local`, then replace the publishable key with the value printed by `npm run db:start`.

## Current status

The landing page, public fixture-backed demo, local Supabase identity foundation, authentication routes, protected workspace shell, core profile schema, and initial RLS tests are implemented. The first complete real-data product workflow is the active milestone; live OCR, payment processing, an installable PWA, and store-distributed mobile applications remain later work. See [the handoff](docs/HANDOFF.md) to resume development and [the MVP execution plan](docs/MVP_EXECUTION_PLAN.md) for scope and release criteria.
