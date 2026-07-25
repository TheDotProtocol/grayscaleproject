# Organizational Memory Engine

**Phase:** 1.5B  
**Package:** `@grayscale/platform` + `backend/src/modules/memory/`  
**ADR:** [ADR-007](../architecture/ADR-007-memory-index-facade.md)

---

## Philosophy

> The Event Store captures **what happened**.  
> The Memory Engine preserves **what is known**.  
> The Knowledge Graph models **how it is connected**.

The Memory Engine is the company's **long-term recall** — a unified search layer over existing domain tables, not a replacement for them.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Memory Facade                         │
│  MemoryQueryService.search()  →  memory_records index   │
│  MemoryQueryService.resolveSource()  →  domain tables   │
└─────────────────────────────────────────────────────────┘
         ▲                              │
         │ upsert/remove                │ read
         │                              ▼
┌─────────────────┐    events    ┌──────────────────┐
│ MemoryIndex     │◄─────────────│ Domain Modules   │
│ Projector       │              │ (memory, billing,│
└─────────────────┘              │  timeline, …)    │
         ▲                         └──────────────────┘
         │ append + enqueue
┌─────────────────┐
│ Event Store     │
└─────────────────┘
```

---

## Memory Types

| Type | Source Table | Trigger Events |
|------|--------------|----------------|
| `note` | `memories` | `memory.created`, `memory.updated` |
| `git_activity` | `memories` (source=github) | `memory.created` |
| `journal` | `journal_entries` | `journal.entry.created` |
| `timeline` | `timeline_events` | `timeline.event.created` |
| `meeting` | `timeline_events` (eventType=meeting) | `timeline.event.created` |
| `knowledge` | `knowledge_nodes`, `knowledge_edges` | `knowledge.*.created` |
| `notification` | `notifications` | `notification.created` |
| `bill` | `bills` | `billing.bill.due_soon`, `billing.bill.overdue` |
| `recommendation` | `agent_recommendations` | `agent.recommendation.created` |

Deletes: `memory.deleted` → remove index row.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/companies/:id/memory/search?q=&type=&tags=` | Unified search |
| `GET` | `/companies/:id/memory/records/:recordId` | Index row + source entity |
| `POST` | `/companies/:id/memory/ingest` | Manual index upsert (admin) |
| `POST` | `/companies/:id/memory/backfill` | Scan domain tables → index |

Existing CRUD endpoints (`GET/POST/PATCH/DELETE /memory`) are unchanged.

---

## Search Examples

```bash
# Text search across all memory types
GET /companies/{id}/memory/search?q=strategy

# Filter by type
GET /companies/{id}/memory/search?type=journal,bill

# Tag filter
GET /companies/{id}/memory/search?tags=billing,overdue
```

---

## Backfill & Replay

**Backfill** (one-time per company):
```bash
POST /companies/{id}/memory/backfill
```

**Replay** (re-index from event store):
```typescript
await eventsService.replay({
  companyId,
  types: ["memory.created", "journal.entry.created", /* … */],
});
```

Both are idempotent via `@@unique([sourceTable, sourceId])`.

---

## Future: Semantic Indexing

Postgres `vector` extension is enabled. Sprint 2+ will add:
- `embedding vector(1536)` column on `memory_records`
- Embedding pipeline on ingest
- Hybrid search (full-text + semantic similarity)

The facade API remains stable — only the query engine evolves.

---

## Platform Contracts

```typescript
import type {
  MemoryRecord,
  MemorySearchQuery,
  MemoryIngestionPort,
  MemoryQueryPort,
} from "@grayscale/platform";
```

Implementations live in the backend; contracts are versioned in `@grayscale/platform`.
