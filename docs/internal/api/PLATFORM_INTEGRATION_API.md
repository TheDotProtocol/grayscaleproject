# Platform Integration API

Phase 1.5F — Integration & Plugin Platform health and control endpoints.

Base path: `/companies/:companyId/platform`

## Connectors

| Method | Path | Description |
|--------|------|-------------|
| GET | `/connectors/status` | Registered connectors and versions |

## Integrations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/integrations/health` | Per-provider health snapshots |
| GET | `/integrations/health/summary` | Aggregated health summary |
| GET | `/integrations/:provider/sync-status` | Sync + connection status |
| GET | `/integrations/:provider/auth-status` | Authentication status |
| GET | `/integrations/cost` | Cost monitor snapshots |
| POST | `/integrations/github/connect` | Connect GitHub (encrypted credentials) |
| POST | `/integrations/:provider/sync` | Enqueue BullMQ sync job |
| POST | `/integrations/:provider/sync/inline` | Run sync inline |
| DELETE | `/integrations/:provider` | Disconnect + revoke credentials |

## Plugins

| Method | Path | Description |
|--------|------|-------------|
| GET | `/plugins/health` | Installed plugin health |
| GET | `/plugins` | List installed plugins |
| POST | `/plugins/github/install` | Install GitHub reference plugin |

## Simulator (AIP-25)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/simulator/:provider/fixtures` | List simulated webhooks |
| POST | `/simulator/:provider/replay/:fixtureId` | Replay fixture through normalization |

See [ADR-011](../architecture/ADR-011-integration-plugin-platform.md).
