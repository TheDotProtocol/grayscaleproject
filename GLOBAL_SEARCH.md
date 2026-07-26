# Global Search

**RC1 Track B — Universal Search**

---

## Endpoint

```
GET /companies/:companyId/mission-control/search?q={query}&domains={csv}&limit={n}
```

## Search Domains

| Domain | Source |
|--------|--------|
| memory | Memory query service |
| graph | Knowledge graph nodes |
| goals | Goal engine |
| bills | Billing records |
| meetings | Timeline events |
| recommendations | Recommendation engine |
| plugins | Plugin runtime |
| integrations | Integration registry |
| executives | Constitutional executive registry |
| council | Council session store |
| events | Domain events |
| learning / wisdom | Tagged memory records |
| forecasts / simulations / signals / insights | Domain event types |
| policies | Decision policies |
| strategies | Scenario plans |

## UI Integration

The command palette (⌘K) debounces queries against this endpoint and groups results by category. Results include optional `route` hints for navigation.

## Contract

Defined in `@grayscale/platform` — `packages/platform/src/mission-control/search.ts`.

Results are scored, sorted, and limited. No duplicated storage — all reads go through existing platform services.
