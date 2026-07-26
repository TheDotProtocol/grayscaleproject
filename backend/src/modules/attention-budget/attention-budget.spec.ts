import { describe, it, expect, beforeEach } from "vitest";
import { AttentionBudgetStoreService } from "./attention-budget-store.service";
import { AttentionCapacityService } from "./attention-capacity.service";
import { AttentionDebtService } from "./attention-debt.service";
import { AttentionRecoveryService } from "./attention-recovery.service";
import { AttentionBudgetCertificationService } from "./attention-budget-certification.service";
import { AutonomyGovernanceService } from "./autonomy-governance.service";
import { AttentionAllocatorService } from "./attention-allocator.service";

const mockAttention = {
  assemble: async () => ({
    budget: { totalCapacity: 100, allocated: 40, remaining: 60, unit: "cognitive_slots" as const },
    saturation: { level: 0.4, status: "healthy" as const },
    debt: { deferredItems: 2, oldestDeferredDays: 3, domains: ["operations"] },
    allocations: [{ domain: "strategy", weight: 20, executiveId: "athena" }],
    executiveAttention: [{ executiveId: "athena", allocatedWeight: 0.3, openIssues: 1, meetingLoad: 0 }],
    strategicFocus: { themes: ["growth"], coveragePercent: 60 },
    operationalNoise: { noiseScore: 0.2, sources: ["pulse"] },
    contextSwitching: { switchesLast24h: 5, averageFocusDurationMinutes: 45 },
    communicationLoad: { pendingMessages: 0, councilSessions: 0, loadRatio: 0.1 },
    trends: [{ direction: "stable" as const, domain: "strategy", delta: 0 }],
  }),
};

describe("AttentionBudget", () => {
  let certification: AttentionBudgetCertificationService;
  let autonomy: AutonomyGovernanceService;

  beforeEach(() => {
    const store = new AttentionBudgetStoreService();
    const capacity = new AttentionCapacityService(mockAttention as never);
    const debt = new AttentionDebtService(mockAttention as never);
    const recovery = new AttentionRecoveryService(capacity, debt);
    const allocator = new AttentionAllocatorService(mockAttention as never, store, { publish: async () => ({}) } as never);
    certification = new AttentionBudgetCertificationService(
      mockAttention as never,
      allocator,
      capacity,
      debt,
      recovery,
      store,
    );
    autonomy = new AutonomyGovernanceService({ get: () => "false" } as never);
  });

  it("returns finite attention budget snapshot", async () => {
    const snap = await certification.getSnapshot("co-1");
    expect(snap.totalCapacity).toBe(100);
    expect(snap.remaining).toBe(60);
  });

  it("certifies attention budget gates", async () => {
    const report = await certification.certify("co-1");
    expect(report.checks.length).toBe(15);
    expect(report.score).toBeGreaterThanOrEqual(90);
  });

  it("keeps autonomous execution disabled", async () => {
    const report = await autonomy.validate("co-1");
    expect(report.autonomousExecutionEnabled).toBe(false);
    expect(report.checks.find((c) => c.gate === "autonomy_disabled")?.passed).toBe(true);
  });
});
