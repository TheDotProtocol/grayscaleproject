/** Organizational Decision Economy — contracts (Sprint 3 Phase D) */

import type { ForesightMetricDetail } from "../foresight/foresight-engine.js";

export const DECISION_ECONOMY_VERSION = "1.0.0";

export interface DecisionCost extends ForesightMetricDetail {
  estimatedHours: number;
  currencyEquivalent?: number;
}

export interface DecisionDebt extends ForesightMetricDetail {
  deferredDecisions: number;
  oldestDays: number;
}

export interface DecisionVelocity extends ForesightMetricDetail {
  decisionsPerWeek: number;
}

export interface DecisionRoi extends ForesightMetricDetail {
  score: number;
}

export interface DecisionComplexity extends ForesightMetricDetail {
  score: number;
  factors: string[];
}

export interface DecisionConfidenceMetric extends ForesightMetricDetail {
  score: number;
}

export interface DecisionQuality extends ForesightMetricDetail {
  score: number;
}

export interface OpportunityCost extends ForesightMetricDetail {
  score: number;
  deferredOpportunities: string[];
}

export interface AttentionCost extends ForesightMetricDetail {
  cognitiveSlots: number;
}

export interface FounderBandwidth extends ForesightMetricDetail {
  utilization: number;
  pendingActions: number;
}

export interface ExecutiveBandwidth extends ForesightMetricDetail {
  utilization: number;
  executiveCount: number;
}

export interface RiskReduction extends ForesightMetricDetail {
  score: number;
}

export interface OrganizationalDecisionEconomy {
  companyId: string;
  assembledAt: string;
  version: string;
  decisionCost: DecisionCost;
  decisionDebt: DecisionDebt;
  decisionVelocity: DecisionVelocity;
  decisionRoi: DecisionRoi;
  decisionComplexity: DecisionComplexity;
  decisionConfidence: DecisionConfidenceMetric;
  decisionQuality: DecisionQuality;
  opportunityCost: OpportunityCost;
  attentionCost: AttentionCost;
  founderBandwidth: FounderBandwidth;
  executiveBandwidth: ExecutiveBandwidth;
  riskReduction: RiskReduction;
}

export interface OrganizationalDecisionEconomyPort {
  assess(companyId: string): Promise<OrganizationalDecisionEconomy>;
}
