import { Injectable } from "@nestjs/common";
import { OrganizationalTwinService } from "../twin-runtime/organizational-twin.service";
import { SimulationSessionService } from "../twin-runtime/simulation-session.service";
import { ForecastIntelligenceService } from "../twin-runtime/forecast-intelligence.service";
import { TwinCertificationService } from "../twin-runtime/twin-certification.service";
import { TwinStoreService } from "../twin-runtime/twin-store.service";

@Injectable()
export class TwinWidgetDataService {
  constructor(
    private readonly twin: OrganizationalTwinService,
    private readonly simulation: SimulationSessionService,
    private readonly forecast: ForecastIntelligenceService,
    private readonly certification: TwinCertificationService,
    private readonly store: TwinStoreService,
  ) {}

  getOverview(companyId: string) {
    return this.store.twins.get(companyId) ?? this.twin.assemble(companyId);
  }

  getTimeline(companyId: string) {
    return this.twin.getTimeline(companyId);
  }

  getEvolution(companyId: string) {
    return this.twin.getEvolution(companyId);
  }

  getHealth(companyId: string) {
    return this.twin.getHealth(companyId);
  }

  getState(companyId: string) {
    return this.twin.getPresentState(companyId);
  }

  getSimulationQueue(companyId: string) {
    return [...this.store.simulations.values()].filter(
      (s) => s.companyId === companyId && ["draft", "running"].includes(s.status),
    );
  }

  getSimulationResults(companyId: string) {
    return [...this.store.simulations.values()].filter(
      (s) => s.companyId === companyId && s.status === "completed",
    );
  }

  getScenarioLibrary() {
    return this.simulation.listScenarios();
  }

  getForecastDashboard(companyId: string) {
    return this.forecast.list(companyId);
  }

  async getRealityComparison(companyId: string) {
    const forecasts = await this.forecast.list(companyId);
    const latest = forecasts.at(-1);
    if (!latest) return { message: "No forecasts to compare" };
    return {
      forecastId: latest.forecastId,
      projected: latest.projectedMetrics,
      realityWins: true,
      status: latest.status,
    };
  }

  async getReplay(companyId: string) {
    const versions = await this.twin.listVersions(companyId);
    const latest = versions.at(-1);
    if (!latest) return { events: [] };
    return this.twin.replay(companyId, latest.versionId);
  }

  getMetrics(companyId: string) {
    return this.twin.getMetrics(companyId);
  }

  getIntegrity(companyId: string) {
    return this.twin.getIntegrity(companyId);
  }

  getSynchronization(companyId: string) {
    return this.twin.getSynchronization(companyId);
  }

  getLearning(companyId: string) {
    return [...this.store.learning.values()].filter((l) => l.companyId === companyId);
  }
}
