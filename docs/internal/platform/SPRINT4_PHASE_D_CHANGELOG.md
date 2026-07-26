# Sprint 4 Phase D Changelog

**Tag:** `Sprint-4-Phase-D-PolicyEngine-v1.0`  
**Date:** 2026-07-26

## Added

### Platform (`packages/platform/src/policy/`)
- Core types: verdicts, snapshots, decisions, Sprint 5 extension points (reserved)
- 15 interface-first ports (Policy + Governance)
- Explainability, history, audit, certification contracts
- 15 Mission Control widget definitions
- `phase-d-ecs.ts` — 10 Executive Compliance extension gates
- Events: policy.evaluated, governance.checkpoint.completed, policy.approval.routed, certification events

### Backend (`backend/src/modules/policy-engine/`)
- `PolicyEngineModule`
- `PolicyEvaluationService`, `PolicyEngineConstraintService`, `PolicyApprovalService`
- `PolicyAuditService`, `PolicyHistoryService`, `PolicyExplainabilityService`
- `GovernanceKernelService`, `GovernanceCertificationService`
- `PolicyEngineContextService` — CompanyContext assembly
- REST API `/policy-engine/:companyId/*`
- `policy-engine.spec.ts` — 3 unit tests

### CompanyContext
- Version `2.3.0-s4d-policy-engine`
- Fields: organizationalPolicies, policyHealth, policyConstraints, policyApprovals, policyExceptions, governanceState, governanceHealth, governanceMetrics, policyExplainability, policyHistory

### Documentation
- ORGANIZATIONAL_POLICY_ENGINE.md, ORGANIZATIONAL_GOVERNANCE_KERNEL.md
- Architecture, runtime, explainability, certification companions
- ADR-085 through ADR-089

## Changed

- `FOUNDER_CONSTITUTION.md` — hierarchy includes OPE + Governance Kernel
- `executive-compliance.service.ts` — 10 Phase D ECS checks
- `widget-catalog.service.ts` — 15 policy/governance widgets
- `context-runtime` — policy-engine assembler
- `events/catalog.ts` — Phase D events

## Unchanged

- Bedrock frozen; no duplicate storage; no Prisma from executives
- `EXECUTIVES_ENABLED=false`
- `AUTONOMOUS_EXECUTION_ENABLED=false`
- Sprint 5 extension points defined only — not implemented
