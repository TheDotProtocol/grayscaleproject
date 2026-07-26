# RC1 Track A Changelog

**Release:** RC1-Track-A-FounderWorkspace-v1.0  
**Date:** 2026-07-26

---

## Added — Frontend (`apps/web`)

- Founder Workspace navigation (20 routes, 7 executives)
- `/dashboard/home` — Founder Home
- Pages: organization, council, twin, strategy, learning, wisdom, reflection, simulation, forecasts, automation, graph, notebook, goals, projects, profile
- Executive workspaces: `/dashboard/executives/[id]`
- Workspace component library (Panel, GenericDataView, CommandPalette, etc.)
- `useWorkspaceQuery` hook + `lib/api/workspace.ts`
- Extended Mission Control widget renderer for Sprint 3/4 widgets

## Changed

- Sidebar → grouped Founder Workspace navigation
- `/dashboard` redirects to `/dashboard/home`
- Dashboard layout includes command palette

## Added — Backend

- MC widget catalog: council + twin widgets registered

## Documentation

- FOUNDER_WORKSPACE_ARCHITECTURE.md + 9 platform guides
- ADR-052, ADR-053, ADR-054
- RC1 certificate, changelog, product readiness report

---

## Unchanged

- EXECUTIVES_ENABLED=false
- Bedrock frozen
- All business logic remains in backend
