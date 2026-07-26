# Simulation Certification

**Version:** 1.0.0 | **Module:** `packages/platform/src/simulation/simulation-certification.ts`

## Gates (`SIMULATION_ECS_GATES`)

1. `replay_determinism` — seed-hash pipeline reproducibility
2. `explainability_complete` — explanation on completed sessions
3. `scenario_reproducibility` — 15+ scenario types defined
4. `policy_compliance` — Founder Constitution enforced
5. `constraint_compliance` — reality preservation constraints
6. `founder_constitution_compliance` — `realityModified: false`
7. `homeostasis_validation` — before/after captured
8. `audit_validation` — append-only audit trail
9. `version_validation` — engine + pipeline version recorded
10. `twin_synchronization` — twinVersionId referenced
11. `reality_protection` — reality never modified

## Scoring

- Score = passed gates / total gates × 100
- Certified when `passed && score >= 90`

## Service

`SimulationCertificationService.certify(companyId, sessionId?)`

See `SIMULATION_CERTIFICATION_REPORT.md` for Sprint 3 Phase C results.
