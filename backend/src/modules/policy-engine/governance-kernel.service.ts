import { Injectable } from "@nestjs/common";
import type {
  GovernanceEvaluationResult,
  GovernanceHealth,
  GovernanceMetrics,
  GovernanceState,
  PolicyEvaluationRequest,
  PolicyExceptionSnapshot,
  PolicyHealth,
  OrganizationalPolicySnapshot,
} from "@grayscale/platform";
import { GOVERNANCE_KERNEL_VERSION, POLICY_ENGINE_VERSION } from "@grayscale/platform";
import { PolicyService } from "../intelligence/policy.service";
import { PolicyEvaluationService } from "./policy-evaluation.service";
import { PolicyApprovalService } from "./policy-approval.service";
import { PolicyEngineStoreService } from "./policy-engine-store.service";
import { PolicyEngineConstraintService } from "./policy-engine-constraint.service";
import { EventsService } from "../events/events.service";

/** Governance Kernel — final constitutional checkpoint; validates, never reasons */
@Injectable()
export class GovernanceKernelService {
  constructor(
    private readonly evaluation: PolicyEvaluationService,
    private readonly approvals: PolicyApprovalService,
    private readonly constraints: PolicyEngineConstraintService,
    private readonly bedrockPolicies: PolicyService,
    private readonly store: PolicyEngineStoreService,
    private readonly events: EventsService,
  ) {}

  async evaluate(request: PolicyEvaluationRequest): Promise<GovernanceEvaluationResult> {
    const decision = await this.evaluation.evaluate(request);
    const permitted = decision.verdict === "permitted";
    const checkpointPassed = permitted || decision.verdict.startsWith("requires_");

    if (decision.requiredApprovals.length > 0) {
      for (const kind of decision.requiredApprovals) {
        await this.approvals.routeApproval({
          companyId: request.companyId,
          actionRef: request.actionRef,
          kind,
          correlationId: request.correlationId,
        });
      }
    }

    const result: GovernanceEvaluationResult = {
      evaluationId: this.store.newId("geval"),
      companyId: request.companyId,
      permitted,
      policyDecisionId: decision.decisionId,
      verdict: decision.verdict,
      checkpointPassed,
      correlationId: request.correlationId,
      evaluatedAt: new Date().toISOString(),
      version: GOVERNANCE_KERNEL_VERSION,
    };

    await this.events.publish("governance.checkpoint.completed", request.companyId, {
      evaluationId: result.evaluationId,
      permitted,
      verdict: decision.verdict,
    }, { correlationId: request.correlationId });

    return result;
  }

  async getState(companyId: string): Promise<GovernanceState> {
    const queue = await this.approvals.getQueue(companyId);
    const exceptions = this.store.exceptions.get(companyId) ?? [];
    return {
      companyId,
      kernelVersion: GOVERNANCE_KERNEL_VERSION,
      defaultDeny: true,
      pendingApprovals: queue.pending.length,
      activeExceptions: exceptions.length,
      riskEscalations: 0,
      assembledAt: new Date().toISOString(),
    };
  }

  async getHealth(companyId: string): Promise<GovernanceHealth> {
    const constraintSnap = await this.constraints.assess(companyId);
    const issues: string[] = [];
    if (constraintSnap.violationCount > 0) issues.push(`${constraintSnap.violationCount} constraint violations`);
    const score = Math.max(0, 100 - constraintSnap.violationCount * 10);
    return {
      companyId,
      score,
      status: score >= 70 ? "healthy" : score >= 40 ? "degraded" : "critical",
      issues,
      assessedAt: new Date().toISOString(),
    };
  }

  async getMetrics(companyId: string): Promise<GovernanceMetrics> {
    const decisions = this.evaluation.listRecent(companyId);
    const now = new Date();
    return {
      companyId,
      periodStart: new Date(now.getTime() - 86400000).toISOString(),
      periodEnd: now.toISOString(),
      evaluationsTotal: decisions.length,
      permittedCount: decisions.filter((d) => d.verdict === "permitted").length,
      deniedCount: decisions.filter((d) => d.verdict === "prohibited" || d.verdict === "unknown_denied").length,
      approvalRoutedCount: decisions.filter((d) => d.requiredApprovals.length > 0).length,
      exceptionCount: (this.store.exceptions.get(companyId) ?? []).length,
    };
  }

  async getPolicySnapshot(companyId: string): Promise<OrganizationalPolicySnapshot> {
    const policies = await this.bedrockPolicies.listActive(companyId);
    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: POLICY_ENGINE_VERSION,
      activePolicyCount: policies.length,
      defaultDeny: true,
      correlationId: crypto.randomUUID(),
    };
  }

  async getPolicyHealth(companyId: string): Promise<PolicyHealth> {
    const decisions = this.evaluation.listRecent(companyId);
    const violations = decisions.filter((d) => d.verdict === "prohibited").length;
    const queue = await this.approvals.getQueue(companyId);
    const score = Math.max(0, 100 - violations * 15);
    return {
      companyId,
      score,
      status: score >= 70 ? "healthy" : score >= 40 ? "degraded" : "critical",
      violationCount: violations,
      pendingApprovals: queue.pending.length,
      assessedAt: new Date().toISOString(),
    };
  }

  async listExceptions(companyId: string): Promise<PolicyExceptionSnapshot> {
    return {
      companyId,
      active: this.store.exceptions.get(companyId) ?? [],
      assessedAt: new Date().toISOString(),
    };
  }
}
