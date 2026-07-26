import { Injectable } from "@nestjs/common";
import type { AttentionCapacitySnapshot } from "@grayscale/platform";
import { AttentionEngineService } from "../context-runtime/attention-engine.service";

@Injectable()
export class AttentionCapacityService {
  constructor(private readonly attention: AttentionEngineService) {}

  async measure(companyId: string): Promise<AttentionCapacitySnapshot> {
    const orgAttention = await this.attention.assemble(companyId);
    const utilization = orgAttention.budget.allocated / Math.max(orgAttention.budget.totalCapacity, 1);
    const status = utilization < 0.15 && orgAttention.saturation.status === "healthy"
      ? "starvation"
      : orgAttention.saturation.status;

    return {
      companyId,
      totalSlots: orgAttention.budget.totalCapacity,
      usedSlots: orgAttention.budget.allocated,
      utilizationPercent: Math.round(utilization * 100),
      saturationStatus: status,
      trend: orgAttention.trends[0]?.direction === "increasing" ? "rising" : orgAttention.trends[0]?.direction === "decreasing" ? "falling" : "stable",
      assessedAt: new Date().toISOString(),
    };
  }
}
