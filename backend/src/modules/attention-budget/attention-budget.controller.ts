import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { AttentionBudgetCertificationService } from "./attention-budget-certification.service";
import { AttentionAllocatorService } from "./attention-allocator.service";
import { AttentionCapacityService } from "./attention-capacity.service";
import { AttentionDebtService } from "./attention-debt.service";
import { AttentionRecoveryService } from "./attention-recovery.service";
import { AutonomyGovernanceService } from "./autonomy-governance.service";
import { AttentionBudgetContextService } from "./attention-budget-context.service";

@Controller("attention-budget")
export class AttentionBudgetController {
  constructor(
    private readonly context: AttentionBudgetContextService,
    private readonly certification: AttentionBudgetCertificationService,
    private readonly allocator: AttentionAllocatorService,
    private readonly capacity: AttentionCapacityService,
    private readonly debt: AttentionDebtService,
    private readonly recovery: AttentionRecoveryService,
    private readonly autonomy: AutonomyGovernanceService,
  ) {}

  @Get(":companyId/snapshot")
  getSnapshot(@Param("companyId") companyId: string) {
    return this.context.assemble(companyId);
  }

  @Get(":companyId/health")
  getHealth(@Param("companyId") companyId: string) {
    return this.certification.getHealth(companyId);
  }

  @Get(":companyId/capacity")
  getCapacity(@Param("companyId") companyId: string) {
    return this.capacity.measure(companyId);
  }

  @Get(":companyId/debt")
  getDebt(@Param("companyId") companyId: string) {
    return this.debt.assess(companyId);
  }

  @Get(":companyId/recovery")
  getRecovery(@Param("companyId") companyId: string) {
    return this.recovery.assess(companyId);
  }

  @Get(":companyId/allocation")
  getAllocation(@Param("companyId") companyId: string) {
    return this.allocator.getAllocation(companyId);
  }

  @Post(":companyId/allocate")
  allocate(
    @Param("companyId") companyId: string,
    @Body() body: { category: string; weight: number; executiveId?: string; correlationId?: string; triggerSource?: string },
  ) {
    return this.allocator.allocate(companyId, {
      category: body.category as never,
      weight: body.weight,
      executiveId: body.executiveId,
      correlationId: body.correlationId ?? crypto.randomUUID(),
      triggerSource: body.triggerSource ?? "manual",
    });
  }

  @Get(":companyId/certification")
  certify(@Param("companyId") companyId: string) {
    return this.certification.certify(companyId);
  }

  @Get(":companyId/autonomy-governance")
  validateAutonomy(@Param("companyId") companyId: string) {
    return this.autonomy.validate(companyId);
  }
}
