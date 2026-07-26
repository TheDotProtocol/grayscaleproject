# Executive Specialization

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Source:** `packages/platform/src/executive/executive-specialization.ts`

---

## Rule

Each executive owns **reasoning only** in exclusive domains. No executive duplicates another's responsibilities. Overlap triggers council responsibility conflict detection.

---

## Domain Matrix

| Executive | Domains | Decision Classes |
|-----------|---------|------------------|
| **Athena** | strategy, discovery, governance | strategic, operational, governance |
| **Atlas** | operations, execution, capacity, workflow, delivery | operational, execution |
| **Ledger** | finance, cash, revenue, forecasting, budget | financial |
| **Mercury** | communication, stakeholders, narratives, brand | communication |
| **Sentinel** | risk, compliance, security, governance | risk, compliance |
| **Navigator** | strategy, scenarios, trade_offs | strategic |
| **Forge** | innovation, experiments, opportunities, transformation | innovation |

---

## Conflict Detection

`CouncilCollaborationService.detectConflicts()` flags domains claimed by multiple council members. Conflicts surface via:

```
GET /companies/:id/council/collaboration/conflicts
```

Resolution path: council deliberation → founder escalation.

---

## Twin Views by Executive

| Executive | Primary Twin Views |
|-----------|-------------------|
| Atlas | strategyView, organizationView |
| Ledger | organizationView, strategyView |
| Mercury | identity, signal views |
| Sentinel | strategyView.criticalRisks |
| Navigator | intent, strategy, timeline |
| Forge | insightView, wisdom |

All views accessed via `extractTwinReasoning(ctx)` — never direct source queries.
