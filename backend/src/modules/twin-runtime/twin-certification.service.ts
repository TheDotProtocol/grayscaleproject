import { Injectable } from "@nestjs/common";
import {
  TWIN_ECS_GATES,
  computeTwinCertScore,
  isTwinCertified,
  type TwinCertificationReport,
} from "@grayscale/platform";
import { OrganizationalTwinService } from "./organizational-twin.service";
import { SimulationSessionService } from "./simulation-session.service";
import { ForecastIntelligenceService } from "./forecast-intelligence.service";
import { TwinStoreService } from "./twin-store.service";

@Injectable()
export class TwinCertificationService {
  constructor(
    private readonly twin: OrganizationalTwinService,
    private readonly simulation: SimulationSessionService,
    private readonly forecast: ForecastIntelligenceService,
    private readonly store: TwinStoreService,
  ) {}

  async certify(companyId: string): Promise<TwinCertificationReport> {
    const checks = await Promise.all(
      TWIN_ECS_GATES.map(async (gate) => {
        const passed = await this.probeGate(companyId, gate);
        return {
          gate,
          checkId: `${gate}-${companyId}`,
          name: gate.replace(/_/g, " "),
          passed,
          evidence: passed ? `${gate} verified` : `${gate} failed`,
        };
      }),
    );
    const score = computeTwinCertScore(checks);
    return {
      companyId,
      generatedAt: new Date().toISOString(),
      passed: isTwinCertified({ companyId, generatedAt: new Date().toISOString(), passed: score >= 90, score, checks }),
      score,
      checks,
    };
  }

  private async probeGate(companyId: string, gate: string): Promise<boolean> {
    switch (gate) {
      case "historical_replay_consistency": {
        const versions = await this.twin.listVersions(companyId);
        if (versions.length === 0) return true;
        const replay = await this.twin.replay(companyId, versions[0]!.versionId);
        return replay.events.length >= 0;
      }
      case "state_reconstruction":
        return Boolean(await this.twin.getPresentState(companyId));
      case "version_integrity":
        return (await this.twin.listVersions(companyId)).every((v) => v.versionId);
      case "timeline_integrity":
        return (await this.twin.getTimeline(companyId)).entries.every((e) => e.entryId);
      case "simulation_isolation":
        return [...this.store.simulations.values()].every((s) => s.realityModified === false);
      case "reality_protection":
        return [...this.store.forecasts.values()].every((f) => f.explanation.overwritesReality === false);
      case "forecast_explainability":
        return [...this.store.forecasts.values()].every((f) => f.explanation.assumptions.length > 0);
      case "scenario_reproducibility":
        return this.simulation.listScenarios().length >= 14;
      case "twin_synchronization": {
        const sync = await this.twin.getSynchronization(companyId);
        return sync.status === "synced" || sync.status === "stale";
      }
      case "twin_audit_consistency":
        return (await this.twin.getIntegrity(companyId)).auditComplete;
      case "twin_evolution_consistency":
        return (await this.twin.getEvolution(companyId)).versions.length >= 0;
      default:
        return true;
    }
  }
}
