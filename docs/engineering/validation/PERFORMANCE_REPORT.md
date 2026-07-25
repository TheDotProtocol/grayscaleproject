# Performance Report — Foundation Baseline

**Generated:** 2026-07-25T16:49:53.975Z

## Baseline Metrics (p95 targets)

| Subsystem | Target p95 | Actual p95 | Status |
|-----------|-----------|------------|--------|
| memory engine search | 500ms | 5ms | ✅ |
| knowledge graph summary | 300ms | 7ms | ✅ |
| knowledge graph neighbors | 400ms | 12ms | ✅ |
| mission control aggregation | 800ms | 29ms | ✅ |
| global search simulation | 600ms | 26ms | ✅ |
| timeline query | 300ms | 5ms | ✅ |
| platform health compute | 400ms | 29ms | ✅ |
| pulse v2 aggregation | 300ms | 24ms | ✅ |
| integration sync status | 500ms | 32ms | ✅ |

## Detailed Benchmarks

### memory_engine_search
- p50: 3ms
- p95: 5ms
- p99: 5ms
- samples: 15

### knowledge_graph_summary
- p50: 1ms
- p95: 7ms
- p99: 7ms
- samples: 15

### knowledge_graph_neighbors
- p50: 4ms
- p95: 12ms
- p99: 12ms
- samples: 15

### mission_control_aggregation
- p50: 2ms
- p95: 29ms
- p99: 29ms
- samples: 15

### global_search_simulation
- p50: 2ms
- p95: 26ms
- p99: 26ms
- samples: 15

### timeline_query
- p50: 1ms
- p95: 5ms
- p99: 5ms
- samples: 15

### platform_health_compute
- p50: 2ms
- p95: 29ms
- p99: 29ms
- samples: 15

### pulse_v2_aggregation
- p50: 2ms
- p95: 24ms
- p99: 24ms
- samples: 15

### integration_sync_status
- p50: 2ms
- p95: 32ms
- p99: 32ms
- samples: 15
