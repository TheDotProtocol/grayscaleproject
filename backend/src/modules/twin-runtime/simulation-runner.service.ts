import { Injectable } from "@nestjs/common";
import type {
  OrganizationalTwin,
  SimulationAuditEntry,
  SimulationLifecycleStage,
  SimulationOutcome,
  SimulationSession,
} from "@grayscale/platform";
import {
  SIMULATION_ENGINE_VERSION,
  SIMULATION_PIPELINE_STAGES,
  SIMULATION_PIPELINE_VERSION,
} from "@grayscale/platform";
import { HomeostasisEngineService } from "../context-runtime/homeostasis-engine.service";
import { TwinStoreService } from "./twin-store.service";

function deterministicUnit(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function deterministicId(prefix: string, seed: string): string {
  return `${prefix}-${seed.slice(0, 12).replace(/[^a-z0-9]/gi, "")}-${Math.floor(deterministicUnit(seed) * 1e6)}`;
}

const SCENARIO_STRESS_MULTIPLIER: Record<string, number> = {
  growth: 0.15,
  hiring: 0.2,
  layoffs: 0.35,
  revenue_decline: 0.4,
  security_incident: 0.45,
  infrastructure_failure: 0.4,
  vendor_outage: 0.25,
  executive_loss: 0.35,
  unknown_event: 0.5,
  regulatory_change: 0.3,
  rapid_expansion: 0.25,
  new_product_launch: 0.2,
  market_change: 0.2,
  budget_change: 0.15,
  custom: 0.2,
};

/** Deterministic simulation pipeline — organization is the subject, not executives */
@Injectable()
export class SimulationRunnerService {
  constructor(
    private readonly store: TwinStoreService,
    private readonly homeostasis: HomeostasisEngineService,
  ) {}

  async runPipeline(sessionId: string): Promise<SimulationSession> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");

    session.status = "running";
    session.auditTrail = session.auditTrail ?? [];
    session.engineVersion = SIMULATION_ENGINE_VERSION;
    session.pipelineVersion = SIMULATION_PIPELINE_VERSION;

    const twin = await this.resolveTwin(session.companyId, session.twinVersionId);
    const homeostasisBefore = await this.homeostasis.assess(session.companyId);
    session.homeostasisBefore = {
      stress: homeostasisBefore.stressIndex.value,
      stability: homeostasisBefore.stability.score,
      equilibrium: homeostasisBefore.equilibriumIndex.value,
    };

    const seed = `${session.companyId}:${session.twinVersionId}:${session.scenario.type}:${session.sessionId}`;
    const stages: SimulationLifecycleStage[] = ["created", ...SIMULATION_PIPELINE_STAGES];

    for (const stage of stages) {
      session.lifecycle.currentStage = stage;
      session.lifecycle.stages.push({ stage, completedAt: new Date().toISOString() });
      session.auditTrail.push(this.audit(session, stage, { twinVersionId: session.twinVersionId }));
    }

    const multiplier = SCENARIO_STRESS_MULTIPLIER[session.scenario.type] ?? 0.2;
    const twinConfidence = twin.confidence.overall;
    const baseImpact = deterministicUnit(seed);
    const stressDelta = Math.min(0.5, multiplier * (1 - twinConfidence * 0.3));

    const homeostasisAfter = {
      stress: Math.min(1, homeostasisBefore.stressIndex.value + stressDelta),
      stability: Math.max(0, homeostasisBefore.stability.score - stressDelta),
      equilibrium: Math.max(0, homeostasisBefore.equilibriumIndex.value - stressDelta * 0.8),
    };
    session.homeostasisAfter = homeostasisAfter;

    const baselineId = deterministicId("out", `${seed}:baseline`);
    const altId = deterministicId("out", `${seed}:alternative`);

    session.branches = [
      { branchId: "baseline", label: "Baseline (status quo)", probability: 0.55 + baseImpact * 0.1 },
      { branchId: "alternative", label: "Alternative (scenario applied)", probability: 0.45 - baseImpact * 0.1 },
    ];

    const baselineMetrics = {
      organizational_stress: homeostasisBefore.stressIndex.value,
      stability: homeostasisBefore.stability.score,
      capacity: twin.strategyView ? 1 - twin.strategyView.criticalRisks * 0.05 : 0.7,
      resilience: homeostasisBefore.resilienceIndex.score,
    };

    const altMetrics = {
      organizational_stress: homeostasisAfter.stress,
      stability: homeostasisAfter.stability,
      capacity: Math.max(0, baselineMetrics.capacity - stressDelta * 0.5),
      resilience: Math.max(0, homeostasisBefore.resilienceIndex.score - stressDelta * 0.3),
    };

    session.outcomes = [
      this.outcome(baselineId, "Baseline organizational trajectory", baselineMetrics, twinConfidence, seed, "baseline"),
      this.outcome(altId, `${session.scenario.label} scenario outcome`, altMetrics, twinConfidence * 0.9, seed, "alternative"),
    ];

    session.confidence = {
      overall: Math.round(twinConfidence * 85) / 100,
      evidenceWeight: Math.min(1, (twin.evidence?.length ?? 0) / 10),
      assumptionRisk: multiplier,
    };

    session.riskAssessment = {
      level: stressDelta > 0.35 ? "high" : stressDelta > 0.2 ? "moderate" : "low",
      score: stressDelta,
      factors: [
        `scenario:${session.scenario.type}`,
        `stress_delta:${stressDelta.toFixed(2)}`,
        `twin_confidence:${twinConfidence.toFixed(2)}`,
      ],
    };

    session.opportunityAssessment = {
      level: altMetrics.resilience > baselineMetrics.resilience ? "high" : "moderate",
      score: Math.max(0, altMetrics.resilience - baselineMetrics.resilience + baseImpact * 0.2),
      factors: [`resilience_delta:${(altMetrics.resilience - baselineMetrics.resilience).toFixed(2)}`],
    };

    session.scenario.assumptions = [
      {
        id: deterministicId("asm", seed),
        label: "Twin state at simulation start",
        value: { twinVersionId: session.twinVersionId, confidence: twinConfidence },
        source: "twin",
      },
      {
        id: deterministicId("asm", `${seed}:h`),
        label: "Homeostasis baseline",
        value: session.homeostasisBefore,
        source: "homeostasis",
      },
    ];

    session.scenario.constraints = [
      { id: deterministicId("cst", seed), label: "Reality preservation", enforced: true, source: "founder-constitution" },
      { id: deterministicId("cst", `${seed}:t`), label: "Twin synchronization", enforced: true, source: "twin-runtime" },
    ];

    session.explanation = {
      sessionId,
      summary: `Organizational simulation of ${session.scenario.label} — organization as subject, reality preserved`,
      assumptions: session.scenario.assumptions,
      constraints: session.scenario.constraints,
      evidence: (twin.evidence ?? []).slice(0, 5).map((e) => ({
        evidenceId: e.evidenceId,
        sourceType: e.sourceType,
        summary: e.summary,
        weight: 0.8,
      })),
      alternatives: session.branches.map((b) => b.label),
      unknowns: ["External market response timing", "Unmodeled regulatory shifts"],
    };

    session.status = "completed";
    session.completedAt = new Date().toISOString();
    session.lifecycle.currentStage = "certified";

    this.store.simulations.set(sessionId, session);
    return session;
  }

  private async resolveTwin(companyId: string, twinVersionId: string): Promise<OrganizationalTwin> {
    const cached = this.store.twins.get(companyId);
    if (cached) return cached;

    return {
      companyId,
      version: twinVersionId,
      assembledAt: new Date().toISOString(),
      correlationId: twinVersionId,
      present: {
        version: { versionId: twinVersionId, companyId, sequence: 1, capturedAt: new Date().toISOString(), scope: "present", correlationId: twinVersionId },
        identity: { companyId, name: companyId, stage: "unknown", persistedSince: new Date().toISOString() },
        scope: "present",
        assembledAt: new Date().toISOString(),
        confidence: 0.6,
        evidenceCount: 0,
      },
      identity: { companyId, name: companyId, stage: "unknown", persistedSince: new Date().toISOString() },
      confidence: { overall: 0.6, evidence: 0.5, temporal: 0.5 },
      evidence: [],
      memoryView: { recordCount: 0, recentThemes: [] },
      graphView: { nodeCount: 0, edgeCount: 0, density: 0 },
      strategyView: { activeGoals: 0, openRecommendations: 0, criticalRisks: 0 },
      signalView: { signalCount: 0, categories: {} },
      insightView: { insightCount: 0, topInsights: [] },
      organizationView: { stage: "unknown", operatingMode: "unknown", missionStatus: {} },
    };
  }

  private outcome(
    id: string,
    label: string,
    metrics: Record<string, number>,
    confidence: number,
    seed: string,
    branch: string,
  ): SimulationOutcome {
    return {
      outcomeId: id,
      label,
      metrics,
      confidence: Math.round(confidence * 100) / 100,
      explanation: `Deterministic ${branch} outcome derived from twin state and homeostasis (seed: ${seed.slice(0, 16)})`,
    };
  }

  private audit(session: SimulationSession, action: string, details: Record<string, unknown>): SimulationAuditEntry {
    return {
      entryId: deterministicId("aud", `${session.sessionId}:${action}`),
      action,
      actorId: "simulation-runner",
      recordedAt: new Date().toISOString(),
      details,
    };
  }
}
