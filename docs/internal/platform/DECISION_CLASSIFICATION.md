# Decision Classification

**Companion to ORGANIZATIONAL_DECISION_MODEL.md**

---

## Flow

```
Issue proposed
  → decisionClass validated (isValidDecisionClass)
  → classifyDecision() → ClassifiedDecision
  → requirements loaded from DECISION_CLASS_REGISTRY
  → council.issue.classified event
  → deliberation may begin
```

---

## Platform Functions

```typescript
import { classifyDecision, isValidDecisionClass, DECISION_CLASS_REGISTRY } from "@grayscale/platform";

const classified = classifyDecision("financial", correlationId);
// classified.requirements.founderApprovalRequired === true
```

---

## Enforcement

- `CouncilDecisionClassifierService` — backend
- Invalid class → error before issue creation
- Requirements drive consensus founder-review triggers

---

*Registry:* `packages/platform/src/decision/decision-classes.ts`
