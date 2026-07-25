import type { RecommendationEvidence } from "../intelligence/recommendations.js";
import type { ConfidenceSource } from "../intelligence/types.js";

/** Explainability framework — no opaque reasoning */

export interface ExplainabilityEvidence {
  memoryRefs: { id: string; summary: string }[];
  eventRefs: { id: string; type: string; summary: string }[];
  graphRefs: { nodeId: string; relationship: string; summary: string }[];
  metrics?: Record<string, unknown>;
}

export interface ExecutiveExplainability {
  reason: string;
  evidence: ExplainabilityEvidence;
  confidence: number;
  confidenceSources: ConfidenceSource[];
  risk: {
    level: "low" | "medium" | "high" | "critical";
    summary: string;
    assessmentIds?: string[];
  };
  dependencies: string[];
  alternatives: { title: string; summary: string; tradeoffs: string }[];
  policyUsed?: string[];
  constraintsUsed?: string[];
  decisionPath: string[];
}

export interface ExecutiveOutput {
  id: string;
  companyId: string;
  executiveId: string;
  instanceId: string;
  outputType: string;
  title: string;
  summary: string;
  explainability: ExecutiveExplainability;
  payload: Record<string, unknown>;
  correlationId: string;
  traceId?: string;
  createdAt: string;
}

export interface CreateExecutiveOutputInput {
  companyId: string;
  executiveId: string;
  instanceId: string;
  outputType: string;
  title: string;
  summary: string;
  explainability: ExecutiveExplainability;
  payload?: Record<string, unknown>;
  correlationId: string;
  traceId?: string;
}

export function createExplainability(
  partial: Partial<ExecutiveExplainability> & Pick<ExecutiveExplainability, "reason">,
): ExecutiveExplainability {
  return {
    reason: partial.reason,
    evidence: partial.evidence ?? { memoryRefs: [], eventRefs: [], graphRefs: [] },
    confidence: partial.confidence ?? 0.5,
    confidenceSources: partial.confidenceSources ?? [],
    risk: partial.risk ?? { level: "low", summary: "No significant risk identified" },
    dependencies: partial.dependencies ?? [],
    alternatives: partial.alternatives ?? [],
    policyUsed: partial.policyUsed,
    constraintsUsed: partial.constraintsUsed,
    decisionPath: partial.decisionPath ?? [],
  };
}

export type { RecommendationEvidence };
