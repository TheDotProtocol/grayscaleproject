import { describe, it, expect } from "vitest";
import { createExplainability } from "./explainability.js";

describe("createExplainability", () => {
  it("fills defaults for required explainability fields", () => {
    const exp = createExplainability({ reason: "Test reasoning" });
    expect(exp.reason).toBe("Test reasoning");
    expect(exp.confidence).toBe(0.5);
    expect(exp.evidence.memoryRefs).toEqual([]);
    expect(exp.decisionPath).toEqual([]);
  });
});
