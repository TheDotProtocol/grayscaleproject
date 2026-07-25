/** Recovery Framework — AIP-36 */

export const RECOVERY_TYPES = [
  "replay",
  "retry",
  "rollback",
  "restore",
  "snapshot",
  "disaster_recovery",
  "platform_rebuild",
] as const;

export type RecoveryType = (typeof RECOVERY_TYPES)[number];

export const RECOVERY_STATUSES = ["pending", "running", "completed", "failed"] as const;
export type RecoveryStatus = (typeof RECOVERY_STATUSES)[number];

export interface RecoveryOperation {
  id: string;
  type: RecoveryType;
  subsystem: string;
  status: RecoveryStatus;
  parameters: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  initiatedBy?: string;
  startedAt: string;
  completedAt?: string;
}

export interface RecoveryPort {
  execute(type: RecoveryType, parameters: Record<string, unknown>, initiatedBy?: string): Promise<RecoveryOperation>;
  get(id: string): Promise<RecoveryOperation | null>;
  list(limit?: number): Promise<RecoveryOperation[]>;
}
