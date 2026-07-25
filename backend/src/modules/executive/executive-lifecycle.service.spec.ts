import { canTransition } from "@grayscale/platform";

describe("Executive lifecycle transitions", () => {
  it("supports standard runtime bootstrap path", () => {
    expect(canTransition("created", "initializing")).toBe(true);
    expect(canTransition("initializing", "idle")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransition("archived", "idle")).toBe(false);
  });
});
