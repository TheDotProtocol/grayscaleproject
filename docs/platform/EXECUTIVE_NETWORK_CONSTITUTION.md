# Executive Network Constitution

**Version:** 1.0.0  
**Status:** Immutable  
**Hierarchy:** Below `EXECUTIVE_COUNCIL_CONSTITUTION.md`, above executive runtime collaboration logic

---

## I. Purpose

If the Executive Council Constitution answers **how executives make decisions together**, the Executive Network Constitution answers **how executives relate to one another over the lifetime of the organization**.

Every executive—whether the seventh or the fiftieth—has a constitutional place. No executive is added ad hoc.

---

## II. Core Principles

1. **Dependency transparency** — Every executive declares who they depend on and who depends on them.
2. **Shared ownership boundaries** — Responsibilities are exclusive; overlap requires council resolution.
3. **Trust propagation** — Trust scores propagate through collaboration evidence, never through direct assignment.
4. **Delegation rules** — Delegation flows through the Executive Bus with audit; never through direct service calls.
5. **Escalation paths** — Escalation follows: executive → council → founder.
6. **Collaboration contracts** — Inter-executive requests are typed, versioned, and auditable.
7. **Knowledge sharing** — Evidence shared via bus and council; no private organizational state.
8. **Succession and replacement** — Executive lifecycle is constitutional: creation, certification, suspension, retirement.
9. **Council expansion** — New executives join council only after certification; council quorum adjusts constitutionally.

---

## III. Twin-Centric Rule (Phase D+)

All executives reason exclusively through `CompanyContext.twin`.

Source systems (Memory, Graph, Strategy, Signals, Insights, Pulse, Intent, Organizational Intelligence) remain **source systems only**. Reality updates the Twin first. Executives consume the Twin. Never the source systems directly.

---

## IV. Communication Channels

Executives communicate only through:

- Executive Bus
- Council Runtime
- Event Catalog

Never direct service calls between executives.

---

## V. Executive Lifecycle

| State | Meaning |
|-------|---------|
| `registered` | Identity immutable record created |
| `certifying` | ECS gates in progress |
| `certified_dormant` | Passed certification; EXECUTIVES_ENABLED=false |
| `active` | Founder-enabled (post-Sprint 3) |
| `suspended` | Temporarily removed from council |
| `retired` | Permanent; historical record preserved |

No executive becomes ACTIVE until certified.

---

## VI. Hierarchy Reference

References without rewriting:

- `ARCHITECTURE_LOCK.md`
- `FOUNDER_CONSTITUTION.md`
- `ORGANIZATIONAL_OPERATING_MODEL.md`
- `EXECUTIVE_COUNCIL_CONSTITUTION.md`
- `ORGANIZATIONAL_DECISION_MODEL.md`
- `LIVING_ORGANIZATIONAL_TWIN.md`

---

## VII. Non-Negotiables

- The organization owns the truth; executives interpret through the Twin.
- The Founder governs; the platform preserves institutional intelligence.
- Everything event-driven, versioned, explainable, auditable, constitutional.
