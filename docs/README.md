# FitSync documentation

This directory separates active product decisions from supporting evidence and historical material.

## Start here

| Document | Purpose |
| --- | --- |
| [MVP execution plan](MVP_EXECUTION_PLAN.md) | Active scope, workflows, security rules, milestones, and acceptance criteria |
| [Project handoff](HANDOFF.md) | Compact verified implementation state and resume instructions |
| [Design specification](../DESIGN.md) | Interface tokens, components, and visual rationale |
| [Contributing guide](../CONTRIBUTING.md) | Team ownership, branches, validation, and data-safety rules |

Executable code, migrations, and tests take precedence over prose when they disagree. `MVP_EXECUTION_PLAN.md` is the product source of truth for work that has not yet been implemented.

## Active milestone

- [M4 OCR architecture and benchmark plan](plans/m4-ocr-architecture-and-benchmark-plan.md)
- [M4 OCR benchmark protocol](plans/m4-ocr-benchmark-protocol.md)
- [ADR-002: OCR drafts behind a provider adapter](architecture/adr-002-ocr-drafts-behind-provider-adapter.md)

## Architecture decisions

- [ADR-001: Monorepo with a modular monolith backend](architecture/adr-001-monorepo-and-modular-monolith.md)
- [ADR-002: OCR drafts behind a server-only provider adapter](architecture/adr-002-ocr-drafts-behind-provider-adapter.md)

## Research and evidence

- [Survey evidence used on the landing page](research/survey-evidence.md)

Research documents support claims and decisions; they do not establish that a feature is implemented.

## Archive

Superseded landing strategy and alignment reports are retained under [`archive/landing/`](archive/landing/) for historical context. Archived documents are not implementation instructions and may describe routes, targets, or planned capabilities that no longer match the product.

Completed milestone checklists and the obsolete continuation prompt were removed from the working tree after their verified outcomes were consolidated into `HANDOFF.md` and `MVP_EXECUTION_PLAN.md`. They remain recoverable from Git history.
