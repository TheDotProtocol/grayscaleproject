# Twin Explainability

**Version:** 1.0.0 (Sprint 3 Phase B)  
**Module:** `packages/platform/src/twin/twin-explainability.ts`  
**ADR:** ADR-039, ADR-058

---

## Purpose

The Living Organizational Twin must be **explainable** — not a black box. Every twin state must trace to evidence, constitutional references, and organizational impact expectations.

Executives, Founders, and Mission Control consume twin explainability to understand *why* the organization appears as it does.

---

## Contracts

| Type | Purpose |
|------|---------|
| `TwinExplainabilityEvidence` | Source, type, summary, weight |
| `TwinExplainability` | Full explanation assembly |
| `TwinExplainabilityPort` | `explain(companyId, versionId?)` |

---

## TwinExplainability Fields

| Field | Purpose |
|-------|---------|
| `evidenceConsidered` | Weighted evidence from Bedrock sources |
| `confidenceBreakdown` | Per-domain confidence scores |
| `attentionInfluence` | How attention shaped the twin |
| `signalInfluence` | Signal IDs that influenced state |
| `councilInfluence` | Council decisions affecting twin |
| `founderConstitutionRefs` | Constitutional anchors |
| `operatingModelRefs` | OOM section references |
| `rejectedAlternatives` | States considered but not selected |
| `rollbackStrategy` | How to revert if reality diverges |
| `expectedOrganizationalImpact` | Anticipated downstream effects |

---

## Principles

1. **Evidence-first** — every attribute traceable to source
2. **Constitutional anchoring** — references Founder Constitution and OOM
3. **Attention transparency** — attention allocation visible in explanation
4. **Signal transparency** — correlated signals cited
5. **Auditability** — versioned with twin snapshot

---

## Integration

- Twin Runtime (`TwinRuntimePort`)
- Mission Control: `twin-confidence`, `twin-integrity-summary` widgets
- Executive Runtime — explainability available on demand
- Council Explainability — complementary, not duplicate

---

*See also: `COUNCIL_EXPLAINABILITY.md`, `LIVING_ORGANIZATIONAL_TWIN.md`*
