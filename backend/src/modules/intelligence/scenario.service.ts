import { Injectable } from "@nestjs/common";
import type { ScenarioPlan } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ScenarioService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: string): Promise<ScenarioPlan[]> {
    const rows = await this.prisma.scenarioPlan.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      name: r.name,
      case: r.caseType as ScenarioPlan["case"],
      assumptions: (r.assumptions ?? {}) as Record<string, unknown>,
      outcomes: (r.outcomes ?? {}) as Record<string, unknown>,
      linkedRecommendationIds: r.linkedRecommendationIds,
    }));
  }

  async create(input: {
    companyId: string;
    name: string;
    case: ScenarioPlan["case"];
    assumptions?: Record<string, unknown>;
    outcomes?: Record<string, unknown>;
    linkedRecommendationIds?: string[];
  }): Promise<ScenarioPlan> {
    const row = await this.prisma.scenarioPlan.create({
      data: {
        companyId: input.companyId,
        name: input.name,
        caseType: input.case,
        assumptions: (input.assumptions ?? {}) as object,
        outcomes: (input.outcomes ?? {}) as object,
        linkedRecommendationIds: input.linkedRecommendationIds ?? [],
      },
    });
    return {
      id: row.id,
      companyId: row.companyId,
      name: row.name,
      case: row.caseType as ScenarioPlan["case"],
      assumptions: (row.assumptions ?? {}) as Record<string, unknown>,
      outcomes: (row.outcomes ?? {}) as Record<string, unknown>,
      linkedRecommendationIds: row.linkedRecommendationIds,
    };
  }
}
