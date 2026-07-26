import { Inject, Injectable, forwardRef } from "@nestjs/common";
import type { OrganizationalAntifragility } from "@grayscale/platform";
import { ANTIFRAGILITY_ENGINE_VERSION } from "@grayscale/platform";
import { HomeostasisEngineService } from "./homeostasis-engine.service";
import { SimulationContextService } from "../twin-runtime/simulation-context.service";
import { foresightMetric } from "./organizational-reasoning.util";

/** Antifragility — how organization improves under stress (deterministic, no recommendations) */
@Injectable()
export class AntifragilityEngineService {
  constructor(
    private readonly homeostasis: HomeostasisEngineService,
    @Inject(forwardRef(() => SimulationContextService))
    private readonly simulation: SimulationContextService,
  ) {}

  async assess(companyId: string): Promise<OrganizationalAntifragility> {
    const [homeo, simCtx] = await Promise.all([
      this.homeostasis.assess(companyId),
      this.simulation.assemble(companyId),
    ]);

    const stress = homeo.stressIndex.value;
    const recovery = homeo.recoveryCapacity.score;
    const simCount = simCtx.recentSessions.length;
    const evidence = [`stress:${stress.toFixed(2)}`, `recovery:${recovery.toFixed(2)}`, `simulations:${simCount}`];

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: ANTIFRAGILITY_ENGINE_VERSION,
      stressGain: { ...foresightMetric(Math.max(0, recovery - stress * 0.5), "Net gain from stress-recovery cycle", evidence), score: Math.max(0, recovery - stress * 0.5) },
      adaptationSpeed: { ...foresightMetric(homeo.adaptationRate.rate, "Domain adaptation rate", homeo.adaptationRate.domains), rate: homeo.adaptationRate.rate, domains: homeo.adaptationRate.domains },
      failureLearning: { ...foresightMetric(simCount > 0 ? 0.6 : 0.3, "Simulation-derived learning exposure", evidence), lessonsRecorded: simCount, domains: homeo.adaptationRate.domains },
      elasticity: { ...foresightMetric(homeo.organizationalBalance.score, "Organizational balance elasticity", evidence), score: homeo.organizationalBalance.score },
      recoveryAcceleration: { ...foresightMetric(homeo.recoveryVelocity.score, "Recovery velocity toward equilibrium", evidence), score: homeo.recoveryVelocity.score, daysToRecover: homeo.recoveryVelocity.daysToEquilibrium },
      innovationPressure: { ...foresightMetric(stress * 0.4 + simCount * 0.1, "Stress + experiment pressure", evidence, stress > 0.5 ? "rising" : "stable"), score: stress * 0.4 + simCount * 0.1, sources: ["homeostasis", "simulation"] },
      experimentQuality: { ...foresightMetric(simCtx.simulationHealth.certificationScore ? simCtx.simulationHealth.certificationScore / 100 : 0.5, "Simulation certification quality proxy", evidence), score: simCtx.simulationHealth.certificationScore ? simCtx.simulationHealth.certificationScore / 100 : 0.5, simulationCount: simCount },
      resilience: { ...foresightMetric(homeo.resilienceIndex.score, "Composite resilience index", evidence), score: homeo.resilienceIndex.score },
      recoveryCurve: { ...foresightMetric(recovery, "Recovery curve shape from homeostasis", evidence), curveShape: recovery > 0.6 ? "exponential" : "linear", estimatedDays: homeo.recoveryCapacity.estimatedRecoveryDays },
      organizationalFlexibility: { ...foresightMetric(homeo.adaptiveCapacity.score, "Adaptive capacity across domains", homeo.adaptiveCapacity.domains), score: homeo.adaptiveCapacity.score, domains: homeo.adaptiveCapacity.domains },
      institutionalGrowth: { ...foresightMetric(homeo.healthMomentum.score, "Health momentum as institutional growth proxy", evidence, homeo.healthMomentum.direction === "accelerating" ? "rising" : "stable"), score: homeo.healthMomentum.score, indicators: homeo.healthMomentum.evidence },
    };
  }
}
