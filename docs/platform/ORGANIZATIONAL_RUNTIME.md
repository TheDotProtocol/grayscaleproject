# Organizational Runtime

**Project Grayscale — Constitutional Operating System (OrgOS)**

**Version:** 1.0.0  
**Status:** IMMUTABLE (constitutional hierarchy)  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Sprint:** Sprint 4 — Phase A  
**Tag:** `Sprint-4-Phase-A-OrganizationalRuntime-v1.0`

---

## Preamble

Sprint 3 completed the Organizational Intelligence stack. Sprint 4 begins the **Organizational Operating System (OrgOS)**.

This document answers one question:

> **How does the organization continuously operate?**

This is **not** another intelligence engine. It is the constitutional runtime that orchestrates every capability already built.

The runtime defines orchestration. Executives own reasoning. Mission Control owns visualization. **No runtime owns business logic.**

---

## Constitutional Position

```
ARCHITECTURE_LOCK.md
FOUNDER_CONSTITUTION.md
ORGANIZATIONAL_OPERATING_MODEL.md
ORGANIZATIONAL_RUNTIME.md              ← this document
ORGANIZATIONAL_NERVOUS_SYSTEM.md
EXECUTIVE_COUNCIL_CONSTITUTION.md
EXECUTIVE_PHILOSOPHY.md
EXECUTIVE_MANIFESTO.md
EXECUTIVE_CERTIFICATION.md
Runtime implementations (backend modules, platform ports)
Executive implementations (Athena, Atlas, …)
```

Changes require: ADR, version bump, migration note, and constitutional approval by Founder.

---

## Article I — Purpose

The Organizational Runtime is the constitutional operating system that allows the organization to **continuously function** through:

- Deterministic orchestration
- Scheduling and synchronization
- Runtime governance
- Explainability and auditability
- Health, capacity, and resilience monitoring

The runtime **never performs organizational reasoning**. It coordinates sub-runtimes that expose assembled state. Executives consume that state; they do not schedule themselves.

---

## Article II — Ownership Boundaries

| Layer | Owns |
|-------|------|
| **Organizational Runtime** | Orchestration, scheduling, heartbeat, synchronization, governance |
| **Executives** | Reasoning, recommendations, debate, judgment augmentation |
| **Mission Control** | Visualization, operational awareness, widget contracts |
| **Bedrock** | Event store, memory, graph, strategy, executive framework |

**Non-negotiable:** The runtime never becomes an executive. Executives remain consumers of the runtime.

---

## Article III — Organizational Heartbeat

The **Organizational Heartbeat** is the deterministic pulse of continuous operation.

Each beat executes, in order:

1. Context refresh
2. Signal processing
3. Memory synchronization
4. Graph synchronization
5. Twin synchronization
6. Simulation refresh
7. Forecast refresh
8. Health monitoring
9. Attention refresh
10. Organizational snapshot

Heartbeat is **configurable**, **asynchronous**, and **auditable**. Every beat emits `runtime.heartbeat.completed` with correlation and trace identifiers.

---

## Article IV — Organizational Lifecycle

Runtime lifecycle stages:

| Stage | Meaning |
|-------|---------|
| `initializing` | Runtime bootstrapping sub-runtimes |
| `awake` | Ready for orchestration |
| `operating` | Active heartbeat and scheduled tasks |
| `maintenance` | Background maintenance window |
| `sleeping` | Reduced activity; wake cycle pending |
| `degraded` | Partial sub-runtime failure |
| `halted` | Orchestration stopped; requires intervention |

Lifecycle transitions are event-driven, versioned, and explainable.

---

## Article V — Organizational Scheduling

The runtime owns **all scheduling**. Executives never schedule themselves.

Supported schedule modes:

- `continuous` — ongoing background processing
- `scheduled` — cron-like deterministic intervals
- `event_driven` — triggered by catalog events
- `manual` — operator-initiated via Mission Control or API
- `maintenance` — deferred non-critical work
- `deferred` — delayed execution with explicit priority
- `priority` — precedence over standard queue

Executive scheduling, Council scheduling, and sub-runtime refresh are **runtime responsibilities**, not executive responsibilities.

---

## Article VI — Workload & Resource Management

The runtime **measures** — it does not optimize (Phase A scope):

- CPU workload proxy
- Queue depth and execution backlog
- Executive and Council utilization
- Runtime contention
- Processing latency
- Capacity trend (rising / stable / falling)

Optimization logic is deferred to future phases. Measurement is mandatory now.

---

## Article VII — Synchronization

The runtime synchronizes sub-runtimes without duplicating storage:

| Sub-Runtime | Synchronization Responsibility |
|-------------|-------------------------------|
| Context Runtime | CompanyContext assembly and cache invalidation |
| Executive Runtime | Lifecycle state exposure (no direct scheduling) |
| Council Runtime | Session state coordination |
| Twin Runtime | Twin snapshot refresh markers |
| Simulation Runtime | Session refresh markers |
| Forecast Runtime | Forecast refresh markers |
| Memory Runtime | Memory index synchronization markers |
| Knowledge Graph Runtime | Graph projection synchronization markers |
| Strategy Runtime | Strategy state exposure |

Synchronization is orchestration — not re-implementation of Bedrock engines.

---

## Article VIII — Event Processing

All runtime coordination is **event-driven**:

- `runtime.heartbeat.completed`
- `runtime.orchestration.started`
- `runtime.orchestration.completed`
- `runtime.certified`

Events carry correlation ID, trace ID, version, and audit reference. No runtime bypasses the event catalog.

---

## Article IX — Attention Cycle

The **Organizational Attention Cycle** refreshes attention state during heartbeat without introducing new intelligence. Attention data is assembled through Context Runtime from existing ONS and Twin capabilities.

---

## Article X — Wake & Sleep Cycles

| Cycle | Behavior |
|-------|----------|
| **Wake** | Transition from `sleeping` → `awake` → `operating`; resume heartbeat |
| **Sleep** | Transition from `operating` → `sleeping`; reduce heartbeat frequency |

Wake and sleep preserve audit continuity. No state is silently discarded.

---

## Article XI — Runtime Governance

Runtime governance enforces:

1. Constitutional hierarchy (this document beneath OOM, above implementations)
2. No business logic in runtime modules
3. No direct Prisma access from executives
4. No duplicate storage
5. No circular orchestration
6. No duplicate execution of the same task
7. Version integrity on every orchestration action

Governance policies inherit from Founder Constitution and Architecture Lock.

---

## Article XII — Explainability

Every runtime action must explain:

- Why it executed
- Trigger source
- Dependencies
- Affected runtimes
- Duration and priority
- Evidence
- Version
- Correlation ID and Trace ID
- Audit reference

See `RUNTIME_EXPLAINABILITY.md` for the technical contract.

---

## Article XIII — Auditability

Runtime audit entries are **append-only**. Each entry records action, runtime ID, actor (`organizational-runtime`), timestamps, correlation/trace IDs, and structured details.

Mission Control exposes audit via `runtime-audit` widget contract.

---

## Article XIV — Health, Capacity & Resilience

| Concern | Runtime Responsibility |
|---------|------------------------|
| **Health** | Composite score from sub-runtime status and heartbeat stability |
| **Capacity** | Queue depth, backlog, utilization trends |
| **Resilience** | Degraded mode detection; no silent failure |

Health is explainable. Capacity is measured. Resilience defers to Platform Operations for infrastructure.

---

## Article XV — Background Processing

Background jobs are scheduled through Runtime Scheduler — never through executive inbox or ad-hoc timers. All background work is auditable and explainable.

---

## Article XVI — Certification

Runtime certification (`RUNTIME_CERTIFICATION.md`) requires all 11 ECS gates to pass with score ≥ 90:

1. Heartbeat stable
2. Schedulers deterministic
3. No circular orchestration
4. No duplicate execution
5. Runtime health explainable
6. Orchestration auditable
7. Constitutional hierarchy respected
8. No business logic in runtime
9. Executives not schedulers
10. Event-driven coordination
11. Version integrity

---

## Article XVII — Relationship to Sprint 4 Vision

Sprint 4 transforms Project Grayscale from an Organizational Intelligence Platform into a **continuously operating Organizational Operating System**.

The objective is **not** to build additional intelligence. The objective is to bring the organization itself to life through deterministic orchestration while preserving every constitutional principle established since Bedrock.

---

## Certification

**Organizational Runtime v1.0.0** is certified when `RUNTIME_CERTIFICATION.md` gates pass and `SPRINT4_PHASE_A_CERTIFICATE.md` is issued.

**Context Version:** `2.0.0-s4a-org-runtime`
