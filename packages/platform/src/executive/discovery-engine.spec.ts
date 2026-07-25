import { describe, it, expect } from "vitest";
import { DISCOVERY_STAGES, nextDiscoveryStage, isDiscoveryComplete } from "./discovery-engine.js";
import type { DiscoverySnapshot } from "./discovery-engine.js";

describe("discovery engine contract", () => {
  it("defines 13 constitutional stages in order", () => {
    expect(DISCOVERY_STAGES).toHaveLength(13);
    expect(DISCOVERY_STAGES[0]).toBe("observe");
    expect(DISCOVERY_STAGES[DISCOVERY_STAGES.length - 1]).toBe("recommendation_eligibility");
  });

  it("advances stages sequentially", () => {
    expect(nextDiscoveryStage("observe")).toBe("identity_engine");
    expect(nextDiscoveryStage("confidence_evaluation")).toBe("recommendation_eligibility");
    expect(nextDiscoveryStage("recommendation_eligibility")).toBeNull();
  });

  it("requires eligibility for discovery complete", () => {
    const incomplete: DiscoverySnapshot = {
      executiveId: "athena",
      companyId: "c1",
      status: "in_progress",
      currentStage: "observe",
      stages: DISCOVERY_STAGES.map((stage) => ({
        stage,
        status: "completed" as const,
        evidenceCount: 1,
      })),
      eligibleForRecommendation: false,
      overallConfidence: 0.9,
    };
    expect(isDiscoveryComplete(incomplete)).toBe(false);

    const complete: DiscoverySnapshot = { ...incomplete, eligibleForRecommendation: true };
    expect(isDiscoveryComplete(complete)).toBe(true);
  });
});
