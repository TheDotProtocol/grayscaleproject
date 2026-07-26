/** Organizational Attention Budget — core contracts (Sprint 4 Phase C) */

export const ATTENTION_BUDGET_VERSION = "1.0.0";

export type AttentionCategory =
  | "strategic"
  | "operational"
  | "innovation"
  | "crisis"
  | "emergency"
  | "opportunity"
  | "founder"
  | "executive";

export interface AttentionBudgetSnapshot {
  companyId: string;
  assembledAt: string;
  version: string;
  totalCapacity: number;
  allocated: number;
  remaining: number;
  unit: "cognitive_slots";
  correlationId: string;
}

export interface AttentionCapacitySnapshot {
  companyId: string;
  totalSlots: number;
  usedSlots: number;
  utilizationPercent: number;
  saturationStatus: "healthy" | "elevated" | "critical" | "overload" | "starvation";
  trend: "rising" | "stable" | "falling";
  assessedAt: string;
}

export interface AttentionDebtSnapshot {
  companyId: string;
  debtUnits: number;
  deferredItems: number;
  oldestDeferredDays: number;
  domains: string[];
  accumulating: boolean;
  assessedAt: string;
}

export interface AttentionRecoverySnapshot {
  companyId: string;
  recoveryRate: number;
  estimatedRecoveryDays: number;
  fatigueLevel: number;
  recommendedActions: string[];
  assessedAt: string;
}

export interface AttentionConsumptionSnapshot {
  companyId: string;
  byCategory: Record<AttentionCategory, number>;
  byExecutive: Array<{ executiveId: string; consumed: number }>;
  contextSwitchCost: number;
  interruptionCost: number;
  assessedAt: string;
}

export interface AttentionBudgetHealth {
  companyId: string;
  score: number;
  status: "healthy" | "degraded" | "critical";
  issues: string[];
  assessedAt: string;
}

export interface AttentionAllocationSnapshot {
  companyId: string;
  allocations: Array<{
    category: AttentionCategory;
    weight: number;
    executiveId?: string;
    explainable: true;
  }>;
  strategicConcentration: number;
  operationalNoiseRatio: number;
  assessedAt: string;
}

export interface AttentionBudgetMetrics {
  companyId: string;
  periodStart: string;
  periodEnd: string;
  allocationsProcessed: number;
  contextSwitches: number;
  debtAccumulated: number;
  debtRecovered: number;
  averageLatencyMs: number;
}
