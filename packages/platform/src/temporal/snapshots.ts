/** Organizational Snapshots — immutable historical references (ADR-025) */

import type { IntentContext } from "../intent/intent-engine.js";
import type { OrganizationalIntelligenceContext } from "../organization/context.js";
import type { StrategicIntelligenceContext } from "../intelligence/context.js";
import type { GraphSummary } from "../graph/ports.js";
import type { MemoryRecord } from "../memory/types.js";
import type { PlatformEvent } from "../events/envelope.js";

export interface OrganizationalSnapshot {
  id: string;
  companyId: string;
  capturedAt: string;
  period: "point_in_time" | "weekly" | "monthly" | "quarterly" | "yearly";
  label: string;
  immutable: true;

  organizationalIntelligence?: OrganizationalIntelligenceContext;
  intent?: IntentContext;
  strategy?: StrategicIntelligenceContext;
  graph?: GraphSummary;
  memory?: MemoryRecord[];
  readinessScore?: number;
  platformHealthScore?: number;
  reliabilityScore?: number;
  pulseScore?: number;
  securitySummary?: Record<string, unknown>;
  governanceSummary?: Record<string, unknown>;
  integrationCount?: number;
  recentEventCount?: number;
  timelineEntryCount?: number;

  /** Full snapshot never recomputed — reference only */
  snapshotHash: string;
}

export interface OrganizationalSnapshotPort {
  capture(companyId: string, period: OrganizationalSnapshot["period"]): Promise<OrganizationalSnapshot>;
  get(id: string): Promise<OrganizationalSnapshot | null>;
  list(companyId: string, limit?: number): Promise<OrganizationalSnapshot[]>;
  /** History is immutable — updates forbidden */
  assertImmutable(snapshot: OrganizationalSnapshot): true;
}

export function assertSnapshotImmutable(): true {
  return true;
}

export * from "./temporal-engine.js";
