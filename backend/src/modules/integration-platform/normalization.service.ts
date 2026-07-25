import { Injectable } from "@nestjs/common";
import { normalizeGitHubCommit } from "@grayscale/connector-github";
import type { NormalizationResult, RawProviderPayload } from "@grayscale/platform";

@Injectable()
export class NormalizationService {
  normalize(raw: RawProviderPayload, companyId: string): NormalizationResult {
    switch (raw.providerId) {
      case "github":
        if (raw.resourceType === "commits") {
          return normalizeGitHubCommit(raw, companyId);
        }
        break;
      default:
        break;
    }

    const idempotencyKey = `${raw.providerId}:${raw.resourceType}:${raw.sourceId}:${raw.payloadHash}`;
    return {
      entity: {
        companyId,
        entityType: "development_activity",
        sourceProvider: raw.providerId,
        sourceId: raw.sourceId,
        sourceUrl: raw.sourceUrl,
        displayName: `${raw.providerId} ${raw.resourceType}`,
        occurredAt: raw.fetchedAt,
        metadata: {},
        rawPayloadHash: raw.payloadHash,
        idempotencyKey,
      },
      platformEventType: "integration.sync.completed",
      platformEventPayload: { provider: raw.providerId, sourceId: raw.sourceId },
    };
  }
}
