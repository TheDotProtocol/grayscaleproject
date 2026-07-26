import { Injectable } from "@nestjs/common";
import type { PolicyAuditEntry, PolicyDecision, PolicyExplainability, PolicyHistoryEntry } from "@grayscale/platform";

@Injectable()
export class PolicyEngineStoreService {
  readonly decisions = new Map<string, PolicyDecision>();
  readonly audit = new Map<string, PolicyAuditEntry>();
  readonly history = new Map<string, PolicyHistoryEntry[]>();
  readonly approvals = new Map<string, Array<{ approvalId: string; kind: "founder" | "council" | "executive"; actionRef: string; requestedAt: string }>>();
  readonly exceptions = new Map<string, Array<{ exceptionId: string; policyRef: string; reason: string; expiresAt?: string; immutable: true }>>();
  readonly explainability = new Map<string, PolicyExplainability>();

  newId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
