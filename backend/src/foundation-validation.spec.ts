import { describe, it, expect } from "vitest";
import { SandboxGateService } from "./modules/integration-platform/sandbox-gate.service";
import { PermissionService } from "./modules/executive/permission.service";
import { CredentialVaultService } from "./modules/integration-platform/credential-vault.service";
import { GraphValidationService } from "./modules/graph/graph-validation.service";
import { WidgetCatalogService } from "./modules/mission-control/widget-catalog.service";
import { GOVERNANCE_ENTRY_TYPES } from "@grayscale/platform";
import { PULSE_DOMAINS } from "@grayscale/platform";
import { READINESS_SECTION_IDS } from "@grayscale/platform";

/** Foundation Validation — security & architecture checks (no DB required) */
describe("Foundation Validation — Security", () => {
  describe("Permission escalation prevention", () => {
    it("denies actions without explicit grant", async () => {
      const svc = new PermissionService();
      const result = await svc.check({
        executiveId: "exec-1",
        action: "memory.delete",
        resource: "memory:*",
      });
      expect(result.allowed).toBe(false);
    });

    it("allows only explicitly granted permissions", async () => {
      const svc = new PermissionService();
      await svc.grant({
        executiveId: "exec-1",
        permissions: [{ action: "memory.read", resource: "memory:*", scope: "company", granted: true }],
      });
      const allowed = await svc.check({ executiveId: "exec-1", action: "memory.read", resource: "memory:*" });
      const denied = await svc.check({ executiveId: "exec-1", action: "memory.write", resource: "memory:*" });
      expect(allowed.allowed).toBe(true);
      expect(denied.allowed).toBe(false);
    });
  });

  describe("Sandbox escape prevention", () => {
    const prisma = {
      installedPlugin: {
        findUnique: async () => null,
      },
    };
    const svc = new SandboxGateService(prisma as never);

    it("blocks uninstalled plugins", async () => {
      const result = await svc.check("malicious-plugin", "co-1", "memory.write");
      expect(result.allowed).toBe(false);
    });

    it("blocks unknown sandbox APIs", async () => {
      const result = await svc.check("plugin-1", "co-1", "unknown.api" as never);
      expect(result.allowed).toBe(false);
    });
  });

  describe("Credential vault encryption", () => {
    it("encrypts and decrypts credentials", async () => {
      const config = { get: (k: string) => (k === "INTEGRATION_ENCRYPTION_KEY" ? "dev-integration-key-change-in-prod-32chars!" : "1") };
      const prisma = {
        integrationCredential: {
          upsert: async () => ({
            id: "cred-1",
            companyId: "co-1",
            provider: "github",
            encryptedSecret: "enc",
            keyVersion: 1,
            createdAt: new Date(),
          }),
        },
        credentialAuditLog: { create: async () => ({}) },
      };
      const vault = new CredentialVaultService(prisma as never, config as never);
      const stored = await vault.store("co-1", "github", { accessToken: "ghp_secret_token" });
      expect(stored.provider).toBe("github");
    });
  });

  describe("Graph validation", () => {
    it("rejects self-referencing edges", async () => {
      const svc = new GraphValidationService();
      const node = { id: "node-1", nodeType: "concept" } as never;
      const result = await svc.validateEdge("co-1", node, node, "relates_to");
      expect(result.valid).toBe(false);
    });
  });
});

describe("Foundation Validation — Architecture", () => {
  it("defines 8 Pulse v2 domains", () => {
    expect(PULSE_DOMAINS.length).toBe(8);
  });

  it("defines 12 readiness report sections", () => {
    expect(READINESS_SECTION_IDS.length).toBe(12);
  });

  it("defines 8 governance entry types", () => {
    expect(GOVERNANCE_ENTRY_TYPES.length).toBe(8);
  });

  it("registers platform operations widgets", () => {
    const catalog = new WidgetCatalogService();
    const ids = catalog.list().map((w) => w.id);
    expect(ids).toContain("reliability-dashboard");
    expect(ids).toContain("foundation-readiness");
    expect(ids).toContain("security-health");
    expect(ids).toContain("platform-evolution");
  });

  it("maintains distinct health widgets (platform vs security vs reliability)", () => {
    const catalog = new WidgetCatalogService();
    const ids = catalog.list().map((w) => w.id);
    expect(ids).toContain("platform-health");
    expect(ids).toContain("security-health");
    expect(ids).toContain("reliability-dashboard");
    expect(ids).toContain("readiness-matrix"); // company readiness
    expect(ids).toContain("foundation-readiness"); // platform readiness
  });
});

describe("Foundation Validation — Executive gate", () => {
  it("EXECUTIVES_ENABLED must be false for Foundation", () => {
    expect(process.env.EXECUTIVES_ENABLED).not.toBe("true");
  });
});
