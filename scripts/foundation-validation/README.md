# Foundation Validation Suite

Complete engineering validation for Project Grayscale Foundation (Phase 1.5H gate).

## Commands

```bash
# Full scale (100 companies, 100K events, etc.)
pnpm validate:foundation

# Reduced scale for dev/CI
pnpm validate:foundation:quick

# Unit tests + code analysis only (no database)
pnpm validate:foundation:offline
```

**Prerequisites for live validation:** `pnpm setup:dev` (Docker Postgres + Redis + migrations)

## Validation Phases

| Phase | Description |
|-------|-------------|
| 1 | Platform stress testing — seed data at scale, measure query latency |
| 2 | Recovery validation — replay, snapshot, queue, connector, plugin recovery |
| 3 | Performance benchmark — baseline p95 targets for 9 subsystems |
| 4 | Security validation — attack simulations + Security Observatory |
| 5 | Founder workflow — idea → launch journey analysis |

## Reports

Generated to `docs/engineering/validation/`:

- `PLATFORM_VALIDATION_REPORT.md`
- `PERFORMANCE_REPORT.md`
- `RECOVERY_REPORT.md`
- `SECURITY_REPORT.md`
- `FOUNDER_EXPERIENCE_REPORT.md`
- `FOUNDATION_VERDICT.md`

JSON results: `scripts/foundation-validation/results/`

## Certification

**FOUNDATION CERTIFIED — READY FOR SPRINT 2** requires all 5 phases PASS with zero critical blockers.

Executive implementation remains blocked until certification completes.
