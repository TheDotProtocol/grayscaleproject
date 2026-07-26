# ADR-053: Workspace API-Only Orchestration

**Status:** Accepted | **Date:** 2026-07-26

## Decision

Workspace pages consume backend APIs only. No Prisma, no duplicated storage, no client-side business logic duplication.

## Consequences

`lib/api/workspace.ts` helpers, `useWorkspaceQuery` hook, GenericDataView for adaptive rendering.
