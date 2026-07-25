# Executive Certification Specification

**Foundation Gate Deliverable — Sprint 2 Prerequisite**

**Version:** 1.0  
**Status:** Mandatory  
**Effective:** Upon Foundation completion (Phase 1.5H)

**Constitutional hierarchy:** Read `EXECUTIVE_PHILOSOPHY.md` (why) before this specification (how). Manifesto v1.2 (Sprint 2 Phase A.1) extends behavioral rules; platform contracts in `@grayscale/platform/src/executive/` define discovery architecture ports (ADR-014).

No executive implementation may begin until this specification is accepted and the Platform Readiness Report verdict is `READY FOR SPRINT 2`.

---

## 1. Purpose

This specification defines the mandatory interfaces, contracts, permissions, capabilities, explainability requirements, health metrics, inbox behavior, escalation policies, output contracts, and test requirements that **every Sprint 2 executive** must satisfy before activation.

Executives are autonomous agents operating within company boundaries. Certification ensures each executive is deterministic, auditable, permission-bound, and observable before `EXECUTIVES_ENABLED=true`.

---

## 2. Scope

Applies to all executive roles defined in Sprint 2:

| Executive | Domain | Primary Inbox |
|-----------|--------|---------------|
| Chief of Staff | Operations coordination | `executive.inbox.chief-of-staff` |
| CTO | Engineering & architecture | `executive.inbox.cto` |
| CFO | Finance & billing | `executive.inbox.cfo` |
| CMO | Growth & communications | `executive.inbox.cmo` |
| General Counsel | Compliance & policy | `executive.inbox.counsel` |

Each executive must implement **all** sections below. Role-specific extensions are additive, never subtractive.

---

## 3. Mandatory Interfaces

Every executive MUST implement the following platform ports (from `@grayscale/platform`):

```typescript
interface CertifiedExecutive {
  // Identity & lifecycle
  id: ExecutiveId;
  role: ExecutiveRole;
  version: SemVer;

  // Core ports (required)
  lifecycle: ExecutiveLifecyclePort;      // register, activate, suspend, retire
  permissions: ExecutivePermissionPort;   // capability checks, scope enforcement
  inbox: ExecutiveInboxPort;              // receive, acknowledge, escalate, complete
  output: ExecutiveOutputPort;            // structured deliverables, contracts
  explainability: ExecutiveExplainabilityPort; // decision traces, rationale
  health: ExecutiveHealthPort;            // heartbeat, SLO, error budget
  escalation: ExecutiveEscalationPort;    // policy-driven escalation
}
```

### 3.1 Registration Contract

```typescript
POST /companies/:companyId/executives/register
{
  role: ExecutiveRole;
  capabilities: CapabilityId[];
  policyBundleId: string;
  sandboxProfile: SandboxProfileId;
}
```

Response MUST include `executiveId`, `status: "registered"`, and governance event `executive.registered`.

### 3.2 Activation Gate

Activation is blocked unless:

1. Platform Readiness Report = `READY FOR SPRINT 2`
2. Executive passes certification test suite (Section 10)
3. `PermissionService` grants all declared capabilities
4. Sandbox profile validated by `SandboxGateService`
5. Governance entry recorded: `executive.activation.approved`

---

## 4. Permissions & Capabilities

### 4.1 Capability Model

Capabilities are **explicit grants**, never implicit. Each executive declares capabilities at registration; the platform validates against `CapabilityDiscoveryService`.

| Capability Class | Examples | Default |
|------------------|----------|---------|
| Read | `memory.read`, `graph.read`, `billing.read` | Per role |
| Write | `memory.write`, `recommendation.approve` | Restricted |
| Execute | `integration.sync`, `agent.run` | Sandboxed |
| Admin | `executive.assign`, `policy.override` | Denied |

### 4.1.1 Permission Check Contract

Every executive action MUST call:

```typescript
await permissionService.assert({
  executiveId,
  companyId,
  capability: CapabilityId,
  resource?: ResourceRef,
  context?: ActionContext,
});
```

Failure MUST emit `authorization.failure` to Security Observatory and return `403` with structured denial reason.

### 4.2 Scope Boundaries

- Executives operate **within a single company** unless explicitly granted cross-company scope (denied in Sprint 2).
- Executives MUST NOT access raw credentials; use `CredentialVaultPort` token handles only.
- Executives MUST NOT bypass plugin sandbox; all plugin invocations go through `PluginRuntimeService`.

---

## 5. Explainability Requirements

Every executive decision that mutates state MUST produce an explainability record:

```typescript
interface ExecutiveDecisionTrace {
  id: string;
  executiveId: string;
  companyId: string;
  action: string;
  inputs: Record<string, unknown>;      // redacted secrets
  rationale: string;                     // human-readable, deterministic template
  evidenceRefs: string[];                // memory IDs, event IDs, graph node IDs
  policyEvaluations: PolicyEvaluation[];
  outcome: "approved" | "denied" | "deferred" | "escalated";
  recordedAt: ISO8601;
  governanceEventId: string;             // immutable link to event store
}
```

### 5.1 Redaction Rules

- Never log API keys, tokens, or PII beyond company-member scope
- Hash sensitive identifiers in traces
- Full traces stored in event store; summaries exposed via Mission Control

### 5.2 Retrieval

```
GET /companies/:companyId/executives/:executiveId/traces
GET /companies/:companyId/executives/:executiveId/traces/:traceId
```

---

## 6. Health Metrics

Each executive exposes health **independently** from Platform Health and Security Health:

```typescript
interface ExecutiveHealthSnapshot {
  executiveId: string;
  status: "healthy" | "degraded" | "offline" | "suspended";
  heartbeatAt: ISO8601;
  inboxDepth: number;
  pendingEscalations: number;
  actionsLast24h: number;
  errorRate24h: number;
  slo: {
    responseTimeP95Ms: number;
    availability: number;
  };
  errorBudget: {
    remaining: number;
    burnRate: number;
  };
}
```

### 6.1 Heartbeat

- Interval: 60 seconds when active
- Missed heartbeats (>3): status → `degraded`
- Missed heartbeats (>10): auto-suspend + governance alert

### 6.2 Mission Control Widget

Widget `executive-health` (Sprint 2) displays per-executive health. Must NOT conflate with `platform-health` or `security-health`.

---

## 7. Inbox Behavior

### 7.1 Inbox Contract

```typescript
interface ExecutiveInboxPort {
  enqueue(item: InboxItem): Promise<InboxItemId>;
  list(filter?: InboxFilter): Promise<InboxItem[]>;
  acknowledge(id: InboxItemId): Promise<void>;
  complete(id: InboxItemId, result: InboxResult): Promise<void>;
  escalate(id: InboxItemId, policy: EscalationPolicy): Promise<void>;
}
```

### 7.2 Item Types

| Type | Source | SLA |
|------|--------|-----|
| `recommendation` | Intelligence engines | 4h |
| `pulse.alert` | Pulse Engine v2 | 1h (critical: 15m) |
| `integration.failure` | Integration Platform | 2h |
| `founder.request` | Mission Control actions | 24h |
| `peer.escalation` | Other executives | 1h |

### 7.3 Ordering

FIFO within priority bands: `critical` > `high` > `normal` > `low`.

### 7.4 Idempotency

Inbox operations MUST be idempotent via `PlatformIdempotencyKey`.

---

## 8. Escalation Policies

### 8.1 Default Policy Matrix

| Condition | Escalation Target | Action |
|-----------|-------------------|--------|
| Capability denied | Chief of Staff | Log + notify founder |
| SLO breach (executive) | Platform ops | Suspend if burn rate > 2x |
| Security finding (critical) | General Counsel + Platform | Immediate suspend |
| Cross-executive conflict | Chief of Staff | Mediate or defer |
| Unresolved inbox > SLA | Founder Pulse | `founder.escalation` pulse |

### 8.2 Escalation Record

Every escalation MUST emit:

- Event: `executive.escalated`
- Governance entry: type `policy_change` or `architecture_decision`
- Explainability trace with full policy evaluation chain

---

## 9. Output Contracts

Executive outputs MUST conform to typed contracts:

```typescript
interface ExecutiveOutput {
  type: OutputType;           // e.g. "brief", "recommendation", "report"
  schemaVersion: SemVer;
  payload: unknown;           // validated against JSON Schema
  attachments?: AttachmentRef[];
  explainabilityTraceId: string;
  producedAt: ISO8601;
}
```

### 9.1 Required Output Types (minimum per role)

| Executive | Required Outputs |
|-----------|------------------|
| Chief of Staff | Daily ops brief, escalation summary |
| CTO | Architecture review, tech debt report |
| CFO | Cash flow snapshot, bill forecast |
| CMO | Campaign status, channel metrics |
| General Counsel | Compliance checklist, policy diff |

### 9.2 Validation

All outputs validated pre-delivery. Invalid outputs rejected with `executive.output.rejected` event.

---

## 10. Test Requirements

Before activation, each executive MUST pass:

### 10.1 Unit Tests (≥80% coverage on executive module)

- Permission denial paths
- Inbox FIFO + priority ordering
- Escalation policy evaluation
- Explainability trace generation
- Output schema validation
- Heartbeat lifecycle

### 10.2 Integration Tests

- End-to-end: register → certify → activate → action → trace → governance
- Sandbox violation blocked and logged to Security Observatory
- Authorization failure emits security finding
- Deactivation cleans inbox and suspends heartbeat

### 10.3 Certification Test Suite

```
pnpm --filter backend test:executive-certification
```

Must pass 100% of certification scenarios (no skipped tests).

### 10.4 Determinism

Given identical inputs and platform state, executive decisions MUST produce identical outputs and traces (excluding timestamps and UUIDs).

---

## 11. Event Catalog (Executive Events)

Required events (add to `@grayscale/platform` event catalog in Sprint 2):

| Event | Category |
|-------|----------|
| `executive.registered` | executive |
| `executive.activated` | executive |
| `executive.suspended` | executive |
| `executive.retired` | executive |
| `executive.action.completed` | executive |
| `executive.action.denied` | executive |
| `executive.escalated` | executive |
| `executive.output.produced` | executive |
| `executive.output.rejected` | executive |
| `executive.heartbeat.missed` | executive |

All events immutable in domain event store; governance log cross-references via `correlationId`.

---

## 12. Governance Integration

Every executive lifecycle change MUST record a governance entry (AIP-39):

- Registration → `feature_flag_change` or `permission_change`
- Activation → `architecture_decision`
- Capability grant/revoke → `permission_change`
- Policy update → `policy_change`
- Suspension/retirement → `architecture_decision`

---

## 13. Security Observatory Integration

Executive certification requires Security Observatory probes (AIP-40):

- Authentication failures on executive endpoints
- Authorization failures from permission checks
- Token misuse (vault handle validation)
- Rate-limit violations on executive APIs
- Sandbox violations from plugin invocations
- Audit integrity of executive decision traces

Security Health MUST remain independent from Platform Health and Executive Health.

---

## 14. Platform Evolution Compatibility

Executives MUST declare compatibility in registration:

```typescript
{
  executiveRuntimeVersion: SemVer;
  minPlatformVersion: SemVer;
  minSchemaVersion: string;
}
```

Platform Evolution service (AIP-41) validates compatibility before activation.

---

## 15. Activation Checklist

Before setting `EXECUTIVES_ENABLED=true`:

- [ ] Platform Readiness Report: `READY FOR SPRINT 2`
- [ ] This specification version accepted
- [ ] All five executive roles implement mandatory interfaces
- [ ] Certification test suite passes
- [ ] Governance entries recorded for each executive registration
- [ ] Security Observatory shows no critical findings for executive subsystem
- [ ] Mission Control `executive-health` widget operational
- [ ] ADR for Sprint 2 executive architecture accepted
- [ ] API documentation published for executive endpoints

---

## 16. Non-Goals (Sprint 2)

- Multi-company executive scope
- Executive-to-executive direct messaging (use inbox escalation)
- LLM provider lock-in (must remain provider-agnostic)
- Autonomous spending without CFO approval capability

---

## 17. References

- ADR-013: Platform Operations & Reliability
- AIP-39: Platform Governance
- AIP-40: Security Observatory
- AIP-41: Platform Evolution
- `docs/api/PLATFORM_OPERATIONS_API.md`
- `packages/platform/src/executive/` (Sprint 2 contracts)

---

**Certification Authority:** Platform Operations Module + Governance Service  
**Review Cadence:** Each executive version bump requires re-certification
