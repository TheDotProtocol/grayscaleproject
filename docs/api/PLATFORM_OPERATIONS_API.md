# Platform Operations API

Phase 1.5H — observability, reliability, recovery, and readiness endpoints.

**Design specification.** Implementation follows approval of [Platform Operations Design Review](../architecture/PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md).

Base path: `/platform/operations`

All endpoints require JWT authentication unless noted.

---

## Reliability (AIP-33)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reliability` | All service reliability profiles |
| GET | `/reliability/:serviceId` | Single service SLO, error budget, RTO/RPO |

### `GET /reliability` response

```json
{
  "window": "24h",
  "services": [
    {
      "serviceId": "event-store",
      "sla": {
        "availabilityTarget": 99.9,
        "latencyP95Ms": 100,
        "errorRateMax": 0.001
      },
      "slo": {
        "availability": 99.95,
        "latencyP95Ms": 45,
        "errorRate": 0.0002
      },
      "errorBudget": {
        "total": 100,
        "consumed": 5,
        "remaining": 95,
        "burnRate": 0.2
      },
      "recovery": {
        "rtoMinutes": 5,
        "rpoMinutes": 0
      },
      "computedAt": "2026-07-25T15:00:00Z"
    }
  ]
}
```

Reliability is **separate from health** (1.5G). Health = current state. Reliability = commitment over time.

---

## Diagnostics (AIP-34)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/diagnostics` | All diagnostic findings |
| GET | `/diagnostics?severity=critical` | Filter by severity |
| GET | `/diagnostics?subsystem=graph_integrity` | Filter by subsystem |
| GET | `/diagnostics/:subsystem` | Subsystem-specific probe |

### Diagnostic subsystems

| Subsystem | Probes |
|-----------|--------|
| `memory_integrity` | Orphan records, stale index rows |
| `graph_integrity` | Orphan nodes, invalid edges |
| `strategy_rules` | Policy conflicts, constraint violations |
| `executive_runtime` | Queue status, disabled consistency |
| `plugin_sandbox` | Denied API call audit |
| `integration_sync` | Failed/stale sync jobs |
| `security` | Plaintext tokens, expired credentials |
| `storage` | Table growth, migration status |
| `queue_health` | BullMQ depth, DLQ count, stalled jobs |
| `event_store` | Failed events, processing lag |

### Finding schema

```json
{
  "id": "diag-graph-001",
  "subsystem": "graph_integrity",
  "severity": "warning",
  "category": "orphan_node",
  "title": "3 orphan graph nodes detected",
  "description": "Nodes without active source entity references",
  "evidence": { "orphanCount": 3, "nodeIds": ["..."] },
  "remediation": "Run graph integrity repair or re-project from events",
  "detectedAt": "2026-07-25T15:00:00Z"
}
```

---

## Performance Metrics (AIP-35)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/metrics` | Current metrics snapshot |
| GET | `/metrics/trends?window=24h` | Historical trends |
| GET | `/metrics/trends?window=7d&category=api_latency` | Filtered trends |

### Metric categories

| Category | Unit | Description |
|----------|------|-------------|
| `api_latency` | ms | Per-route p50/p95/p99 |
| `queue_depth` | count | BullMQ waiting + active jobs |
| `worker_throughput` | jobs/hour | Completed jobs per queue |
| `slow_query` | ms | Prisma queries > 100ms |
| `cache_hit_rate` | ratio | Cache effectiveness |
| `database` | connections | Active PG connections |
| `event_processing` | ms | Projector processing time |
| `memory_usage` | bytes | Node.js heap usage |
| `cpu` | load | System load average |
| `storage` | bytes | Database table sizes |
| `bandwidth` | bytes | Request/response volume |

---

## Platform Cost (AIP-37)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/cost` | Current period cost breakdown |
| GET | `/cost/trends?periods=6` | Cost trends over periods |

### Cost categories

Database, Queues, Workers, Storage, Bandwidth, AI Usage, Connectors, Plugins, Infrastructure.

Extends Integration Cost Monitor (1.5F) with platform-wide categories.

---

## Recovery (AIP-36)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/recovery` | List recovery operations |
| GET | `/recovery/:id` | Operation status |
| POST | `/recovery/replay` | Replay domain events by sequence range |
| POST | `/recovery/retry` | Retry failed domain events |
| POST | `/recovery/retry-jobs` | Retry failed BullMQ jobs |
| POST | `/recovery/snapshot` | Create platform state snapshot |
| POST | `/recovery/rebuild` | Rebuild all projections from event store |
| POST | `/recovery/restore` | Restore from named snapshot |

### `POST /recovery/replay` body

```json
{
  "companyId": "co-1",
  "fromSequence": 1000,
  "toSequence": 1050,
  "dryRun": false
}
```

### `POST /recovery/rebuild` body

```json
{
  "companyId": "co-1",
  "confirmRebuild": true
}
```

All recovery operations are **async** (platform jobs) with audit trail and event publishing.

---

## Platform Readiness Report (AIP-38)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/readiness/generate` | Generate new readiness report |
| GET | `/readiness/latest` | Most recent report |
| GET | `/readiness/:id` | Specific report by ID |

### Verdict

The report concludes with exactly one of:

- **`READY FOR SPRINT 2`** — Foundation complete; executive systems may begin
- **`NOT READY`** — Blockers documented with remediation steps

### Report sections (12)

1. Platform Foundation
2. API Stability
3. Architecture Completeness
4. Performance
5. Reliability
6. Security
7. Documentation
8. Automated Testing
9. Technical Debt
10. Known Risks
11. Coverage
12. Operational Readiness

See [Platform Readiness Report Template](../engineering/PLATFORM_READINESS_REPORT.md).

---

## Error Handling

| Code | Meaning |
|------|---------|
| 200 | Success |
| 202 | Recovery operation queued (async) |
| 400 | Invalid recovery parameters |
| 403 | Recovery requires confirmation flag |
| 503 | Subsystem probe unavailable |

---

## See Also

- [ADR-013](../architecture/ADR-013-platform-operations-reliability.md)
- [Mission Control API](./MISSION_CONTROL_API.md)
- [Platform Integration API](./PLATFORM_INTEGRATION_API.md)
