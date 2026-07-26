import { describe, it, expect } from "vitest";
import { TWIN_ECS_GATES, computeTwinCertScore, isTwinCertified } from "./twin-certification.js";
import { TWIN_ENGINE_VERSION } from "./twin-model.js";

describe("twin certification", () => {
  it("defines 11 certification gates", () => {
    expect(TWIN_ECS_GATES).toHaveLength(11);
  });

  it("computes certification score", () => {
    const checks = TWIN_ECS_GATES.map((gate) => ({
      gate,
      checkId: gate,
      name: gate,
      passed: true,
      evidence: "ok",
    }));
    expect(computeTwinCertScore(checks)).toBe(100);
    expect(isTwinCertified({ companyId: "c1", generatedAt: "", passed: true, score: 100, checks })).toBe(true);
  });

  it("exports twin engine version", () => {
    expect(TWIN_ENGINE_VERSION).toBe("1.0.0");
  });
});
