import { describe, it, expect } from "vitest";
import { canTransition } from "./lifecycle.js";

describe("executive lifecycle", () => {
  it("allows valid transitions", () => {
    expect(canTransition("created", "initializing")).toBe(true);
    expect(canTransition("initializing", "idle")).toBe(true);
    expect(canTransition("idle", "thinking")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransition("archived", "idle")).toBe(false);
    expect(canTransition("created", "executing")).toBe(false);
  });
});
