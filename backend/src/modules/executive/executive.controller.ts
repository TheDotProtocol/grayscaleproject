import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type {
  InitializeExecutiveInput,
  SendExecutiveMessageInput,
  CreateInboxItemInput,
  ExecutiveLifecycleState,
  ExecutivePermissionGrant,
  CreateExecutiveOutputInput,
  ExecutionRequest,
} from "@grayscale/platform";
import { ExecutiveRuntimeService } from "./executive-runtime.service";
import { CompanyContextService } from "./company-context.service";
import { CapabilityRegistryService } from "./capability-registry.service";
import { PermissionService } from "./permission.service";
import { ExecutiveBusService } from "./executive-bus.service";
import { ExecutiveInboxService } from "./executive-inbox.service";
import { ExecutiveAuditService } from "./executive-audit.service";

@ApiTags("executive-runtime")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/executive-runtime")
export class ExecutiveController {
  constructor(
    private readonly runtime: ExecutiveRuntimeService,
    private readonly context: CompanyContextService,
    private readonly capabilities: CapabilityRegistryService,
    private readonly permissions: PermissionService,
    private readonly bus: ExecutiveBusService,
    private readonly inbox: ExecutiveInboxService,
    private readonly audit: ExecutiveAuditService,
  ) {}

  @Get("status")
  getStatus() {
    return {
      enabled: this.runtime.isEnabled(),
      message: this.runtime.isEnabled()
        ? "Executive execution enabled"
        : "Executive runtime infrastructure active; execution disabled (EXECUTIVES_ENABLED=false)",
    };
  }

  @Get("context")
  getContext(@Param("companyId") companyId: string) {
    return this.context.assemble(companyId);
  }

  @Get("instances")
  listInstances(@Param("companyId") companyId: string) {
    return this.runtime.listInstances(companyId);
  }

  @Post("instances")
  initialize(
    @Param("companyId") companyId: string,
    @Body() body: Omit<InitializeExecutiveInput, "companyId">,
  ) {
    return this.runtime.initialize({ ...body, companyId });
  }

  @Get("instances/:executiveId")
  getInstance(
    @Param("companyId") companyId: string,
    @Param("executiveId") executiveId: string,
  ) {
    return this.runtime.getInstance(companyId, executiveId);
  }

  @Post("instances/:instanceId/context")
  injectContext(@Param("instanceId") instanceId: string) {
    return this.runtime.injectContext(instanceId);
  }

  @Get("instances/:instanceId/health")
  getHealth(@Param("instanceId") instanceId: string) {
    return this.runtime.getHealth(instanceId);
  }

  @Post("instances/:instanceId/lifecycle")
  transition(
    @Param("instanceId") instanceId: string,
    @Body() body: { state: ExecutiveLifecycleState; reason: string },
  ) {
    return this.runtime.transition(instanceId, body.state, body.reason);
  }

  @Get("capabilities")
  discoverCapabilities(@Param("companyId") companyId: string) {
    return this.capabilities.discover(companyId);
  }

  @Post("permissions")
  grantPermissions(@Body() body: ExecutivePermissionGrant) {
    return this.permissions.grant(body);
  }

  @Post("bus/send")
  sendMessage(
    @Param("companyId") companyId: string,
    @Body() body: Omit<SendExecutiveMessageInput, "companyId">,
  ) {
    return this.bus.send({ ...body, companyId });
  }

  @Get("bus/pending/:executiveId")
  getPending(
    @Param("companyId") companyId: string,
    @Param("executiveId") executiveId: string,
  ) {
    return this.bus.getPending(companyId, executiveId);
  }

  @Post("inbox")
  enqueueInbox(
    @Param("companyId") companyId: string,
    @Body() body: Omit<CreateInboxItemInput, "companyId">,
  ) {
    return this.inbox.enqueue({ ...body, companyId });
  }

  @Get("instances/:instanceId/inbox")
  listInbox(
    @Param("instanceId") instanceId: string,
    @Query("queue") queue?: string,
  ) {
    return this.inbox.list(instanceId, queue as never);
  }

  @Get("instances/:instanceId/inbox/summary")
  inboxSummary(@Param("instanceId") instanceId: string) {
    return this.inbox.summary(instanceId);
  }

  @Post("execution-requests")
  submitExecution(
    @Param("companyId") companyId: string,
    @Body() body: Omit<ExecutionRequest, "companyId">,
  ) {
    return this.runtime.submitExecutionRequest({ ...body, companyId });
  }

  @Post("outputs")
  recordOutput(
    @Param("companyId") companyId: string,
    @Body() body: Omit<CreateExecutiveOutputInput, "companyId">,
  ) {
    return this.runtime.recordOutput({ ...body, companyId });
  }

  @Get("audit")
  auditLog(
    @Param("companyId") companyId: string,
    @Query("executiveId") executiveId?: string,
    @Query("limit") limit?: string,
  ) {
    return this.audit.query(companyId, {
      executiveId,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }
}
