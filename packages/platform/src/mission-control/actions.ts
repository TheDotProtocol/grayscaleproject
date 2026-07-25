/** Operations Center Actions — AIP-30 (all async via platform jobs) */

export const ACTION_CATEGORIES = [
  "recommendation",
  "goal",
  "task",
  "meeting",
  "notification",
  "plugin",
  "integration",
  "executive",
  "quick",
] as const;

export type ActionCategory = (typeof ACTION_CATEGORIES)[number];

export const PLATFORM_JOB_STATUSES = [
  "pending",
  "running",
  "completed",
  "failed",
] as const;

export type PlatformJobStatus = (typeof PLATFORM_JOB_STATUSES)[number];

export interface PlatformActionDefinition {
  id: string;
  name: string;
  category: ActionCategory;
  capabilityId: string;
  permission: string;
  inputSchema: Record<string, unknown>;
  description?: string;
}

export interface PlatformJob {
  id: string;
  companyId: string;
  actionId: string;
  status: PlatformJobStatus;
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  userId?: string;
  correlationId: string;
  createdAt: string;
  completedAt?: string;
}

export interface ActionDispatchPort {
  dispatch(
    companyId: string,
    actionId: string,
    payload: Record<string, unknown>,
    userId?: string,
  ): Promise<PlatformJob>;
  getJob(jobId: string): Promise<PlatformJob | null>;
  listActions(filters?: { category?: ActionCategory }): PlatformActionDefinition[];
}
