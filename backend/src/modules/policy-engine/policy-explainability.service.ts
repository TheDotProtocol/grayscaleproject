import { Injectable } from "@nestjs/common";
import type { PolicyExplainability } from "@grayscale/platform";
import { PolicyEngineStoreService } from "./policy-engine-store.service";

@Injectable()
export class PolicyExplainabilityService {
  constructor(
    private readonly store: PolicyEngineStoreService,
  ) {}

  explain(decisionId: string): PolicyExplainability | undefined {
    const decision = this.store.decisions.get(decisionId);
    if (!decision) return undefined;

    const existing = this.store.explainability.get(decisionId);
    if (existing) return existing;

    const record: PolicyExplainability = {
      decisionId,
      action: `${decision.actionKind}:${decision.actionRef}`,
      why: decision.reasons.join("; ") || "Default deny — no explicit allow",
      verdict: decision.verdict,
      policiesEvaluated: ["bedrock-decision-policies"],
      constraintsChecked: ["bedrock-strategic-constraints"],
      approvalsRequired: decision.requiredApprovals,
      evidenceRequired: decision.evidenceRequired,
      defaultDenyApplied: decision.verdict === "unknown_denied" || decision.verdict === "prohibited",
      constitutionalSources: [
        "FOUNDER_CONSTITUTION.md",
        "ORGANIZATIONAL_OPERATING_MODEL.md",
        "ARCHITECTURE_LOCK.md",
        "ORGANIZATIONAL_POLICY_ENGINE.md",
      ],
      version: decision.version,
      correlationId: decision.correlationId,
      traceId: `trace-${decision.correlationId.slice(0, 12)}`,
      auditReference: decisionId,
      recordedAt: decision.evaluatedAt,
    };
    this.store.explainability.set(decisionId, record);
    return record;
  }
}
