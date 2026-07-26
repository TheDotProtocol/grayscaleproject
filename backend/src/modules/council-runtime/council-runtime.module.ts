import { Module, forwardRef } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { ExecutiveModule } from "../executive/executive.module";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { CouncilStoreService } from "./council-store.service";
import { CouncilDecisionClassifierService } from "./council-decision-classifier.service";
import { CouncilSessionService } from "./council-session.service";
import { CouncilEvidenceService } from "./council-evidence.service";
import { CouncilConsensusService } from "./council-consensus.service";
import { CouncilDecisionService, CouncilExplainabilityService } from "./council-decision.service";
import { CouncilGovernanceService } from "./council-governance.service";
import { CouncilHistoryService, CouncilReplayService, CouncilAttentionService } from "./council-history.service";
import { ExecutiveCouncilRuntimeService } from "./executive-council-runtime.service";
import { CouncilCertificationService } from "./council-certification.service";
import { CouncilCollaborationService } from "./council-collaboration.service";
import { CouncilRuntimeController } from "./council-runtime.controller";

@Module({
  imports: [forwardRef(() => EventsModule), ExecutiveModule, forwardRef(() => ContextRuntimeModule)],
  controllers: [CouncilRuntimeController],
  providers: [
    CouncilStoreService,
    CouncilDecisionClassifierService,
    CouncilSessionService,
    CouncilEvidenceService,
    CouncilConsensusService,
    CouncilDecisionService,
    CouncilExplainabilityService,
    CouncilGovernanceService,
    CouncilHistoryService,
    CouncilReplayService,
    CouncilAttentionService,
    ExecutiveCouncilRuntimeService,
    CouncilCertificationService,
    CouncilCollaborationService,
  ],
  exports: [
    ExecutiveCouncilRuntimeService,
    CouncilCertificationService,
    CouncilSessionService,
    CouncilAttentionService,
    CouncilDecisionClassifierService,
    CouncilStoreService,
    CouncilCollaborationService,
  ],
})
export class CouncilRuntimeModule {}
