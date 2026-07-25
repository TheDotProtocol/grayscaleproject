import { describe, it, expect, vi } from "vitest";
import { IdempotencyService } from "./idempotency.service";

describe("IdempotencyService", () => {
  const prisma = {
    platformIdempotencyKey: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    normalizedEntityRecord: {
      findUnique: vi.fn(),
    },
  };

  const service = new IdempotencyService(prisma as never);

  it("detects duplicate idempotency keys within TTL", async () => {
    prisma.platformIdempotencyKey.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
    });

    const result = await service.checkAndSet("co-1", "github:commits:abc");
    expect(result.isDuplicate).toBe(true);
  });

  it("allows first-seen idempotency keys", async () => {
    prisma.platformIdempotencyKey.findUnique.mockResolvedValue(null);
    prisma.platformIdempotencyKey.upsert.mockResolvedValue({});

    const result = await service.checkAndSet("co-1", "github:commits:def");
    expect(result.isDuplicate).toBe(false);
    expect(prisma.platformIdempotencyKey.upsert).toHaveBeenCalled();
  });

  it("detects persisted normalized entity duplicates", async () => {
    prisma.normalizedEntityRecord.findUnique.mockResolvedValue({ id: "ent-1" });
    const dup = await service.isEntityDuplicate("co-1", "github:commits:xyz");
    expect(dup).toBe(true);
  });
});
