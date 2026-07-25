# Athena Reference Implementation

**Version:** 1.0.0 (Sprint 2)  
**Executive ID:** `athena`  
**Canonical Identity:** `ATHENA` (never changes)  
**Status:** Reference executive — all future executives extend via inheritance

---

## Why Athena Is the Reference Executive

Athena is the first fully constitutional executive. It demonstrates:

- Discovery before recommendation (never "ChatGPT with memory")
- Full Bedrock consumption without ownership
- Mandatory skeptic, notebook, and curiosity integration
- Complete explainability for Mission Control
- Founder Constitution inheritance
- Certification via deterministic ECS (no LLM pass/fail)

Atlas, Ledger, Sentinel, Mercury, Navigator, Forge, and all future executives **extend Athena through inheritance—not duplication**.

All executives inherit the **Organizational Operating Model** (`ORGANIZATIONAL_OPERATING_MODEL.md`)—the organization reasons independently; executives consume, never own, organizational intelligence.

---

## Architecture Responsibilities

| Responsibility | Owner |
|----------------|-------|
| Orchestration of discovery → recommendation pipeline | Athena Service |
| Platform data access | Bedrock services only |
| Storage | Platform modules (Memory, Graph, Events) |
| Certification | Executive Compliance Suite |
| Presentation / persona | Identity Engine (display only) |
| Constitutional enforcement | Founder Constitution + Mission Control |

Athena **never** owns persistence, graph storage, memory indices, or strategy state.

---

## Interfaces Implemented

- `DiscoveryEnginePort` — 13-stage discovery pipeline
- `ExecutiveNotebookPort` — immutable notebook references
- `ExecutiveCuriosityEnginePort` — investigations over assumptions
- `ExecutiveSkepticEnginePort` — mandatory challenge pass
- `ExecutiveComplianceSuitePort` — ECS certification consumer
- `RecommendationPipelineTrace` — Part 6 mandatory pre-draft stages
- `AthenaRecommendationExplainability` — full MC explainability

---

## Runtime Services Consumed (Never Owned)

| Service | Usage |
|---------|-------|
| Executive Runtime | Lifecycle, outputs, transitions |
| Company Context | Single assembly point for all intelligence |
| Memory Engine | Evidence via context |
| Knowledge Graph | Cross-reference via context |
| Strategy Engine | Goals, risks, policies, constraints |
| Organizational Intelligence | DNA, emotion, culture, wisdom, learning |
| Intent Engine | Intent coverage and alignment |
| Temporal Intelligence | Time-aware context |
| Signals | Active signal references |
| Insights | Insight references |
| Executive Notebook | Immutable audit trail |
| Curiosity Engine | Unknowns → investigations |
| Skeptic Engine | Challenge before draft |
| Trust Engine | Trust scoring (via org intelligence) |
| Identity Engine | Presentation only—never reasoning |
| Experience Memory | Via context runtime |
| Founder Constitution | Via `CompanyContext.founderConstitution` |

---

## Services Athena Intentionally Does NOT Own

- Prisma / database access
- Direct event store writes (uses Executive Runtime)
- Policy storage or mutation
- Graph node creation
- Memory indexing
- LLM provider selection
- Automation execution

---

## Recommendation Pipeline (Part 6)

Mandatory order before any draft recommendation:

1. Observe → 2. Discover → 3. Understand → 4. Validate → 5. Challenge  
6. Cross-reference → 7. Investigate → 8. Generate hypotheses  
9. Run Skeptic Engine → 10. Consult Notebook → 11. Consult Memory  
12. Consult Graph → 13. Consult Organizational Intelligence  
14. Consult Intent → 15. Consult Policies → 16. Consult Constraints  
17. Consult Founder Constitution → 18. Generate Draft Recommendation

Implementation: `AthenaService.runRecommendationPipeline()`

---

## Future Executive Inheritance Pattern

```typescript
// Future executives extend Athena patterns:
class AtlasService extends AthenaServicePattern {
  executiveId = "atlas";
  // Override domain-specific draft rules only
  // Never duplicate context assembly, notebook, skeptic, or compliance
}
```

Shared platform contracts in `@grayscale/platform/executive/*` ensure zero duplication.

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/companies/:id/athena/status` | Status and certification state |
| GET | `/companies/:id/athena/pipeline` | Recommendation pipeline trace |
| POST | `/companies/:id/athena/instances/:id/discovery` | Run discovery |
| POST | `/companies/:id/athena/instances/:id/recommendations/draft` | Draft recommendations |
| GET | `/companies/:id/executive-compliance/athena/certify` | ECS certification |

---

## Activation

Athena may be **Certified** but remains **Dormant** until Founder explicitly enables executives.

`EXECUTIVES_ENABLED=false` until Founder activation post-certification.
