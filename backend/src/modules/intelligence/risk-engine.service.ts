import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, RiskAssessment, RiskCategory } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToRisk } from "./intelligence.mapper";

@Injectable()
export class RiskEngineService implements IntelligenceEngine {
  readonly id = "risks";
  readonly name = "Risk Engine";
  readonly version = 1;

  constructor(private readonly prisma: PrismaService) {}

  async contribute(companyId: string) {
    const topRisks = await this.listTop(companyId);
    return {
      engineId: this.id,
      data: { topRisks, count: topRisks.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listTop(companyId: string, limit = 10): Promise<RiskAssessment[]> {
    const rows = await this.prisma.riskAssessment.findMany({
      where: { companyId },
      orderBy: { score: "desc" },
      take: limit,
    });
    return rows.map(rowToRisk);
  }

  async assess(input: {
    companyId: string;
    category: RiskCategory;
    title: string;
    description: string;
    likelihood: number;
    impact: number;
    mitigation?: string;
    linkedEntityType?: string;
    linkedEntityId?: string;
  }): Promise<RiskAssessment> {
    const score = input.likelihood * input.impact;
    const severity =
      score >= 0.7 ? "critical" : score >= 0.5 ? "high" : score >= 0.25 ? "medium" : "low";

    const row = await this.prisma.riskAssessment.create({
      data: {
        companyId: input.companyId,
        category: input.category,
        title: input.title,
        description: input.description,
        likelihood: input.likelihood,
        impact: input.impact,
        score,
        severity,
        mitigation: input.mitigation,
        linkedEntityType: input.linkedEntityType,
        linkedEntityId: input.linkedEntityId,
      },
    });
    return rowToRisk(row);
  }
}
