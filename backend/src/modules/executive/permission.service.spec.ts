import { describe, it, expect, beforeEach } from "vitest";
import { PermissionService } from "./permission.service";

describe("PermissionService", () => {
  const service = new PermissionService();

  beforeEach(async () => {
    await service.grant({
      executiveId: "athena",
      grantedBy: "system",
      grantedAt: new Date().toISOString(),
      permissions: [
        { action: "read", resource: "memory", granted: true },
        { action: "execute", resource: "analysis", granted: true },
      ],
    });
  });

  it("allows granted permissions", async () => {
    const result = await service.check({
      executiveId: "athena",
      action: "read",
      resource: "memory",
    });
    expect(result.allowed).toBe(true);
  });

  it("denies missing permissions", async () => {
    const result = await service.check({
      executiveId: "athena",
      action: "approve",
      resource: "decision",
    });
    expect(result.allowed).toBe(false);
  });
});
