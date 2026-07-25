import { IntelligenceEngineRegistryService } from "./engine-registry.service";
import type { IntelligenceEngine } from "@grayscale/platform";

function mockEngine(id: string): IntelligenceEngine {
  return {
    id,
    name: `Engine ${id}`,
    version: 1,
    contribute: async (companyId) => ({
      engineId: id,
      data: { companyId },
      computedAt: new Date().toISOString(),
    }),
  };
}

describe("IntelligenceEngineRegistryService", () => {
  let registry: IntelligenceEngineRegistryService;

  beforeEach(() => {
    registry = new IntelligenceEngineRegistryService();
  });

  it("registers and lists engines dynamically (AIP-10)", () => {
    registry.register(mockEngine("compliance"));
    registry.register(mockEngine("goals"));

    const engines = registry.list();
    expect(engines).toHaveLength(2);
    expect(engines.map((e) => e.id)).toEqual(["compliance", "goals"]);
  });

  it("retrieves engine by id", () => {
    registry.register(mockEngine("sales_forecasting"));
    expect(registry.get("sales_forecasting")?.id).toBe("sales_forecasting");
    expect(registry.get("missing")).toBeUndefined();
  });

  it("unregisters engines", () => {
    registry.register(mockEngine("hiring"));
    registry.unregister("hiring");
    expect(registry.list()).toHaveLength(0);
  });
});
