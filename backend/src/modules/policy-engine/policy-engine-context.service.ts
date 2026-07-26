import { Injectable } from "@nestjs/common";
import type { PolicyExplainability, PolicyHistory } from "@grayscale/platform";
import { GovernanceKernelService } from "./governance-kernel.service";
import { PolicyApprovalService } from "./policy-approval.service";
import { PolicyEngineConstraintService } from "./policy-engine-constraint.service";
import { PolicyHistoryService } from "./policy-history.service";
import { PolicyExplainabilityService } from "./policy-explainability.service";
import { GovernanceCertificationService } from "./governance-certification.service";
import { PolicyEvaluationService } from "./policy-evaluation.service";

@Injectable()
export class PolicyEngineContextService {
  constructor(
    private readonly kernel: GovernanceKernelService,
    private readonly constraints: PolicyEngineConstraintService,
    private readonly approvals: PolicyApprovalService,
    private readonly history: PolicyHistoryService,
    private readonly explainability: PolicyExplainabilityService,
    private readonly certification: GovernanceCertificationService,
    private readonly evaluation: PolicyEvaluationService,
  ) {}

  async assemble(companyId: string) {
    const [
      organizationalPolicies,
      policyHealth,
      policyConstraints,
      policyApprovals,
      policyExceptions,
      governanceState,
      governanceHealth,
      governanceMetrics,
      policyHistory,
    ] = await Promise.all([
      this.kernel.getPolicySnapshot(companyId),
      this.kernel.getPolicyHealth(companyId),
      this.constraints.assess(companyId),
      this.approvals.getQueue(companyId),
      this.kernel.listExceptions(companyId),
      this.kernel.getState(companyId),
      this.kernel.getHealth(companyId),
      this.kernel.getMetrics(companyId),
      this.history.getHistory(companyId),
    ]);

    const recent = this.evaluation.listRecent(companyId);
    const latestDecision = recent[recent.length - 1];
    const policyExplainability = latestDecision ? this.explainability.explain(latestDecision.decisionId) : undefined;

    return {
      organizationalPolicies,
      policyHealth,
      policyConstraints,
      policyApprovals,
      policyExceptions,
      governanceState,
      governanceHealth,
      governanceMetrics,
      policyExplainability,
      policyHistory,
    };
  }
}
