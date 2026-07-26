/** Unified organizational timeline — RC1 Track B */

export type OrganizationalTimelineCategory =
  | "mission_control"
  | "executive_discovery"
  | "council"
  | "learning"
  | "wisdom"
  | "strategy"
  | "forecast"
  | "simulation"
  | "reflection"
  | "evolution"
  | "founder_override"
  | "automation"
  | "platform";

export interface OrganizationalTimelineEntry {
  id: string;
  companyId: string;
  category: OrganizationalTimelineCategory;
  title: string;
  summary?: string;
  occurredAt: string;
  source: string;
  correlationId?: string;
  executiveId?: string;
  evidence?: string[];
  confidence?: number;
}

export interface OrganizationalTimelinePort {
  getUnifiedTimeline(companyId: string, options?: { limit?: number; categories?: OrganizationalTimelineCategory[] }): Promise<OrganizationalTimelineEntry[]>;
}
