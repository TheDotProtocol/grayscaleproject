# Council Governance Model

**Project Grayscale — Executive Council Governance**

**Version:** 1.0.0  
**Status:** Constitutional — Sprint 3 Phase A  
**Companion:** `EXECUTIVE_COUNCIL_CONSTITUTION.md`

---

## Governance Hierarchy

```
Founder (sovereign)
  ↓
Founder Constitution
  ↓
Organizational Operating Model
  ↓
Executive Council Constitution (this governance layer)
  ↓
Council Session Governance (CouncilGovernance)
  ↓
Executive roles (CouncilMember)
```

---

## Council Roles

| Role | ID | Voting | Responsibilities |
|------|-----|--------|------------------|
| Chair Executive | `chair` | Procedural only | Facilitate sessions, enforce order, procedural tie-breaks |
| Reference Executive | `reference` | Yes | Athena — implementation reference, pattern inheritance |
| Voting Executive | `voting` | Yes | Domain binding votes on resolutions |
| Advisory Executive | `advisory` | No* | Expert input; session elevation possible |
| Observer Executive | `observer` | No | Read-only; may request clarification |
| Temporary Executive | `temporary` | Scoped | Time-bounded; explicit expiry |

*Advisory may be elevated to voting for a specific session with recorded rationale.

---

## Membership Model

```typescript
CouncilMember {
  executiveId: string
  roles: CouncilRole[]
  domains: string[]
  votingWeight: number
  trustScore?: number
  activeFrom: ISO8601
  activeUntil?: ISO8601
  certified: boolean
}
```

Future executives declare roles at ECS certification (Phase B+).

---

## Session Governance

| Rule | Enforcement |
|------|-------------|
| Quorum | Minimum participating voting executives |
| Evidence for dissent | Required — validated at vote submission |
| Founder presence | Required for material decisions (configurable policy) |
| Constitution check | Every session validates compliance flags |
| Session closure | Requires consensus measurement or escalation |

---

## Escalation Model

**CouncilEscalation** triggers:

1. No consensus after deliberation rounds
2. Constitutional compliance failure
3. Responsibility conflict unresolved
4. Material decision without adequate evidence
5. Executive request for Founder ruling

Escalation **preserves** all deliberation record—it does not reset.

---

## Override Model

**CouncilOverride** records Founder actions:

| Override Type | Learning Outcome |
|---------------|------------------|
| Reject majority | Record minority validation path |
| Select minority | Promote dissent evidence to learning |
| Halt session | Record halt reason; issue remains open |
| Reassign responsibility | Update CouncilResponsibility map |

---

## Conflict Resolution

**CouncilConflictResolution** for overlapping domain claims:

1. Evidence comparison
2. Chair ruling (procedural scope)
3. Founder ruling (substantive scope)
4. ADR if governance semantics change

---

## Evolution Governance

**CouncilEvolution** for membership changes:

| Event | Requirements |
|-------|--------------|
| Add executive | ECS certified, roles declared, ADR if new domain |
| Remove executive | Handoff complete, history preserved |
| Role change | Recorded, effective-dated |
| Temporary assignment | Expiry enforced automatically |

---

## Compliance Enforcement

**CouncilGovernance** validates per session:

- [ ] Founder Constitution inherited
- [ ] Council Constitution inherited
- [ ] Organizational Operating Model referenced
- [ ] Architecture Lock respected
- [ ] ECS council gates (Phase B+)

Non-compliant sessions cannot produce binding resolutions.

---

## Trust Governance

Trust informs deliberation—it does not replace evidence:

| Trust Level | Effect |
|-------------|--------|
| High | Standard evidence requirements |
| Medium | Enhanced citation requirements for material dissent |
| Low | Full evidence required for all positions |

Trust never removes voting rights.

---

*Platform contracts:* `@grayscale/platform/council`
