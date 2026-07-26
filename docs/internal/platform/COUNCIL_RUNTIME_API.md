# Council Runtime API

**Base:** `/companies/:companyId/council`  
**Auth:** JWT required

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Council health metrics |
| GET | `/sessions` | List sessions |
| GET | `/metrics` | 30-day council metrics |
| GET | `/history` | Decision history |
| GET | `/audit` | Audit trail |
| GET | `/certify` | Council certification report |
| POST | `/sessions` | Open session |
| POST | `/sessions/:sessionId/issues` | Open classified issue |
| POST | `/sessions/:sessionId/issues/:issueId/consensus` | Measure consensus |
| GET | `/sessions/:sessionId/replay` | Replay session events |

---

## Open Session

```json
POST /companies/{id}/council/sessions
{
  "title": "Q3 Strategic Review",
  "participatingExecutiveIds": ["athena"],
  "correlationId": "optional-uuid"
}
```

---

## Open Issue (classification required)

```json
POST /companies/{id}/council/sessions/{sessionId}/issues
{
  "title": "Budget reallocation",
  "summary": "Review Q3 budget priorities",
  "domain": "finance",
  "decisionClass": "financial",
  "initiatingExecutiveId": "athena"
}
```

---

## Mission Control Widgets

Data providers wired in `CouncilWidgetDataService` — see `council-widgets.ts`.

---

*EXECUTIVES_ENABLED remains false — council operates in certification/dormant mode.*
