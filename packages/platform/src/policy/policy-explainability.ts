/** Policy Engine Explainability (Sprint 4 Phase D) */

import type { PolicyVerdict } from "./organizational-policy-engine.js";

export interface PolicyExplainability {
  decisionId: string;
  action: string;
  why: string;
  verdict: PolicyVerdict;
  policiesEvaluated: string[];
  constraintsChecked: string[];
  approvalsRequired: string[];
  evidenceRequired: boolean;
  defaultDenyApplied: boolean;
  constitutionalSources: string[];
  version: string;
  correlationId: string;
  traceId: string;
  auditReference: string;
  recordedAt: string;
}
