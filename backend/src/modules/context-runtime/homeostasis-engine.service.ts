import { Injectable } from "@nestjs/common";
import type { OrganizationalHomeostasis } from "@grayscale/platform";
import { HOMEOSTASIS_ENGINE_VERSION } from "@grayscale/platform";
import { AttentionEngineService } from "./attention-engine.service";

/** Organizational Homeostasis — equilibrium contracts (deterministic, no LLM) */
@Injectable()
export class HomeostasisEngineService {
  constructor(private readonly attention: AttentionEngineService) {}

  async assess(companyId: string): Promise<OrganizationalHomeostasis> {
    const attn = await this.attention.assemble(companyId);
    const saturation = attn.saturation.level;
    const stress = Math.min(1, saturation + attn.decisionCongestion.congestionScore * 0.3);

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: HOMEOSTASIS_ENGINE_VERSION,
      stability: {
        score: 1 - stress,
        status: stress > 0.8 ? "unstable" : stress > 0.5 ? "strained" : "stable",
        assessedAt: new Date().toISOString(),
      },
      stressIndex: {
        value: stress,
        contributors: attn.insights.driftWarnings.length ? attn.insights.driftWarnings : ["baseline"],
        trend: attn.trends[0]?.direction === "increasing" ? "rising" : "stable",
      },
      recoveryCapacity: {
        score: Math.max(0, 1 - stress),
        recoveryWindowsAvailable: stress < 0.5 ? 2 : 1,
        estimatedRecoveryDays: stress > 0.7 ? 14 : 7,
      },
      adaptationRate: { rate: 0.5, domains: attn.allocations.map((a) => a.domain), measuredAt: new Date().toISOString() },
      burnoutRisk: {
        level: saturation > 0.85 ? "high" : saturation > 0.6 ? "moderate" : "low",
        score: saturation,
        indicators: attn.insights.driftWarnings,
      },
      operationalEquilibrium: {
        score: 1 - attn.operationalNoise.noiseScore,
        imbalanceDomains: attn.drift?.actualFocus ?? [],
      },
      organizationalLoad: {
        totalLoad: attn.budget.allocated / Math.max(1, attn.budget.totalCapacity),
        executiveLoad: attn.executiveAttention.reduce((s, e) => s + e.allocatedWeight, 0),
        operationalLoad: attn.meetingLoad.loadRatio,
        councilLoad: attn.communicationLoad.councilSessions,
      },
      organizationalFatigue: {
        score: saturation,
        sustainedDays: attn.debt.oldestDeferredDays,
        domains: attn.debt.domains,
      },
      recoveryWindows: [],
      stabilityTrend: { direction: "stable", delta: 0, periodDays: 7 },
      equilibriumIndex: {
        value: 1 - stress,
        components: { attention: 1 - saturation, congestion: 1 - attn.decisionCongestion.congestionScore },
        computedAt: new Date().toISOString(),
      },
    };
  }
}
