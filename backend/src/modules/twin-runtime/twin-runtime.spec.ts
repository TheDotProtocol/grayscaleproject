import { describe, it, expect, beforeEach } from "vitest";
import { TwinStoreService } from "./twin-store.service";
import { SimulationSessionService } from "./simulation-session.service";

describe("TwinRuntime", () => {
  let store: TwinStoreService;
  let simulation: SimulationSessionService;

  beforeEach(() => {
    store = new TwinStoreService();
    simulation = new SimulationSessionService(store, { publish: async () => ({}) } as never);
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

  it("runs simulation deterministically", async () => {
    const session = await simulation.createSession({
      companyId: "co-1",
      twinVersionId: "ver-1",
      scenario: { type: "hiring", label: "Hiring", description: "Test" },
    });
    const completed = await simulation.runSession(session.sessionId);
    expect(completed.status).toBe("completed");
    expect(completed.outcomes.length).toBeGreaterThan(0);
    expect(completed.realityModified).toBe(false);
  });

  it("lists scenario library with 14 types", () => {
    expect(simulation.listScenarios().length).toBeGreaterThanOrEqual(14);
  });
});
