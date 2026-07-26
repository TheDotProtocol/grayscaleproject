# Internal Document Index

**Project Grayscale — Documentation That Must Remain Private**

**Version:** 1.0  
**Grayscale OS:** v1.0  
**Status:** Planning index — governs future `grayscale-internal` repository  
**Must never appear in `/docs` public manifest**

---

## Purpose

This index catalogs documentation that **must not** be exposed through the public Documentation Center, public GitHub mirrors, or customer-facing exports. It supports repository split planning and access control design.

For visibility policy, see `docs/DOCUMENTATION_POLICY.md`.

---

## Certification & Sprint Evidence

### Sprint Certificates

- `docs/platform/SPRINT2_PHASE_*_CERTIFICATE.md`
- `docs/platform/SPRINT3_PHASE_*_CERTIFICATE.md`
- `docs/platform/SPRINT4_PHASE_*_CERTIFICATE.md`
- `docs/platform/AUTONOMOUS_EXECUTION_CERTIFICATION.md`
- `docs/platform/SIMULATION_CERTIFICATION.md`
- `docs/platform/TWIN_CERTIFICATION.md`
- `docs/platform/POLICY_ENGINE_CERTIFICATION.md`
- `docs/platform/EXECUTIVE_CERTIFICATION.md`

### Certification Reports

- `docs/platform/SIMULATION_CERTIFICATION_REPORT.md`
- `docs/platform/SPRINT3_PHASE_B_ONS_ALIGNMENT_REPORT.md`
- `docs/platform/SPRINT3_PHASE_D_CERTIFICATE.md`
- `docs/engineering/ATHENA_CERTIFICATION_REPORT.md`
- `docs/engineering/validation/FOUNDATION_VERDICT.md`
- `docs/engineering/validation/PLATFORM_VALIDATION_REPORT.md`
- `docs/engineering/validation/PERFORMANCE_REPORT.md`

---

## Executive & Founder Internal

- `docs/platform/EXECUTIVE_MANIFESTO.md` (full internal constitutional — public gets `EXECUTIVE_PHILOSOPHY.md`)
- `docs/platform/ATHENA_REFERENCE_IMPLEMENTATION.md`
- `docs/platform/LEDGER_REFERENCE_IMPLEMENTATION.md`
- `docs/platform/FOUNDER_WORKSPACE_ARCHITECTURE.md`
- `docs/platform/AUTONOMOUS_EXECUTION_ARCHITECTURE.md`
- `docs/platform/AUTONOMOUS_EXECUTION_GOVERNANCE.md`
- `prompts/**` — all executive and agent prompt packs
- Cursor session artifacts and agent transcripts

---

## Architecture — Internal Debates & Pre-Decision

Full ADR catalog (`docs/architecture/ADR-*.md`) — **247+ architecture documents**:

- Internal unless explicitly curated into public overview
- ADR certification gates (`ADR-088-policy-governance-certification.md`, etc.)
- `docs/architecture/ARCHITECTURE_REVIEW.md`
- `docs/architecture/PLATFORM_OPERATIONS_RELIABILITY_DESIGN_REVIEW.md`
- `docs/architecture/MARKETPLACE_ARCHITECTURE.md` (pre-release)

**Public exception:** Selected ADRs may be excerpted in `docs/public/architecture-overview.md` only — not published in full ADR form without review.

---

## Internal Planning & Roadmaps

- Pre-announce product roadmaps (beyond public landing roadmap)
- Pricing experiments and packaging drafts
- Competitive analysis
- Sales playbooks
- Enterprise deal-specific architecture documents

---

## Engineering Internal

- `docs/platform/RUNTIME_EXPLAINABILITY.md` (internal certification detail)
- `docs/platform/RUNTIME_SCHEDULER.md`
- `docs/platform/ATTENTION_BUDGET_EXPLAINABILITY.md`
- Sprint phase alignment reports
- Load test raw results
- Security penetration test reports (full)
- Incident postmortems (unredacted)

---

## Strategy Documents — Internal Classification

| Document | Classification |
|----------|----------------|
| `OPEN_PLATFORM_STRATEGY.md` | Public (strategy declaration) |
| `REPOSITORY_STRATEGY.md` | Public (planning-only marker) |
| `LICENSING_STRATEGY.md` | Public (recommendation) |
| `DOCUMENTATION_POLICY.md` | Public |
| `PUBLIC_DOCUMENT_INDEX.md` | Public |
| `INTERNAL_DOCUMENT_INDEX.md` | Public (this meta-index — lists categories, not content) |

---

## Access Control (Future `grayscale-internal`)

| Role | Access |
|------|--------|
| Founder / Chairman | Full |
| Core Platform Engineering | Full |
| Executive Certification reviewers | Certification + executive docs |
| Sprint contributors | Sprint-scoped certificates |
| External contractors | Least-privilege; NDAs required |
| Customers | **No access** to this index's document bodies |

---

## Leak Prevention Checklist

Before any docs manifest or public repo sync:

- [ ] File path not listed in this index
- [ ] Content scan: no `prompts/` references with full prompt text
- [ ] No certification scores used for marketing without approval
- [ ] No internal API keys, staging URLs, or employee credentials
- [ ] No unreleased feature commitments

---

## Maintenance

Update this index when:

- New sprint certificate is produced
- New ADR is created (default: INTERNAL until curated)
- New prompt pack is added to `prompts/`
- Certification report is generated

**Owner:** Platform Architecture + Founder Office  
**Target repository:** `grayscale-internal` (future)

Cross-reference: `docs/platform/PUBLIC_DOCUMENT_INDEX.md`
