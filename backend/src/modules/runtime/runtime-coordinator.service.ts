import { Injectable } from "@nestjs/common";
import type {
  OrganizationalRuntimeSnapshot,
  RuntimeHealth,
  RuntimeHeartbeatCycle,
  RuntimeMetrics,
  RuntimeState,
} from "@grayscale/platform";
import { ORGANIZATIONAL_RUNTIME_VERSION } from "@grayscale/platform";
import { RuntimeHeartbeatService } from "./runtime-heartbeat.service";
import { RuntimeSchedulerService } from "./runtime-scheduler.service";
import { RuntimeResourceManagerService } from "./runtime-resource-manager.service";
import { RuntimeStoreService } from "./runtime-store.service";

const REGISTERED_RUNTIMES: RuntimeState[] = [
  { runtimeId: "context", status: "idle", version: "1.0", lastExecutedAt: undefined },
  { runtimeId: "executive", status: "idle", version: "1.0" },
  { runtimeId: "council", status: "idle", version: "1.0" },
  { runtimeId: "twin", status: "idle", version: "1.0" },
  { runtimeId: "simulation", status: "idle", version: "1.0" },
  { runtimeId: "forecast", status: "idle", version: "1.0" },
  { runtimeId: "memory", status: "idle", version: "1.0" },
  { runtimeId: "graph", status: "idle", version: "1.0" },
  { runtimeId: "strategy", status: "idle", version: "1.0" },
  { runtimeId: "signals", status: "idle", version: "1.0" },
  { runtimeId: "insights", status: "idle", version: "1.0" },
  { runtimeId: "mission-control", status: "idle", version: "1.0" },
  { runtimeId: "platform-operations", status: "idle", version: "1.0" },
];

/** Organizational Runtime Coordinator — orchestrates, never reasons */
@Injectable()
export class RuntimeCoordinatorService {
  constructor(
    private readonly heartbeat: RuntimeHeartbeatService,
    private readonly scheduler: RuntimeSchedulerService,
    private readonly resources: RuntimeResourceManagerService,
    private readonly store: RuntimeStoreService,
  ) {}

  async getSnapshot(companyId: string, correlationId?: string): Promise<OrganizationalRuntimeSnapshot> {
    const cfg = this.heartbeat.getConfig(companyId);
    const tasks = await this.scheduler.list(companyId);
    const resources = await this.resources.measure(companyId);
    const health = await this.getHealth(companyId);

    const intervalMs = cfg.intervalSeconds * 1000;

    return {
      companyId,
      assembledAt: new Date().toISOString(),
      version: ORGANIZATIONAL_RUNTIME_VERSION,
      lifecycle: health.status === "healthy" ? "operating" : "degraded",
      heartbeat: {
        enabled: true,
        intervalSeconds: cfg.intervalSeconds,
        lastBeatAt: cfg.lastBeatAt,
        nextBeatAt: cfg.lastBeatAt ? new Date(new Date(cfg.lastBeatAt).getTime() + intervalMs).toISOString() : undefined,
        beatCount: cfg.beatCount,
        lastCycleDurationMs: 0,
        stable: cfg.beatCount > 0,
      },
      scheduler: {
        queueDepth: resources.queueDepth,
        pendingTasks: tasks.filter((t) => t.status === "pending").length,
        completedTasks: tasks.filter((t) => t.status === "completed").length,
        modes: this.scheduler.supportedModes(),
      },
      health,
      resources,
      activeRuntimes: REGISTERED_RUNTIMES.map((r) => ({
        ...r,
        lastExecutedAt: cfg.lastBeatAt,
        status: r.runtimeId === "context" && cfg.beatCount > 0 ? "running" as const : "idle",
      })),
      correlationId: correlationId ?? crypto.randomUUID(),
    };
  }

  async runHeartbeat(companyId: string, options?: { correlationId?: string }): Promise<RuntimeHeartbeatCycle> {
    return this.heartbeat.tick(companyId, options);
  }

  async getHealth(companyId: string): Promise<RuntimeHealth> {
    const cfg = this.heartbeat.getConfig(companyId);
    const queueDepth = this.scheduler.queueDepth(companyId);
    const issues: string[] = [];
    if (queueDepth > 20) issues.push("queue_depth_elevated");
    if (cfg.beatCount === 0) issues.push("no_heartbeat_yet");

    const score = issues.length === 0 ? 0.95 : issues.length === 1 ? 0.75 : 0.5;
    return {
      status: score >= 0.9 ? "healthy" : score >= 0.6 ? "degraded" : "critical",
      score,
      checkedAt: new Date().toISOString(),
      issues,
    };
  }

  async getMetrics(companyId: string): Promise<RuntimeMetrics> {
    const cfg = this.heartbeat.getConfig(companyId);
    const tasks = await this.scheduler.list(companyId);
    const now = new Date().toISOString();
    return {
      companyId,
      periodStart: cfg.lastBeatAt ?? now,
      periodEnd: now,
      heartbeatCount: cfg.beatCount,
      tasksExecuted: tasks.filter((t) => t.status === "completed").length,
      tasksFailed: tasks.filter((t) => t.status === "failed").length,
      averageLatencyMs: 50,
      orchestrationCount: cfg.beatCount,
    };
  }
}
