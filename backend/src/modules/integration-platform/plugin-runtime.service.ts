import { Injectable, NotFoundException } from "@nestjs/common";
import type { PluginRuntimePort, PluginManifestV2, InstalledPlugin, PluginLifecycleState } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { SandboxGateService } from "./sandbox-gate.service";

@Injectable()
export class PluginRuntimeService implements PluginRuntimePort {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly sandbox: SandboxGateService,
  ) {}

  async install(companyId: string, manifest: PluginManifestV2): Promise<InstalledPlugin> {
    const policy = this.sandbox.defaultPolicy(manifest.id, companyId);
    const row = await this.prisma.installedPlugin.upsert({
      where: { companyId_pluginId: { companyId, pluginId: manifest.id } },
      create: {
        companyId,
        pluginId: manifest.id,
        version: manifest.version,
        state: "active",
        config: {},
        permissions: manifest.permissions as object,
        sandboxPolicy: policy as object,
        manifest: manifest as object,
      },
      update: {
        version: manifest.version,
        state: "active",
        permissions: manifest.permissions as object,
        manifest: manifest as object,
      },
    });

    await this.events.publish("plugin.installed", companyId, {
      pluginId: manifest.id,
      version: manifest.version,
    }, { source: "plugin-runtime" });

    return this.toInstalled(row);
  }

  async uninstall(companyId: string, pluginId: string): Promise<void> {
    await this.prisma.installedPlugin.deleteMany({ where: { companyId, pluginId } });
    await this.events.publish("plugin.uninstalled", companyId, { pluginId }, { source: "plugin-runtime" });
  }

  async activate(companyId: string, pluginId: string) {
    return this.setState(companyId, pluginId, "active");
  }

  async deactivate(companyId: string, pluginId: string) {
    return this.setState(companyId, pluginId, "deactivated");
  }

  async getInstalled(companyId: string, pluginId: string) {
    const row = await this.prisma.installedPlugin.findUnique({
      where: { companyId_pluginId: { companyId, pluginId } },
    });
    return row ? this.toInstalled(row) : null;
  }

  async listInstalled(companyId: string) {
    const rows = await this.prisma.installedPlugin.findMany({ where: { companyId } });
    return rows.map((r) => this.toInstalled(r));
  }

  async healthCheck(companyId: string, pluginId: string) {
    const installed = await this.getInstalled(companyId, pluginId);
    if (!installed) throw new NotFoundException("Plugin not installed");
    const issues: string[] = [];
    if (installed.state === "degraded") issues.push("Plugin degraded");
    if (installed.state === "failed") issues.push("Plugin failed");
    return { healthy: issues.length === 0, issues };
  }

  private async setState(companyId: string, pluginId: string, state: PluginLifecycleState) {
    const row = await this.prisma.installedPlugin.update({
      where: { companyId_pluginId: { companyId, pluginId } },
      data: { state },
    });
    return this.toInstalled(row);
  }

  private toInstalled(row: {
    id: string;
    companyId: string;
    pluginId: string;
    version: string;
    state: string;
    config: unknown;
    permissions: unknown;
    sandboxPolicy: unknown;
    installedAt: Date;
    updatedAt: Date;
  }): InstalledPlugin {
    return {
      id: row.id,
      companyId: row.companyId,
      pluginId: row.pluginId,
      version: row.version,
      state: row.state as PluginLifecycleState,
      config: (row.config ?? {}) as Record<string, unknown>,
      permissions: (row.permissions ?? []) as InstalledPlugin["permissions"],
      sandboxPolicy: (row.sandboxPolicy ?? {}) as InstalledPlugin["sandboxPolicy"],
      installedAt: row.installedAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
