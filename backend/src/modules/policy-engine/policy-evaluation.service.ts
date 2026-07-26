import { Injectable } from "@nestjs/common";
import type {
  PolicyActionKind,
  PolicyDecision,
  PolicyEvaluationRequest,
  PolicyVerdict,
} from "@grayscale/platform";
import { POLICY_ENGINE_VERSION } from "@grayscale/platform";
import { PolicyService } from "../intelligence/policy.service";
import { ConstraintService as IntelligenceConstraintService } from "../intelligence/constraint.service";
import { EventsService } from "../events/events.service";
import { PolicyEngineStoreService } from "./policy-engine-store.service";
import { PolicyAuditService } from "./policy-audit.service";
import { PolicyHistoryService } from "./policy-history.service";

/** Deterministic policy evaluation — default deny, no reasoning */
@Injectable()
export class PolicyEvaluationService {
  constructor(
    private readonly bedrockPolicies: PolicyService,
    private readonly bedrockConstraints: IntelligenceConstraintService,
    private readonly store: PolicyEngineStoreService,
    private readonly audit: PolicyAuditService,
    private readonly history: PolicyHistoryService,
    private readonly events: EventsService,
  ) {}

  async evaluate(request: PolicyEvaluationRequest): Promise<PolicyDecision> {
    const policies = await this.bedrockPolicies.listActive(request.companyId);
    const constraints = await this.bedrockConstraints.list(request.companyId);

    const violations = this.bedrockPolicies.evaluatePolicies(policies, {
      requiresApproval: request.context?.requiresApproval as boolean | undefined,
      estimatedCostCents: request.context?.estimatedCostCents as number | undefined,
    });
    const constraintViolations = this.bedrockConstraints.evaluateConstraints(constraints, {
      estimatedCostCents: request.context?.estimatedCostCents as number | undefined,
    });

    let verdict: PolicyVerdict = "permitted";
    const requiredApprovals: Array<"founder" | "council" | "executive"> = [];
    const reasons: string[] = [];

    if (policies.length === 0 && !request.context?.explicitAllow) {
      verdict = "unknown_denied";
      reasons.push("No active policies — default deny");
    } else if (constraintViolations.some((v) => v.includes("(hard)"))) {
      verdict = "prohibited";
      reasons.push(...constraintViolations);
    } else if (violations.some((v) => v.includes("founder"))) {
      verdict = "requires_founder_approval";
      requiredApprovals.push("founder");
      reasons.push(...violations);
    } else if (violations.some((v) => v.includes("council"))) {
      verdict = "requires_council_consensus";
      requiredApprovals.push("council");
      reasons.push(...violations);
    } else if (violations.length > 0) {
      verdict = "requires_executive_approval";
      requiredApprovals.push("executive");
      reasons.push(...violations);
    } else if (constraintViolations.length > 0) {
      verdict = "requires_evidence";
      reasons.push(...constraintViolations);
    }

    const decision: PolicyDecision = {
      decisionId: this.store.newId("pdec"),
      companyId: request.companyId,
      actionKind: request.actionKind,
      actionRef: request.actionRef,
      verdict,
      reasons,
      requiredApprovals,
      evidenceRequired: verdict === "requires_evidence",
      correlationId: request.correlationId,
      evaluatedAt: new Date().toISOString(),
      version: POLICY_ENGINE_VERSION,
    };

    this.store.decisions.set(decision.decisionId, decision);
    await this.history.record(request.companyId, {
      companyId: request.companyId,
      action: verdict === "permitted" ? "approve" : "deny",
      summary: `${request.actionKind}:${request.actionRef} → ${verdict}`,
      policyVersion: POLICY_ENGINE_VERSION,
      correlationId: request.correlationId,
    });
    await this.audit.record({
      companyId: request.companyId,
      action: "policy.evaluated",
      actorId: "organizational-policy-engine",
      correlationId: request.correlationId,
      traceId: `trace-${request.correlationId.slice(0, 12)}`,
      details: { verdict, actionRef: request.actionRef },
    });
    await this.events.publish("policy.evaluated", request.companyId, { decisionId: decision.decisionId, verdict }, {
      correlationId: request.correlationId,
    });

    return decision;
  }

  listRecent(companyId: string): PolicyDecision[] {
    return [...this.store.decisions.values()].filter((d) => d.companyId === companyId).slice(-20);
  }

  getDecision(decisionId: string): PolicyDecision | null {
    return this.store.decisions.get(decisionId) ?? null;
  }
}
