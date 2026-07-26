import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { RuntimeCoordinatorService } from "./runtime-coordinator.service";
import { RuntimeHeartbeatService } from "./runtime-heartbeat.service";
import { RuntimeSchedulerService } from "./runtime-scheduler.service";
import { RuntimeCertificationService } from "./runtime-certification.service";
import { RuntimeExplainabilityService } from "./runtime-explainability.service";

@Controller("runtime")
export class RuntimeController {
  constructor(
    private readonly coordinator: RuntimeCoordinatorService,
    private readonly heartbeat: RuntimeHeartbeatService,
    private readonly scheduler: RuntimeSchedulerService,
    private readonly certification: RuntimeCertificationService,
    private readonly explainability: RuntimeExplainabilityService,
  ) {}

  @Get(":companyId/snapshot")
  getSnapshot(@Param("companyId") companyId: string) {
    return this.coordinator.getSnapshot(companyId);
  }

  @Post(":companyId/heartbeat")
  runHeartbeat(@Param("companyId") companyId: string) {
    return this.coordinator.runHeartbeat(companyId);
  }

  @Get(":companyId/health")
  getHealth(@Param("companyId") companyId: string) {
    return this.coordinator.getHealth(companyId);
  }

  @Get(":companyId/metrics")
  getMetrics(@Param("companyId") companyId: string) {
    return this.coordinator.getMetrics(companyId);
  }

  @Get(":companyId/scheduler")
  listTasks(@Param("companyId") companyId: string) {
    return this.scheduler.list(companyId);
  }

  @Post(":companyId/heartbeat/configure")
  configureHeartbeat(@Param("companyId") companyId: string, @Body() body: { intervalSeconds: number }) {
    return this.heartbeat.configure(companyId, body.intervalSeconds);
  }

  @Get(":companyId/certification")
  certify(@Param("companyId") companyId: string) {
    return this.certification.certify(companyId);
  }

  @Get(":companyId/explain/:actionId")
  explain(@Param("actionId") actionId: string) {
    return this.explainability.explain(actionId);
  }
}
