import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, Opportunity, OpportunityCategory } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToOpportunity } from "./intelligence.mapper";

@Injectable()
export class OpportunityEngineService implements IntelligenceEngine {
  readonly id = "opportunities";
  readonly name = "Opportunity Engine";
  readonly version = 1;

  constructor(private readonly prisma: PrismaService) {}

  async contribute(companyId: string) {
    const top = await this.listTop(companyId);
    return {
      engineId: this.id,
      data: { topOpportunities: top, count: top.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listTop(companyId: string, limit = 10): Promise<Opportunity[]> {
    const rows = await this.prisma.opportunity.findMany({
      where: { companyId, status: { in: ["identified", "evaluating", "pursuing"] } },
      orderBy: { confidence: "desc" },
      take: limit,
    });
    return rows.map(rowToOpportunity);
  }

  async identify(input: {
    companyId: string;
    category: OpportunityCategory;
    title: string;
    description: string;
    confidence?: number;
    estimatedValueCents?: number;
    linkedRecommendationId?: string;
  }): Promise<Opportunity> {
    const row = await this.prisma.opportunity.create({
      data: {
        companyId: input.companyId,
        category: input.category,
        title: input.title,
        description: input.description,
        confidence: input.confidence ?? 0.5,
        estimatedValueCents: input.estimatedValueCents,
        linkedRecommendationId: input.linkedRecommendationId,
      },
    });
    return rowToOpportunity(row);
  }
}
