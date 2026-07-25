import { describe, it, expect, vi } from "vitest";
import { IntegrationHealthService } from "./integration-health.service";

describe("IntegrationHealthService", () => {
  const prisma = {
    integrationHealthSnapshot: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  };

  const service = new IntegrationHealthService(prisma as never);

  it("aggregates health summary counts", async () => {
    prisma.integrationHealthSnapshot.findMany.mockResolvedValue([
      {
        companyId: "co-1",
        provider: "github",
        pluginId: null,
        state: "healthy",
        message: null,
        authStatus: "valid",
        lastSyncAt: new Date(),
        webhookStatus: "inactive",
        recordedAt: new Date(),
      },
      {
        companyId: "co-1",
        provider: "slack",
        pluginId: null,
        state: "rate_limited",
        message: "429",
        authStatus: "valid",
        lastSyncAt: null,
        webhookStatus: "inactive",
        recordedAt: new Date(),
      },
    ]);

    const summary = await service.aggregateSummary("co-1");
    expect(summary.healthy).toBe(1);
    expect(summary.critical).toBe(1);
    expect(summary.states.rate_limited).toBe(1);
  });
});
