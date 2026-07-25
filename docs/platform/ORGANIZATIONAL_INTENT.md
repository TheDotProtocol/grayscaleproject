# Organizational Intent

**Project Grayscale — WHY Something Exists**

**Version:** 1.0  
**Status:** Constitutional — Sprint 2 Phase A.4  
**ADR:** ADR-023

---

## Purpose

Intent is not a task. Intent is not a goal. **Intent explains WHY something exists.**

Every strategic object must eventually connect back to organizational intent. Executives should never lose this chain.

---

## Hierarchy (Constitutional — Full Traceability Required)

```
Vision
    ↓
Mission
    ↓
Intent
    ↓
Strategic Themes
    ↓
Goals
    ↓
Objectives
    ↓
Projects
    ↓
Tasks
    ↓
Recommendations
    ↓
Execution
```

---

## Example Chain

```
Launch AskTrabaajo
    ↓
Increase recurring revenue
    ↓
Reduce dependence on investment
    ↓
Increase founder independence
    ↓
Achieve organizational vision
```

Executives must preserve and cite this chain in explainability traces.

---

## Intent vs Other Layers

| Layer | Question | Engine |
|-------|----------|--------|
| DNA | Who are we? | Organizational DNA (ADR-015) |
| Intent | Why are we doing this? | Intent Engine (ADR-023) |
| Strategy | What should we pursue? | Strategy Engine |
| Execution | What are we doing? | Projects, tasks, recommendations |

---

## Contract

`packages/platform/src/intent/intent-engine.ts`

- `IntentEnginePort` — hierarchy, coverage, validation, snapshots
- `IntentRecord` — versioned, evidence-backed, approval-gated
- `IntentCoverage` — % of strategic objects linked to intent

---

## Events

- `intent.proposed` / `intent.approved` / `intent.updated`
- `intent.snapshot.captured`

---

*Intent becomes immutable organizational reasoning.*
