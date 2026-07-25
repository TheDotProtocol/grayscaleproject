import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  IntelligenceEngine,
  CreateRecommendationInput,
  Recommendation,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import {
  rowToRecommendation,
  confidenceBand,
  defaultTradeOff,
} from "./intelligence.mapper";

@Injectable()
export class RecommendationEngineService implements IntelligenceEngine {
  readonly id = "recommendations";
  readonly name = "Recommendation Engine";
  readonly version = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async contribute(companyId: string) {
    const open = await this.listOpen(companyId);
    return {
      engineId: this.id,
      data: { openRecommendations: open, count: open.length },
      computedAt: new Date().toISOString(),
    };
  }

  async listOpen(companyId: string): Promise<Recommendation[]> {
    const rows = await this.prisma.recommendation.findMany({
      where: {
        companyId,
        status: { in: ["draft", "pending_approval", "approved"] },
      },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(rowToRecommendation);
  }

  async getById(companyId: string, id: string): Promise<Recommendation> {
    const row = await this.prisma.recommendation.findFirst({
      where: { id, companyId },
    });
    if (!row) throw new NotFoundException("Recommendation not found");
    return rowToRecommendation(row);
  }

  async create(input: CreateRecommendationInput): Promise<Recommendation> {
    const confidence = input.confidence ?? 0.5;
    const row = await this.prisma.recommendation.create({
      data: {
        companyId: input.companyId,
        title: input.title,
        summary: input.summary,
        reasoning: input.reasoning,
        evidence: (input.evidence ?? []) as object,
        alternatives: (input.alternatives ?? []) as object,
        confidenceSources: (input.confidenceSources ?? []) as object,
        tradeOff: (input.tradeOff ?? defaultTradeOff()) as object,
        confidence,
        confidenceBand: confidenceBand(confidence),
        department: input.department,
        source: input.source,
        sourceRef: input.sourceRef,
        requiresApproval: input.requiresApproval ?? true,
        estimatedCostCents: input.estimatedCostCents,
        estimatedRoi: input.estimatedRoi,
        expectedOutcome: input.expectedOutcome,
        rollbackStrategy: input.rollbackStrategy,
        createdBy: input.createdBy,
        status: input.requiresApproval === false ? "approved" : "pending_approval",
      },
    });

    await this.prisma.recommendationAudit.create({
      data: {
        recommendationId: row.id,
        action: "created",
        actorId: input.createdBy,
        metadata: { source: input.source } as object,
      },
    });

    await this.events.publish(
      "recommendation.generated",
      input.companyId,
      { recommendationId: row.id, title: row.title, source: row.source },
      { userId: input.createdBy, source: "intelligence" },
    );

    return rowToRecommendation(row);
  }

  async updateStatus(
    companyId: string,
    id: string,
    status: Recommendation["status"],
    actorId: string,
  ): Promise<Recommendation> {
    const row = await this.prisma.recommendation.update({
      where: { id },
      data: { status },
    });
    if (row.companyId !== companyId) throw new NotFoundException();

    await this.prisma.recommendationAudit.create({
      data: {
        recommendationId: id,
        action: `status_${status}`,
        actorId,
        metadata: {} as object,
      },
    });

    return rowToRecommendation(row);
  }
}
