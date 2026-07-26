import { Injectable } from "@nestjs/common";
import type { SimulationContextSnapshot } from "@grayscale/platform";
import { SIMULATION_ENGINE_VERSION, SIMULATION_SCENARIO_LIBRARY } from "@grayscale/platform";
import { SimulationSessionService } from "./simulation-session.service";
import { SimulationCertificationService } from "./simulation-certification.service";

/** Assembles simulation context for CompanyContext — no duplicate storage */
@Injectable()
export class SimulationContextService {
  constructor(
    private readonly simulation: SimulationSessionService,
    private readonly certification: SimulationCertificationService,
  ) {}

  async assemble(companyId: string): Promise<SimulationContextSnapshot> {
    const history = await this.simulation.getHistory(companyId);
    const active = history.filter((h) => h.status === "draft" || h.status === "running");
    const completed = history.filter((h) => h.status === "completed");
    const cert = await this.certification.certify(companyId);
    const aggregate = await this.simulation.getAggregateMetrics(companyId);

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: SIMULATION_ENGINE_VERSION,
      activeSimulations: active,
      recentSessions: history.slice(0, 10),
      simulationHealth: {
        companyId,
        status: cert.passed ? "healthy" : completed.length > 0 ? "degraded" : "healthy",
        activeSessionCount: active.length,
        lastCompletedAt: completed[0]?.completedAt,
        certificationScore: cert.score,
        assessedAt: new Date().toISOString(),
      },
      simulationCapabilities: {
        scenarioTypes: SIMULATION_SCENARIO_LIBRARY.map((s) => s.type),
        maxConcurrentSessions: 5,
        replayEnabled: true,
        certificationEnabled: true,
        twinSynchronizationRequired: true,
      },
      latestCertification: cert,
    };
  }

  async getAggregateMetrics(companyId: string) {
    return this.simulation.getAggregateMetrics(companyId);
  }
}
