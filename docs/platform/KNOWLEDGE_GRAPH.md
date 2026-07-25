# Company Knowledge Graph

**Phase:** 1.5C · **ADR:** [ADR-008](../architecture/ADR-008-knowledge-graph.md)

## Four Pillars

| Pillar | Question |
|--------|----------|
| Event Store | What happened? |
| Memory Engine | What do we know? |
| Knowledge Graph | How is everything connected? |
| Strategy Engine | What should we do next? *(contracts only)* |

## Principles

- Graph nodes **reference** domain entities — never duplicate business payload
- Edges store **relationships** with typed metadata (strength, confidence, evidence, reason)
- Provider-agnostic ports in `@grayscale/platform` — Postgres adjacency list today, Neo4j/Neptune export tomorrow

## Schema

- `graph_nodes` — entity references via `(sourceTable, sourceId)`, versioning, lifecycle
- `graph_edges` — 19 relationship types including `DEPENDS_ON`, `REQUIRES`, `SUPPORTS`
- **Decision** node type — architectural/business decisions with evidence links

## Services

| Service | Role |
|---------|------|
| GraphNodeService | Upsert/archive nodes |
| GraphEdgeService | Create/upsert/archive edges |
| GraphValidationService | Relationship matrix enforcement |
| GraphTraversalService | Neighbors, expand, shortest path |
| GraphSearchService | Node search |
| GraphImportService / GraphExportService | Bulk IO + future provider sync |
| GraphProjector | Event-driven auto-projection |
| GraphSummaryService | Mission Control summaries |

## API

Base: `/companies/:companyId/graph`

See [GRAPH_API.md](./GRAPH_API.md)

## Migration

Sprint 1 `knowledge_nodes` / `knowledge_edges` migrated to `graph_nodes` / `graph_edges` via migration `20260725200000_knowledge_graph`. Legacy `/knowledge` API delegates to graph services.

## Strategy Engine

Interfaces in `@grayscale/platform/strategy` — `StrategyContext`, `StrategyPlanner`, `StrategyAnalyzer`, `StrategyProvider`. No implementation in 1.5C.
