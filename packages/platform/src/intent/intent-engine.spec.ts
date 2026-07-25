import { describe, it, expect } from "vitest";
import { INTENT_HIERARCHY_LEVELS } from "./intent-engine.js";
import { CONTEXT_ASSEMBLER_IDS } from "../context-runtime/runtime.js";
import { isSignalDistinctFromEvent } from "../signals/signal-bus.js";
import { assertInsightNotRecommendation } from "../insights/insight-engine.js";

describe("Phase A.4 platform contracts", () => {
  it("defines intent hierarchy levels", () => {
    expect(INTENT_HIERARCHY_LEVELS[0]).toBe("vision");
    expect(INTENT_HIERARCHY_LEVELS).toContain("execution");
    expect(INTENT_HIERARCHY_LEVELS).toHaveLength(10);
  });

  it("registers context assemblers", () => {
    expect(CONTEXT_ASSEMBLER_IDS).toContain("intent");
    expect(CONTEXT_ASSEMBLER_IDS).toContain("governance");
    expect(CONTEXT_ASSEMBLER_IDS.length).toBeGreaterThanOrEqual(20);
  });

  it("keeps signals distinct from events", () => {
    expect(isSignalDistinctFromEvent()).toBe(true);
  });

  it("ensures insights are not recommendations", () => {
    expect(
      assertInsightNotRecommendation({
        id: "i1",
        companyId: "c1",
        category: "throughput",
        observation: "Throughput declined 27% over four weeks.",
        evidence: [],
        derivedFromSignalIds: [],
        confidence: 0.9,
        generatedAt: new Date().toISOString(),
        isRecommendation: false,
      }),
    ).toBe(true);
  });
});
