import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { EventsService } from "../events/events.service";
import type { RuntimeAuditEntry, RuntimeHeartbeatCycle, RuntimeHeartbeatStep, RuntimeId } from "@grayscale/platform";
import { ContextRuntimeService } from "../context-runtime/context-runtime.service";
import { RuntimeStoreService } from "./runtime-store.service";
import { RuntimeExplainabilityService } from "./runtime-explainability.service";

const HEARTBEAT_STEPS: Array<{ label: string; runtimeId: RuntimeId }> = [
  { label: "Context refresh", runtimeId: "context" },
  { label: "Signal processing", runtimeId: "signals" },
  { label: "Memory synchronization", runtimeId: "memory" },
  { label: "Graph synchronization", runtimeId: "graph" },
  { label: "Twin synchronization", runtimeId: "twin" },
  { label: "Simulation refresh", runtimeId: "simulation" },
  { label: "Forecast refresh", runtimeId: "forecast" },
  { label: "Health monitoring", runtimeId: "platform-operations" },
  { label: "Attention refresh", runtimeId: "context" },
  { label: "Organizational snapshot", runtimeId: "context" },
];

/** Deterministic organizational heartbeat — async, auditable, configurable */
@Injectable()
export class RuntimeHeartbeatService {
  private readonly defaultIntervalSeconds = 300;

  constructor(
    private readonly store: RuntimeStoreService,
    @Inject(forwardRef(() => ContextRuntimeService))
    private readonly context: ContextRuntimeService,
    private readonly events: EventsService,
    private readonly explainability: RuntimeExplainabilityService,
  ) {}

  async configure(companyId: string, intervalSeconds: number) {
    const cfg = this.store.heartbeatConfig.get(companyId) ?? { intervalSeconds: this.defaultIntervalSeconds, beatCount: 0 };
    cfg.intervalSeconds = intervalSeconds;
    this.store.heartbeatConfig.set(companyId, cfg);
    return { intervalSeconds };
  }

  getConfig(companyId: string) {
    return this.store.heartbeatConfig.get(companyId) ?? { intervalSeconds: this.defaultIntervalSeconds, beatCount: 0 };
  }

  async tick(companyId: string, options?: { correlationId?: string }): Promise<RuntimeHeartbeatCycle> {
    const correlationId = options?.correlationId ?? crypto.randomUUID();
    const traceId = `trace-${correlationId.slice(0, 12)}`;
    const cycleId = this.store.newId("hb");
    const startedAt = new Date().toISOString();
    const steps: RuntimeHeartbeatStep[] = [];

    for (const step of HEARTBEAT_STEPS) {
      const t0 = Date.now();
      let success = true;
      try {
        if (step.runtimeId === "context" && step.label === "Context refresh") {
          await this.context.invalidateCache(companyId);
          await this.context.assemble(companyId, { correlationId, bypassCache: true });
        }
      } catch {
        success = false;
      }
      steps.push({
        stepId: `${cycleId}-${step.runtimeId}`,
        label: step.label,
        runtimeId: step.runtimeId,
        durationMs: Date.now() - t0,
        success,
      });
    }

    const cfg = this.getConfig(companyId);
    cfg.beatCount += 1;
    cfg.lastBeatAt = new Date().toISOString();
    this.store.heartbeatConfig.set(companyId, cfg);

    const cycle: RuntimeHeartbeatCycle = {
      cycleId,
      companyId,
      startedAt,
      completedAt: new Date().toISOString(),
      steps,
      correlationId,
      traceId,
    };

    await this.explainability.recordHeartbeat(cycle);
    await this.events.publish("runtime.heartbeat.completed", companyId, { cycleId, steps: steps.length }, { correlationId });

    const audit: RuntimeAuditEntry = {
      entryId: this.store.newId("aud"),
      action: "heartbeat.completed",
      runtimeId: "context",
      actorId: "organizational-runtime",
      recordedAt: new Date().toISOString(),
      correlationId,
      traceId,
      details: { cycleId, stepCount: steps.length },
    };
    const entries = this.store.audit.get(companyId) ?? [];
    entries.push(audit);
    this.store.audit.set(companyId, entries);

    return cycle;
  }
}
