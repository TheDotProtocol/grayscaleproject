import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
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

@ApiTags("platform-operations")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("platform/operations")
export class PlatformOperationsController {
  constructor(
    private readonly reliability: ReliabilityEngineService,
    private readonly diagnostics: DiagnosticsEngineService,
    private readonly performance: PerformanceObservatoryService,
    private readonly recovery: RecoveryService,
    private readonly cost: PlatformCostObservatoryService,
    private readonly readiness: ReadinessReportGeneratorService,
    private readonly governance: GovernanceService,
    private readonly security: SecurityObservatoryService,
    private readonly evolution: PlatformEvolutionService,
    private readonly pulseV2: PulseV2Service,
  ) {}

  @Get("reliability")
  getReliability(@Query("window") window?: string) {
    return this.reliability.computeAll(window);
  }

  @Get("reliability/:serviceId")
  getServiceReliability(@Param("serviceId") serviceId: string, @Query("window") window?: string) {
    return this.reliability.computeProfile(serviceId, window);
  }

  @Get("diagnostics")
  getDiagnostics(@Query("companyId") companyId?: string) {
    return this.diagnostics.runAll(companyId);
  }

  @Get("diagnostics/:subsystem")
  getSubsystemDiagnostics(@Param("subsystem") subsystem: never, @Query("companyId") companyId?: string) {
    return this.diagnostics.runSubsystem(subsystem, companyId);
  }

  @Get("metrics")
  getMetrics() {
    return this.performance.getCurrent();
  }

  @Get("metrics/trends")
  getTrends(@Query("window") window = "24h", @Query("category") category?: never) {
    return this.performance.getTrends(window, category);
  }

  @Get("cost")
  getCost(@Query("period") period?: string) {
    return this.cost.compute(period);
  }

  @Get("security")
  getSecurity(@Query("companyId") companyId?: string) {
    return this.security.assess(companyId);
  }

  @Get("evolution")
  getEvolution() {
    return this.evolution.getCurrent();
  }

  @Get("governance")
  searchGovernance(@Query("q") q?: string, @Query("type") type?: never) {
    return this.governance.search(q, type);
  }

  @Get("pulse")
  getPulse(@Query("companyId") companyId: string) {
    return this.pulseV2.aggregateDomains(companyId);
  }

  @Get("recovery")
  listRecovery() {
    return this.recovery.list();
  }

  @Get("recovery/:id")
  getRecovery(@Param("id") id: string) {
    return this.recovery.get(id);
  }

  @Post("recovery/replay")
  replay(@Body() body: Record<string, unknown>) {
    return this.recovery.execute("replay", body);
  }

  @Post("recovery/snapshot")
  snapshot(@Body() body: { name: string }) {
    return this.recovery.execute("snapshot", body);
  }

  @Post("recovery/rebuild")
  rebuild(@Body() body: Record<string, unknown>) {
    return this.recovery.execute("platform_rebuild", body);
  }

  @Post("readiness/generate")
  generateReadiness() {
    return this.readiness.generate();
  }

  @Get("readiness/latest")
  latestReadiness() {
    return this.readiness.getLatest();
  }

  @Get("readiness/:id")
  getReadiness(@Param("id") id: string) {
    return this.readiness.getById(id);
  }
}
