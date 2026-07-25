import { describe, it, expect } from "vitest";
import {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiresAt,
} from "./token.util";

describe("token.util", () => {
  it("generates unique refresh tokens", () => {
    const a = generateRefreshToken();
    const b = generateRefreshToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(32);
  });

  it("hashes tokens deterministically", () => {
    const token = "test-token-value";
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
    expect(hashRefreshToken(token)).not.toBe(token);
  });

  it("sets refresh expiry in the future", () => {
    const exp = refreshTokenExpiresAt(7);
    expect(exp.getTime()).toBeGreaterThan(Date.now());
  });
});
