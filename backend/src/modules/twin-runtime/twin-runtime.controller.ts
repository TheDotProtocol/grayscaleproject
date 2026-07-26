import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrganizationalTwinService } from "./organizational-twin.service";
import { SimulationSessionService } from "./simulation-session.service";
import { ForecastIntelligenceService } from "./forecast-intelligence.service";
import { TwinCertificationService } from "./twin-certification.service";
import type { SimulationScenarioType } from "@grayscale/platform";

@ApiTags("twin")
@Controller("companies/:companyId/twin")
export class TwinRuntimeController {
  constructor(
    private readonly twin: OrganizationalTwinService,
    private readonly simulation: SimulationSessionService,
    private readonly forecast: ForecastIntelligenceService,
    private readonly certification: TwinCertificationService,
  ) {}

  @Get()
  assemble(@Param("companyId") companyId: string) {
    return this.twin.assemble(companyId);
  }

  @Get("health")
  health(@Param("companyId") companyId: string) {
    return this.twin.getHealth(companyId);
  }

  @Get("metrics")
  metrics(@Param("companyId") companyId: string) {
    return this.twin.getMetrics(companyId);
  }

  @Get("timeline")
  timeline(@Param("companyId") companyId: string) {
    return this.twin.getTimeline(companyId);
  }

  @Get("evolution")
  evolution(@Param("companyId") companyId: string) {
    return this.twin.getEvolution(companyId);
  }

  @Get("integrity")
  integrity(@Param("companyId") companyId: string) {
    return this.twin.getIntegrity(companyId);
  }

  @Get("synchronization")
  synchronization(@Param("companyId") companyId: string) {
    return this.twin.getSynchronization(companyId);
  }

  @Get("versions")
  versions(@Param("companyId") companyId: string) {
    return this.twin.listVersions(companyId);
  }

  @Get("versions/:versionId/replay")
  replay(@Param("companyId") companyId: string, @Param("versionId") versionId: string) {
    return this.twin.replay(companyId, versionId);
  }

  @Post("snapshots")
  snapshot(@Param("companyId") companyId: string, @Body() body: { milestone?: string }) {
    return this.twin.captureSnapshot(companyId, body.milestone);
  }

  @Get("certify")
  certify(@Param("companyId") companyId: string) {
    return this.certification.certify(companyId);
  }

  @Get("simulations")
  listSimulations(@Param("companyId") companyId: string) {
    return this.simulation.getHistory(companyId);
  }

  @Get("scenarios")
  scenarios() {
    return this.simulation.listScenarios();
  }

  @Post("simulations")
  createSimulation(
    @Param("companyId") companyId: string,
    @Body() body: { twinVersionId: string; type: SimulationScenarioType; label: string; description: string },
  ) {
    return this.simulation.createSession({ companyId, twinVersionId: body.twinVersionId, scenario: body });
  }

  @Post("simulations/:sessionId/run")
  runSimulation(@Param("sessionId") sessionId: string) {
    return this.simulation.runSession(sessionId);
  }

  @Get("forecasts")
  listForecasts(@Param("companyId") companyId: string) {
    return this.forecast.list(companyId);
  }

  @Post("forecasts")
  generateForecast(
    @Param("companyId") companyId: string,
    @Body() body: { twinVersionId: string; horizonDays: number },
  ) {
    return this.forecast.generate({ companyId, ...body });
  }
}
