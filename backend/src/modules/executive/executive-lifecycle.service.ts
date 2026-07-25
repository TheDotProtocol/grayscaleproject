import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { canTransition, type ExecutiveLifecycleState } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { ExecutiveAuditService } from "./executive-audit.service";
import { rowToInstance } from "./executive.mapper";

@Injectable()
export class ExecutiveLifecycleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: ExecutiveAuditService,
  ) {}

  async transition(
    instanceId: string,
    toState: ExecutiveLifecycleState,
    reason: string,
    actorId?: string,
  ) {
    const instance = await this.prisma.executiveInstance.findUnique({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException("Executive instance not found");

    const fromState = instance.lifecycleState as ExecutiveLifecycleState;
    if (!canTransition(fromState, toState)) {
      throw new BadRequestException(
        `Invalid lifecycle transition: ${fromState} → ${toState}`,
      );
    }

    const row = await this.prisma.executiveInstance.update({
      where: { id: instanceId },
      data: {
        lifecycleState: toState,
        lastActivityAt: new Date(),
      },
    });

    await this.audit.log({
      companyId: row.companyId,
      instanceId: row.id,
      executiveId: row.executiveId,
      action: `lifecycle.${fromState}_to_${toState}`,
      actorType: actorId ? "founder" : "system",
      actorId,
      metadata: { reason, fromState, toState },
    });

    return rowToInstance(row);
  }
}
