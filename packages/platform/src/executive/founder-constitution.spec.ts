import { describe, it, expect } from "vitest";
import {
  FOUNDER_CONSTITUTION_VERSION,
  FOUNDER_CONSTITUTION_PRINCIPLES,
  createFounderConstitutionContext,
} from "./founder-constitution.js";

describe("Founder Constitution", () => {
  it("has version and principles", () => {
    expect(FOUNDER_CONSTITUTION_VERSION).toBe("1.0.0");
    expect(FOUNDER_CONSTITUTION_PRINCIPLES.length).toBeGreaterThanOrEqual(10);
  });

  it("creates context with founder final authority", () => {
    const ctx = createFounderConstitutionContext();
    expect(ctx.founderFinalAuthority).toBe(true);
    expect(ctx.documentRef).toBe("docs/platform/FOUNDER_CONSTITUTION.md");
  });
});
