# ADR-057: Command Palette as Organizational Command System

**Status:** Accepted  
**Date:** 2026-07-26  
**Track:** RC1 Track B

## Context

Track A introduced a navigation-only ⌘K palette. Track B requires full organizational command capabilities: search, create, run actions, recent commands.

## Decision

Expand command palette to orchestrate:

- Local navigation + executive jumps
- Debounced universal search API
- Quick actions dispatch
- Pinned create commands (simulation, forecast, council, notebook)
- Recent commands in localStorage + workspace session sync for searches

## Consequences

- Single keyboard entry point for founder operations
- All mutations via existing MC action dispatcher
- No new backend command registry — reuses quick-actions + search APIs
