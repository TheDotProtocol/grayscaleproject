import { Injectable } from "@nestjs/common";
import type {
  IntelligenceEngine,
  PriorityConfig,
  PriorityConfigScope,
  PriorityInput,
  PriorityScore,
  PriorityWeights,
  CompanyOperatingMode,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { OperatingModeService } from "./operating-mode.service";
import { computePriorityScore, defaultWeights } from "./intelligence.mapper";

@Injectable()
export class PriorityEngineService implements IntelligenceEngine {
  readonly id = "priority";
  readonly name = "Priority Engine";
  readonly version = 1;

  constructor(
    private readonly prisma: PrismaService,
    private readonly operatingMode: OperatingModeService,
  ) {}

  async contribute(companyId: string) {
    const ranking = await this.rankRecommendations(companyId);
    return {
      engineId: this.id,
      data: { scores: ranking.scores, rankedAt: ranking.rankedAt },
      computedAt: new Date().toISOString(),
    };
  }

  /** AIP-13: Company → Department → Executive → Founder override */
  async resolveWeights(
    companyId: string,
    department?: string,
    executiveId?: string,
    founderOverride?: boolean,
  ): Promise<{ weights: PriorityWeights; configScope: PriorityConfigScope; configId: string }> {
    const configs = await this.prisma.priorityConfig.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });

    const mode = await this.operatingMode.getActiveMode(companyId);
    let weights = defaultWeights();
    let configScope: PriorityConfigScope = "company";
    let configId = "default";

    const companyConfig = configs.find((c) => c.scope === "company");
    if (companyConfig) {
      weights = { ...weights, ...(companyConfig.weights as unknown as PriorityWeights) };
      configScope = "company";
      configId = companyConfig.id;
    }

    if (department) {
      const deptConfig = configs.find(
        (c) => c.scope === "department" && c.scopeRef === department,
      );
      if (deptConfig) {
        weights = { ...weights, ...(deptConfig.weights as unknown as PriorityWeights) };
        configScope = "department";
        configId = deptConfig.id;
      }
    }

    if (executiveId) {
      const execConfig = configs.find(
        (c) => c.scope === "executive" && c.scopeRef === executiveId,
      );
      if (execConfig) {
        weights = { ...weights, ...(execConfig.weights as unknown as PriorityWeights) };
        configScope = "executive";
        configId = execConfig.id;
      }
    }

    if (founderOverride) {
      const founderConfig = configs.find((c) => c.scope === "founder");
      if (founderConfig) {
        weights = { ...weights, ...(founderConfig.weights as unknown as PriorityWeights) };
        configScope = "founder";
        configId = founderConfig.id;
      }
    }

    weights = this.applyModeAdjustments(weights, mode);
    return { weights, configScope, configId };
  }

  private applyModeAdjustments(
    weights: PriorityWeights,
    mode: CompanyOperatingMode,
  ): PriorityWeights {
    const adjustments = this.operatingMode.modeWeightAdjustments(mode);
    const adjusted = { ...weights };
    for (const [key, multiplier] of Object.entries(adjustments)) {
      const k = key as keyof PriorityWeights;
      if (adjusted[k] !== undefined && multiplier) {
        adjusted[k] = Math.min(1, adjusted[k] * multiplier);
      }
    }
    const total = Object.values(adjusted).reduce((s, v) => s + v, 0);
    if (total > 0) {
      for (const k of Object.keys(adjusted) as (keyof PriorityWeights)[]) {
        adjusted[k] = adjusted[k] / total;
      }
    }
    return adjusted;
  }

  async score(input: PriorityInput, companyId: string): Promise<PriorityScore> {
    const { weights, configScope, configId } = await this.resolveWeights(companyId);
    const { score, factors } = computePriorityScore(input, weights);

    const row = await this.prisma.priorityScore.create({
      data: {
        companyId,
        entityType: input.entityType,
        entityId: input.entityId,
        score,
        reasoning: {
          summary: `Priority score ${score} from ${configScope} configuration`,
          factors,
          configScope,
          configId,
        } as object,
        configId: configId === "default" ? null : configId,
      },
    });

    return {
      id: row.id,
      companyId,
      entityType: input.entityType,
      entityId: input.entityId,
      score,
      reasoning: row.reasoning as unknown as PriorityScore["reasoning"],
      computedAt: row.computedAt.toISOString(),
    };
  }

  async rankRecommendations(companyId: string) {
    const recs = await this.prisma.recommendation.findMany({
      where: {
        companyId,
        status: { in: ["draft", "pending_approval", "approved"] },
      },
    });

    const scores: PriorityScore[] = [];
    for (const rec of recs) {
      const input: PriorityInput = {
        entityType: "recommendation",
        entityId: rec.id,
        businessValue: rec.confidence,
        founderPriority: rec.source === "founder" ? 0.9 : 0.5,
        revenueImpact: rec.estimatedRoi ? 0.7 : 0.4,
        riskScore: rec.riskAssessmentIds.length > 0 ? 0.6 : 0.3,
        dependencyBlockers: rec.dependencies.length,
        timeSensitivity: rec.expectedTimeline ? 0.7 : 0.4,
        engineeringCost: rec.engineeringCost ?? 0.5,
      };
      scores.push(await this.score(input, companyId));
    }

    scores.sort((a, b) => b.score - a.score);
    for (let i = 0; i < scores.length; i++) {
      scores[i] = { ...scores[i], rank: i + 1 };
    }

    return { companyId, scores, rankedAt: new Date().toISOString() };
  }

  async upsertConfig(
    companyId: string,
    scope: PriorityConfigScope,
    weights: PriorityWeights,
    createdBy: string,
    scopeRef?: string,
    operatingMode?: CompanyOperatingMode,
  ): Promise<PriorityConfig> {
    const row = await this.prisma.priorityConfig.create({
      data: {
        companyId,
        scope,
        scopeRef,
        weights: weights as object,
        operatingMode,
        createdBy,
      },
    });
    return {
      id: row.id,
      companyId,
      scope: row.scope as PriorityConfigScope,
      scopeRef: row.scopeRef ?? undefined,
      weights: row.weights as unknown as PriorityWeights,
      operatingMode: (row.operatingMode as CompanyOperatingMode) ?? undefined,
      createdBy: row.createdBy,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
