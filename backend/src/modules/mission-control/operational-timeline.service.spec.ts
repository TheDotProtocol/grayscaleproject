import { describe, it, expect } from "vitest";
import { OperationalTimelineService } from "./operational-timeline.service";

describe("OperationalTimelineService", () => {
  const prisma = {
    domainEvent: {
      findMany: async () => [
        {
          id: "evt-1",
          companyId: "co-1",
          type: "memory.created",
          payload: { title: "Test note" },
          source: "api",
          status: "processed",
          correlationId: "corr-1",
          sequence: BigInt(1),
          version: 1,
          createdAt: new Date("2026-07-25T10:00:00Z"),
        },
      ],
    },
  };

  const service = new OperationalTimelineService(prisma as never);

  it("maps domain events to timeline entries", async () => {
    const entries = await service.getTimeline("co-1");
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe("Test note");
    expect(entries[0].category).toBe("memory");
  });
});
