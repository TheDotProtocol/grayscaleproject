import { Injectable } from "@nestjs/common";
import type { RuntimeAuditEntry, RuntimeExplainability, RuntimeTask } from "@grayscale/platform";

/** In-memory runtime store — Sprint 4 Phase A */
@Injectable()
export class RuntimeStoreService {
  readonly tasks = new Map<string, RuntimeTask>();
  readonly audit = new Map<string, RuntimeAuditEntry[]>();
  readonly heartbeatConfig = new Map<string, { intervalSeconds: number; beatCount: number; lastBeatAt?: string }>();
  readonly explainability = new Map<string, RuntimeExplainability>();
  readonly executedTaskIds = new Set<string>();

  taskKey(companyId: string, taskId: string): string {
    return `${companyId}:${taskId}`;
  }

  newId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
