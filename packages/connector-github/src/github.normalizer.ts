import type { NormalizationResult } from "@grayscale/platform";
import type { RawProviderPayload } from "@grayscale/platform";

export function normalizeGitHubCommit(raw: RawProviderPayload, companyId: string): NormalizationResult {
  const commit = raw.payload as {
    sha: string;
    commit: { message: string; author: { date: string } };
    html_url: string;
  };
  const title = commit.commit.message.split("\n")[0];
  const idempotencyKey = `github:commits:${commit.sha}`;

  return {
    entity: {
      companyId,
      entityType: "development_activity",
      sourceProvider: "github",
      sourceId: commit.sha,
      sourceUrl: commit.html_url,
      displayName: title,
      summary: commit.commit.message,
      occurredAt: commit.commit.author.date,
      metadata: { sha: commit.sha, url: commit.html_url },
      rawPayloadHash: raw.payloadHash,
      idempotencyKey,
    },
    platformEventType: "git.commit.received",
    platformEventPayload: {
      sha: commit.sha,
      message: title,
      url: commit.html_url,
      provider: "github",
    },
  };
}
