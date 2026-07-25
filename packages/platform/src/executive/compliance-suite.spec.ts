import { describe, it, expect } from "vitest";
import {
  ECS_CATEGORIES,
  computeEcsScore,
  isEcsCertified,
  type EcsCheckResult,
} from "./compliance-suite.js";

describe("Executive Compliance Suite", () => {
  it("defines 21 certification categories", () => {
    expect(ECS_CATEGORIES.length).toBe(21);
  });

  it("computes score from checks", () => {
    const checks: EcsCheckResult[] = [
      { category: "identity", checkId: "a", name: "A", passed: true, severity: "critical", evidence: "ok" },
      { category: "trust", checkId: "b", name: "B", passed: true, severity: "standard", evidence: "ok" },
    ];
    expect(computeEcsScore(checks)).toBe(100);
  });

  it("certifies when score >= 90 and no critical failures", () => {
    const report = {
      executiveId: "athena",
      companyId: "c1",
      generatedAt: new Date().toISOString(),
      score: 95,
      passed: true,
      criticalFailures: 0,
      checks: [],
      verdict: "CERTIFIED_DORMANT" as const,
      executivesEnabled: false as const,
    };
    expect(isEcsCertified(report)).toBe(true);
  });
});
