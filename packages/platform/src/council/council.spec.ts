import { describe, it, expect } from "vitest";
import {
  COUNCIL_PRINCIPLES,
  COUNCIL_ROLES,
  COUNCIL_DECISION_LIFECYCLE_STAGES,
} from "./constitution.js";
import { isCouncilExplanationComplete } from "./explanation.js";
import { isCouncilLifecycleComplete } from "./history.js";

describe("Executive Council contracts", () => {
  it("defines 10 immutable principles", () => {
    expect(COUNCIL_PRINCIPLES).toHaveLength(10);
  });

  it("defines 6 council roles", () => {
    expect(COUNCIL_ROLES).toContain("chair");
    expect(COUNCIL_ROLES).toContain("reference");
  });

  it("defines 14 lifecycle stages", () => {
    expect(COUNCIL_DECISION_LIFECYCLE_STAGES).toHaveLength(14);
    expect(COUNCIL_DECISION_LIFECYCLE_STAGES[0]).toBe("issue");
    expect(COUNCIL_DECISION_LIFECYCLE_STAGES.at(-1)).toBe("historical_wisdom");
  });

  it("validates lifecycle completion deterministically", () => {
    expect(
      isCouncilLifecycleComplete([
        "issue",
        "evidence_collection",
        "discovery",
        "deliberation",
        "challenge",
        "consensus",
        "explanation",
      ]),
    ).toBe(true);
    expect(isCouncilLifecycleComplete(["issue"])).toBe(false);
  });

  it("validates explanation completeness", () => {
    expect(
      isCouncilExplanationComplete({
        issueSummary: "Test",
        decisionPath: ["issue", "consensus"],
        whatCouldMakeThisWrong: "New evidence",
        consensusLevel: "strong",
        confidence: 0.7,
        correlationId: "c1",
      }),
    ).toBe(true);
  });
});
