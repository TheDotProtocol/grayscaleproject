import { describe, it, expect, beforeEach, vi } from "vitest";
import { ExecutiveComplianceService } from "./executive-compliance.service";

describe("ExecutiveComplianceService", () => {
  let service: ExecutiveComplianceService;

  const mockCtx = {
    companyId: "co-1",
    correlationId: "corr-1",
    assembledAt: new Date().toISOString(),
    contextRuntime: { contextVersion: "1" },
    founderConstitution: { version: "1.0.0", founderFinalAuthority: true },
    memory: [{ id: "m1" }],
    graph: { nodeCount: 1, edgeCount: 0, hubNodes: [] },
    strategy: { policies: [], constraints: [] },
    goals: [],
    organizationalIntelligence: undefined,
    intent: undefined,
  };

  beforeEach(() => {
    service = new ExecutiveComplianceService(
      { assemble: vi.fn().mockResolvedValue(mockCtx) } as never,
      {
        getSnapshot: vi.fn().mockResolvedValue(null),
        checkEligibility: vi.fn().mockResolvedValue({ eligible: false, reason: "not started" }),
      } as never,
      { search: vi.fn().mockResolvedValue([]) } as never,
      { listOpenQuestions: vi.fn().mockResolvedValue([]) } as never,
      {
        runPass: vi.fn().mockResolvedValue({
          passed: true,
          whatCouldMakeThisWrong: "test",
          challenges: [],
          adjustedConfidence: 0.5,
          completedAt: new Date().toISOString(),
        }),
      } as never,
      { get: vi.fn().mockReturnValue("false") } as never,
    );
  });

  it("returns certification report for athena", async () => {
    const report = await service.runCertification("co-1", "athena");
    expect(report.executiveId).toBe("athena");
    expect(report.executivesEnabled).toBe(false);
    expect(report.checks.length).toBeGreaterThan(10);
  });

  it("fails for non-athena executive id on critical check", async () => {
    const report = await service.runCertification("co-1", "atlas");
    const idCheck = report.checks.find((c) => c.checkId === "identity.executive_id");
    expect(idCheck?.passed).toBe(false);
  });
});
