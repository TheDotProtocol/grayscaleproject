# Sprint 4 Phase C Changelog

**Tag:** `Sprint-4-Phase-C-AttentionBudget-v1.0`  
**Date:** 2026-07-26

## Added

### Platform (`packages/platform/src/attention-budget/`)
- Core types: budget, capacity, debt, recovery, consumption, allocation, metrics
- 10 interface-first ports + explainability, history, audit, certification
- Autonomous execution governance contracts (`AUTONOMOUS_EXECUTION_ENABLED=false`)
- 14 Mission Control widget definitions
- `phase-c-ecs.ts` — 9 Executive Compliance extension gates
- Events: attention-budget.*, autonomy.governance.validated

### Backend (`backend/src/modules/attention-budget/`)
- `AttentionBudgetModule`
- `AttentionAllocatorService`, `AttentionCapacityService`, `AttentionDebtService`
- `AttentionRecoveryService`, `AttentionBudgetCertificationService`
- `AutonomyGovernanceService` (validation only)
- `AttentionBudgetContextService` — CompanyContext assembly
- REST API `/attention-budget/:companyId/*`
- `attention-budget.spec.ts` — 3 unit tests

### CompanyContext
- Version `2.2.0-s4c-attention-budget`
- Fields: attentionBudget, attentionCapacity, attentionDebt, attentionRecovery, attentionConsumption, attentionBudgetHealth, attentionAllocation, attentionMetrics

### Documentation
- ORGANIZATIONAL_ATTENTION_BUDGET.md, AUTONOMOUS_EXECUTION_GOVERNANCE.md
- Runtime, explainability, certification companions
- ADR-080 through ADR-084

## Changed

- `FOUNDER_CONSTITUTION.md` — hierarchy includes OAB
- `executive-compliance.service.ts` — 9 Phase C ECS checks
- `widget-catalog.service.ts` — 14 attention budget widgets
- `context-runtime` — attention-budget assembler

## Unchanged

- Bedrock frozen; no duplicate storage; no Prisma from executives
- `EXECUTIVES_ENABLED=false`
- Autonomous execution disabled
- Organizational Attention Engine (ONS) — feeds budget, not replaced
