# Internal Documentation Index

**Project Grayscale — Maintainer Index**

**Classification:** INTERNAL — Must never appear in `/docs` website manifest  
**Location:** `docs/internal/`  
**Future home:** `grayscale-internal` or private `grayscale-core` repository

---

## Directory Structure

```
docs/internal/
├── DOCUMENTATION_POLICY.md      Visibility policy
├── NON_NEGOTIABLES.md           Engineering non-negotiables
├── founder-journal.md           Internal founder journal spec
├── architecture/                ADRs and architecture reviews (~101 files)
├── platform/                    Constitutional & platform specs (~130 files)
├── engineering/                 Validation & certification reports
├── executives/                  Executive implementation docs
├── api/                         Detailed API specifications
├── plugins/                     Internal plugin specs
├── releases/                    Full release documentation
└── sprint-2/                    Sprint 2 internal artifacts
```

---

## Architecture (`docs/internal/architecture/`)

All Architecture Decision Records (ADR-001 through ADR-088+), including:

- Event store, memory, graph, intelligence ADRs
- Executive runtime, council, simulation ADRs
- Mission Control, policy engine, governance ADRs
- Platform operations and reliability reviews
- `PLUGIN_SECURITY_MODEL.md` — *public summary at docs/public/security.md*
- `MARKETPLACE_ARCHITECTURE.md` — pre-release internal

---

## Platform (`docs/internal/platform/`)

Constitutional and implementation documentation including:

### Executive & Founder (INTERNAL)

- `EXECUTIVE_MANIFESTO.md`
- `EXECUTIVE_PHILOSOPHY.md` — *public summary at docs/public/executives.md*
- `EXECUTIVE_CERTIFICATION.md`
- `FOUNDER_CONSTITUTION.md`
- `FOUNDER_WORKSPACE_ARCHITECTURE.md`
- `ATHENA_REFERENCE_IMPLEMENTATION.md`
- `LEDGER_REFERENCE_IMPLEMENTATION.md`

### Runtime & OrgOS (INTERNAL)

- `ORGANIZATIONAL_CONTEXT_RUNTIME.md`
- `ORGANIZATIONAL_OPERATING_MODEL.md`
- `RUNTIME_SCHEDULER.md`
- `RUNTIME_EXPLAINABILITY.md`
- `POLICY_ENGINE_RUNTIME.md`
- `AUTONOMOUS_EXECUTION_ARCHITECTURE.md`

### Sprint Certificates (INTERNAL)

- `SPRINT2_PHASE_*`, `SPRINT3_PHASE_*`, `SPRINT4_PHASE_*`
- `SIMULATION_CERTIFICATION.md`, `TWIN_CERTIFICATION.md`
- `POLICY_ENGINE_CERTIFICATION.md`

### Strategy (INTERNAL copies — public summaries in docs/public/)

- `OPEN_PLATFORM_STRATEGY.md`
- `REPOSITORY_STRATEGY.md`
- `LICENSING_STRATEGY.md`
- `PUBLIC_DOCUMENT_INDEX.md`

---

## Engineering (`docs/internal/engineering/`)

- `ATHENA_CERTIFICATION_REPORT.md`
- `validation/FOUNDATION_VERDICT.md`
- `validation/PLATFORM_VALIDATION_REPORT.md`
- `validation/PERFORMANCE_REPORT.md`

---

## Executives (`docs/internal/executives/`)

- `ATHENA.md` — *public summary at docs/public/athena.md*
- Additional executive implementation specifications

---

## API (`docs/internal/api/`)

Detailed API docs — public summary at `docs/public/api-reference.md`:

- `MISSION_CONTROL_API.md`
- `INTELLIGENCE_API.md`
- `PLATFORM_INTEGRATION_API.md`
- `PLATFORM_OPERATIONS_API.md`
- `EXECUTIVE_RUNTIME_API.md`

---

## Prompts (Repository Root)

**Not in docs/internal/ but INTERNAL classification:**

```
prompts/           Executive and agent prompt packs — NEVER public
```

---

## Leak Prevention

Before any public release or repository split:

- [ ] No `docs/internal/` paths in `manifest.ts`
- [ ] No prompt text in `docs/public/`
- [ ] No certification scores in public marketing without approval
- [ ] README links to `/docs` not internal paths

---

## Maintenance

Update this index when:

- New ADR accepted → `docs/internal/architecture/`
- Sprint certificate produced → `docs/internal/platform/`
- New prompt pack → `prompts/`
- Public summary created → corresponding `docs/public/` file

**Owner:** Platform Architecture  
**Cross-reference:** [REPOSITORY_GOVERNANCE.md](../../REPOSITORY_GOVERNANCE.md)
