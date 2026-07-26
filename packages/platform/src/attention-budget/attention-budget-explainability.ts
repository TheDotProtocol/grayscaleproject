/** Attention Budget Explainability — every allocation must explain (Sprint 4 Phase C) */

export interface AttentionBudgetExplainability {
  actionId: string;
  action: string;
  why: string;
  triggerSource: string;
  category: string;
  affectedExecutives: string[];
  contextSwitchCost: number;
  durationMs: number;
  evidence: string[];
  version: string;
  correlationId: string;
  traceId: string;
  auditReference: string;
  recordedAt: string;
}
