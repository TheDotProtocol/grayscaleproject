/** Executive Deliberation Engine — deterministic 12-stage pipeline (Sprint 4 Phase B) */

import type { RuntimeId } from "../runtime/organizational-runtime.js";

export const DELIBERATION_STAGES = [
  "observation",
  "evidence_collection",
  "discussion",
  "challenge",
  "counter_evidence",
  "alternative_generation",
  "consensus_measurement",
  "founder_policy_validation",
  "constraint_validation",
  "recommendation_draft",
  "explainability_review",
  "certification",
] as const;

export type DeliberationStage = (typeof DELIBERATION_STAGES)[number];

export interface DeliberationStageRecord {
  stage: DeliberationStage;
  stageIndex: number;
  startedAt: string;
  completedAt?: string;
  success: boolean;
  evidence: string[];
  correlationId: string;
}

export interface ExecutiveDeliberationProposal {
  proposalId: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  initiatingExecutiveId: string;
  currentStage: DeliberationStage;
  currentStageIndex: number;
  completedStages: DeliberationStage[];
  stageRecords: DeliberationStageRecord[];
  status: "in_progress" | "completed" | "blocked" | "escalated";
  correlationId: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutiveDeliberationPort {
  startProposal(input: {
    companyId: string;
    sessionId: string;
    issueId: string;
    initiatingExecutiveId: string;
    correlationId: string;
  }): Promise<ExecutiveDeliberationProposal>;
  advanceStage(proposalId: string, evidence?: string[]): Promise<ExecutiveDeliberationProposal>;
  getProposal(proposalId: string): Promise<ExecutiveDeliberationProposal | null>;
  listActive(companyId: string): Promise<ExecutiveDeliberationProposal[]>;
  canSkipStage(_stage: DeliberationStage): false;
}

export function nextDeliberationStage(current: DeliberationStage): DeliberationStage | null {
  const idx = DELIBERATION_STAGES.indexOf(current);
  if (idx < 0 || idx >= DELIBERATION_STAGES.length - 1) return null;
  return DELIBERATION_STAGES[idx + 1]!;
}

export function isDeliberationComplete(stages: DeliberationStage[]): boolean {
  return DELIBERATION_STAGES.every((s) => stages.includes(s));
}

export const DELIBERATION_RUNTIME_ID: RuntimeId = "council";
