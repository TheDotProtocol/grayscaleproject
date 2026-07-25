import { describe, it, expect, vi } from "vitest";
import { ConfigService } from "@nestjs/config";
import { CredentialVaultService } from "./credential-vault.service";

describe("CredentialVaultService", () => {
  const prisma = {
    integrationCredential: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    credentialAuditLog: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
    },
  };

  const config = {
    get: (key: string) =>
      key === "INTEGRATION_ENCRYPTION_KEY"
        ? "test-vault-key"
        : key === "INTEGRATION_ENCRYPTION_KEY_VERSION"
          ? "1"
          : undefined,
  } as ConfigService;

  const service = new CredentialVaultService(prisma as never, config);

  it("encrypts and retrieves secrets round-trip", async () => {
    const stored = {
      id: "cred-1",
      companyId: "co-1",
      provider: "github",
      encryptedSecret: "",
      keyVersion: 1,
      expiresAt: null,
      createdAt: new Date(),
      rotatedAt: null,
    };

    prisma.integrationCredential.upsert.mockImplementation(async ({ create }) => {
      stored.encryptedSecret = create.encryptedSecret;
      return stored;
    });

    prisma.integrationCredential.findUnique.mockImplementation(async () => ({
      ...stored,
      encryptedSecret: stored.encryptedSecret,
    }));

    await service.store("co-1", "github", { accessToken: "ghp_secret" });
    const secret = await service.retrieve("co-1", "github");

    expect(secret).toEqual({ accessToken: "ghp_secret" });
    expect(prisma.credentialAuditLog.create).toHaveBeenCalled();
  });

  it("returns null for expired credentials", async () => {
    prisma.integrationCredential.findUnique.mockResolvedValue({
      id: "cred-2",
      companyId: "co-1",
      provider: "github",
      encryptedSecret: "1:00:00:00",
      keyVersion: 1,
      expiresAt: new Date("2020-01-01"),
      createdAt: new Date(),
      rotatedAt: null,
    });

    const secret = await service.retrieve("co-1", "github");
    expect(secret).toBeNull();
  });
});
