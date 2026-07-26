import { Injectable } from "@nestjs/common";
import type { AttentionBudgetAuditEntry } from "@grayscale/platform";

@Injectable()
export class AttentionBudgetStoreService {
  readonly audit = new Map<string, AttentionBudgetAuditEntry>();
  readonly history = new Map<string, Array<{ entryId: string; action: string; summary: string; correlationId: string; version: string; recordedAt: string }>>();

  newId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}
