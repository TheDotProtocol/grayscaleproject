# Council Runtime v2

**Continuous Executive Council — Runtime Upgrade**

**Version:** 2.0.0  
**Sprint:** Sprint 4 Phase B

---

## Upgrade Summary

Council Runtime v2 transforms the Executive Council from a **static governance model** into a **continuously operating collaborative executive network**.

| Capability | v1 (Sprint 3) | v2 (Sprint 4 Phase B) |
|------------|---------------|------------------------|
| Session opening | Manual API | Runtime-scheduled (7 modes) |
| Deliberation | Per-executive records | 12-stage deterministic pipeline |
| Communication | Bus messages | Collaboration network (11 request kinds) |
| History | Basic history entries | Immutable searchable council memory |
| Scheduling | Ad-hoc | Organizational Runtime owns scheduling |
| Certification | Council ECS (11 gates) | + Collaboration ECS (12 gates) |

---

## Council Schedule Modes

| Mode | Trigger |
|------|---------|
| `continuous` | Ongoing council availability |
| `scheduled` | Fixed interval |
| `event_driven` | Catalog events |
| `manual` | Operator via Mission Control |
| `founder_requested` | Founder explicit request |
| `emergency` | Critical organizational issue |
| `policy_triggered` | Automation policy threshold |

**Executives never create councils.** Organizational Runtime owns council scheduling via `CouncilSchedulerService`.

---

## Council Memory

Immutable entry types: minutes, evidence, vote, challenge, alternative, rejected_alternative, consensus, minority_report, founder_override, learning, audit, replay.

Search: `GET /companies/:id/council/memory/search?q=`

---

## CompanyContext Fields (v2.1.0)

- `activeDeliberations` — in-progress proposals
- `collaborationNetwork` — request/challenge/escalation counts
- Existing council fields unchanged (read-only assembly)

---

## Non-Negotiables

- No Bedrock modifications
- No duplicate storage
- Runtime owns scheduling; executives consume
- All collaboration auditable and explainable
