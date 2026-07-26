# Organizational Attention Runtime

**Technical companion to `ORGANIZATIONAL_ATTENTION_BUDGET.md`**

**Version:** 1.0.0

---

## Architecture

```
Attention Engine (ONS perception)
  → Attention Budget Module (constitutional allocation)
    → AttentionAllocatorService
    → AttentionCapacityService
    → AttentionDebtService
    → AttentionRecoveryService
    → AttentionBudgetCertificationService
  → CompanyContext (read-only snapshots)
  → Mission Control (14 widgets)
```

---

## Platform Contracts

`packages/platform/src/attention-budget/`

| Port | Role |
|------|------|
| `AttentionBudgetPort` | Snapshot, health, metrics |
| `AttentionAllocatorPort` | Organizational allocation |
| `AttentionConsumptionPort` | Consumption measurement |
| `AttentionDebtPort` | Debt assessment |
| `AttentionCapacityPort` | Capacity and saturation |
| `AttentionRecoveryPort` | Recovery and fatigue |
| `AttentionBudgetExplainabilityPort` | Allocation explanations |
| `AttentionBudgetHistoryPort` | Versioned history |
| `AttentionBudgetAuditPort` | Append-only audit |
| `AttentionBudgetCertificationPort` | 15 ECS gates |

---

## API

```
GET  /attention-budget/:companyId/snapshot
GET  /attention-budget/:companyId/health
GET  /attention-budget/:companyId/capacity
GET  /attention-budget/:companyId/debt
GET  /attention-budget/:companyId/recovery
GET  /attention-budget/:companyId/allocation
POST /attention-budget/:companyId/allocate
GET  /attention-budget/:companyId/certification
GET  /attention-budget/:companyId/autonomy-governance
```

---

## CompanyContext Fields

- `attentionBudget`, `attentionCapacity`, `attentionDebt`, `attentionRecovery`
- `attentionConsumption`, `attentionBudgetHealth`, `attentionAllocation`, `attentionMetrics`

Context version: `2.2.0-s4c-attention-budget`

---

## Events

- `attention-budget.allocated`
- `attention-budget.certified`
- `attention-budget.debt.recorded`
- `attention-budget.recovery.assessed`
- `autonomy.governance.validated`
