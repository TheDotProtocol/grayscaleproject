import type { CouncilIssueStatus, CouncilSessionStatus } from "./constitution.js";
import type { CouncilScheduleMode } from "./council-scheduling.js";

export interface CouncilSession {
  id: string;
  companyId: string;
  title: string;
  status: CouncilSessionStatus;
  scheduleMode?: CouncilScheduleMode;
  chairExecutiveId?: string;
  participatingExecutiveIds: string[];
  quorumRequired: number;
  correlationId: string;
  startedAt?: string;
  closedAt?: string;
  constitutionalCompliance: CouncilSessionCompliance;
}

export interface CouncilSessionCompliance {
  founderConstitution: boolean;
  councilConstitution: boolean;
  organizationalOperatingModel: boolean;
  architectureLock: boolean;
  checkedAt: string;
}

export interface CouncilIssue {
  id: string;
  companyId: string;
  sessionId: string;
  title: string;
  summary: string;
  domain: string;
  /** Decision class — MUST be set before deliberation begins (ADR-036) */
  decisionClass: string;
  classification?: { decisionClass: string; classifiedAt: string; correlationId: string };
  status: CouncilIssueStatus;
  urgency: "low" | "medium" | "high" | "critical";
  intentRef?: string;
  objectiveRef?: string;
  initiatingExecutiveId: string;
  correlationId: string;
  openedAt: string;
  resolvedAt?: string;
}

export interface CouncilEvidence {
  id: string;
  companyId: string;
  sessionId: string;
  issueId: string;
  submittedByExecutiveId: string;
  sourceType: "memory" | "graph" | "signal" | "insight" | "notebook" | "investigation" | "policy" | "constraint" | "other";
  sourceRef: string;
  summary: string;
  supportsPosition?: string;
  contradictsPosition?: string;
  recency?: string;
  correlationId: string;
  submittedAt: string;
}
