import { describe, it, expect } from "vitest";
import { normalizeGitHubCommit } from "./github.normalizer.js";

describe("normalizeGitHubCommit", () => {
  it("normalizes commit to development_activity with idempotency key", () => {
    const raw = {
      providerId: "github" as const,
      resourceType: "commits" as const,
      sourceId: "abc123",
      sourceUrl: "https://github.com/o/r/commit/abc123",
      fetchedAt: new Date().toISOString(),
      payload: {
        sha: "abc123",
        commit: { message: "feat: test", author: { date: "2026-01-01T00:00:00Z" } },
        html_url: "https://github.com/o/r/commit/abc123",
      },
      payloadHash: "hash1",
    };

    const result = normalizeGitHubCommit(raw, "co-1");
    expect(result.entity.entityType).toBe("development_activity");
    expect(result.entity.idempotencyKey).toBe("github:commits:abc123");
    expect(result.platformEventType).toBe("git.commit.received");
  });
});
