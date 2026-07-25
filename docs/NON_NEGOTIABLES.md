# Project Grayscale — Engineering Constitution

**These principles are non-negotiable.** Every architecture decision, feature, and agent behavior must comply. When in conflict, these principles win.

---

## 1. Founder Data Sovereignty

**Founder data is owned by the founder.**

- All company data belongs to the company and its founders — never to Project Grayscale.
- Data export must always be available (JSON, CSV, PDF).
- Account deletion must permanently remove founder data within 30 days.
- No selling, sharing, or training on founder data without explicit consent.

---

## 2. Privacy by Default

**Privacy is the default.**

- Collect only data required for the feature to function.
- Local-first architecture: Ollama for sensitive operations when possible.
- Integration tokens encrypted at rest.
- No third-party analytics without founder opt-in.
- AI providers must be configurable per-company — founders choose where their data goes.

---

## 3. Explainable AI

**Every AI recommendation must be explainable.**

- Every agent output includes reasoning, confidence score, and source references.
- No black-box decisions on founder-critical actions.
- Memory citations required when agents reference company knowledge.
- Founders can ask "why did you recommend this?" and get a traceable answer.

---

## 4. Human Approval for Critical Actions

**Human approval is required for critical actions.**

- Agents propose; founders approve.
- Critical actions include: financial transactions, external communications, data deletion, integration connections, and agent configuration changes.
- Auto-execution is never allowed for critical actions — even at 99% confidence.
- Approval requests must be clear, actionable, and reversible where possible.

---

## 5. Agent Accountability

**Every executive agent must justify its existence.**

- Each agent must map to a measurable founder outcome (time saved, revenue protected, risk reduced).
- Agents without demonstrated founder benefit are deprecated.
- Agent activity is logged in an audit trail accessible to the founder.
- No agent may act outside its defined permission scope.

---

## 6. Measurable Founder Benefit

**No feature ships without a measurable founder benefit.**

- Every feature must answer: *"Does this increase founder success probability?"*
- Vanity metrics (page views, signups without activation) are not success metrics.
- Sustainable revenue, reduced founder burnout, and faster decision-making are valid metrics.
- Features that add complexity without measurable benefit are rejected.

---

## 7. Simplicity Over Complexity

**Simplicity beats unnecessary complexity.**

- Prefer one database over three. Prefer BullMQ over Kafka. Prefer Postgres edges over Neo4j.
- Do not introduce abstractions until the third use case demands it.
- If a founder cannot understand what a feature does in 10 seconds, simplify it.
- Technical elegance that increases operating cost without founder ROI is rejected.

---

## 8. Sustainable Companies, Not Vanity Metrics

**The product optimizes for sustainable companies, not vanity metrics.**

- Optimize for revenue, retention, and founder health — not growth-at-all-costs.
- Billing reminders help founders stay solvent; they are not upsell mechanisms.
- Agent recommendations prioritize long-term company health over short-term wins.
- We build tools for founders building real businesses, not pitch decks.

---

## 9. Security Without Compromise

**Security is not optional, even in development.**

- Passwords hashed with bcrypt (cost ≥ 12). JWT secrets rotated in production.
- No secrets in source code or client bundles.
- Company-scoped authorization on every tenant route.
- Dependency vulnerabilities patched within 7 days of disclosure.

---

## 10. Open Standards and Portability

**Founders must never be locked in.**

- API-first design — every UI feature has an API equivalent.
- Standard export formats (JSON, CSV, PDF, DOCX).
- AI provider abstraction — switch between Ollama, OpenAI, Anthropic without code changes.
- Self-hostable architecture — founders can run on their own infrastructure.

---

## Enforcement

- All pull requests must reference applicable non-negotiables in the description.
- Architecture Decision Records (ADRs) must note any tension with these principles and justify the deviation.
- Mission Control tracks violations as technical debt.
- Deviations require explicit founder approval documented in an ADR.

---

*This document is the constitution for Project Grayscale engineering. Amendments require founder approval and an ADR.*

**Version:** 1.0  
**Effective:** 2026-07-25  
**Author:** Founding Principal Engineer
