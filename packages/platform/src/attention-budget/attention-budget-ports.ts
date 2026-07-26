import type {
  AttentionAllocationSnapshot,
  AttentionBudgetHealth,
  AttentionBudgetMetrics,
  AttentionBudgetSnapshot,
  AttentionCapacitySnapshot,
  AttentionCategory,
  AttentionConsumptionSnapshot,
  AttentionDebtSnapshot,
  AttentionRecoverySnapshot,
} from "./organizational-attention-budget.js";
import type { AttentionBudgetAuditEntry } from "./attention-budget-audit.js";
import type { AttentionBudgetExplainability } from "./attention-budget-explainability.js";
import type { AttentionBudgetHistory } from "./attention-budget-history.js";

export interface AttentionBudgetPort {
  getSnapshot(companyId: string): Promise<AttentionBudgetSnapshot>;
  getHealth(companyId: string): Promise<AttentionBudgetHealth>;
  getMetrics(companyId: string): Promise<AttentionBudgetMetrics>;
}

export interface AttentionAllocatorPort {
  allocate(companyId: string, input: {
    category: AttentionCategory;
    weight: number;
    executiveId?: string;
    correlationId: string;
    triggerSource: string;
  }): Promise<AttentionAllocationSnapshot>;
  getAllocation(companyId: string): Promise<AttentionAllocationSnapshot>;
}

export interface AttentionConsumptionPort {
  measure(companyId: string): Promise<AttentionConsumptionSnapshot>;
}

export interface AttentionDebtPort {
  assess(companyId: string): Promise<AttentionDebtSnapshot>;
}

export interface AttentionCapacityPort {
  measure(companyId: string): Promise<AttentionCapacitySnapshot>;
}

export interface AttentionRecoveryPort {
  assess(companyId: string): Promise<AttentionRecoverySnapshot>;
}

export interface AttentionBudgetAuditPort {
  append(entry: Omit<AttentionBudgetAuditEntry, "entryId" | "recordedAt">): Promise<AttentionBudgetAuditEntry>;
  list(companyId: string): Promise<AttentionBudgetAuditEntry[]>;
}

export type AttentionBudgetExplainabilityPort = {
  explain(actionId: string): Promise<AttentionBudgetExplainability>;
  explainAllocation(companyId: string): Promise<AttentionBudgetExplainability>;
};

export interface AttentionBudgetHistoryPort {
  append(companyId: string, entry: Omit<AttentionBudgetHistory["entries"][0], "entryId">): Promise<void>;
  getHistory(companyId: string): Promise<AttentionBudgetHistory>;
}
