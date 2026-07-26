import { Injectable } from "@nestjs/common";
import type { AttentionDebtSnapshot } from "@grayscale/platform";
import { AttentionEngineService } from "../context-runtime/attention-engine.service";

@Injectable()
export class AttentionDebtService {
  constructor(private readonly attention: AttentionEngineService) {}

  async assess(companyId: string): Promise<AttentionDebtSnapshot> {
    const orgAttention = await this.attention.assemble(companyId);
    return {
      companyId,
      debtUnits: orgAttention.debt.deferredItems * 2,
      deferredItems: orgAttention.debt.deferredItems,
      oldestDeferredDays: orgAttention.debt.oldestDeferredDays,
      domains: orgAttention.debt.domains,
      accumulating: orgAttention.debt.deferredItems > 0,
      assessedAt: new Date().toISOString(),
    };
  }
}
