# Architecture Lock

**Project Grayscale — Immutable Architectural Constitution**

**Version:** 1.0  
**Status:** IMMUTABLE — changes require governance approval + ADR + founder sign-off  
**Foundation:** Bedrock v1.0.0-bedrock (Certified, FROZEN)  
**Effective:** Sprint 2 Phase B onward

---

## 1. Bedrock Is Frozen

Foundation v1.0 **Bedrock** is certified and **frozen**. Bedrock defines:

- Event store and projector architecture
- Memory Engine, Knowledge Graph, Strategy Engine
- Executive Runtime framework (lifecycle, permissions, inbox, bus, audit)
- Mission Control framework
- Integration & Plugin platform
- Platform Operations layer

**No Bedrock module may be rewritten.** Extensions only.

---

## 2. No Breaking Architecture

All evolution MUST be:

- **Additive** — optional fields, new modules, new events
- **Backwards compatible** — existing APIs, events, and schemas continue working
- **Versioned** — breaking semantics require new version, never silent change

Breaking changes to Bedrock are **forbidden** without a new Foundation release (v2.0+) with full re-certification.

---

## 3. ADR Required for Platform Evolution

Every architectural change requires an **Architecture Decision Record** in `docs/architecture/`:

- Context and problem statement
- Decision and alternatives considered
- Consequences (positive, negative, risks)
- Compliance with this Architecture Lock
- **Why Bedrock cannot already solve it**

No ADR → no merge for architectural changes.

---

## 4. Mandatory Versioning

| Layer | Rule |
|-------|------|
| **Events** | Every catalog entry has `version`; consumers must handle unknown versions gracefully |
| **Schemas** | Prisma migrations forward-only; immutable history tables append-only |
| **APIs** | New endpoints extend; existing response shapes gain optional fields only |
| **Contracts** | `@grayscale/platform` ports extend via optional fields or new interfaces |

---

## 5. Executive Certification Mandatory

No executive may activate (`EXECUTIVES_ENABLED=true`) without:

- Passing `EXECUTIVE_CERTIFICATION.md` gates
- Athena reference certification first
- Governance approval recorded

---

## 6. The Bedrock Extension Test

Every architectural proposal MUST answer:

> **Why can Bedrock not already solve this?**

Acceptable answers:

- New domain (organizational intelligence, intent, notebook) not in Bedrock scope
- New executive capability that extends without modifying Bedrock contracts
- New observability or context assembly layer

Unacceptable answers:

- "Cleaner to rewrite" — forbidden
- "Breaking change simplifies code" — forbidden
- "We don't need backwards compatibility" — forbidden

---

## 7. Constitutional Hierarchy

```
ARCHITECTURE_LOCK.md              ← this document (immutable rules)
FOUNDER_CONSTITUTION.md           ← founder–platform relationship
ORGANIZATIONAL_OPERATING_MODEL.md ← organization reasoning (first-class system)
EXECUTIVE_PHILOSOPHY.md           ← why
EXECUTIVE_MANIFESTO.md            ← what
ADR-001–034+                      ← how (decisions)
Platform contracts                ← interfaces
Implementation                    ← code
```

When in conflict: Architecture Lock → Founder Constitution → Organizational Operating Model → Philosophy → Manifesto → ADR → Code.

---

## 8. Sprint 2 Extension Map (Non-Breaking)

| Phase | Extension | Bedrock Impact |
|-------|-----------|----------------|
| A.1 | Executive Discovery Architecture | Optional CompanyContext fields |
| A.2 | Organizational Intelligence (9 engines) | New `organization/` module |
| A.4 | Intent, Context Runtime, Temporal, Signals, Insights | New `context-runtime/` module |
| B | Notebook, Curiosity, Skeptic, Athena | New executive modules; Athena consumes Bedrock |

**Bedrock unchanged. Extensions only.**

---

*Build the Organization. Not the Chatbot.*
