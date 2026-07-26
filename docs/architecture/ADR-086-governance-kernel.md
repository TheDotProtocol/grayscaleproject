# ADR-086: Governance Kernel

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase D

## Context

Policy evaluation alone does not enforce constitutional rules at execution boundary. A final checkpoint is required that validates policy decisions, routes approvals, and emits governance events without reasoning.

## Decision

1. Create `ORGANIZATIONAL_GOVERNANCE_KERNEL.md` as immutable constitutional document
2. Implement `GovernanceKernelService` as final checkpoint before execution
3. Kernel validates — never reasons
4. Integrate approval routing (founder, council, executive)
5. Emit `governance.checkpoint.completed` on every evaluation

## Consequences

- Two-layer governance: OPE evaluates permission; Kernel enforces checkpoint
- Governance state, health, metrics on CompanyContext
- 12 governance certification gates
- Sprint 5 automation enforcement extension point reserved

## Bedrock Extension Test

Kernel wraps Policy Engine — no new data plane; event-driven enforcement only.
