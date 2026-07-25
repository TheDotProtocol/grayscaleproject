import { describe, it, expect } from "vitest";
import { ORGANIZATIONAL_ENGINE_IDS } from "./common.js";
import { ORGANIZATIONAL_EMOTION_METRICS } from "./emotional-engine.js";
import { LEARNING_RECORD_TYPES } from "./organizational-learning.js";
import { isWisdomDistinctFromMemory } from "./wisdom-engine.js";

describe("organizational intelligence contracts", () => {
  it("registers nine permanent core engines", () => {
    expect(ORGANIZATIONAL_ENGINE_IDS).toHaveLength(9);
    expect(ORGANIZATIONAL_ENGINE_IDS).toContain("organizational-dna");
    expect(ORGANIZATIONAL_ENGINE_IDS).toContain("organizational-adaptation");
  });

  it("defines explainable emotional metrics", () => {
    expect(ORGANIZATIONAL_EMOTION_METRICS).toContain("founder_stress");
    expect(ORGANIZATIONAL_EMOTION_METRICS).toContain("organization_morale");
    expect(ORGANIZATIONAL_EMOTION_METRICS.length).toBeGreaterThanOrEqual(16);
  });

  it("defines learning record types", () => {
    expect(LEARNING_RECORD_TYPES).toContain("failure");
    expect(LEARNING_RECORD_TYPES).toContain("operational_lesson");
  });

  it("keeps wisdom distinct from memory", () => {
    expect(isWisdomDistinctFromMemory()).toBe(true);
  });
});
