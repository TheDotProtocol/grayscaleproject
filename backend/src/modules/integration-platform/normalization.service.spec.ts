import { NormalizationService } from "./normalization.service";

describe("NormalizationService", () => {
  const service = new NormalizationService();

  it("normalizes github commits via connector normalizer", () => {
    const result = service.normalize(
      {
        providerId: "github",
        resourceType: "commits",
        sourceId: "sha1",
        fetchedAt: new Date().toISOString(),
        payload: {
          sha: "sha1",
          commit: { message: "fix", author: { date: new Date().toISOString() } },
          html_url: "https://github.com/a/b/commit/sha1",
        },
        payloadHash: "h1",
      },
      "co-1",
    );
    expect(result.platformEventType).toBe("git.commit.received");
  });
});
