import { Injectable } from "@nestjs/common";
import {
  DISCOVERY_STAGES,
  type DiscoveryEnginePort,
  type DiscoverySnapshot,
  type DiscoveryStage,
  type DiscoveryStageResult,
  type CompanyContext,
} from "@grayscale/platform";

@Injectable()
export class DiscoveryEngineService implements DiscoveryEnginePort {
  private readonly snapshots = new Map<string, DiscoverySnapshot>();

  private key(executiveId: string, companyId: string): string {
    return `${companyId}:${executiveId}`;
  }

  async start(executiveId: string, companyId: string): Promise<DiscoverySnapshot> {
    const snapshot: DiscoverySnapshot = {
      executiveId,
      companyId,
      status: "in_progress",
      currentStage: "observe",
      stages: DISCOVERY_STAGES.map((stage) => ({
        stage,
        status: "pending",
        evidenceCount: 0,
      })),
      startedAt: new Date().toISOString(),
      eligibleForRecommendation: false,
      overallConfidence: 0,
    };
    this.snapshots.set(this.key(executiveId, companyId), snapshot);
    return snapshot;
  }

  async completeStage(
    executiveId: string,
    companyId: string,
    stage: DiscoveryStage,
    evidence?: Record<string, unknown>,
  ): Promise<DiscoverySnapshot> {
    let snapshot = await this.getSnapshot(executiveId, companyId);
    if (!snapshot) snapshot = await this.start(executiveId, companyId);

    const evidenceCount = evidence ? Object.keys(evidence).length : 1;
    snapshot = {
      ...snapshot,
      stages: snapshot.stages.map((s) =>
        s.stage === stage
          ? { ...s, status: "completed" as const, completedAt: new Date().toISOString(), evidenceCount }
          : s,
      ),
      currentStage: stage,
    };

    const allComplete = snapshot.stages.every((s) => s.status === "completed");
    if (allComplete) {
      snapshot = {
        ...snapshot,
        status: "completed",
        completedAt: new Date().toISOString(),
        eligibleForRecommendation: true,
        eligibilityReason: "All discovery stages completed with evidence",
        overallConfidence: 0.75,
      };
    }

    this.snapshots.set(this.key(executiveId, companyId), snapshot);
    return snapshot;
  }

  async getSnapshot(executiveId: string, companyId: string): Promise<DiscoverySnapshot | null> {
    return this.snapshots.get(this.key(executiveId, companyId)) ?? null;
  }

  async checkEligibility(executiveId: string, companyId: string) {
    const snapshot = await this.getSnapshot(executiveId, companyId);
    if (!snapshot) return { eligible: false, reason: "Discovery not started" };
    if (!snapshot.eligibleForRecommendation) {
      return { eligible: false, reason: "Discovery pipeline incomplete" };
    }
    return { eligible: true, reason: snapshot.eligibilityReason ?? "Eligible" };
  }

  /** Run full discovery pipeline from CompanyContext — constitutional order */
  async runPipelineFromContext(
    executiveId: string,
    ctx: CompanyContext,
  ): Promise<DiscoverySnapshot> {
    await this.start(executiveId, ctx.companyId);

    const stageEvidence: Record<DiscoveryStage, Record<string, unknown>> = {
      observe: {
        eventCount: ctx.recentEvents.length,
        assembledAt: ctx.assembledAt,
        attentionSaturation: ctx.attention?.saturation.status ?? "unknown",
        attentionDrift: ctx.attention?.drift?.driftScore ?? 0,
        twinVersion: ctx.twin?.present.version.versionId ?? "none",
        twinConfidence: ctx.twin?.confidence.overall ?? 0,
        twinEvidenceCount: ctx.twin?.evidence.length ?? 0,
      },
      identity_engine: { hasIdentity: Boolean(ctx.identity) },
      cognitive_model: { hasCognitiveModel: Boolean(ctx.cognitiveModel) },
      memory_engine: { memoryCount: ctx.memory.length },
      knowledge_graph: { nodeCount: ctx.graph.nodeCount, edgeCount: ctx.graph.edgeCount },
      strategy_engine: { goalCount: ctx.goals.length, riskCount: ctx.risks.length },
      policies: { policyCount: ctx.strategy.policies?.length ?? 0 },
      constraints: { constraintCount: ctx.strategy.constraints?.length ?? 0 },
      dependencies: { objectiveCount: ctx.objectives.length },
      risk_analysis: { criticalRisks: ctx.missionStatus.criticalRisks },
      opportunity_analysis: { opportunities: ctx.opportunities.length },
      confidence_evaluation: { readiness: ctx.missionStatus },
      recommendation_eligibility: { eligible: true },
    };

    for (const stage of DISCOVERY_STAGES) {
      await this.completeStage(executiveId, ctx.companyId, stage, stageEvidence[stage]);
    }

    return (await this.getSnapshot(executiveId, ctx.companyId))!;
  }
}
