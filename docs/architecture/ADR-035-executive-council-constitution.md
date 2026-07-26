# ADR-035: Executive Council Constitution

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** 3 Phase A — Executive Council Foundation

## Context

Sprint 2 certified Athena as the reference executive (dormant). Sprint 3 introduces multi-executive collaboration via the Executive Council. Before implementing council runtime logic, constitutional governance must define how executives deliberate, disagree, vote, and escalate—without becoming a multi-agent chat.

## Decision

1. Create `EXECUTIVE_COUNCIL_CONSTITUTION.md` as immutable document below Organizational Operating Model
2. Create companion architecture documents: lifecycle, governance, explainability
3. Define platform contracts in `packages/platform/src/council/` — **contracts only, no runtime**
4. Reserve Mission Control council widgets — no data providers in Phase A
5. Preserve Sprint 2 `executive-council.ts` messaging port unchanged

## Why Constitutional Governance Before Implementation

| Risk without constitution | Mitigation |
|---------------------------|------------|
| Multi-agent chat behavior | Structured deliberation lifecycle |
| False consensus | Measured consensus + minority preservation |
| Executive-owned knowledge | Organization-owned council record |
| Founder bypass | Mandatory review/override gates |
| Unexplainable decisions | CouncilExplanation contract |

## Consequences

- Phase B implements `ExecutiveCouncilFoundationPort` against these contracts
- ECS extends with council certification gates
- All executives inherit council constitution automatically
- No Bedrock, Athena, or runtime changes in Phase A

## Non-negotiables

- Bedrock frozen
- No Prisma, NestJS services, migrations, UI, or LLM in Phase A
- Event-driven architecture for Phase B implementation
