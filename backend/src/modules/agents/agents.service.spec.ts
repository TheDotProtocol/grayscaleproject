import { describe, it, expect, vi, beforeEach } from "vitest";
import { ServiceUnavailableException } from "@nestjs/common";
import { AgentsService } from "./agents.service";

describe("AgentsService freeze gate", () => {
  let service: AgentsService;

  beforeEach(() => {
    service = new AgentsService(
      {} as never,
      {} as never,
      {} as never,
      {
        get: vi.fn().mockReturnValue(undefined),
      } as never,
    );
  });

  it("rejects runAgent when EXECUTIVES_ENABLED is not true", async () => {
    await expect(
      service.runAgent("co-1", "user-1", "athena", "hello"),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("allows runAgent when EXECUTIVES_ENABLED=true", async () => {
    const config = { get: vi.fn().mockReturnValue("true") };
    const prisma = {
      agentRun: { create: vi.fn().mockRejectedValue(new Error("stop-after-gate")) },
    };
    const svc = new AgentsService(prisma as never, {} as never, {} as never, config as never);

    await expect(
      svc.runAgent("co-1", "user-1", "athena", "hello"),
    ).rejects.toThrow("stop-after-gate");
  });
});
