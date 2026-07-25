import { describe, it, expect } from "vitest";
import {
  RECOMMENDATION_PIPELINE_STAGES,
  isRecommendationPipelineComplete,
  type RecommendationPipelineTrace,
} from "./recommendation-pipeline.js";

describe("Recommendation Pipeline", () => {
  it("defines 18 stages ending with draft generation", () => {
    expect(RECOMMENDATION_PIPELINE_STAGES).toHaveLength(18);
    expect(RECOMMENDATION_PIPELINE_STAGES.at(-1)).toBe("generate_draft_recommendation");
  });

  it("detects complete pipeline", () => {
    const trace: RecommendationPipelineTrace = {
      executiveId: "athena",
      companyId: "c1",
      correlationId: "corr",
      steps: RECOMMENDATION_PIPELINE_STAGES.slice(0, -1).map((stage) => ({
        stage,
        status: "completed",
        evidence: {},
        completedAt: new Date().toISOString(),
      })),
      completed: true,
      startedAt: new Date().toISOString(),
    };
    expect(isRecommendationPipelineComplete(trace)).toBe(true);
  });
});
