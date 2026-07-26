# Organizational Alignment Engine

**Version:** 1.0.0 (Sprint 3 Phase D)  
**Status:** IMMUTABLE  
**ADR:** ADR-067

---

## Purpose

Measure alignment across the organizational chain with explainable scores, evidence, confidence, and gap identification.

---

## Alignment Dimensions

| Dimension | Measures |
|-----------|----------|
| Vision ↔ Mission | Intent themes present |
| Mission ↔ Strategy | Goals mapped to mission |
| Strategy ↔ Objectives | Objectives under goals |
| Objectives ↔ Projects | Project focus allocation |
| Projects ↔ Execution | Execution vs declared focus |
| Execution ↔ Results | Results tracking |
| Founder ↔ Organization | Founder bandwidth vs org load |
| Executives ↔ Founder | Executive attention distribution |
| Culture ↔ Decisions | Decision culture health |
| Identity ↔ Execution | Identity-intent coherence |
| Intent ↔ Outcomes | Intent-outcome chain integrity |

Each dimension: `AlignmentScore` with score, confidence, evidence, reason, gaps.

**overallAlignment** — aggregate score.

---

## Integration

- **CompanyContext.alignment** / **organizationalAlignment**
- Consumes: Intent, Attention, Strategy
- Mission Control: `organizational-alignment`

No recommendations. Measurement only.
