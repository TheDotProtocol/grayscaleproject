/** Organizational Runtime — core contracts (Sprint 4 Phase A) */

export const ORGANIZATIONAL_RUNTIME_VERSION = "1.0.0";

export type RuntimeLifecycleStage =
  | "initializing"
  | "awake"
  | "operating"
  | "maintenance"
  | "sleeping"
  | "degraded"
  | "halted";

export type RuntimeScheduleMode =
  | "continuous"
  | "scheduled"
  | "event_driven"
  | "manual"
  | "maintenance"
  | "deferred"
  | "priority";

export type RuntimeId =
  | "context"
  | "executive"
  | "council"
  | "twin"
  | "simulation"
  | "forecast"
  | "memory"
  | "graph"
  | "strategy"
  | "signals"
  | "insights"
  | "mission-control"
  | "platform-operations";

export interface RuntimeState {
  runtimeId: RuntimeId;
  status: "idle" | "running" | "waiting" | "error";
  lastExecutedAt?: string;
  version: string;
}

export interface OrganizationalRuntimeSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  lifecycle: RuntimeLifecycleStage;
  heartbeat: RuntimeHeartbeatStatus;
  scheduler: RuntimeSchedulerStatus;
  health: RuntimeHealth;
  resources: RuntimeResourceMetrics;
  activeRuntimes: RuntimeState[];
  correlationId: string;
}

export interface RuntimeHeartbeatStatus {
  enabled: boolean;
  intervalSeconds: number;
  lastBeatAt?: string;
  nextBeatAt?: string;
  beatCount: number;
  lastCycleDurationMs: number;
  stable: boolean;
}

export interface RuntimeSchedulerStatus {
  queueDepth: number;
  pendingTasks: number;
  completedTasks: number;
  modes: RuntimeScheduleMode[];
}

export interface RuntimeHealth {
  status: "healthy" | "degraded" | "critical";
  score: number;
  checkedAt: string;
  issues: string[];
}

export interface RuntimeResourceMetrics {
  queueDepth: number;
  executionBacklog: number;
  executiveUtilization: number;
  councilUtilization: number;
  runtimeContention: number;
  processingLatencyMs: number;
  capacityTrend: "rising" | "stable" | "falling";
  cpuWorkloadProxy: number;
}

export interface RuntimeMetrics {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  heartbeatCount: number;
  tasksExecuted: number;
  tasksFailed: number;
  averageLatencyMs: number;
  orchestrationCount: number;
}

export interface RuntimeAuditEntry {
  entryId: string;
  action: string;
  runtimeId: RuntimeId;
  actorId: string;
  recordedAt: string;
  correlationId: string;
  traceId: string;
  details: Record<string, unknown>;
}

export interface RuntimeGovernancePolicy {
  id: string;
  label: string;
  enforced: boolean;
  source: "founder-constitution" | "architecture-lock" | "organizational-runtime";
}

export interface RuntimeTask {
  taskId: string;
  companyId: string;
  runtimeId: RuntimeId;
  mode: RuntimeScheduleMode;
  priority: number;
  label: string;
  scheduledAt: string;
  status: "pending" | "running" | "completed" | "failed" | "deferred";
  correlationId: string;
}

export interface RuntimeHeartbeatCycle {
  cycleId: string;
  companyId: string;
  startedAt: string;
  completedAt?: string;
  steps: RuntimeHeartbeatStep[];
  correlationId: string;
  traceId: string;
}

export interface RuntimeHeartbeatStep {
  stepId: string;
  label: string;
  runtimeId: RuntimeId;
  durationMs: number;
  success: boolean;
  skipped?: boolean;
}

export interface OrganizationalRuntimePort {
  getSnapshot(companyId: string): Promise<OrganizationalRuntimeSnapshot>;
  runHeartbeat(companyId: string, options?: { correlationId?: string }): Promise<RuntimeHeartbeatCycle>;
  getHealth(companyId: string): Promise<RuntimeHealth>;
  getMetrics(companyId: string): Promise<RuntimeMetrics>;
}
