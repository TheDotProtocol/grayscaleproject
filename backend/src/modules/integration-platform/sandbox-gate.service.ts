import { Injectable } from "@nestjs/common";
import type { SandboxGatePort, SandboxApi, PluginSandboxPolicy } from "@grayscale/platform";
import { SANDBOX_APIS } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

/** AIP-19 deny-all sandbox enforcement */
@Injectable()
export class SandboxGateService implements SandboxGatePort {
  constructor(private readonly prisma: PrismaService) {}

  async check(pluginId: string, companyId: string, api: SandboxApi): Promise<{ allowed: boolean; reason: string }> {
    if (!SANDBOX_APIS.includes(api)) {
      return { allowed: false, reason: `Unknown sandbox API: ${api}` };
    }

    const installed = await this.prisma.installedPlugin.findUnique({
      where: { companyId_pluginId: { companyId, pluginId } },
    });
    if (!installed) {
      return { allowed: false, reason: "Plugin not installed" };
    }

    const policy = installed.sandboxPolicy as unknown as PluginSandboxPolicy;
    if (!policy?.allowedApis?.includes(api)) {
      return { allowed: false, reason: `Sandbox denies ${api} for ${pluginId}` };
    }

    return { allowed: true, reason: "Granted" };
  }

  defaultPolicy(pluginId: string, companyId: string): PluginSandboxPolicy {
    return {
      pluginId,
      companyId,
      allowedApis: ["integration.read", "integration.sync", "events.publish", "memory.write", "graph.read"],
      allowedEvents: ["integration.sync.completed", "git.commit.received"],
      allowedSubscriptions: [],
      allowedExecutives: [],
      allowedStorage: { maxBytes: 1_048_576, ttlSeconds: 7_776_000 },
      allowedPermissions: [],
      networkPolicy: "provider_only",
    };
  }
}
