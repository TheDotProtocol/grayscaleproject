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
import { TwinStoreService } from "./twin-store.service";

const SCENARIO_LIBRARY: Array<{ type: SimulationScenarioType; label: string; description: string }> = [
  { type: "growth", label: "Growth", description: "Explore scaling operations and capacity" },
  { type: "market_change", label: "Market Change", description: "Model shifting market conditions" },
  { type: "hiring", label: "Hiring", description: "Simulate team expansion" },
  { type: "layoffs", label: "Layoffs", description: "Simulate workforce reduction" },
  { type: "budget_change", label: "Budget Change", description: "Model budget reallocation" },
  { type: "infrastructure_failure", label: "Infrastructure Failure", description: "Simulate platform outage" },
  { type: "security_incident", label: "Security Incident", description: "Simulate breach response" },
  { type: "vendor_outage", label: "Vendor Outage", description: "Simulate third-party failure" },
  { type: "revenue_decline", label: "Revenue Decline", description: "Model revenue contraction" },
  { type: "rapid_expansion", label: "Rapid Expansion", description: "Simulate accelerated growth" },
  { type: "new_product_launch", label: "New Product Launch", description: "Simulate product launch impact" },
  { type: "regulatory_change", label: "Regulatory Change", description: "Model compliance shift" },
  { type: "executive_loss", label: "Executive Loss", description: "Simulate leadership transition" },
  { type: "unknown_event", label: "Unknown Event", description: "Explore black swan scenarios" },
];

@Injectable()
export class SimulationSessionService implements SimulationEnginePort {
  constructor(
    private readonly store: TwinStoreService,
    private readonly events: EventsService,
  ) {}

  listScenarios() {
    return SCENARIO_LIBRARY;
  }

  async createSession(input: {
    companyId: string;
    twinVersionId: string;
    scenario: { type: SimulationScenarioType; label: string; description: string; assumptions?: unknown[]; constraints?: unknown[] };
    correlationId?: string;
  }): Promise<SimulationSession> {
    const sessionId = this.store.newId("sim");
    const correlationId = input.correlationId ?? crypto.randomUUID();
    const session: SimulationSession = {
      sessionId,
      companyId: input.companyId,
      twinVersionId: input.twinVersionId,
      scenario: {
        scenarioId: this.store.newId("scn"),
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
      realityModified: false,
      correlationId,
      createdAt: new Date().toISOString(),
    };
    this.store.simulations.set(sessionId, session);
    await this.events.publish("simulation.session.created", input.companyId, { sessionId }, { correlationId });
    return session;
  }

  async runSession(sessionId: string): Promise<SimulationSession> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");

    session.status = "running";
    session.lifecycle.currentStage = "running";
    session.lifecycle.stages.push({ stage: "running", completedAt: new Date().toISOString() });

    const baselineId = this.store.newId("out");
    const altId = this.store.newId("out");
    session.branches = [
      { branchId: "baseline", label: "Baseline", probability: 0.6 },
      { branchId: "alternative", label: "Alternative", probability: 0.4 },
    ];
    session.outcomes = [
      { outcomeId: baselineId, label: "Baseline outcome", metrics: { impact: 0.5, cost: 100 }, confidence: 0.7, explanation: "Deterministic baseline from twin state" },
      { outcomeId: altId, label: "Alternative outcome", metrics: { impact: 0.8, cost: 150 }, confidence: 0.55, explanation: "Alternative branch exploration" },
    ];
    session.confidence = { overall: 0.65, evidenceWeight: 0.7, assumptionRisk: 0.3 };
    session.status = "completed";
    session.completedAt = new Date().toISOString();
    session.lifecycle.currentStage = "outcomes_generated";
    session.lifecycle.stages.push({ stage: "outcomes_generated", completedAt: session.completedAt });

    this.store.simulations.set(sessionId, session);
    await this.events.publish("simulation.session.completed", session.companyId, { sessionId }, { correlationId: session.correlationId });
    return session;
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
    return { baselineOutcomeId: baselineId, alternativeOutcomeId: alternativeId, delta, preferred: "inconclusive" };
  }

  async explain(sessionId: string): Promise<SimulationExplanation> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    return {
      sessionId,
      summary: `Simulation of ${session.scenario.label} — reality preserved`,
      assumptions: session.scenario.assumptions,
      constraints: session.scenario.constraints,
      evidence: [],
      alternatives: session.branches.map((b) => b.label),
      unknowns: ["Market response timing", "Resource availability"],
    };
  }

  async rollback(sessionId: string, reason: string): Promise<SimulationRollback> {
    const session = this.store.simulations.get(sessionId);
    if (!session) throw new Error("Simulation session not found");
    session.status = "rolled_back";
    this.store.simulations.set(sessionId, session);
    return { sessionId, rolledBackAt: new Date().toISOString(), reason, realityPreserved: true };
  }

  async getHistory(companyId: string): Promise<SimulationHistoryEntry[]> {
    return [...this.store.simulations.values()]
      .filter((s) => s.companyId === companyId)
      .map((s) => ({
        sessionId: s.sessionId,
        scenarioType: s.scenario.type,
        status: s.status,
        startedAt: s.createdAt,
        completedAt: s.completedAt,
      }));
  }

  async replay(sessionId: string): Promise<SimulationReplay> {
    return { sessionId, events: [{ sequence: 1, type: "simulation.session.created", payload: {} }] };
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
}
