# Organizational Wisdom Engine

**Version:** 1.0.0 (Sprint 4)  
**ADR:** ADR-019 (contract), ADR-049 (runtime)

---

## Principle

Wisdom ≠ Memory ≠ Learning. Wisdom represents **validated organizational truths** — institutional capital.

## Requirements

- Repeated evidence
- Historical consistency
- Cross-executive agreement (via council)
- Reality validation
- Founder consistency

Executives consume approved wisdom before strategy evaluation. Executives never approve wisdom.

## Platform

`packages/platform/src/organization/wisdom-engine.ts`

## Backend

`OrganizationalWisdomEngineService` — propose, approve, listApproved, getHistory, growth metrics.

## API

```
GET  /companies/:id/organizational-evolution/wisdom
GET  /companies/:id/organizational-evolution/wisdom/approved
POST /companies/:id/organizational-evolution/wisdom/propose
```

## Twin Integration

Approved wisdom flows into `CompanyContext.organizationalIntelligence.approvedWisdom` and twin `wisdom` view.
