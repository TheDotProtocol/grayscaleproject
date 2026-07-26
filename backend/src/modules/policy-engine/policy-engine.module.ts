import { Module, forwardRef } from "@nestjs/common";
import { IntelligenceModule } from "../intelligence/intelligence.module";
import { EventsModule } from "../events/events.module";
import { PolicyEngineStoreService } from "./policy-engine-store.service";
import { PolicyEvaluationService } from "./policy-evaluation.service";
import { PolicyEngineConstraintService } from "./policy-engine-constraint.service";
import { PolicyApprovalService } from "./policy-approval.service";
import { PolicyAuditService } from "./policy-audit.service";
import { PolicyHistoryService } from "./policy-history.service";
import { PolicyExplainabilityService } from "./policy-explainability.service";
import { GovernanceKernelService } from "./governance-kernel.service";
import { GovernanceCertificationService } from "./governance-certification.service";
import { PolicyEngineContextService } from "./policy-engine-context.service";
import { PolicyEngineController } from "./policy-engine.controller";

@Module({
  imports: [IntelligenceModule, forwardRef(() => EventsModule)],
  controllers: [PolicyEngineController],
  providers: [
    PolicyEngineStoreService,
    PolicyEvaluationService,
    PolicyEngineConstraintService,
    PolicyApprovalService,
    PolicyAuditService,
    PolicyHistoryService,
    PolicyExplainabilityService,
    GovernanceKernelService,
    GovernanceCertificationService,
    PolicyEngineContextService,
  ],
  exports: [PolicyEngineContextService, GovernanceKernelService, GovernanceCertificationService, PolicyEvaluationService],
})
export class PolicyEngineModule {}
