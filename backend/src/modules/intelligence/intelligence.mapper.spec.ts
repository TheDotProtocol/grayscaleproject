import { computePriorityScore, defaultWeights, confidenceBand } from "./intelligence.mapper";

describe("intelligence.mapper", () => {
  describe("computePriorityScore", () => {
    it("returns score between 0 and 100", () => {
      const weights = defaultWeights();
      const { score } = computePriorityScore(
        {
          businessValue: 0.8,
          founderPriority: 0.7,
          revenueImpact: 0.6,
          riskScore: 0.2,
          dependencyBlockers: 0,
          timeSensitivity: 0.5,
          engineeringCost: 0.3,
        },
        weights,
      );
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("lowers score when risk is high", () => {
      const weights = defaultWeights();
      const input = {
        businessValue: 0.8,
        founderPriority: 0.7,
        revenueImpact: 0.6,
        dependencyBlockers: 0,
        timeSensitivity: 0.5,
        engineeringCost: 0.3,
      };
      const lowRisk = computePriorityScore({ ...input, riskScore: 0.1 }, weights);
      const highRisk = computePriorityScore({ ...input, riskScore: 0.9 }, weights);
      expect(lowRisk.score).toBeGreaterThan(highRisk.score);
    });
  });

  describe("confidenceBand", () => {
    it("maps confidence to bands", () => {
      expect(confidenceBand(0.95)).toBe("verified");
      expect(confidenceBand(0.8)).toBe("high");
      expect(confidenceBand(0.6)).toBe("medium");
      expect(confidenceBand(0.3)).toBe("low");
      expect(confidenceBand(0.1)).toBe("unknown");
    });
  });

  describe("defaultWeights", () => {
    it("weights sum to approximately 1", () => {
      const w = defaultWeights();
      const sum = Object.values(w).reduce((s, v) => s + v, 0);
      expect(sum).toBeCloseTo(1, 2);
    });
  });
});
