import { Injectable } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import type {
  SimulationComparison,
  SimulationEnginePort,
  SimulationExplanation,
  SimulationHistoryEntry,
  SimulationMetrics,
  SimulationReplay,
  SimulationRollback,
  SimulationSession,
  SimulationScenarioType,
} from "@grayscale/platform";
import {
  SIMULATION_ENGINE_VERSION,
  SIMULATION_PIPELINE_VERSION,
  SIMULATION_SCENARIO_LIBRARY,
} from "@grayscale/platform";
import { TwinStoreService } from "./twin-store.service";
import { SimulationRunnerService } from "./simulation-runner.service";

function deterministicId(prefix: string, seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${prefix}-${seed.slice(0, 12).replace(/[^a-z0-9]/gi, "")}-${(h >>> 0) % 1e6}`;
}

@Injectable()
export class SimulationSessionService implements SimulationEnginePort {
  constructor(
    private readonly store: TwinStoreService,
    private readonly events: EventsService,
    private readonly runner: SimulationRunnerService,
  ) {}

  listScenarios() {
    return SIMULATION_SCENARIO_LIBRARY.map(({ type, label, description }) => ({ type, label, description }));
  }

  async createSession(input: {
    companyId: string;
    twinVersionId: string;
    scenario: { type: SimulationScenarioType; label: string; description: string; assumptions?: unknown[]; constraints?: unknown[] };
    correlationId?: string;
  }): Promise<SimulationSession> {
    const seed = `${input.companyId}:${input.twinVersionId}:${input.scenario.type}`;
    const sessionId = deterministicId("sim", seed + Date.now());
    const correlationId = input.correlationId ?? crypto.randomUUID();
    const session: SimulationSession = {
      sessionId,
      companyId: input.companyId,
      twinVersionId: input.twinVersionId,
      scenario: {
        scenarioId: deterministicId("scn", seed),
        type: input.scenario.type,
        label: input.scenario.label,
        description: input.scenario.description,
        assumptions: [],
        constraints: [],
      },
      status: "draft",
      branches: [],
      outcomes: [],
      confidence: { overall: 0, evidenceWeight: 0, assumptionRisk: 0 },
      lifecycle: {
        sessionId,
        currentStage: "created",
        stages: [{ stage: "created", completedAt: new Date().toISOString() }],
      },
      auditTrail: [],
      realityModified: false,
      correlationId,
      engineVersion: SIMULATION_ENGINE_VERSION,
      pipelineVersion: SIMULATION_PIPELINE_VERSION,
      createdAt: new Date().toISOString(),
    };
    this.store.simulations.set(sessionId, session);
    await this.events.publish("simulation.session.created", input.companyId, { sessionId }, { correlationId });
    return session;
  }

  async runSession(sessionId: string): Promise<SimulationSession> {
    const completed = await this.runner.runPipeline(sessionId);
    await this.events.publish(
      "simulation.session.completed",
      completed.companyId,
      { sessionId, scenarioType: completed.scenario.type },
      { correlationId: completed.correlationId },
    );
    return completed;
  }

  async compareOutcomes(sessionId: string, baselineId: string, alternativeId: string): Promise<SimulationComparison> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    const baseline = session.outcomes.find((o) => o.outcomeId === baselineId);
    const alternative = session.outcomes.find((o) => o.outcomeId === alternativeId);
    const delta: Record<string, number> = {};
    if (baseline && alternative) {
      for (const key of Object.keys(baseline.metrics)) {
        delta[key] = (alternative.metrics[key] ?? 0) - (baseline.metrics[key] ?? 0);
      }
    }
    const preferred =
      alternative && baseline && alternative.metrics.organizational_stress < baseline.metrics.organizational_stress
        ? "alternative"
        : "baseline";
    return { baselineOutcomeId: baselineId, alternativeOutcomeId: alternativeId, delta, preferred };
  }

  async explain(sessionId: string): Promise<SimulationExplanation> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    if (session.explanation) return session.explanation;
    return {
      sessionId,
      summary: `Simulation of ${session.scenario.label} — organization as subject, reality preserved`,
      assumptions: session.scenario.assumptions,
      constraints: session.scenario.constraints,
      evidence: [],
      alternatives: session.branches.map((b) => b.label),
      unknowns: ["Market response timing"],
    };
  }

  async rollback(sessionId: string, reason: string): Promise<SimulationRollback> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    session.status = "rolled_back";
    session.auditTrail.push({
      entryId: deterministicId("aud", `${sessionId}:rollback`),
      action: "rolled_back",
      actorId: "simulation-runtime",
      recordedAt: new Date().toISOString(),
      details: { reason },
    });
    this.store.simulations.set(sessionId, session);
    await this.events.publish("simulation.session.rolled_back", session.companyId, { sessionId, reason }, { correlationId: session.correlationId });
    return { sessionId, rolledBackAt: new Date().toISOString(), reason, realityPreserved: true };
  }

  async getHistory(companyId: string): Promise<SimulationHistoryEntry[]> {
    return [...this.store.simulations.values()]
      .filter((s) => s.companyId === companyId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((s) => ({
        sessionId: s.sessionId,
        scenarioType: s.scenario.type,
        status: s.status,
        startedAt: s.createdAt,
        completedAt: s.completedAt,
      }));
  }

  async replay(sessionId: string): Promise<SimulationReplay> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    const events = session.auditTrail.map((entry, i) => ({
      sequence: i + 1,
      type: entry.action,
      payload: entry.details as Record<string, unknown>,
    }));
    if (events.length === 0) {
      events.push({ sequence: 1, type: "simulation.session.created", payload: { sessionId } });
    }
    return { sessionId, events };
  }

  async getMetrics(sessionId: string): Promise<SimulationMetrics> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    return {
      sessionId,
      durationMs: session.completedAt ? new Date(session.completedAt).getTime() - new Date(session.createdAt).getTime() : 0,
      branchCount: session.branches.length,
      outcomeCount: session.outcomes.length,
      realityModified: false,
    };
  }

  async getAggregateMetrics(companyId: string) {
    const sessions = [...this.store.simulations.values()].filter((s) => s.companyId === companyId);
    const completed = sessions.filter((s) => s.status === "completed");
    const totalDuration = completed.reduce((sum, s) => {
      if (!s.completedAt) return sum;
      return sum + (new Date(s.completedAt).getTime() - new Date(s.createdAt).getTime());
    }, 0);
    return {
      totalSessions: sessions.length,
      completedSessions: completed.length,
      averageDurationMs: completed.length ? Math.round(totalDuration / completed.length) : 0,
    };
  }
}
