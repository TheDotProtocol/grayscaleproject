# Organizational Attention Engine

**Version:** 1.0.0 (Sprint 3 Phase B)  
**Module:** `packages/platform/src/attention/`, `backend/.../attention-engine.service.ts`  
**ADR:** ADR-038

---

## Purpose

Measure where the organization focuses its limited cognitive capacity. Attention is a measurable organizational resource—not an executive preference.

---

## Contracts

| Type | Purpose |
|------|---------|
| `OrganizationalAttention` | Full attention assembly |
| `AttentionAllocation` | Domain/executive weight |
| `AttentionBudget` | Cognitive slot capacity |
| `AttentionSaturation` | Overload detection |
| `AttentionDebt` | Deferred focus items |
| `AttentionDrift` | Declared vs actual focus |
| `AttentionHealth` | Health score |
| `AttentionForecast` | Contract only (Phase C) |

---

## Integration

- **CompanyContext.attention** — read-only, assembled by `AttentionEngineService`
- **Athena Discovery** — `observe` stage includes attention saturation/drift
- **Council Runtime** — `CouncilAttentionService` for Mission Control

---

## Events

`attention.snapshot.captured`

---

*AttentionForecast implementation deferred to Sprint 3 Phase C (Digital Twin)*
