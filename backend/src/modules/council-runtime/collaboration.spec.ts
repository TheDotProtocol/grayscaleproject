import { describe, it, expect, beforeEach } from "vitest";
import { CouncilStoreService } from "./council-store.service";
import { CouncilDeliberationEngineService } from "./council-deliberation-engine.service";
import { CouncilMemoryService } from "./council-memory.service";
import { CouncilSchedulerService } from "./council-scheduler.service";
import { ExecutiveCollaborationNetworkService } from "./executive-collaboration-network.service";
import { CouncilSessionService } from "./council-session.service";
import { RuntimeStoreService } from "../runtime/runtime-store.service";
import { RuntimeSchedulerService } from "../runtime/runtime-scheduler.service";
import { DELIBERATION_STAGES } from "@grayscale/platform";

describe("ExecutiveCollaboration", () => {
  let deliberation: CouncilDeliberationEngineService;
  let scheduler: CouncilSchedulerService;
  let network: ExecutiveCollaborationNetworkService;

  beforeEach(() => {
    const store = new CouncilStoreService();
    const memory = new CouncilMemoryService(store, { publish: async () => ({}) } as never);
    deliberation = new CouncilDeliberationEngineService(store, memory, { publish: async () => ({}) } as never);
    const runtimeStore = new RuntimeStoreService();
    const runtimeScheduler = new RuntimeSchedulerService(runtimeStore);
    const sessions = new CouncilSessionService(store, { classify: () => ({}) } as never, { publish: async () => ({}) } as never);
    scheduler = new CouncilSchedulerService(store, sessions, runtimeScheduler, { publish: async () => ({}) } as never);
    network = new ExecutiveCollaborationNetworkService(store, { publish: async () => ({}) } as never);
  });

  it("supports all council schedule modes via runtime", () => {
    expect(scheduler.supportedModes()).toHaveLength(7);
    expect(scheduler.supportedModes()).toContain("founder_requested");
  });

  it("advances deliberation through all 12 stages", async () => {
    const proposal = await deliberation.startProposal({
      companyId: "co-1",
      sessionId: "sess-1",
      issueId: "issue-1",
      initiatingExecutiveId: "athena",
      correlationId: "corr-1",
    });
    let current = proposal;
    for (let i = 0; i < DELIBERATION_STAGES.length - 1; i++) {
      current = await deliberation.advanceStage(current.proposalId);
    }
    expect(current.completedStages.length).toBeGreaterThanOrEqual(DELIBERATION_STAGES.length - 1);
  });

  it("routes collaboration requests through network", async () => {
    const req = await network.sendRequest({
      companyId: "co-1",
      kind: "challenge_request",
      fromExecutiveId: "athena",
      toExecutiveId: "sentinel",
      payload: { topic: "risk" },
      correlationId: "corr-2",
    });
    expect(req.requestId).toBeDefined();
    expect(req.status).toBe("pending");
  });
});
