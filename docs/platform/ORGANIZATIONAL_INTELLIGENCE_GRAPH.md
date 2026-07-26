# Organizational Intelligence Graph

**Version:** 1.0.0 (Sprint 4)

---

## Principle

Knowledge, learning, wisdom, attention, capacity, trust, identity, evolution, reflection, and autonomy are **organizational concepts** — not executive-owned.

## Node Types

`knowledge`, `learning`, `wisdom`, `attention`, `capacity`, `trust`, `identity`, `evolution`, `reflection`, `autonomy`

## Platform

`packages/platform/src/organization/intelligence-graph.ts`

## Backend

`IntelligenceGraphService` — upsertNode, linkNodes, assemble

## API

```
GET /companies/:id/organizational-evolution/intelligence-graph
```

## Event

`org-intelligence-graph.updated`

## Integration

Org engines register nodes when records are created. Graph extends existing Knowledge Graph — no duplicate storage.
