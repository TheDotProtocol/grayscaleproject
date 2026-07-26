import { describe, it, expect } from "vitest";
import { classifyDecision, DECISION_CLASSES, isValidDecisionClass } from "./decision-classes.js";

describe("Organizational Decision Model", () => {
  it("defines 19 decision classes", () => {
    expect(DECISION_CLASSES).toHaveLength(19);
  });

  it("classifies decisions deterministically", () => {
    const c = classifyDecision("strategic", "corr-1");
    expect(c.requirements.founderApprovalRequired).toBe(true);
    expect(c.requirements.councilQuorum).toBeGreaterThan(0);
  });

  it("validates decision class strings", () => {
    expect(isValidDecisionClass("financial")).toBe(true);
    expect(isValidDecisionClass("invalid")).toBe(false);
  });
});
