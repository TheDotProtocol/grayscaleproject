# ADR-008: Company Knowledge Graph

**Status:** Accepted  
**Date:** 2026-07-25  
**Phase:** 1.5C  
**Deciders:** Founding Principal Engineer

---

## Context

Project Grayscale requires a relationship layer connecting all platform entities. Sprint 1 introduced prototype `knowledge_nodes` / `knowledge_edges` tables that duplicate content rather than reference domain entities. Phase 1.5B delivered the Memory Engine (searchable knowledge). Phase 1.5C must deliver **relationships** — not another storage layer.

---

## Decision

1. **Postgres adjacency list** — `graph_nodes` + `graph_edges` tables with company-scoped indexes.
2. **Entity-reference nodes** — graph nodes point to domain entities via `(sourceTable, sourceId)`; never duplicate business payload.
3. **Typed relationships** — 17 initial relationship types with validation matrix.
4. **Seven graph services** — Node, Edge, Traversal, Search, Validation, Import, Export.
5. **Event-driven projection** — `GraphProjector` on existing event bus auto-creates nodes and inferred edges.
6. **Memory ↔ Graph link** — `memory_records.graphNodeId` ↔ `graph_nodes.memoryRecordId`.
7. **Migrate Sprint 1 knowledge tables** — deprecate `knowledge_nodes` / `knowledge_edges` after data migration.

---

## Three-Pillar Model

| System | Stores | Does NOT store |
|--------|--------|----------------|
| Memory Engine | Searchable knowledge (titles, summaries, tags) | Relationships |
| Knowledge Graph | Nodes (references) + Edges (relationships) | Full entity payload |
| Event Store | Immutable history | Current state |

---

## Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Neo4j / Neptune | Ops complexity, dual datastore; Postgres sufficient at current scale |
| Memory `relatedIds` only | No typed edges, no traversal, no shortest path |
| JSON graph blob per company | No indexed queries, write contention |
| Keep Sprint 1 knowledge tables | Missing entity refs, audit, validation, services |

---

## Consequences

**Positive:**
- Executives reason over connected model, not isolated tables
- Mission Control exposes graph health and hub detection
- Single Postgres backup covers graph + domain + memory + events
- Export enables future Neo4j sync if scale demands

**Negative:**
- Recursive CTE traversal slower than native graph DB at >10M edges
- Dual projection (Memory + Graph) from same events — mitigated by idempotent upserts
- Sprint 1 knowledge API breaking change — mitigated by migration + redirect

---

## Scalability

Architect for **millions of nodes, tens of millions of edges, thousands of companies**. Revisit graph database when p95 traversal exceeds 200ms or total edges exceed 50M.

---

## References

- [KNOWLEDGE_GRAPH_DESIGN_REVIEW.md](./KNOWLEDGE_GRAPH_DESIGN_REVIEW.md)
- ADR-007 (Memory Index Facade)
- ADR-006 (Event Store)
