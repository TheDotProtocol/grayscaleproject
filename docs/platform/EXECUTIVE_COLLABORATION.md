# Executive Collaboration

**Version:** 1.0.0 (Sprint 3 Phase D)

---

## Principle

Executives collaborate constitutionally — never through direct service calls. All inter-executive communication flows through:

1. **Executive Bus** — typed, versioned messages
2. **Council Runtime** — structured deliberation
3. **Event Catalog** — auditable event stream

---

## Message Types (Executive Bus)

| Kind | Purpose |
|------|---------|
| `request` | Ask another executive for input |
| `evidence` | Share structured evidence |
| `challenge` | Challenge another executive's position |
| `delegation` | Delegate with audit trail |
| `counter_argument` | Structured dissent |
| `consensus_update` | Consensus state change |
| `confidence_change` | Confidence adjustment with rationale |
| `new_evidence` | Evidence that changes deliberation |
| `escalation` | Escalate to council or founder |
| `replay` | Historical replay request |

---

## Collaboration Records

`ExecutiveCollaborationRecord` — versioned, correlation-id tracked, stored via `ExecutiveNetworkPort.recordCollaboration`.

---

## Twin-Centric Evidence

All collaboration evidence references twin version and twin evidence — never raw source system IDs without twin mediation.

---

## Events

Phase D events in `packages/platform/src/events/catalog.ts`:

- `executive.registered`
- Per-executive discovery/draft events
- `council.collaboration.*`
- `network.collaboration.*`

---

## Non-negotiables

- Everything versioned
- Everything auditable
- Everything explainable
- No direct executive-to-executive service calls
