import { Injectable } from "@nestjs/common";
import type { RuntimeResourceMetrics } from "@grayscale/platform";
import { RuntimeSchedulerService } from "./runtime-scheduler.service";
import { RuntimeStoreService } from "./runtime-store.service";

/** Resource measurement only — no optimization logic */
@Injectable()
export class RuntimeResourceManagerService {
  constructor(
    private readonly scheduler: RuntimeSchedulerService,
    private readonly store: RuntimeStoreService,
  ) {}

  async measure(companyId: string): Promise<RuntimeResourceMetrics> {
    const tasks = await this.scheduler.list(companyId);
    const pending = tasks.filter((t) => t.status === "pending").length;
    const cfg = this.store.heartbeatConfig.get(companyId);
    const queueDepth = this.scheduler.queueDepth(companyId);

    return {
      queueDepth,
      executionBacklog: pending,
      executiveUtilization: 0,
      councilUtilization: 0,
      runtimeContention: Math.min(1, queueDepth / 10),
      processingLatencyMs: cfg?.beatCount ? 50 : 0,
      capacityTrend: queueDepth > 5 ? "rising" : "stable",
      cpuWorkloadProxy: Math.min(1, (cfg?.beatCount ?? 0) * 0.01 + queueDepth * 0.05),
    };
  }
}
