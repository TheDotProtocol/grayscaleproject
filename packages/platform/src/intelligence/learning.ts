/** Learning Engine — future platform pillar (interfaces only) */

export interface LearningOutcome {
  recommendationId: string;
  decisionId?: string;
  predictedOutcome?: string;
  actualOutcome?: string;
  success: boolean;
  founderFeedback?: string;
  measuredAt: string;
}

export interface DecisionQualityMetric {
  companyId: string;
  period: string;
  totalDecisions: number;
  successfulDecisions: number;
  qualityScore: number;
}

export interface LearningEnginePort {
  recordOutcome(outcome: LearningOutcome): Promise<void>;
  compareRecommendationToOutcome(recommendationId: string): Promise<LearningOutcome | null>;
  getDecisionQuality(companyId: string, period: string): Promise<DecisionQualityMetric>;
  captureFounderFeedback(recommendationId: string, feedback: string): Promise<void>;
}
