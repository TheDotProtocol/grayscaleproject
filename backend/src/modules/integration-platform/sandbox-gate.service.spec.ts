import { describe, it, expect, vi } from "vitest";
import { SandboxGateService } from "./sandbox-gate.service";

describe("SandboxGateService", () => {
  const prisma = {
    installedPlugin: {
      findUnique: vi.fn(),
    },
  };

  const service = new SandboxGateService(prisma as never);

  it("denies unknown sandbox APIs", async () => {
    const result = await service.check("io.grayscale.github", "co-1", "admin" as never);
    expect(result.allowed).toBe(false);
  });

  it("denies when plugin is not installed", async () => {
    prisma.installedPlugin.findUnique.mockResolvedValue(null);
    const result = await service.check("io.grayscale.github", "co-1", "memory.read");
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("not installed");
  });

  it("allows explicitly granted APIs", async () => {
    prisma.installedPlugin.findUnique.mockResolvedValue({
      sandboxPolicy: service.defaultPolicy("io.grayscale.github", "co-1"),
    });

    const result = await service.check("io.grayscale.github", "co-1", "memory.write");
    expect(result.allowed).toBe(true);
  });

  it("denies APIs not in sandbox policy", async () => {
    prisma.installedPlugin.findUnique.mockResolvedValue({
      sandboxPolicy: {
        ...service.defaultPolicy("io.grayscale.github", "co-1"),
        allowedApis: ["integration.read"],
      },
    });

    const result = await service.check("io.grayscale.github", "co-1", "memory.write");
    expect(result.allowed).toBe(false);
  });
});
