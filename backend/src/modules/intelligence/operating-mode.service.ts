import { Injectable } from "@nestjs/common";
import type { CompanyOperatingMode, CompanyOperatingModeConfig } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

const DEFAULT_MODE: CompanyOperatingMode = "startup";

@Injectable()
export class OperatingModeService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveMode(companyId: string): Promise<CompanyOperatingMode> {
    const row = await this.prisma.companyOperatingMode.findFirst({
      where: { companyId },
      orderBy: { effectiveFrom: "desc" },
    });
    return (row?.mode as CompanyOperatingMode) ?? DEFAULT_MODE;
  }

  async setMode(
    companyId: string,
    mode: CompanyOperatingMode,
    metadata?: Record<string, unknown>,
  ): Promise<CompanyOperatingModeConfig> {
    const row = await this.prisma.companyOperatingMode.create({
      data: {
        companyId,
        mode,
        metadata: (metadata ?? {}) as object,
      },
    });
    return {
      companyId,
      mode: row.mode as CompanyOperatingMode,
      effectiveFrom: row.effectiveFrom.toISOString(),
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    };
  }

  /** Mode-specific weight adjustments — rule-based, no LLM */
  modeWeightAdjustments(mode: CompanyOperatingMode): Partial<Record<string, number>> {
    switch (mode) {
      case "cash_conservation":
        return { revenueImpact: 1.3, engineeringCost: 1.4, risk: 1.2 };
      case "emergency":
        return { timeSensitivity: 1.5, risk: 1.3 };
      case "launch":
        return { timeSensitivity: 1.4, businessValue: 1.2 };
      case "growth":
        return { revenueImpact: 1.3, businessValue: 1.2 };
      case "enterprise":
        return { risk: 1.2, dependency: 1.1 };
      default:
        return {};
    }
  }
}
