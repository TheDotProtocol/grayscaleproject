import type { CouncilDecisionLifecycleStage } from "./constitution.js";

export interface CouncilHistoryEntry {
  id: string;
  companyId: string;
  entryType: "session" | "issue" | "vote" | "resolution" | "decision" | "override" | "escalation";
  refId: string;
  summary: string;
  correlationId: string;
  recordedAt: string;
}

export interface CouncilHistory {
  companyId: string;
  entries: CouncilHistoryEntry[];
  from: string;
  to: string;
}

export interface CouncilAuditEntry {
  id: string;
  companyId: string;
  sessionId?: string;
  checkType: string;
  passed: boolean;
  evidence: string;
  correlationId: string;
  auditedAt: string;
}

export interface CouncilAudit {
  companyId: string;
  sessionId?: string;
  entries: CouncilAuditEntry[];
  overallCompliant: boolean;
  generatedAt: string;
}

export interface CouncilReplayEvent {
  sequence: number;
  eventType: string;
  payload: Record<string, unknown>;
  correlationId: string;
  occurredAt: string;
}

export interface CouncilReplay {
  companyId: string;
  sessionId: string;
  events: CouncilReplayEvent[];
  reconstructedAt: string;
}

export function isCouncilLifecycleComplete(
  completedStages: CouncilDecisionLifecycleStage[],
): boolean {
  const required: CouncilDecisionLifecycleStage[] = [
    "issue",
    "evidence_collection",
    "discovery",
    "deliberation",
    "challenge",
    "consensus",
    "explanation",
  ];
  return required.every((s) => completedStages.includes(s));
}
