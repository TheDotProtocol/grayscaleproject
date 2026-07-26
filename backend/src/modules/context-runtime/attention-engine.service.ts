import { Injectable } from "@nestjs/common";
import type {
  AttentionHealth,
  AttentionSnapshot,
  OrganizationalAttention,
  OrganizationalAttentionEnginePort,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";
import { StrategyEngineService } from "../intelligence/strategy-engine.service";
import { PulseEngineService } from "../pulse/pulse-engine.service";
import { IntentEngineService } from "./intent-engine.service";

@Injectable()
export class AttentionEngineService implements OrganizationalAttentionEnginePort {
  constructor(
    private readonly strategy: StrategyEngineService,
    private readonly pulse: PulseEngineService,
    private readonly intent: IntentEngineService,
    private readonly events: EventsService,
  ) {}

  async assemble(companyId: string): Promise<OrganizationalAttention> {
    const [strategyCtx, pulseHealth, intentCtx] = await Promise.all([
      this.strategy.buildContext(companyId),
      this.pulse.getHealth(companyId),
      this.intent.getContext(companyId),
    ]);

    const openRecs = strategyCtx.openRecommendations.length;
    const blocked = strategyCtx.objectives.filter((o) => o.status === "blocked").length;
    const criticalRisks = strategyCtx.topRisks.filter((r) => r.severity === "critical").length;
    const activeGoals = strategyCtx.goals.filter((g) => g.status === "active").length;

    const allocated = openRecs * 2 + blocked * 3 + criticalRisks * 5 + activeGoals;
    const totalCapacity = 100;
    const remaining = Math.max(0, totalCapacity - allocated);
    const saturationLevel = Math.min(1, allocated / totalCapacity);
    const correlationId = crypto.randomUUID();

    const attention: OrganizationalAttention = {
      companyId,
      assembledAt: new Date().toISOString(),
      version: "1.0.0",
      allocations: [
        { domain: "strategy", weight: activeGoals * 5, executiveId: "athena" },
        { domain: "operations", weight: blocked * 3 },
        { domain: "risk", weight: criticalRisks * 5, executiveId: "sentinel" },
      ],
      priorities: strategyCtx.goals.slice(0, 5).map((g, i) => ({
        id: g.id,
        label: g.title,
        weight: 1 - i * 0.1,
        source: "goal" as const,
      })),
      budget: { totalCapacity, allocated, remaining, unit: "cognitive_slots" },
      saturation: {
        level: saturationLevel,
        status: saturationLevel > 0.85 ? "overload" : saturationLevel > 0.65 ? "critical" : saturationLevel > 0.4 ? "elevated" : "healthy",
      },
      debt: { deferredItems: blocked, oldestDeferredDays: blocked > 0 ? 7 : 0, domains: blocked > 0 ? ["operations"] : [] },
      drift: openRecs > activeGoals * 2 ? {
        declaredFocus: strategyCtx.goals.slice(0, 3).map((g) => g.title),
        actualFocus: ["recommendations", "operations"],
        driftScore: 0.4,
        detectedAt: new Date().toISOString(),
      } : undefined,
      executiveAttention: [{ executiveId: "athena", allocatedWeight: 0.4, openIssues: openRecs, meetingLoad: 0 }],
      strategicFocus: {
        themes: strategyCtx.goals.slice(0, 3).map((g) => g.title),
        coveragePercent: intentCtx?.coverage.coveragePercent ?? 0,
      },
      operationalNoise: { noiseScore: pulseHealth.counts.last24h > 50 ? 0.6 : 0.2, sources: ["pulse"] },
      decisionCongestion: {
        openDecisions: strategyCtx.pendingDecisions.length,
        pendingCouncilIssues: 0,
        congestionScore: strategyCtx.pendingDecisions.length * 0.1,
      },
      contextSwitching: { switchesLast24h: pulseHealth.counts.last24h, averageFocusDurationMinutes: 45 },
      meetingLoad: { hoursScheduled: 0, hoursRemaining: 8, loadRatio: 0 },
      communicationLoad: { pendingMessages: 0, councilSessions: 0, loadRatio: 0 },
      trends: [{ direction: "stable", domain: "strategy", delta: 0 }],
      insights: {
        summary: saturationLevel > 0.65 ? "Attention saturation elevated" : "Attention within healthy bounds",
        recommendations: saturationLevel > 0.65 ? ["Defer non-critical initiatives"] : [],
        driftWarnings: openRecs > activeGoals * 2 ? ["Recommendation volume exceeds goal focus"] : [],
      },
    };

    await this.events.publish(
      "attention.snapshot.captured",
      companyId,
      { saturation: attention.saturation.status },
      { correlationId, source: "attention-engine" },
    );

    return attention;
  }

  async getSnapshot(companyId: string): Promise<AttentionSnapshot> {
    const attention = await this.assemble(companyId);
    return { companyId, capturedAt: attention.assembledAt, attention, correlationId: crypto.randomUUID() };
  }

  async getHealth(companyId: string): Promise<AttentionHealth> {
    const attention = await this.assemble(companyId);
    const score = Math.max(0, 100 - attention.saturation.level * 100);
    return {
      companyId,
      score: Math.round(score),
      saturation: attention.saturation,
      driftDetected: (attention.drift?.driftScore ?? 0) > 0.3,
      assessedAt: new Date().toISOString(),
    };
  }
}
