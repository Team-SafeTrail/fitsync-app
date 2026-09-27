# FitSync identity foundation

## Goal

Create a reproducible local Supabase identity layer with protected real-data routes, while preserving the public prototype.

## Tasks

- [x] Initialize project-scoped Supabase configuration and CLI commands.
- [x] Add the first migration with profiles, PTs, trainees, invitations, InBody records, indexes, constraints, triggers, grants, and RLS.
- [x] Add typed browser/server Supabase clients and session-refresh middleware.
- [x] Add PT registration, login, callback, logout, and protected `/workspace` routes.
- [x] Keep public `/app` fixture routes separate from authenticated records.
- [x] Add pgTAP structural and privilege tests.
- [x] Apply migrations and run pgTAP locally.

## Done when

- [x] Web lint, types, and production build pass.
- [x] Authentication pages fail safely when environment variables are absent.
- [x] Role and subscription columns cannot be self-promoted through public grants.
- [x] `npm run db:reset` and `npm run db:test` pass with Docker access.

## Environment note

Verification used Node 20.20.2. The original terminal predated the user being added to the `docker` group, so some database commands required `sg docker`; a fresh login session should pick up the group normally.
