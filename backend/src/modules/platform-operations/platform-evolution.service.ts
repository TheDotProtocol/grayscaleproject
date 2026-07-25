import { Injectable } from "@nestjs/common";
import type { PlatformEvolutionPort, PlatformVersionInfo } from "@grayscale/platform";
import { readdirSync } from "fs";
import { join } from "path";

@Injectable()
export class PlatformEvolutionService implements PlatformEvolutionPort {
  async getCurrent(): Promise<PlatformVersionInfo> {
    const migrations = this.listMigrations();
    return {
      platformVersion: "0.1.0",
      schemaVersion: migrations.at(-1) ?? "20260725250000_platform_operations",
      apiVersion: "v1",
      migrationVersion: migrations.at(-1) ?? "unknown",
      connectorCompatibility: { github: "1.0.0", core: "1.0.0" },
      pluginCompatibility: { minPlatformVersion: "0.1.0" },
      executiveRuntimeVersion: "1.0.0",
      upgradePath: "Apply pending migrations via prisma migrate deploy",
      rollbackPath: "Restore from platform snapshot + event replay",
      recordedAt: new Date().toISOString(),
    };
  }

  private listMigrations(): string[] {
    try {
      const dir = join(process.cwd(), "prisma/migrations");
      return readdirSync(dir).filter((d) => !d.startsWith(".")).sort();
    } catch {
      return [];
    }
  }
}
