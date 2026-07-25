import { Test, TestingModule } from "@nestjs/testing";
import { ExecutiveSkepticService } from "./executive-skeptic.service";

describe("ExecutiveSkepticService", () => {
  let service: ExecutiveSkepticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExecutiveSkepticService],
    }).compile();
    service = module.get(ExecutiveSkepticService);
  });

  it("blocks when no evidence", async () => {
    const result = await service.runPass({
      companyId: "c1",
      executiveId: "athena",
      recommendationTitle: "Test",
      recommendationSummary: "Summary",
      assumptions: ["A1"],
      evidenceIds: [],
      confidence: 0.8,
    });
    expect(result.passed).toBe(false);
    expect(result.whatCouldMakeThisWrong.length).toBeGreaterThan(0);
  });

  it("passes with evidence", async () => {
    const result = await service.runPass({
      companyId: "c1",
      executiveId: "athena",
      recommendationTitle: "Test",
      recommendationSummary: "Summary",
      assumptions: ["A1"],
      evidenceIds: ["mem-1"],
      confidence: 0.7,
    });
    expect(result.passed).toBe(true);
  });
});
