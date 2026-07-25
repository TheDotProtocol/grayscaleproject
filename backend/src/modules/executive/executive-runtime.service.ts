import {
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  type ExecutiveRuntimePort,
  type InitializeExecutiveInput,
  type ExecutiveInstance,
  type ExecutiveHealth,
  type ExecutionRequest,
  type CreateExecutiveOutputInput,
  type ExecutiveOutput,
  type CompanyContext,
  canTransition,
} from "@grayscale/platform";
import { EXECUTIVE_LIST, isExecutivesEnabled } from "@grayscale/shared";
import { PrismaService } from "../../prisma/prisma.service";
import { CompanyContextService } from "./company-context.service";
import { CapabilityRegistryService } from "./capability-registry.service";
import { PermissionService } from "./permission.service";
import { ExecutiveLifecycleService } from "./executive-lifecycle.service";
import { ExecutiveInboxService } from "./executive-inbox.service";
import { ExecutiveBusService } from "./executive-bus.service";
import { ExecutiveAuditService } from "./executive-audit.service";
import { rowToInstance, rowToOutput } from "./executive.mapper";

@Injectable()
export class ExecutiveRuntimeService implements ExecutiveRuntimePort, OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly context: CompanyContextService,
    private readonly capabilities: CapabilityRegistryService,
    private readonly permissions: PermissionService,
    private readonly lifecycle: ExecutiveLifecycleService,
    private readonly inbox: ExecutiveInboxService,
    private readonly bus: ExecutiveBusService,
    private readonly audit: ExecutiveAuditService,
  ) {}

  onModuleInit(): void {
    for (const exec of EXECUTIVE_LIST) {
      this.capabilities.register(exec.id, [
        {
          capability: "ReadContext",
          description: "Read unified company context",
          requiredPermissions: ["read"],
          version: 1,
        },
        {
          capability: "ReadMemory",
          description: "Read organizational memory",
          requiredPermissions: ["read"],
          version: 1,
        },
        {
          capability: "ReadStrategy",
          description: "Read strategic intelligence context",
          requiredPermissions: ["read"],
          version: 1,
        },
      ]);
    }
  }

  isEnabled(): boolean {
    return isExecutivesEnabled(this.config.get("EXECUTIVES_ENABLED"));
  }

  async initialize(input: InitializeExecutiveInput): Promise<ExecutiveInstance> {
    const executive = EXECUTIVE_LIST.find((e) => e.id === input.executiveId);
    if (!executive) throw new NotFoundException(`Unknown executive slot: ${input.executiveId}`);

    const existing = await this.prisma.executiveInstance.findUnique({
      where: {
        companyId_executiveId: {
          companyId: input.companyId,
          executiveId: input.executiveId,
        },
      },
    });
    if (existing) return rowToInstance(existing);

    const row = await this.prisma.executiveInstance.create({
      data: {
        companyId: input.companyId,
        executiveId: input.executiveId,
        lifecycleState: "created",
        capabilities: (input.capabilities ?? []) as object,
        permissions: (input.permissions ?? []) as object,
        metadata: (input.metadata ?? {}) as object,
      },
    });

    let inst = rowToInstance(row);
    if (canTransition("created", "initializing")) {
      inst = await this.lifecycle.transition(inst.id, "initializing", "Runtime bootstrap");
    }
    if (canTransition("initializing", "idle")) {
      inst = await this.lifecycle.transition(inst.id, "idle", "Runtime ready");
    }

    await this.audit.log({
      companyId: input.companyId,
      instanceId: inst.id,
      executiveId: input.executiveId,
      action: "runtime.initialized",
      actorType: "system",
      metadata: { capabilities: input.capabilities ?? [] },
    });

    if (input.permissions?.length) {
      await this.permissions.grant({
        executiveId: input.executiveId,
        permissions: input.permissions,
        grantedBy: "system",
        grantedAt: new Date().toISOString(),
      });
    }

    return inst;
  }

  async getInstance(companyId: string, executiveId: string): Promise<ExecutiveInstance | null> {
    const row = await this.prisma.executiveInstance.findUnique({
      where: { companyId_executiveId: { companyId, executiveId } },
    });
    return row ? rowToInstance(row) : null;
  }

  async listInstances(companyId: string): Promise<ExecutiveInstance[]> {
    const rows = await this.prisma.executiveInstance.findMany({
      where: { companyId },
      orderBy: { executiveId: "asc" },
    });
    return rows.map(rowToInstance);
  }

  async injectContext(instanceId: string): Promise<CompanyContext> {
    const instance = await this.prisma.executiveInstance.findUnique({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException("Executive instance not found");

    const ctx = await this.context.assemble(instance.companyId);

    await this.prisma.executiveInstance.update({
      where: { id: instanceId },
      data: { lastContextAt: new Date(), lastActivityAt: new Date() },
    });

    await this.audit.log({
      companyId: instance.companyId,
      instanceId,
      executiveId: instance.executiveId,
      action: "context.injected",
      actorType: "system",
      metadata: { correlationId: ctx.correlationId },
      correlationId: ctx.correlationId,
    });

    return ctx;
  }

  async transition(instanceId: string, toState: ExecutiveInstance["lifecycleState"], reason: string) {
    return this.lifecycle.transition(instanceId, toState, reason);
  }

  async getHealth(instanceId: string): Promise<ExecutiveHealth> {
    const instance = await this.prisma.executiveInstance.findUnique({
      where: { id: instanceId },
    });
    if (!instance) throw new NotFoundException("Executive instance not found");

    const [pendingMessages, inboxSummary] = await Promise.all([
      this.bus.getPending(instance.companyId, instance.executiveId),
      this.inbox.summary(instanceId),
    ]);

    const issues: string[] = [];
    if (instance.lifecycleState === "failed") issues.push("Instance in failed state");
    if (instance.lifecycleState === "blocked") issues.push("Instance blocked");
    if (inboxSummary.counts.blocked > 0) issues.push(`${inboxSummary.counts.blocked} blocked inbox items`);

    return {
      executiveId: instance.executiveId,
      instanceId: instance.id,
      lifecycleState: instance.lifecycleState as ExecutiveHealth["lifecycleState"],
      healthy: issues.length === 0 && instance.lifecycleState !== "failed",
      lastContextAt: instance.lastContextAt?.toISOString(),
      lastActivityAt: instance.lastActivityAt?.toISOString(),
      pendingMessages: pendingMessages.length,
      blockedItems: inboxSummary.counts.blocked,
      issues,
    };
  }

  async submitExecutionRequest(request: ExecutionRequest): Promise<{ accepted: boolean; reason: string }> {
    if (!this.isEnabled()) {
      return {
        accepted: false,
        reason: "Executive execution is disabled (EXECUTIVES_ENABLED=false)",
      };
    }

    const perm = await this.permissions.check({
      executiveId: request.executiveId,
      action: "execute",
      resource: request.requestType,
    });

    if (!perm.allowed) {
      return { accepted: false, reason: perm.reason };
    }

    await this.inbox.enqueue({
      companyId: request.companyId,
      instanceId: request.instanceId,
      executiveId: request.executiveId,
      queue: request.requiresApproval ? "waiting" : "pending",
      itemType: request.requestType,
      title: `Execution request: ${request.requestType}`,
      payload: request.payload,
      correlationId: request.correlationId,
      traceId: request.traceId,
    });

    await this.audit.log({
      companyId: request.companyId,
      instanceId: request.instanceId,
      executiveId: request.executiveId,
      action: "execution.requested",
      actorType: "executive",
      actorId: request.executiveId,
      metadata: { requestType: request.requestType, requiresApproval: request.requiresApproval },
      correlationId: request.correlationId,
      traceId: request.traceId,
    });

    return { accepted: true, reason: "Execution request queued" };
  }

  async recordOutput(input: CreateExecutiveOutputInput): Promise<ExecutiveOutput> {
    const row = await this.prisma.executiveOutput.create({
      data: {
        companyId: input.companyId,
        instanceId: input.instanceId,
        executiveId: input.executiveId,
        outputType: input.outputType,
        title: input.title,
        summary: input.summary,
        explainability: input.explainability as object,
        payload: (input.payload ?? {}) as object,
        correlationId: input.correlationId,
        traceId: input.traceId,
      },
    });

    await this.audit.log({
      companyId: input.companyId,
      instanceId: input.instanceId,
      executiveId: input.executiveId,
      action: "output.recorded",
      actorType: "executive",
      actorId: input.executiveId,
      metadata: { outputType: input.outputType, title: input.title },
      correlationId: input.correlationId,
      traceId: input.traceId,
    });

    return rowToOutput(row);
  }
}
