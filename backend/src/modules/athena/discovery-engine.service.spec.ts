import { Test, TestingModule } from "@nestjs/testing";
import { DiscoveryEngineService } from "./discovery-engine.service";
import { DISCOVERY_STAGES } from "@grayscale/platform";

describe("DiscoveryEngineService", () => {
  it("completes all 13 stages from context", async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscoveryEngineService],
    }).compile();
    const discovery = module.get(DiscoveryEngineService);

    const ctx = {
      companyId: "c1",
      assembledAt: new Date().toISOString(),
      correlationId: "corr-1",
      recentEvents: [],
      memory: [{ id: "m1" }],
      graph: { nodeCount: 1, edgeCount: 0, hubNodes: [] },
      goals: [],
      objectives: [],
      risks: [],
      opportunities: [],
      missionStatus: {
        activeGoals: 0,
        openRecommendations: 0,
        pendingDecisions: 0,
        blockedObjectives: 0,
        criticalRisks: 0,
      },
      strategy: { policies: [], constraints: [] },
    } as never;

    const snapshot = await discovery.runPipelineFromContext("athena", ctx);
    expect(snapshot.stages).toHaveLength(DISCOVERY_STAGES.length);
    expect(snapshot.eligibleForRecommendation).toBe(true);
  });
});
