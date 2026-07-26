# Organizational Attention Engine

**Version:** 1.1.0 (Sprint 3 Phase B — ONS alignment)  
**Module:** `packages/platform/src/attention/`, `backend/.../attention-engine.service.ts`  
**ADR:** ADR-038, ADR-058 (ONS umbrella)

---

## Purpose

Measure where the organization focuses its limited cognitive capacity. Attention is a measurable organizational resource—not an executive preference.

Part of the **Organizational Nervous System** (`ORGANIZATIONAL_NERVOUS_SYSTEM.md`). Executives consume attention; they never consume raw events.

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
| `AttentionItem` | Queue item with score/urgency |
| `AttentionQueue` | Prioritized attention items |
| `AttentionPolicy` / `AttentionRule` | Allocation policy contracts |
| `AttentionExplanation` | Explainability for rankings |
| `AttentionHistory` | Immutable allocation history |
| `AttentionMetrics` | Operational metrics |
| `OrganizationalAttentionPort` | Port alias |
| `AttentionEngine` | Engine port alias |

---

## Integration

- **CompanyContext.attention** / **organizationalAttention** — read-only, assembled by `AttentionEngineService`
- **CompanyContext.attentionHealth** — derived health snapshot
- **Athena Discovery** — `observe` stage includes attention saturation/drift
- **Council Runtime** — `CouncilAttentionService` for Mission Control

---

## Events

`attention.snapshot.captured`

---

*AttentionForecast implementation deferred to Sprint 3 Phase C (Digital Twin)*
