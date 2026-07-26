import { Module, forwardRef } from "@nestjs/common";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { EventsModule } from "../events/events.module";
import { AttentionBudgetStoreService } from "./attention-budget-store.service";
import { AttentionAllocatorService } from "./attention-allocator.service";
import { AttentionCapacityService } from "./attention-capacity.service";
import { AttentionDebtService } from "./attention-debt.service";
import { AttentionRecoveryService } from "./attention-recovery.service";
import { AttentionBudgetCertificationService } from "./attention-budget-certification.service";
import { AutonomyGovernanceService } from "./autonomy-governance.service";
import { AttentionBudgetContextService } from "./attention-budget-context.service";
import { AttentionBudgetController } from "./attention-budget.controller";

@Module({
  imports: [forwardRef(() => ContextRuntimeModule), forwardRef(() => EventsModule)],
  controllers: [AttentionBudgetController],
  providers: [
    AttentionBudgetStoreService,
    AttentionAllocatorService,
    AttentionCapacityService,
    AttentionDebtService,
    AttentionRecoveryService,
    AttentionBudgetCertificationService,
    AutonomyGovernanceService,
    AttentionBudgetContextService,
  ],
  exports: [
    AttentionBudgetContextService,
    AttentionBudgetCertificationService,
    AutonomyGovernanceService,
    AttentionAllocatorService,
  ],
})
export class AttentionBudgetModule {}
