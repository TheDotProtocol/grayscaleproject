import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { GovernanceKernelService } from "./governance-kernel.service";
import { GovernanceCertificationService } from "./governance-certification.service";
import { PolicyEngineContextService } from "./policy-engine-context.service";
import { PolicyEvaluationService } from "./policy-evaluation.service";
import { PolicyExplainabilityService } from "./policy-explainability.service";

@Controller("policy-engine")
export class PolicyEngineController {
  constructor(
    private readonly context: PolicyEngineContextService,
    private readonly kernel: GovernanceKernelService,
    private readonly evaluation: PolicyEvaluationService,
    private readonly explainability: PolicyExplainabilityService,
    private readonly certification: GovernanceCertificationService,
  ) {}

  @Get(":companyId/snapshot")
  getSnapshot(@Param("companyId") companyId: string) {
    return this.context.assemble(companyId);
  }

  @Post(":companyId/evaluate")
  evaluate(
    @Param("companyId") companyId: string,
    @Body() body: { actionKind: string; actionRef: string; context?: Record<string, unknown>; correlationId?: string },
  ) {
    return this.kernel.evaluate({
      companyId,
      actionKind: body.actionKind as never,
      actionRef: body.actionRef,
      context: body.context,
      correlationId: body.correlationId ?? crypto.randomUUID(),
    });
  }

  @Get(":companyId/decisions")
  listDecisions(@Param("companyId") companyId: string) {
    return this.evaluation.listRecent(companyId);
  }

  @Get(":companyId/explain/:decisionId")
  explain(@Param("decisionId") decisionId: string) {
    return this.explainability.explain(decisionId);
  }

  @Get(":companyId/certification/policy")
  certifyPolicy(@Param("companyId") companyId: string) {
    return this.certification.certifyPolicy(companyId);
  }

  @Get(":companyId/certification/governance")
  certifyGovernance(@Param("companyId") companyId: string) {
    return this.certification.certifyGovernance(companyId);
  }

  @Get(":companyId/governance/state")
  getGovernanceState(@Param("companyId") companyId: string) {
    return this.kernel.getState(companyId);
  }
}
