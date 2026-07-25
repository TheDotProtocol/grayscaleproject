import { Injectable } from "@nestjs/common";
import type { IntelligenceEngine, Decision } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { rowToDecision } from "./intelligence.mapper";

@Injectable()
export class DecisionEngineService implements IntelligenceEngine {
  readonly id = "decisions";
  readonly name = "Decision Engine";
  readonly version = 1;

  constructor(private readonly prisma: PrismaService) {}

  async contribute(companyId: string) {
    const pending = await this.listPending(companyId);
    return {
      engineId: this.id,
      data: { pendingDecisions: pending, count: pending.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listPending(companyId: string): Promise<Decision[]> {
    const rows = await this.prisma.decision.findMany({
      where: { companyId, status: { in: ["proposed", "approved"] } },
      orderBy: { decisionDate: "desc" },
    });
    return rows.map(rowToDecision);
  }

  async record(input: {
    companyId: string;
    recommendationId?: string;
    title: string;
    decisionMakerId: string;
    reasoning: string;
    status?: Decision["status"];
  }): Promise<Decision> {
    const row = await this.prisma.decision.create({
      data: {
        companyId: input.companyId,
        recommendationId: input.recommendationId,
        title: input.title,
        decisionMakerId: input.decisionMakerId,
        reasoning: input.reasoning,
        status: input.status ?? "proposed",
      },
    });

    await this.prisma.decisionAudit.create({
      data: {
        decisionId: row.id,
        action: "recorded",
        actorId: input.decisionMakerId,
        metadata: {} as object,
      },
    });

    return rowToDecision(row);
  }
}
