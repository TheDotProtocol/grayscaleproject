import { Module } from "@nestjs/common";
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
import { CouncilRuntimeController } from "./council-runtime.controller";

@Module({
  imports: [EventsModule, ExecutiveModule, ContextRuntimeModule],
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
  ],
  exports: [ExecutiveCouncilRuntimeService, CouncilCertificationService, CouncilSessionService, CouncilAttentionService],
})
export class CouncilRuntimeModule {}
