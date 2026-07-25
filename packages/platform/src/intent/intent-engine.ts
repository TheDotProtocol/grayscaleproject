/** Organizational Intent Engine — WHY something exists (ADR-023) */

import type { EngineEvidenceRef, EngineLinkRef, VersionedEngineRecord } from "../organization/common.js";

export const INTENT_HIERARCHY_LEVELS = [
  "vision",
  "mission",
  "intent",
  "strategic_theme",
  "goal",
  "objective",
  "project",
  "task",
  "recommendation",
  "execution",
] as const;

export type IntentHierarchyLevel = (typeof INTENT_HIERARCHY_LEVELS)[number];

export interface IntentRecord extends VersionedEngineRecord {
  level: IntentHierarchyLevel;
  title: string;
  statement: string;
  rationale: string;
  parentIntentId?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
  evidence: EngineEvidenceRef[];
  links: EngineLinkRef;
  confidence: number;
  coverage?: number;
  approvalStatus: "draft" | "pending" | "approved" | "superseded";
  approvedBy?: string;
  approvedAt?: string;
  metrics?: IntentMetrics;
  evolutionHistory: Array<{ version: number; changedAt: string; summary: string }>;
}

export interface IntentMetrics {
  coveragePercent: number;
  linkedGoals: number;
  linkedObjectives: number;
  linkedProjects: number;
  traceDepth: number;
}

export interface IntentHierarchyNode {
  intent: IntentRecord;
  children: IntentHierarchyNode[];
}

export interface IntentContext {
  companyId: string;
  assembledAt: string;
  rootIntents: IntentHierarchyNode[];
  coverage: IntentCoverage;
  snapshot?: IntentSnapshot;
}

export interface IntentCoverage {
  totalStrategicObjects: number;
  linkedToIntent: number;
  coveragePercent: number;
  unlinkedEntityIds: string[];
}

export interface IntentSnapshot {
  companyId: string;
  capturedAt: string;
  hierarchy: IntentHierarchyNode[];
  coverage: IntentCoverage;
}

export interface IntentEnginePort {
  readonly engineId: "organizational-intent";
  get(companyId: string, intentId: string): Promise<IntentRecord | null>;
  getHierarchy(companyId: string): Promise<IntentHierarchyNode[]>;
  getContext(companyId: string): Promise<IntentContext>;
  propose(input: Omit<IntentRecord, "id" | "version" | "createdAt" | "updatedAt" | "evolutionHistory">): Promise<IntentRecord>;
  approve(companyId: string, intentId: string, approverId: string): Promise<IntentRecord>;
  validateTrace(companyId: string, entityType: string, entityId: string): Promise<{ valid: boolean; chain: IntentRecord[] }>;
  getCoverage(companyId: string): Promise<IntentCoverage>;
  captureSnapshot(companyId: string): Promise<IntentSnapshot>;
}

export interface IntentProjectorPort {
  readonly name: "intent-projector";
  projectIntentChange(event: { companyId: string; intentId: string; action: string }): Promise<void>;
}
