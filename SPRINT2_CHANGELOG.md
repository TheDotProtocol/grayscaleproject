# Sprint 2 Changelog — Athena Reference Executive

## Sprint-2-Athena-v1.0

### Added

- `docs/platform/FOUNDER_CONSTITUTION.md` — immutable Founder–platform relationship
- `docs/platform/ATHENA_REFERENCE_IMPLEMENTATION.md` — reference executive blueprint
- `docs/platform/EXECUTIVE_COMPLIANCE_SUITE.md` — deterministic certification spec
- Platform contracts: founder-constitution, compliance-suite, recommendation-pipeline
- Backend: ExecutiveComplianceModule, ExecutiveCouncilModule
- Athena recommendation pipeline (Part 6 mandatory stages)
- Mission Control Athena widget data providers (13 widgets)
- ADR-032 (Founder Constitution), ADR-033 (ECS)

### Changed

- CompanyContext: optional `founderConstitution` field
- AthenaService: mandatory pipeline before draft recommendations
- SkepticPassResult: mandatory Part 9 questions
- Athena explainability: constitution, open questions, missing evidence

### Unchanged

- EXECUTIVES_ENABLED=false
- Bedrock v1.0 frozen
- No architectural rewrites
