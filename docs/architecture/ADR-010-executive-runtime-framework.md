# ADR-010: Executive Runtime Framework

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** 1.5E  
**Deciders:** Founding Principal Engineer

---

## Context

Phase 1.5D delivered the Strategic Intelligence Framework — rule-based reasoning without LLM dependency. Sprint 2 will implement concrete executives (Athena, Atlas, Ledger, etc.), but executives must not invent their own architecture.

Executives must behave like **operating system processes**: standardized context injection, capability declarations, permission checks, event-driven communication, and full explainability. No direct database access. No executive-to-executive calls.

Phase 1.5E renames "Executive Base Framework" to **Executive Runtime Framework** — infrastructure only, no executive implementations.

---

## Decision

1. **Company Context Engine** — `CompanyContextAssemblerPort` aggregates all company state into a single `CompanyContext`. This is the only input future executives receive.

2. **Executive Runtime** — `ExecutiveRuntimePort` manages instance lifecycle, context injection, health, execution requests, and structured outputs. No LLM inside the runtime.

3. **Capability Framework** — Executives declare capabilities (`ReadMemory`, `CreateRecommendation`, etc.) via `ExecutiveCapabilityRegistryPort`. Capabilities are composable and registered dynamically.

4. **Permission Framework** — Fine-grained permissions (`read`, `write`, `approve`, `execute`, etc.) are independent of capabilities via `ExecutivePermissionPort`.

5. **Executive Communication Bus** — Event-driven messaging (`request`, `response`, `escalation`, `delegation`, `broadcast`) with correlation IDs, trace IDs, retry, and timeout. No direct executive-to-executive calls.

6. **Executive Inbox** — Eight queues per instance: inbox, outbox, pending, completed, blocked, waiting, escalated, archived.

7. **Executive Lifecycle** — Thirteen standard states with validated transitions (`created` → `initializing` → `idle` → …).

8. **Explainability Framework** — Every output requires reason, evidence, confidence, risk, dependencies, alternatives, policies, constraints, and decision path.

9. **Execution Freeze** — `EXECUTIVES_ENABLED=false` (default). Legacy `AgentsService.runAgent()` returns 503 when disabled.

10. **Abstract `ExecutiveBase`** — Platform-level abstract class for Sprint 2 executives. No implementations in 1.5E.

---

## Architecture

```
CompanyContextEngine ──► ExecutiveRuntime ──► ExecutiveBase (Sprint 2+)
        │                      │
        │                      ├── CapabilityRegistry
        │                      ├── PermissionService
        │                      ├── ExecutiveBus
        │                      ├── ExecutiveInbox
        │                      └── AuditLog
        │
        └── StrategyEngine, Memory, Graph, Pulse, Events, ...
```

Executives never query individual services — only receive `CompanyContext`.

---

## Consequences

### Positive
- Sprint 2 executives inherit consistent infrastructure
- Full audit trail and explainability by design
- Runtime testable without LLM
- Mission Control can visualize inbox/health/lifecycle

### Negative
- Additional tables and API surface before executives exist
- Legacy `AgentsService` remains until Sprint 2 migration

---

## References

- [Executive Runtime Architecture](./EXECUTIVE_RUNTIME.md)
- [Executive Runtime API](../api/EXECUTIVE_RUNTIME_API.md)
- [ADR-009 Strategic Intelligence Framework](./ADR-009-strategic-intelligence-framework.md)
