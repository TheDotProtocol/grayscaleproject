# Executive Runtime API

Phase 1.5E — Executive Runtime Framework endpoints.

Base path: `/companies/:companyId/executive-runtime`

All endpoints require JWT authentication.

## Runtime Status

| Method | Path | Description |
|--------|------|-------------|
| GET | `/status` | Runtime enabled/disabled status (`EXECUTIVES_ENABLED`) |

## Company Context

| Method | Path | Description |
|--------|------|-------------|
| GET | `/context` | Assemble full `CompanyContext` (executives' only input) |

## Executive Instances

| Method | Path | Description |
|--------|------|-------------|
| GET | `/instances` | List runtime instances for company |
| POST | `/instances` | Initialize executive slot (no LLM) |
| GET | `/instances/:executiveId` | Get instance by executive ID |
| POST | `/instances/:instanceId/context` | Inject context into instance |
| GET | `/instances/:instanceId/health` | Instance health check |
| POST | `/instances/:instanceId/lifecycle` | Transition lifecycle state |

## Capabilities & Permissions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/capabilities` | Discover registered capabilities |
| POST | `/permissions` | Grant permissions to executive |

## Communication Bus

| Method | Path | Description |
|--------|------|-------------|
| POST | `/bus/send` | Send bus message |
| GET | `/bus/pending/:executiveId` | Pending messages for executive |

## Inbox

| Method | Path | Description |
|--------|------|-------------|
| POST | `/inbox` | Enqueue inbox item |
| GET | `/instances/:instanceId/inbox` | List inbox items (optional `?queue=`) |
| GET | `/instances/:instanceId/inbox/summary` | Queue counts summary |

## Execution & Outputs

| Method | Path | Description |
|--------|------|-------------|
| POST | `/execution-requests` | Submit execution request (blocked if `EXECUTIVES_ENABLED=false`) |
| POST | `/outputs` | Record structured output with explainability |

## Audit

| Method | Path | Description |
|--------|------|-------------|
| GET | `/audit` | Query audit log (`?executiveId=&limit=`) |

## Environment

```bash
EXECUTIVES_ENABLED=false  # default — runtime active, execution frozen
```

See [EXECUTIVE_RUNTIME.md](../architecture/EXECUTIVE_RUNTIME.md) and [ADR-010](../architecture/ADR-010-executive-runtime-framework.md).
