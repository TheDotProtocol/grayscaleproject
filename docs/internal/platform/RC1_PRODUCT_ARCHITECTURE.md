# RC1 Product Architecture

**Release:** RC1-Track-A-FounderWorkspace-v1.0

---

## Shift

From infrastructure building → **Founder experience productization**.

---

## Stack

```
apps/web (Next.js 15, React 19, Tailwind v4)
        ↓ REST API
backend (NestJS — all Sprint 1-4 modules)
        ↓
packages/platform (contracts)
        ↓
Bedrock (frozen)
```

---

## Deliverables

1. Founder Workspace — 20+ routes, unified navigation
2. Executive Workspaces — 7 constitutional executives
3. Twin visualization page
4. Mission Control UI — extended widget rendering
5. Council, Evolution, Simulation UI pages
6. Component library + command palette
7. Backend MC catalog — council + twin widgets registered

---

## ADRs

ADR-052 through ADR-054

---

EXECUTIVES_ENABLED remains false.
