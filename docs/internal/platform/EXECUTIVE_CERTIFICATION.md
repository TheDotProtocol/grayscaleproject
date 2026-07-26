# Executive Certification

**Project Grayscale — Production Readiness Gate for Executives**

**Version:** 1.5 (Sprint 2 Phase B — Athena Reference Executive)  
**Foundation:** v1.0.0-bedrock  
**Reference Executive:** Athena (Sprint 2)  
**Companion docs:** `EXECUTIVE_PHILOSOPHY.md`, `EXECUTIVE_MANIFESTO.md`, `EXECUTIVE_CERTIFICATION_SPECIFICATION.md`

No executive may enter production until certified. Certification is **binary**: PASS or FAIL. Partial certification is not recognized.

---

## 1. Purpose

This document defines the certification process, areas, scoring, approval criteria, and failure conditions for every executive in Project Grayscale.

Certification verifies that an executive:

- Extends Foundation without breaking it
- Complies with the Executive Manifesto
- Implements all mandatory technical contracts
- Operates safely, observably, and deterministically

---

## 2. Certification Prerequisites

Before certification begins:

| Prerequisite | Status |
|--------------|--------|
| Foundation certified (Bedrock) | Required |
| `EXECUTIVE_PHILOSOPHY.md` accepted | Required |
| `EXECUTIVE_MANIFESTO.md` v1.1 accepted | Required |
| `EXECUTIVE_CERTIFICATION_SPECIFICATION.md` accepted | Required |
| Discovery Mode complete (Athena) | Required before recommendation generation |
| Executive implementation complete | Required |
| All unit/integration tests written | Required |

---

## 3. Certification Areas

Each area is scored **PASS**, **WARN**, or **FAIL**. Any **FAIL** in a critical area blocks certification.

### 3.1 Architecture Compliance

| Criterion | Pass When |
|-----------|-----------|
| Uses Executive Runtime exclusively | No bypass of lifecycle, bus, inbox, permissions |
| CompanyContext-only data access | Zero Prisma, zero direct DB, zero external API |
| Event-driven side effects | All mutations via domain events + projectors |
| Modular boundaries | No duplicated logic or storage |
| ADR compliance | Role architecture documented in ADR |

**Critical:** YES

### 3.2 Foundation Compliance

| Criterion | Pass When |
|-----------|-----------|
| Compatible with v1.0.0-bedrock | Platform Evolution check passes |
| No breaking API changes | Contract tests pass |
| Event catalog entries registered | All executive events in catalog |
| Governance integration | Lifecycle changes recorded |

**Critical:** YES

### 3.3 Executive Runtime

| Criterion | Pass When |
|-----------|-----------|
| register / activate / suspend / retire | All lifecycle transitions work |
| Heartbeat every 60s | Missed heartbeat handling verified |
| State machine deterministic | Same inputs → same state transitions |

**Critical:** YES

### 3.4 Executive Bus

| Criterion | Pass When |
|-----------|-----------|
| Typed messages only | Schema validation on send/receive |
| Idempotent delivery | Duplicate messages handled |
| correlationId on all messages | Audit chain intact |
| Escalation messages | Policy-driven routing verified |

**Critical:** YES

### 3.5 Permissions

| Criterion | Pass When |
|-----------|-----------|
| Default deny | Ungranted actions return 403 |
| assert() on every action | 100% coverage in certification tests |
| Denial logged to Security Observatory | authorization.failure events emitted |
| Wildcard grants documented | ADR if any wildcard used |

**Critical:** YES

### 3.6 Capabilities

| Criterion | Pass When |
|-----------|-----------|
| Declared at registration | CapabilityDiscoveryService validates |
| Minimum necessary grants | No over-provisioning |
| Capability revocation | Immediate effect on deny |

**Critical:** YES

### 3.7 Mission Control Integration

| Criterion | Pass When |
|-----------|-----------|
| Role widgets registered | Widget catalog entries exist |
| Widget data via CompanyContext | No direct service bypass |
| Health widget independent | Not conflated with platform-health |
| Refresh policies defined | Polling intervals documented |

**Critical:** NO (WARN allowed with documented gaps)

### 3.8 Memory Usage

| Criterion | Pass When |
|-----------|-----------|
| Read via CompanyContext | No direct MemoryQueryService from executive |
| Write with capability + provenance | source tagged correctly |
| No deletion without grant | Denial tested |

**Critical:** YES

### 3.9 Knowledge Graph Usage

| Criterion | Pass When |
|-----------|-----------|
| Read via CompanyContext | Graph evidence in recommendations |
| Mutations via events only | No direct GraphNode writes |
| Edge validation respected | Invalid edges rejected |

**Critical:** YES

### 3.10 Strategy Engine Usage

| Criterion | Pass When |
|-----------|-----------|
| Policies evaluated before recommend | Policy chain in trace |
| Constraints enforced | Hard blocks never overridden |
| Priority Engine used | No ad-hoc ranking |

**Critical:** YES

### 3.11 Strategic Intelligence Usage

| Criterion | Pass When |
|-----------|-----------|
| Recommendations cite intelligence entities | Goals, risks, opportunities linked |
| Open recommendations surfaced | listOpen integration works |
| Approval workflow respected | requiresApproval honored |

**Critical:** YES

### 3.12 Recommendation Quality

| Criterion | Pass When |
|-----------|-----------|
| All mandatory output fields present | See Athena output contract |
| No omitted fields | Schema validation 100% |
| Deterministic for same inputs | Replay test passes |
| Alternatives provided | At least one alternative when applicable |

**Critical:** YES

### 3.13 Explainability

| Criterion | Pass When |
|-----------|-----------|
| Decision trace on every mutation | Trace API returns complete record |
| Evidence refs resolvable | IDs link to real entities |
| Redaction rules applied | No secrets in traces |
| Rationale human-readable | Template-based, not raw LLM dump |

**Critical:** YES

### 3.14 Audit Logging

| Criterion | Pass When |
|-----------|-----------|
| Domain events for all material actions | Event catalog compliance |
| Governance entries cross-linked | correlationId matches |
| Executive audit log complete | ExecutiveAuditLog populated |

**Critical:** YES

### 3.15 Event Generation

| Criterion | Pass When |
|-----------|-----------|
| All executive events in catalog | executive.* events registered |
| Version fields correct | Event schema version matches |
| Idempotent publish | Duplicate publish safe |

**Critical:** YES

### 3.16 Error Handling

| Criterion | Pass When |
|-----------|-----------|
| Graceful degradation | Missing context → defer, not crash |
| Structured error responses | No stack traces to founder UI |
| DLQ for unrecoverable failures | Failed jobs tracked |

**Critical:** NO

### 3.17 Recovery

| Criterion | Pass When |
|-----------|-----------|
| Suspend on critical security finding | Auto-suspend tested |
| Inbox recovers after restart | State persisted correctly |
| Heartbeat resumes after activation | No orphan state |

**Critical:** NO

### 3.18 Security

| Criterion | Pass When |
|-----------|-----------|
| Sandbox enforced | Plugin isolation verified |
| No credential access | Vault-only pattern |
| Authorization failures observable | Security Observatory integration |
| Rate limits respected | Load test within limits |

**Critical:** YES

### 3.19 Performance

| Criterion | Pass When |
|-----------|-----------|
| Inbox processing p95 < role SLO | Benchmark documented |
| Recommendation generation p95 < 5s | Without LLM timeout failures |
| Memory footprint stable | No unbounded caches |

**Critical:** NO

### 3.20 Testing

| Criterion | Pass When |
|-----------|-----------|
| Unit test coverage ≥ 90% | On executive module |
| Integration tests pass | End-to-end certification suite |
| Determinism tests pass | Replay identical outputs |
| Zero skipped certification tests | 100% scenario pass rate |

**Critical:** YES

### 3.21 Documentation

| Criterion | Pass When |
|-----------|-----------|
| Role specification complete | Purpose, inputs, outputs, widgets |
| API docs published | Swagger + markdown |
| Manifesto compliance matrix | Self-assessment documented |
| Runbook for suspend/retire | Operations documented |

**Critical:** NO

---

## Part II — Sprint 2 Phase A Mandatory Gates

*The following certification areas extend Part I. All Part I areas remain required.*

### 3.22 Identity Validation

| Criterion | Pass When |
|-----------|-----------|
| Executive ID immutable | UUID never changes across lifecycle |
| Canonical name stable | Internal name distinct from display name |
| Identity record complete | All manifesto §40 fields populated |
| Display name ≠ identity | Audit trails use Executive ID only |

**Critical:** YES

### 3.23 Trust Validation

| Criterion | Pass When |
|-----------|-----------|
| Trust metrics computed | Accuracy, acceptance, success rates tracked |
| Trust Score displayed | Mission Control executive-trust widget |
| New executive starts at baseline | No assumed trust |
| Trust attributed to Executive ID | Not display name |

**Critical:** YES

### 3.24 Experience Memory Validation

| Criterion | Pass When |
|-----------|-----------|
| Separate from Company Memory | Distinct storage and provenance |
| Lessons learned recorded | On recommendation outcome |
| Corrections captured | Founder feedback persisted |
| Never overwrites company memory | Write isolation verified |

**Critical:** YES

### 3.25 Identity Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| Identity read-only to executive | Mutation attempts denied |
| Presentation adapts to identity | Tone, language, accessibility tested |
| Reasoning unchanged by persona | Same inputs → same recommendation substance |
| Identity Engine inherited | All executives receive identity automatically |
| Separate from ECM | Identity prefs ≠ behavioural inference |

**Critical:** YES

### 3.26 Executive Cognitive Model Validation

| Criterion | Pass When |
|-----------|-----------|
| ECM separate from Memory | Distinct storage and provenance |
| Evidence required for updates | Updates without evidence rejected |
| No assumption-based inference | LLM-only ECM updates fail certification |
| Executives consume ECM read-only | Via CompanyContext only |
| Confidence reflects evidence volume | Low evidence → low confidence surfaced |

**Critical:** YES

### 3.27 Discovery Mode Validation

| Criterion | Pass When |
|-----------|-----------|
| Discovery pipeline enforced | No recommend before eligibility |
| Discovery state tracked | Lifecycle records `discovering` phase |
| All 13 discovery stages logged | Observe through recommendation eligibility |
| Premature recommend blocked | Certification test rejects early output |

**Critical:** YES

### 3.28 Policy Validation

| Criterion | Pass When |
|-----------|-----------|
| Active policies retrieved | Via CompanyContext |
| Policy evaluation in trace | Every recommendation |
| No invented policies | Hallucination test fails certification |

**Critical:** YES

### 3.29 Constraint Validation

| Criterion | Pass When |
|-----------|-----------|
| Hard constraints block | Cannot override |
| Constraint evaluation in trace | Documented in explainability |
| Conflict surfaced to founder | Not silently ignored |

**Critical:** YES

### 3.30 Executive Council Validation

| Criterion | Pass When |
|-----------|-----------|
| Council messages via Bus only | No direct calls |
| Approve/disagree/delegate/escalate | All actions typed and auditable |
| Dissent requires evidence | Empty disagree rejected |
| Council events in catalog | executive.council.* registered |

**Critical:** NO (WARN until multi-executive; YES for Athena council-ready)

### 3.31 Recommendation Lifecycle Validation

| Criterion | Pass When |
|-----------|-----------|
| All lifecycle states supported | observed → lessons_learned |
| State transitions emit events | No silent skips |
| Founder review required | submitted → approved/rejected |
| measured → lessons_learned | Outcome loop closed |

**Critical:** YES

### 3.32 Executive Humility Validation

| Criterion | Pass When |
|-----------|-----------|
| Unknown response when evidence missing | Test scenario passes |
| Deferred response when confidence low | Below threshold → defer |
| Humility outputs in Mission Control | Visible, not errors |
| No fabricated certainty | Stress test passes |

**Critical:** YES

### 3.33 Persona Validation

| Criterion | Pass When |
|-----------|-----------|
| Display name customization works | UI shows founder name |
| Internal identity unchanged | Logs show canonical name |
| Reasoning pipeline identical | Same substance across personas |

**Critical:** YES

### 3.34 Athena Pipeline Validation

| Criterion | Pass When |
|-----------|-----------|
| Full pipeline executed | All 12 stages produce trace artifacts |
| No stage skipped | Static/runtime probe |
| Not "chat with memory" | No direct LLM-only path to recommend |

**Critical:** YES

### 3.35 Explainability Depth Validation

| Criterion | Pass When |
|-----------|-----------|
| Memories cited | IDs resolvable |
| Events cited | IDs resolvable |
| Graph nodes cited | IDs resolvable |
| Policies/constraints in trace | Evaluation chain complete |
| Alternatives documented | With rejection rationale |

**Critical:** YES

### 3.36 Mission Control Executive Widgets

| Criterion | Pass When |
|-----------|-----------|
| Minimum widget set registered | identity-profile, discovery-progress, executive-trust, recommendation-readiness |
| ADR-014 widget IDs reserved | All 10 discovery widgets in catalog |
| Widget data via CompanyContext | No bypass |
| Independent from platform-health | Separate widgets |

**Critical:** NO (WARN allowed for Phase A partial; YES before production)

### 3.37 EXECUTIVES_ENABLED Gate

| Criterion | Pass When |
|-----------|-----------|
| All critical areas PASS | Zero critical FAILs |
| Certification score ≥ 90 | Computed across all areas |
| Governance approval recorded | executive.activation.approved |
| Only then: EXECUTIVES_ENABLED=true | Flag flip is final gate |

**Critical:** YES — **no executive activates without this gate**

---

## Part III — Sprint 2 Phase A.2 Mandatory Gates

*Extends Part II. All prior gates remain required.*

### 3.38 Organizational DNA Validation

| Criterion | Pass When |
|-----------|-----------|
| DNA record versioned | Immutable history retained |
| Approval workflow enforced | Unapproved changes blocked |
| Executives read-only | Mutation attempts denied |
| Non-negotiables respected | Recommendations violating DNA fail certification |
| Graph/memory links valid | Link refs resolvable |

**Critical:** YES

### 3.39 Founder DNA Validation

| Criterion | Pass When |
|-----------|-----------|
| Evidence required for updates | Inference-only updates rejected |
| Separate from Identity Engine | Distinct storage and provenance |
| Executives consume read-only | Via CompanyContext |
| Behavioural adaptation tested | Recommendations frame to founder DNA |

**Critical:** YES

### 3.40 Emotional Context Validation

| Criterion | Pass When |
|-----------|-----------|
| All scores explainable | Evidence, confidence, reason, trend present |
| Observation only | No manipulative actions from emotional engine |
| Executives never manipulate | Stress test passes |
| Founder and org metrics tracked | 16 metrics contract verified |

**Critical:** YES

### 3.41 Organizational Cognition Validation

| Criterion | Pass When |
|-----------|-----------|
| Distinct from ECM | Separate contracts and storage |
| Evidence-governed updates | No assumption-based inference |
| Executives consume read-only | Via CompanyContext |
| Cognitive evolution tracked | Timeline artifacts present |

**Critical:** YES

### 3.42 Learning Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| All 11 record types supported | failure through operational_lesson |
| Auto-linking to memory/graph/strategy | Link refs persisted |
| Distinct from wisdom | Separate contracts |
| Timeline retrievable | learning-timeline widget data |

**Critical:** YES

### 3.43 Wisdom Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| Approval workflow enforced | Unapproved wisdom not consumed |
| Wisdom consumed before strategy | Pipeline order verified |
| Evidence chains complete | Supporting memories/decisions linked |
| Distinct from memory and learning | Three-layer separation verified |

**Critical:** YES

### 3.44 Culture Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| All 11 dimensions scored | Explainable scores with evidence |
| Mission Control widget registered | culture-health reserved |
| Executives consume read-only | No culture mutation by executives |

**Critical:** NO (WARN until implementation; YES before production)

### 3.45 Reputation Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| Manual/evidence only | No unauthorized external integrations |
| All 6 source types supported | customers through community |
| Explainable scores | Evidence required |

**Critical:** NO (WARN until integrations; YES before external sources)

### 3.46 Adaptation Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| All 9 metrics tracked | speed through platform_maturity |
| Adaptation index computed | Explainable composite score |
| History retrievable | adaptation-index widget data |

**Critical:** NO (WARN until implementation; YES before production)

### 3.47 Organizational Intelligence CompanyContext Validation

| Criterion | Pass When |
|-----------|-----------|
| `organizationalIntelligence` assembled | All 9 engines contribute |
| Read-only to executives | Mutation attempts denied |
| Event synchronization | All engine events in catalog |
| No duplicate storage | Cross-engine link refs only |
| Recommendation adaptation | Citations in explainability trace |

**Critical:** YES

---

## Part IV — Sprint 2 Phase A.4 Mandatory Gates

*Final foundation layer before Athena. Extends Part III.*

### 3.48 Intent Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| Hierarchy levels defined | Vision through execution (10 levels) |
| Trace validation works | Entity → intent chain resolvable |
| Coverage computed | Intent coverage metrics available |
| Executives never infer purpose | Inference-only intent fails certification |
| Approval workflow for intent changes | Unapproved intent blocked |

**Critical:** YES

### 3.49 Context Runtime Validation

| Criterion | Pass When |
|-----------|-----------|
| Single immutable context assembled | CompanyContextAssembler operational |
| Cache with invalidation | Event projectors invalidate cache |
| Executives read-only | Direct service access blocked |
| All assemblers traced | contextRuntime.assemblerResults populated |
| No bypass path | Static/runtime probes confirm |

**Critical:** YES

### 3.50 Temporal Intelligence Validation

| Criterion | Pass When |
|-----------|-----------|
| Historical snapshots captured | Immutable snapshot records |
| No forecasting | Forecast attempts fail certification |
| Trends/patterns explainable | Evidence required on all analyses |
| Organization age computed | From company founding date |
| History never recomputed | Snapshot immutability verified |

**Critical:** YES

### 3.51 Signal Framework Validation

| Criterion | Pass When |
|-----------|-----------|
| Signals distinct from events | isSignalDistinctFromEvent verified |
| Strategy consumes signals | Signal subscription path exists |
| Executives consume context only | No direct signal mutation by executives |
| All signal types registered | 18 signal types in contract |

**Critical:** YES

### 3.52 Insight Framework Validation

| Criterion | Pass When |
|-----------|-----------|
| Observations only | isRecommendation always false |
| Derived from signals | Signal linkage required |
| No recommendation generation | Insight engine cannot produce recommendations |
| Explainable | Evidence and confidence on all insights |

**Critical:** YES

### 3.53 Complete Context Assembly Gate

| Criterion | Pass When |
|-----------|-----------|
| All five questions answerable | DNA, emotion, cognition, knowledge, intent in context |
| organizationalIntelligence present | Phase A.2 engines assembled |
| intent + temporal + signals + insights present | Phase A.4 fields populated |
| contextRuntime metadata present | Assembly trace complete |
| EXECUTIVES_ENABLED still false | Flag unchanged until Athena cert |

**Critical:** YES — **final foundation gate before Athena implementation**

---

## Part V — Sprint 2 Phase B Mandatory Gates

### 3.54 Executive Notebook Validation

| Criterion | Pass When |
|-----------|-----------|
| Entries immutable | Append-only versioning enforced |
| Separate from company memory | Distinct storage and API |
| Graph/memory linked | Link refs persisted |
| Searchable | Query by type and text |
| NOT recommendations | entryType never produces recommendation output |

**Critical:** YES

### 3.55 Curiosity Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| Question types supported | All 5 curiosity types |
| Investigation workflow | open → investigating → resolved |
| Never direct recommend | curiosityNeverRecommends verified |
| Evidence linkage | Investigations store evidence refs |

**Critical:** YES

### 3.56 Skeptic Engine Validation

| Criterion | Pass When |
|-----------|-----------|
| All challenge types | 9 skeptic challenge types |
| whatCouldMakeThisWrong present | Every pass result |
| Blocking on missing evidence | No evidence → failed pass |
| Confidence adjustment | adjustedConfidence computed |

**Critical:** YES

### 3.57 Athena Explainability Validation

| Criterion | Pass When |
|-----------|-----------|
| Full explainability fields | All AthenaRecommendationExplainability fields |
| isAthenaExplainabilityComplete | Runtime validation passes |
| Discovery before recommend | Eligibility gate enforced |
| Skeptic integrated | Every draft has skeptic pass |
| Notebook + curiosity cited | IDs in explainability trace |

**Critical:** YES — **Athena certification gate**

---

## 4. Certification Score

```
Score = (PASS areas × 1.0 + WARN areas × 0.7) / Total areas × 100
```

| Score | Result |
|-------|--------|
| 100 | Perfect — all areas PASS |
| 90–99 | Certified with documented WARN items |
| < 90 | NOT CERTIFIED |
| Any critical FAIL | NOT CERTIFIED regardless of score |

**Minimum for production:** Score ≥ 90 AND zero critical FAILs.

---

## 5. Approval

Certification approval requires:

1. Automated certification suite: **100% pass** (no skipped tests)
2. Certification score: **≥ 90**
3. Zero critical area FAILs
4. Security review: no critical Security Observatory findings for executive subsystem
5. Governance entry: `executive.activation.approved`
6. Manual sign-off: Founding Principal Engineer

Approval record stored in governance log with certification report ID.

---

## 6. Failure Conditions

Certification **FAILS** if any of:

| Condition | Action |
|-----------|--------|
| Direct Prisma/database access | Block + rewrite required |
| Bypass Executive Runtime | Block + rewrite required |
| Missing mandatory output fields | Block until schema complete |
| Hallucinated policy or evidence | Block + manifesto violation review |
| < 90% test coverage on executive module | Block until tests added |
| Any skipped certification test | Block until suite complete |
| Critical security finding | Block until remediated |
| Breaking Foundation API | Block until ADR + fix |
| EXECUTIVES_ENABLED=true before certification | Block + revert flag |
| Discovery incomplete before recommendations | Block until discovery done |
| Persona changes recommendation substance | Block + manifesto violation |
| Trust score assumed without metrics | Block until trust engine live |
| Skipped pipeline stage (Athena) | Block until pipeline complete |
| Philosophy violation (false certainty) | Block + review |

Failed executives remain **registered** but **not activatable**.

---

## 7. Certification Process

```
1. Implement executive module
2. Self-assess against this document
3. Run: pnpm test:executive-certification (Sprint 2)
4. Generate certification report
5. Review WARN items
6. Governance entry + approval
7. activate()
```

---

## 8. Athena — Reference Certification

Athena MUST be the **first certified executive** and sets the bar for all successors.

Athena-specific gates:

- CompanyContext-only inputs verified by static analysis + runtime probes
- All mandatory recommendation output fields present (see Manifesto §50)
- Full 12-stage reasoning pipeline with trace artifacts
- Discovery Mode complete before first recommendation
- Executive Trust Score operational
- Executive Experience Memory separate from Company Memory
- Identity Engine inherited; ECM evidence-governed; organizational intelligence inherited; persona does not alter reasoning
- Executive Humility responses tested
- Recommendation lifecycle state machine complete
- Mission Control executive widgets (minimum set)
- Executive Bus coordination patterns documented for replication

**No second executive may certify until Athena passes.**

**EXECUTIVES_ENABLED=true** is permitted ONLY after Athena certification approval.

---

## 9. Re-Certification

Required when:

- Executive version bump (semver minor or major)
- New capabilities granted
- Foundation version upgrade
- Security model change
- Manifesto version change

Patch version bumps: run regression subset only (documented in ADR).

---

## 10. Certification Report Template

Each certification run produces:

```markdown
# Executive Certification Report — {ExecutiveName} v{version}

- Date:
- Foundation: v1.0.0-bedrock
- Score: /100
- Critical FAILs: 0
- Result: CERTIFIED | NOT CERTIFIED

## Area Results
| Area | Result | Notes |

## Test Inventory
- Unit tests: / passing
- Integration tests: / passing
- Coverage: %

## Approval
- Automated suite: PASS | FAIL
- Sign-off:
```

Store in `docs/engineering/certification/{executive-id}-{version}.md`

---

## 11. Relationship to Other Documents

| Document | Scope |
|----------|-------|
| `FOUNDER_CONSTITUTION.md` | **Founder–platform relationship** (above all executives) |
| `ORGANIZATIONAL_OPERATING_MODEL.md` | **Organization reasoning** (first-class system; independent of executives) |
| `EXECUTIVE_COUNCIL_CONSTITUTION.md` | **Executive collaboration governance** (council deliberation and consensus) |
| `EXECUTIVE_PHILOSOPHY.md` | **Why** executives exist (north star) |
| `EXECUTIVE_MANIFESTO.md` | **What** executives must be (constitution) |
| `EXECUTIVE_COMPLIANCE_SUITE.md` | **Deterministic certification** (ECS) |
| `ATHENA_REFERENCE_IMPLEMENTATION.md` | **Reference executive blueprint** |
| `EXECUTIVE_CERTIFICATION_SPECIFICATION.md` | **How** to implement (technical contracts) |
| `EXECUTIVE_CERTIFICATION.md` | **When** production-ready (this document — gates) |

---

**No executive enters production until certified.**

*Project Grayscale — Build the Organization. Not the Chatbot.*
