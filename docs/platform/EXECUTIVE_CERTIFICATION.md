# Executive Certification

**Project Grayscale — Production Readiness Gate for Executives**

**Version:** 1.0  
**Foundation:** v1.0.0-bedrock  
**Reference Executive:** Athena (Sprint 2)  
**Companion docs:** `EXECUTIVE_MANIFESTO.md`, `EXECUTIVE_CERTIFICATION_SPECIFICATION.md`

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
| `EXECUTIVE_MANIFESTO.md` accepted | Required |
| `EXECUTIVE_CERTIFICATION_SPECIFICATION.md` accepted | Required |
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
- All 18+ mandatory recommendation output fields present
- 11 Mission Control widgets operational
- Founder preference adaptation without preference mutation
- Executive Bus coordination patterns documented for replication

**No second executive may certify until Athena passes.**

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
| `EXECUTIVE_MANIFESTO.md` | **What** executives must be (constitution) |
| `EXECUTIVE_CERTIFICATION_SPECIFICATION.md` | **How** to implement (technical contracts) |
| `EXECUTIVE_CERTIFICATION.md` | **When** production-ready (this document — gates) |

---

**No executive enters production until certified.**

*Project Grayscale — Build the Organization. Not the Chatbot.*
