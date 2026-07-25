import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { EventsModule } from "../events/events.module";
import { MissionControlModule } from "../mission-control/mission-control.module";
import { PulseModule } from "../pulse/pulse.module";
import { PlatformOperationsController } from "./platform-operations.controller";
import { ReliabilityEngineService } from "./reliability-engine.service";
import { DiagnosticsEngineService } from "./diagnostics-engine.service";
import { PerformanceObservatoryService } from "./performance-observatory.service";
import { RecoveryService } from "./recovery.service";
import { PlatformCostObservatoryService } from "./platform-cost-observatory.service";
import { ReadinessReportGeneratorService } from "./readiness-report-generator.service";
import { GovernanceService } from "./governance.service";
import { SecurityObservatoryService } from "./security-observatory.service";
import { PlatformEvolutionService } from "./platform-evolution.service";
import { PulseV2Service } from "./pulse-v2.service";

@Module({
  imports: [PrismaModule, EventsModule, forwardRef(() => MissionControlModule), PulseModule],
  controllers: [PlatformOperationsController],
  providers: [
    ReliabilityEngineService,
    DiagnosticsEngineService,
    PerformanceObservatoryService,
    RecoveryService,
    PlatformCostObservatoryService,
    ReadinessReportGeneratorService,
    GovernanceService,
    SecurityObservatoryService,
    PlatformEvolutionService,
    PulseV2Service,
  ],
  exports: [
    ReliabilityEngineService,
    DiagnosticsEngineService,
    PerformanceObservatoryService,
    RecoveryService,
    ReadinessReportGeneratorService,
    SecurityObservatoryService,
    GovernanceService,
    PulseV2Service,
  ],
})
export class PlatformOperationsModule {}
