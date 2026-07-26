/** Organizational Runtime ports — interface-first (Sprint 4 Phase A) */

import type {
  OrganizationalRuntimePort,
  OrganizationalRuntimeSnapshot,
  RuntimeAuditEntry,
  RuntimeGovernancePolicy,
  RuntimeHeartbeatCycle,
  RuntimeHealth,
  RuntimeMetrics,
  RuntimeResourceMetrics,
  RuntimeScheduleMode,
  RuntimeState,
  RuntimeTask,
} from "./organizational-runtime.js";

export type RuntimeCoordinatorPort = OrganizationalRuntimePort;

export interface RuntimeSchedulerPort {
  schedule(task: Omit<RuntimeTask, "taskId" | "status">): Promise<RuntimeTask>;
  list(companyId: string): Promise<RuntimeTask[]>;
  executeNext(companyId: string): Promise<RuntimeTask | undefined>;
  supportedModes(): RuntimeScheduleMode[];
}

export interface RuntimeHeartbeatPort {
  tick(companyId: string, options?: { correlationId?: string }): Promise<RuntimeHeartbeatCycle>;
  configure(companyId: string, intervalSeconds: number): Promise<{ intervalSeconds: number }>;
  getStatus(companyId: string): Promise<OrganizationalRuntimeSnapshot["heartbeat"]>;
}

export interface RuntimeHealthPort {
  assess(companyId: string): Promise<RuntimeHealth>;
}

export interface RuntimeResourceManagerPort {
  measure(companyId: string): Promise<RuntimeResourceMetrics>;
}

export interface RuntimeMetricsPort {
  collect(companyId: string): Promise<RuntimeMetrics>;
}

export interface RuntimeAuditPort {
  append(entry: Omit<RuntimeAuditEntry, "entryId">): Promise<RuntimeAuditEntry>;
  list(companyId: string, limit?: number): Promise<RuntimeAuditEntry[]>;
}

export interface RuntimeGovernancePort {
  policies(): Promise<RuntimeGovernancePolicy[]>;
  validateOrchestration(companyId: string): Promise<{ valid: boolean; violations: string[] }>;
}

export interface RuntimeEventCoordinatorPort {
  dispatch(companyId: string, eventType: string, payload: Record<string, unknown>): Promise<{ handled: boolean; runtimes: string[] }>;
}

export interface RuntimeTaskQueuePort {
  enqueue(task: Omit<RuntimeTask, "taskId" | "status">): Promise<RuntimeTask>;
  depth(companyId: string): Promise<number>;
}

export interface RuntimeCapacityPort {
  assess(companyId: string): Promise<{ capacity: number; utilization: number; trend: "rising" | "stable" | "falling" }>;
}

export interface RuntimeStatePort {
  list(companyId: string): Promise<RuntimeState[]>;
}

export interface RuntimeVersionPort {
  version(): Promise<{ runtime: string; heartbeat: string; scheduler: string }>;
}

export interface RuntimeContextPort {
  assemble(companyId: string): Promise<OrganizationalRuntimeSnapshot>;
}
