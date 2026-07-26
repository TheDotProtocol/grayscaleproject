import { Injectable } from "@nestjs/common";
import type { RuntimeExplainability, RuntimeHeartbeatCycle } from "@grayscale/platform";
import { ORGANIZATIONAL_RUNTIME_VERSION, RUNTIME_EXPLAINABILITY_VERSION } from "@grayscale/platform";
import { RuntimeStoreService } from "./runtime-store.service";

/** Runtime explainability — every orchestration action explained */
@Injectable()
export class RuntimeExplainabilityService {
  constructor(private readonly store: RuntimeStoreService) {}

  async recordHeartbeat(cycle: RuntimeHeartbeatCycle): Promise<RuntimeExplainability> {
    const explanation: RuntimeExplainability = {
      actionId: cycle.cycleId,
      companyId: cycle.companyId,
      version: RUNTIME_EXPLAINABILITY_VERSION,
      assembledAt: new Date().toISOString(),
      summary: `Heartbeat cycle ${cycle.cycleId} — ${cycle.steps.length} orchestration steps`,
      whyExecuted: "Scheduled organizational heartbeat maintains continuous operation",
      triggerSource: "heartbeat",
      dependencies: ["context", "signals", "memory", "graph", "twin", "simulation", "forecast"],
      affectedRuntimes: [...new Set(cycle.steps.map((s) => s.runtimeId))],
      durationMs: cycle.steps.reduce((s, step) => s + step.durationMs, 0),
      priority: 1,
      evidence: cycle.steps.map((s) => `${s.label}:${s.success}`),
      engineVersion: ORGANIZATIONAL_RUNTIME_VERSION,
      correlationId: cycle.correlationId,
      traceId: cycle.traceId,
      auditReference: cycle.cycleId,
    };
    this.store.explainability.set(cycle.cycleId, explanation);
    return explanation;
  }

  async explain(actionId: string): Promise<RuntimeExplainability> {
    const found = this.store.explainability.get(actionId);
    if (!found) throw new Error("Runtime action not found");
    return found;
  }

  async explainHeartbeat(cycleId: string): Promise<RuntimeExplainability> {
    return this.explain(cycleId);
  }
}
