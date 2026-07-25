/** Executive Trust Engine — trust is earned, never assumed (ADR-014) */

export interface ExecutiveTrustMetrics {
  executiveId: string;
  companyId: string;
  recommendationAccuracy: number; // 0–100
  acceptanceRate: number; // 0–100
  successRate: number; // 0–100
  decisionQuality: number; // 0–100
  confidenceAccuracy: number; // 0–100 — stated vs actual
  lessonsLearnedCount: number;
  founderSatisfaction?: number; // 0–100 when feedback provided
  trustScore: number; // 0–100 composite
  computedAt: string;
}

export interface TrustEventInput {
  executiveId: string;
  companyId: string;
  type:
    | "recommendation_submitted"
    | "recommendation_accepted"
    | "recommendation_rejected"
    | "recommendation_succeeded"
    | "recommendation_failed"
    | "confidence_calibrated"
    | "founder_feedback"
    | "lesson_learned";
  recommendationId?: string;
  metadata?: Record<string, unknown>;
}

export interface ExecutiveTrustEnginePort {
  getMetrics(executiveId: string, companyId: string): Promise<ExecutiveTrustMetrics>;
  recordEvent(input: TrustEventInput): Promise<ExecutiveTrustMetrics>;
  /** New executives start at baseline — never inherited marketing trust */
  getBaseline(): ExecutiveTrustMetrics;
}
