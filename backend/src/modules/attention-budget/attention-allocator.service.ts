import { Injectable } from "@nestjs/common";
import type { AttentionAllocationSnapshot, AttentionCategory } from "@grayscale/platform";
import { AttentionEngineService } from "../context-runtime/attention-engine.service";
import { EventsService } from "../events/events.service";
import { AttentionBudgetStoreService } from "./attention-budget-store.service";

/** Deterministic attention allocation — executives consume, never create */
@Injectable()
export class AttentionAllocatorService {
  constructor(
    private readonly attention: AttentionEngineService,
    private readonly store: AttentionBudgetStoreService,
    private readonly events: EventsService,
  ) {}

  async allocate(companyId: string, input: {
    category: AttentionCategory;
    weight: number;
    executiveId?: string;
    correlationId: string;
    triggerSource: string;
  }): Promise<AttentionAllocationSnapshot> {
    const orgAttention = await this.attention.assemble(companyId);
    const snapshot = await this.getAllocation(companyId);

    await this.events.publish("attention-budget.allocated", companyId, {
      category: input.category,
      weight: input.weight,
      executiveId: input.executiveId,
    }, { correlationId: input.correlationId });

    this.store.audit.set(this.store.newId("aud"), {
      entryId: this.store.newId("aud"),
      companyId,
      action: "attention.allocated",
      actorId: "organizational-attention-budget",
      correlationId: input.correlationId,
      traceId: `trace-${input.correlationId.slice(0, 12)}`,
      details: { category: input.category, weight: input.weight, triggerSource: input.triggerSource },
      recordedAt: new Date().toISOString(),
    });

    return {
      ...snapshot,
      allocations: [
        ...snapshot.allocations,
        { category: input.category, weight: input.weight, executiveId: input.executiveId, explainable: true },
      ],
      strategicConcentration: orgAttention.strategicFocus.coveragePercent / 100,
      operationalNoiseRatio: orgAttention.operationalNoise.noiseScore,
      assessedAt: new Date().toISOString(),
    };
  }

  async getAllocation(companyId: string): Promise<AttentionAllocationSnapshot> {
    const orgAttention = await this.attention.assemble(companyId);
    return {
      companyId,
      allocations: orgAttention.allocations.map((a) => ({
        category: (a.domain as AttentionCategory) ?? "operational",
        weight: a.weight,
        executiveId: a.executiveId,
        explainable: true as const,
      })),
      strategicConcentration: orgAttention.strategicFocus.coveragePercent / 100,
      operationalNoiseRatio: orgAttention.operationalNoise.noiseScore,
      assessedAt: new Date().toISOString(),
    };
  }
}
