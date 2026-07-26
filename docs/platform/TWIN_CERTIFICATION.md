# Twin Certification

**Sprint 3 Phase C** | 11 gates

| Gate | Requirement |
|------|-------------|
| historical_replay_consistency | Replay reconstructs historical state |
| state_reconstruction | Point-in-time loading works |
| version_integrity | Version chain unbroken |
| timeline_integrity | Timeline entries ordered and complete |
| simulation_isolation | No simulation modifies reality |
| reality_protection | Forecasts not committed as facts |
| forecast_explainability | All forecasts have full explanation |
| scenario_reproducibility | Same inputs → same outcomes |
| twin_synchronization | Twin synced with organizational sources |
| twin_audit_consistency | Audit trail complete |
| twin_evolution_consistency | Evolution traceable |

Pass threshold: ≥90% (matches council certification).

API: `GET /companies/:companyId/twin/certify`
