import { OperatingModeService } from "./operating-mode.service";

describe("OperatingModeService", () => {
  const service = new OperatingModeService({} as never);

  it("adjusts weights for cash conservation mode", () => {
    const adj = service.modeWeightAdjustments("cash_conservation");
    expect(adj.revenueImpact).toBeGreaterThan(1);
    expect(adj.engineeringCost).toBeGreaterThan(1);
  });

  it("returns empty adjustments for startup mode", () => {
    expect(service.modeWeightAdjustments("startup")).toEqual({});
  });
});
