# Executive Council Runtime

**Version:** 1.0.0 (Sprint 3 Phase B)  
**Module:** `backend/src/modules/council-runtime/`  
**Port:** `ExecutiveCouncilFoundationPort`

---

## Architecture

Event-driven council runtime. Executives communicate **only** through the Executive Runtime Bus—never directly.

```
CouncilRuntimeController
  └── ExecutiveCouncilRuntimeService (port implementation)
        ├── CouncilSessionService
        ├── CouncilEvidenceService (via bus)
        ├── CouncilConsensusService
        ├── CouncilDecisionService + CouncilExplainabilityService
        ├── CouncilGovernanceService
        ├── CouncilHistoryService + CouncilReplayService
        └── CouncilDecisionClassifierService
```

State: in-memory `CouncilStoreService` + event catalog emissions.

---

## Lifecycle

1. Open session (constitutional compliance check)
2. Open issue with **decision class** (classification first)
3. Submit evidence (bus notification)
4. Record structured deliberation (bus notification)
5. Cast votes / record minority opinions
6. Measure consensus (deterministic)
7. Propose resolution → generate explanation
8. Founder approval / escalation / override
9. History, replay, audit, metrics

---

## API

See `COUNCIL_RUNTIME_API.md`

Base path: `/companies/:companyId/council`

---

*ADR-037*
