import { describe, it, expect, vi, beforeEach } from "vitest";
import { EventStoreService } from "./event-store.service";

describe("EventStoreService", () => {
  let service: EventStoreService;
  const prisma = {
    domainEvent: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    domainEventFailure: {
      create: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EventStoreService(prisma as never);
  });

  it("appends immutable event with pending status", async () => {
    const now = new Date("2026-07-25T12:00:00Z");
    prisma.domainEvent.create.mockResolvedValue({
      id: "evt-1",
      sequence: BigInt(1),
      companyId: "co-1",
      type: "memory.created",
      version: 1,
      userId: null,
      payload: { title: "Note" },
      correlationId: "corr-1",
      causationId: null,
      traceId: null,
      source: "api",
      status: "pending",
      processedAt: null,
      createdAt: now,
    });

    const stored = await service.append({
      id: "evt-1",
      type: "memory.created",
      version: 1,
      companyId: "co-1",
      payload: { title: "Note" },
      metadata: {
        correlationId: "corr-1",
        timestamp: now.toISOString(),
        source: "api",
      },
    });

    expect(stored.sequence).toBe(BigInt(1));
    expect(stored.status).toBe("pending");
    expect(prisma.domainEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: "evt-1",
          status: "pending",
        }),
      }),
    );
  });

  it("records failure and marks event failed", async () => {
    await service.recordFailure({
      domainEventId: "evt-1",
      projector: "pulse",
      error: "boom",
    });

    expect(prisma.domainEventFailure.create).toHaveBeenCalled();
    expect(prisma.domainEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "evt-1" },
        data: expect.objectContaining({ status: "failed" }),
      }),
    );
  });
});
