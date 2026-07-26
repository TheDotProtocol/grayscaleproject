import { Injectable } from "@nestjs/common";
import type {
  AttentionAllocationSnapshot,
  AttentionBudgetHealth,
  AttentionBudgetMetrics,
  AttentionBudgetSnapshot,
  AttentionCapacitySnapshot,
  AttentionConsumptionSnapshot,
  AttentionDebtSnapshot,
  AttentionRecoverySnapshot,
} from "@grayscale/platform";
import { AttentionBudgetCertificationService } from "./attention-budget-certification.service";
import { AttentionAllocatorService } from "./attention-allocator.service";
import { AttentionCapacityService } from "./attention-capacity.service";
import { AttentionDebtService } from "./attention-debt.service";
import { AttentionRecoveryService } from "./attention-recovery.service";

/** Assembles read-only attention budget snapshots for CompanyContext */
@Injectable()
export class AttentionBudgetContextService {
  constructor(
    private readonly certification: AttentionBudgetCertificationService,
    private readonly allocator: AttentionAllocatorService,
    private readonly capacity: AttentionCapacityService,
    private readonly debt: AttentionDebtService,
    private readonly recovery: AttentionRecoveryService,
  ) {}

  async assemble(companyId: string): Promise<{
    attentionBudget: AttentionBudgetSnapshot;
    attentionCapacity: AttentionCapacitySnapshot;
    attentionDebt: AttentionDebtSnapshot;
    attentionRecovery: AttentionRecoverySnapshot;
    attentionConsumption: AttentionConsumptionSnapshot;
    attentionBudgetHealth: AttentionBudgetHealth;
    attentionAllocation: AttentionAllocationSnapshot;
    attentionMetrics: AttentionBudgetMetrics;
  }> {
    const [
      attentionBudget,
      attentionCapacity,
      attentionDebt,
      attentionRecovery,
      attentionConsumption,
      attentionHealth,
      attentionAllocation,
      attentionMetrics,
    ] = await Promise.all([
      this.certification.getSnapshot(companyId),
      this.capacity.measure(companyId),
      this.debt.assess(companyId),
      this.recovery.assess(companyId),
      this.certification.measureConsumption(companyId),
      this.certification.getHealth(companyId),
      this.allocator.getAllocation(companyId),
      this.certification.getMetrics(companyId),
    ]);

    return {
      attentionBudget,
      attentionCapacity,
      attentionDebt,
      attentionRecovery,
      attentionConsumption,
      attentionBudgetHealth: attentionHealth,
      attentionAllocation,
      attentionMetrics,
    };
  }
}
