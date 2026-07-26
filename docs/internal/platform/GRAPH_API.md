# Graph API Reference

Base path: `/companies/:companyId/graph`  
Auth: JWT Bearer

## Summary (Mission Control)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/summary` | Node/edge counts, hubs, orphans, knowledge coverage |
| GET | `/health` | Graph + memory + recent event summary |

## Nodes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/nodes?q=&type=` | Search/list nodes |
| GET | `/nodes/:nodeId` | Get node by ID |
| POST | `/nodes` | Upsert entity-backed node |
| GET | `/nodes/:nodeId/neighbors` | 1-hop neighbors |
| GET | `/nodes/:nodeId/expand?depth=2` | N-hop subgraph |

## Traversal

| Method | Path | Description |
|--------|------|-------------|
| GET | `/path?from=&to=` | Shortest path |
| GET | `/related?q=&type=&depth=` | Related subgraph search |

## Edges

| Method | Path | Description |
|--------|------|-------------|
| POST | `/edges` | Create validated edge |

## Import / Export

| Method | Path | Description |
|--------|------|-------------|
| POST | `/import` | Bulk JSON import |
| GET | `/export` | Full graph JSON export |

## Legacy

`/companies/:companyId/knowledge` — **deprecated**, delegates to graph export/create.

## Example

```bash
# Everything related to "Authentication"
GET /companies/{id}/graph/related?q=Authentication&depth=2

# Dependency chain
GET /companies/{id}/graph/nodes/{taskId}/expand?depth=5
```
