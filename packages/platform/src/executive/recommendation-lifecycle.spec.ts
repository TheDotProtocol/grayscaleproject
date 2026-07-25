import { describe, it, expect } from "vitest";
import { canTransitionRecommendation } from "./recommendation-lifecycle.js";

describe("recommendation lifecycle contract", () => {
  it("allows valid transitions", () => {
    expect(canTransitionRecommendation("observed", "draft")).toBe(true);
    expect(canTransitionRecommendation("founder_review", "approved")).toBe(true);
    expect(canTransitionRecommendation("measured", "lessons_learned")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransitionRecommendation("archived", "draft")).toBe(false);
    expect(canTransitionRecommendation("observed", "approved")).toBe(false);
  });
});
