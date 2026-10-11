# FitSync documentation

This directory separates active product decisions from supporting evidence and historical material.

## Start here

| Document | Purpose |
| --- | --- |
| [MVP execution plan](MVP_EXECUTION_PLAN.md) | Active scope, workflows, security rules, milestones, and acceptance criteria |
| [Project handoff](HANDOFF.md) | Compact verified implementation state and resume instructions |
| [Design specification](../DESIGN.md) | Interface tokens, components, and visual rationale |
| [Contributing guide](../CONTRIBUTING.md) | Team ownership, branches, validation, and data-safety rules |
| [Team and agent playbook](TEAM_PLAYBOOK.md) | Name-based issue discovery, agent authority, review, and handoff rules |
| [EXE201 delivery plan](../EXE201-delivery-plan.md) | Week 4–14 course roadmap, Trello board contract, Discord routing, and evidence rules |
| [Trello refresh prompt](../trello-weekly-refresh-prompt.md) | Safe, paste-ready Kanban migration, Week 1–3 backfill, and deliverable backlog |
| [Trello board state](TRELLO_BOARD_STATE.md) | Live synchronization snapshot and change log of the FitSync Trello board |
| [W05 slide & script handbook](W05_SLIDE_AND_SCRIPT_HANDBOOK_17SLIDES.md) | Complete 17-slide handbook combining design brief and 30-min presentation script |
| [W05 presentation script](W05_PRESENTATION_SCRIPT_30MIN.md) | 30-minute lecturer presentation script with timing, cues, and speaker transitions |
| [W05 slide design brief](W05_SLIDE_DESIGN_BRIEF_FOR_TOAN.md) | Detailed 17-slide Carbon Dark design brief for slide designer |

Executables, migrations, and tests take precedence over prose when they disagree. `MVP_EXECUTION_PLAN.md` is the product source of truth for work that has not yet been implemented.

## Active milestone & Sprint focus

- **Week 5 Active Sprint:** 17-Slide Lecturer Presentation (`W05_SLIDE_AND_SCRIPT_HANDBOOK_17SLIDES.md`), slot 16:00–16:30 Thursday (08/10/2026).
- **M4 OCR Review & Verification:** PR #11 merged (`21c55ce`), PR #14 approved, PR #15 benchmark evaluated.
- **Adaptive UI Redesign:** PRs #17, #19, #21, #23 approved.
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
