/** Continuous Executive Council — scheduling contracts (Sprint 4 Phase B) */

export const COUNCIL_RUNTIME_VERSION = "2.0.0";

export type CouncilScheduleMode =
  | "continuous"
  | "scheduled"
  | "event_driven"
  | "manual"
  | "founder_requested"
  | "emergency"
  | "policy_triggered";

export interface CouncilScheduleTask {
  taskId: string;
  companyId: string;
  mode: CouncilScheduleMode;
  sessionId?: string;
  priority: number;
  status: "pending" | "running" | "completed" | "failed";
  scheduledAt: string;
  executedAt?: string;
  correlationId: string;
  triggerSource: string;
}

export interface CouncilSchedulerStatus {
  companyId: string;
  modes: CouncilScheduleMode[];
  queueDepth: number;
  activeSessions: number;
  nextScheduledAt?: string;
  runtimeOwned: true;
}

export interface CouncilSchedulerPort {
  supportedModes(): CouncilScheduleMode[];
  schedule(input: Omit<CouncilScheduleTask, "taskId" | "status">): Promise<CouncilScheduleTask>;
  list(companyId: string): Promise<CouncilScheduleTask[]>;
  getStatus(companyId: string): Promise<CouncilSchedulerStatus>;
}
