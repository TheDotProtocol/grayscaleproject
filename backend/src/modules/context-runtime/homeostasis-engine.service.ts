import { Injectable } from "@nestjs/common";
import type { HomeostasisMetricDetail, HomeostasisTrend, OrganizationalHomeostasis } from "@grayscale/platform";
import { HOMEOSTASIS_ENGINE_VERSION } from "@grayscale/platform";
import { AttentionEngineService } from "./attention-engine.service";

function buildMetric(
  value: number,
  reason: string,
  evidence: string[],
  trend: HomeostasisTrend,
): HomeostasisMetricDetail {
  return {
    value,
    reason,
    confidence: Math.min(0.95, 0.55 + evidence.length * 0.08),
    evidence,
    trend,
    history: [{ recordedAt: new Date().toISOString(), value }],
  };
}

/** Organizational Homeostasis — equilibrium service (deterministic, no LLM, no recommendations) */
@Injectable()
export class HomeostasisEngineService {
  constructor(private readonly attention: AttentionEngineService) {}

  async assess(companyId: string): Promise<OrganizationalHomeostasis> {
    const attn = await this.attention.assemble(companyId);
    const saturation = attn.saturation.level;
    const congestion = attn.decisionCongestion.congestionScore;
    const stress = Math.min(1, saturation + congestion * 0.3);
    const stabilityScore = 1 - stress;
    const evidenceBase = [
      `attention_saturation:${saturation.toFixed(2)}`,
      `decision_congestion:${congestion.toFixed(2)}`,
      ...(attn.insights.driftWarnings.length ? attn.insights.driftWarnings : ["baseline_equilibrium"]),
    ];
    const now = new Date().toISOString();

    const stabilityMetric = buildMetric(
      stabilityScore,
      stress > 0.8 ? "Critical stress exceeds recovery capacity" : stress > 0.5 ? "Elevated load straining equilibrium" : "Organization within stable operating band",
      evidenceBase,
      attn.trends[0]?.direction === "increasing" ? "declining" : "stable",
    );

    const stressMetric = buildMetric(
      stress,
      "Composite of attention saturation and decision congestion",
      evidenceBase,
      attn.trends[0]?.direction === "increasing" ? "rising" : "stable",
    );

    const recoveryScore = Math.max(0, 1 - stress);
    const recoveryMetric = buildMetric(
      recoveryScore,
      recoveryScore > 0.5 ? "Recovery windows available" : "Limited recovery capacity under current load",
      [`recovery_score:${recoveryScore.toFixed(2)}`, `deferred_items:${attn.debt.deferredItems}`],
      stress > 0.6 ? "falling" : "stable",
    );

    const execLoad = attn.executiveAttention.reduce((s, e) => s + e.allocatedWeight, 0);
    const founderLoadScore = Math.min(1, attn.budget.allocated / Math.max(1, attn.budget.totalCapacity));

    return {
      companyId,
      assembledAt: now,
      version: HOMEOSTASIS_ENGINE_VERSION,
      stability: {
        ...stabilityMetric,
        score: stabilityScore,
        status: stress > 0.8 ? "unstable" : stress > 0.5 ? "strained" : "stable",
        assessedAt: now,
      },
      stressIndex: {
        ...stressMetric,
        value: stress,
        contributors: attn.insights.driftWarnings.length ? attn.insights.driftWarnings : ["baseline"],
        trend: stressMetric.trend,
      },
      recoveryCapacity: {
        ...recoveryMetric,
        score: recoveryScore,
        recoveryWindowsAvailable: stress < 0.5 ? 2 : 1,
        estimatedRecoveryDays: stress > 0.7 ? 14 : 7,
      },
      adaptationRate: {
        ...buildMetric(0.5, "Adaptation inferred from domain allocation spread", attn.allocations.map((a) => a.domain), "stable"),
        rate: 0.5,
        domains: attn.allocations.map((a) => a.domain),
        measuredAt: now,
      },
      adaptiveCapacity: {
        ...buildMetric(1 - attn.operationalNoise.noiseScore, "Inverse of operational noise score", [`noise:${attn.operationalNoise.noiseScore.toFixed(2)}`], "stable"),
        score: 1 - attn.operationalNoise.noiseScore,
        domains: attn.allocations.map((a) => a.domain),
      },
      recoveryVelocity: {
        ...buildMetric(recoveryScore * 0.8, "Estimated velocity toward equilibrium", [`stress:${stress.toFixed(2)}`], stress > 0.5 ? "falling" : "stable"),
        score: recoveryScore * 0.8,
        daysToEquilibrium: stress > 0.7 ? 14 : 7,
      },
      burnoutRisk: {
        ...buildMetric(saturation, saturation > 0.85 ? "Sustained attention saturation" : "Within sustainable load", attn.insights.driftWarnings, saturation > 0.6 ? "rising" : "stable"),
        level: saturation > 0.85 ? "high" : saturation > 0.6 ? "moderate" : "low",
        score: saturation,
        indicators: attn.insights.driftWarnings,
      },
      operationalEquilibrium: {
        ...buildMetric(1 - attn.operationalNoise.noiseScore, "Balance between declared focus and operational noise", attn.operationalNoise.sources, "stable"),
        score: 1 - attn.operationalNoise.noiseScore,
        imbalanceDomains: attn.drift?.actualFocus ?? [],
      },
      organizationalBalance: {
        ...buildMetric(stabilityScore, "Overall organizational balance index", evidenceBase, stabilityMetric.trend),
        score: stabilityScore,
        imbalanceDomains: attn.drift?.actualFocus ?? [],
      },
      resilienceIndex: {
        ...buildMetric(stabilityScore * 0.9, "Composite resilience under stress", evidenceBase, "stable"),
        score: stabilityScore * 0.9,
        failureCascadeResistance: Math.max(0, 1 - congestion),
      },
      failureCascadeResistance: {
        ...buildMetric(Math.max(0, 1 - congestion), "Resistance to decision cascade under congestion", [`congestion:${congestion.toFixed(2)}`], congestion > 0.5 ? "falling" : "stable"),
        score: Math.max(0, 1 - congestion),
        vulnerableDomains: attn.drift?.actualFocus ?? [],
      },
      decisionSaturation: {
        ...buildMetric(congestion, "Open decision congestion relative to capacity", [`open_decisions:${attn.decisionCongestion.openDecisions}`], congestion > 0.5 ? "rising" : "stable"),
        score: congestion,
        openDecisions: attn.decisionCongestion.openDecisions,
      },
      attentionSaturation: {
        ...buildMetric(saturation, "Attention budget utilization", [`saturation:${saturation.toFixed(2)}`, `status:${attn.saturation.status}`], attn.trends[0]?.direction === "increasing" ? "rising" : "stable"),
        score: saturation,
        status: attn.saturation.status,
      },
      executiveLoad: {
        ...buildMetric(Math.min(1, execLoad), "Aggregate executive attention allocation", attn.executiveAttention.map((e) => e.executiveId), execLoad > 0.7 ? "rising" : "stable"),
        score: Math.min(1, execLoad),
        executiveCount: attn.executiveAttention.length,
      },
      founderLoad: {
        ...buildMetric(founderLoadScore, "Founder cognitive load from budget allocation", [`allocated:${attn.budget.allocated}`], founderLoadScore > 0.7 ? "rising" : "stable"),
        score: founderLoadScore,
        pendingFounderActions: attn.decisionCongestion.openDecisions,
      },
      operationalRecovery: {
        ...buildMetric(recoveryScore, "Operational recovery potential", [`recovery:${recoveryScore.toFixed(2)}`], "stable"),
        score: recoveryScore,
        estimatedRecoveryDays: stress > 0.7 ? 14 : 7,
      },
      healthMomentum: {
        ...buildMetric(stabilityScore, "Direction of organizational health", evidenceBase, attn.trends[0]?.direction === "increasing" ? "declining" : "stable"),
        score: stabilityScore,
        direction: attn.trends[0]?.direction === "increasing" ? "decelerating" : "stable",
      },
      organizationalLoad: {
        totalLoad: attn.budget.allocated / Math.max(1, attn.budget.totalCapacity),
        executiveLoad: execLoad,
        operationalLoad: attn.meetingLoad.loadRatio,
        councilLoad: attn.communicationLoad.councilSessions,
      },
      organizationalFatigue: {
        ...buildMetric(saturation, "Sustained load duration", attn.debt.domains, attn.debt.oldestDeferredDays > 7 ? "rising" : "stable"),
        score: saturation,
        sustainedDays: attn.debt.oldestDeferredDays,
        domains: attn.debt.domains,
      },
      recoveryWindows: stress < 0.5
        ? [{ id: `rw-${companyId}`, startAt: now, endAt: now, capacityRestored: 0.2 }]
        : [],
      stabilityTrend: { direction: "stable", delta: 0, periodDays: 7 },
      equilibriumIndex: {
        ...buildMetric(1 - stress, "Weighted equilibrium across attention and congestion", evidenceBase, "stable"),
        value: 1 - stress,
        components: { attention: 1 - saturation, congestion: 1 - congestion },
        computedAt: now,
      },
    };
  }
}
