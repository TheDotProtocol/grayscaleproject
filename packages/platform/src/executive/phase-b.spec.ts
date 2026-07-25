import { describe, it, expect } from "vitest";
import { NOTEBOOK_ENTRY_TYPES } from "./notebook.js";
import { curiosityNeverRecommends } from "./curiosity-engine.js";
import { requiresSkepticField } from "./skeptic-engine.js";
import { isAthenaExplainabilityComplete } from "./athena-explainability.js";
import { createExplainability } from "./explainability.js";

describe("Phase B executive contracts", () => {
  it("defines notebook entry types", () => {
    expect(NOTEBOOK_ENTRY_TYPES).toContain("observation");
    expect(NOTEBOOK_ENTRY_TYPES).toContain("reflection");
    expect(NOTEBOOK_ENTRY_TYPES.length).toBe(9);
  });

  it("curiosity never recommends directly", () => {
    expect(curiosityNeverRecommends()).toBe(true);
  });

  it("requires skeptic whatCouldMakeThisWrong field", () => {
    expect(
      requiresSkepticField({
        passed: true,
        challenges: [],
        whatCouldMakeThisWrong: "Evidence may be stale",
        adjustedConfidence: 0.6,
        completedAt: new Date().toISOString(),
      }),
    ).toBe(true);
  });

  it("validates complete Athena explainability", () => {
    const base = createExplainability({ reason: "test" });
    expect(
      isAthenaExplainabilityComplete({
        ...base,
        whyAthenaThinksThis: "Because risks are critical",
        whatCouldMakeThisWrong: "New data could change assessment",
        rollbackPlan: "Revert to monitoring mode",
        supportingEvidence: [],
        discoveryStagesCompleted: ["observe"],
      }),
    ).toBe(true);
  });
});
