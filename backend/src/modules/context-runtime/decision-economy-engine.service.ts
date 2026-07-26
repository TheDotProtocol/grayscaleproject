import { Injectable } from "@nestjs/common";
import type { OrganizationalDecisionEconomy } from "@grayscale/platform";
import { DECISION_ECONOMY_VERSION } from "@grayscale/platform";
import { AttentionEngineService } from "./attention-engine.service";
import { foresightMetric } from "./organizational-reasoning.util";

/** Decision Economy — measurable decision costs (deterministic, no recommendations) */
@Injectable()
export class DecisionEconomyEngineService {
  constructor(private readonly attention: AttentionEngineService) {}

  async assess(companyId: string): Promise<OrganizationalDecisionEconomy> {
    const attn = await this.attention.assemble(companyId);
    const congestion = attn.decisionCongestion;
    const evidence = [`open:${congestion.openDecisions}`, `congestion:${congestion.congestionScore.toFixed(2)}`];

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: DECISION_ECONOMY_VERSION,
      decisionCost: { ...foresightMetric(congestion.congestionScore, "Decision congestion as cost proxy", evidence), estimatedHours: congestion.openDecisions * 2 },
      decisionDebt: { ...foresightMetric(attn.debt.deferredItems / Math.max(1, attn.budget.totalCapacity), "Deferred decision load", attn.debt.domains), deferredDecisions: attn.debt.deferredItems, oldestDays: attn.debt.oldestDeferredDays },
      decisionVelocity: { ...foresightMetric(1 / Math.max(1, congestion.openDecisions), "Inverse of open decision backlog", evidence), decisionsPerWeek: Math.max(0, 10 - congestion.openDecisions) },
      decisionRoi: { ...foresightMetric(1 - congestion.congestionScore, "Quality inverse of congestion", evidence), score: 1 - congestion.congestionScore },
      decisionComplexity: { ...foresightMetric(congestion.congestionScore, "Open decisions + council load", [...evidence, `council:${congestion.pendingCouncilIssues}`]), score: congestion.congestionScore, factors: evidence },
      decisionConfidence: { ...foresightMetric(1 - (attn.drift?.driftScore ?? 0), "Inverse of attention drift", attn.drift?.declaredFocus ?? []), score: 1 - (attn.drift?.driftScore ?? 0) },
      decisionQuality: { ...foresightMetric(1 - attn.operationalNoise.noiseScore, "Signal-to-noise in decision environment", attn.operationalNoise.sources), score: 1 - attn.operationalNoise.noiseScore },
      opportunityCost: { ...foresightMetric(attn.debt.deferredItems / Math.max(1, attn.budget.totalCapacity), "Deferred items as opportunity cost", attn.debt.domains), score: attn.debt.deferredItems / Math.max(1, attn.budget.totalCapacity), deferredOpportunities: attn.debt.domains },
      attentionCost: { ...foresightMetric(attn.saturation.level, "Attention slots consumed", [`allocated:${attn.budget.allocated}`]), cognitiveSlots: attn.budget.allocated },
      founderBandwidth: { ...foresightMetric(attn.budget.allocated / Math.max(1, attn.budget.totalCapacity), "Founder cognitive utilization", evidence), utilization: attn.budget.allocated / Math.max(1, attn.budget.totalCapacity), pendingActions: congestion.openDecisions },
      executiveBandwidth: { ...foresightMetric(attn.executiveAttention.reduce((s, e) => s + e.allocatedWeight, 0), "Executive load aggregate", attn.executiveAttention.map((e) => e.executiveId)), utilization: attn.executiveAttention.reduce((s, e) => s + e.allocatedWeight, 0), executiveCount: attn.executiveAttention.length },
      riskReduction: { ...foresightMetric(1 - attn.saturation.level, "Capacity headroom for risk mitigation", evidence), score: 1 - attn.saturation.level },
    };
  }
}
