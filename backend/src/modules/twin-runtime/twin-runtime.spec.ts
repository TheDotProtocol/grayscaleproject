import { describe, it, expect, beforeEach } from "vitest";
import { TwinStoreService } from "./twin-store.service";
import { SimulationRunnerService } from "./simulation-runner.service";
import { SimulationSessionService } from "./simulation-session.service";
import { HomeostasisEngineService } from "../context-runtime/homeostasis-engine.service";

describe("TwinRuntime", () => {
  let store: TwinStoreService;
  let simulation: SimulationSessionService;

  beforeEach(() => {
    store = new TwinStoreService();
    const homeostasis = {
      assess: async () => ({
        companyId: "co-1",
        assembledAt: new Date().toISOString(),
        version: "1.1.0",
        stability: { score: 0.7, status: "stable" as const, assessedAt: new Date().toISOString(), value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        stressIndex: { value: 0.3, contributors: [], trend: "stable" as const, reason: "test", confidence: 0.8, evidence: [], history: [] },
        recoveryCapacity: { score: 0.7, recoveryWindowsAvailable: 1, estimatedRecoveryDays: 7, value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        adaptationRate: { rate: 0.5, domains: [], measuredAt: new Date().toISOString(), value: 0.5, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        adaptiveCapacity: { score: 0.6, domains: [], value: 0.6, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        recoveryVelocity: { score: 0.5, daysToEquilibrium: 7, value: 0.5, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        burnoutRisk: { level: "low" as const, score: 0.2, indicators: [], value: 0.2, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        operationalEquilibrium: { score: 0.7, imbalanceDomains: [], value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        organizationalBalance: { score: 0.7, imbalanceDomains: [], value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        resilienceIndex: { score: 0.7, failureCascadeResistance: 0.8, value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        failureCascadeResistance: { score: 0.8, vulnerableDomains: [], value: 0.8, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        decisionSaturation: { score: 0.2, openDecisions: 0, value: 0.2, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        attentionSaturation: { score: 0.3, status: "healthy" as const, value: 0.3, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        executiveLoad: { score: 0.3, executiveCount: 0, value: 0.3, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        founderLoad: { score: 0.3, pendingFounderActions: 0, value: 0.3, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        operationalRecovery: { score: 0.7, estimatedRecoveryDays: 7, value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        healthMomentum: { score: 0.7, direction: "stable" as const, value: 0.7, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        organizationalLoad: { totalLoad: 0.3, executiveLoad: 0.1, operationalLoad: 0.1, councilLoad: 0 },
        organizationalFatigue: { score: 0.2, sustainedDays: 0, domains: [], value: 0.2, reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
        recoveryWindows: [],
        stabilityTrend: { direction: "stable" as const, delta: 0, periodDays: 7 },
        equilibriumIndex: { value: 0.7, components: {}, computedAt: new Date().toISOString(), reason: "test", confidence: 0.8, evidence: [], trend: "stable" as const, history: [] },
      }),
    } as unknown as HomeostasisEngineService;
    const runner = new SimulationRunnerService(store, homeostasis);
    simulation = new SimulationSessionService(store, { publish: async () => ({}) } as never, runner);
  });

  it("creates simulation session without modifying reality", async () => {
    const session = await simulation.createSession({
      companyId: "co-1",
      twinVersionId: "ver-1",
      scenario: { type: "growth", label: "Growth", description: "Test" },
    });
    expect(session.realityModified).toBe(false);
    expect(session.status).toBe("draft");
  });

  it("runs simulation deterministically with twin and homeostasis", async () => {
    const session = await simulation.createSession({
      companyId: "co-1",
      twinVersionId: "ver-1",
      scenario: { type: "hiring", label: "Hiring", description: "Test" },
    });
    const completed = await simulation.runSession(session.sessionId);
    expect(completed.status).toBe("completed");
    expect(completed.outcomes.length).toBe(2);
    expect(completed.realityModified).toBe(false);
    expect(completed.homeostasisBefore).toBeDefined();
    expect(completed.homeostasisAfter).toBeDefined();
    expect(completed.auditTrail.length).toBeGreaterThan(0);
  });

  it("lists scenario library with 15 types", () => {
    expect(simulation.listScenarios().length).toBeGreaterThanOrEqual(15);
  });

  it("replay returns audit trail events", async () => {
    const session = await simulation.createSession({
      companyId: "co-1",
      twinVersionId: "ver-1",
      scenario: { type: "layoffs", label: "Layoffs", description: "Test" },
    });
    await simulation.runSession(session.sessionId);
    const replay = await simulation.replay(session.sessionId);
    expect(replay.events.length).toBeGreaterThan(1);
  });
});
