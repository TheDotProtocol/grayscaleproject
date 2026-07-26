import { Injectable } from "@nestjs/common";
import type { AttentionRecoverySnapshot } from "@grayscale/platform";
import { AttentionCapacityService } from "./attention-capacity.service";
import { AttentionDebtService } from "./attention-debt.service";

@Injectable()
export class AttentionRecoveryService {
  constructor(
    private readonly capacity: AttentionCapacityService,
    private readonly debt: AttentionDebtService,
  ) {}

  async assess(companyId: string): Promise<AttentionRecoverySnapshot> {
    const cap = await this.capacity.measure(companyId);
    const debtSnap = await this.debt.assess(companyId);
    const fatigueLevel = cap.utilizationPercent / 100;
    const recoveryRate = Math.max(0, 1 - fatigueLevel);
    const estimatedRecoveryDays = debtSnap.debtUnits > 0 ? Math.ceil(debtSnap.debtUnits / Math.max(recoveryRate, 0.1)) : 0;

    return {
      companyId,
      recoveryRate: Math.round(recoveryRate * 100) / 100,
      estimatedRecoveryDays,
      fatigueLevel: Math.round(fatigueLevel * 100) / 100,
      recommendedActions: cap.saturationStatus === "overload"
        ? ["Defer non-critical allocations", "Reduce context switching"]
        : debtSnap.accumulating
          ? ["Address attention debt domains"]
          : [],
      assessedAt: new Date().toISOString(),
    };
  }
}
