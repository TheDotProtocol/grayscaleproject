/** Activity Center — RC1 Track B */

export interface ActivityCenterEntry {
  id: string;
  companyId: string;
  actor: string;
  actorType: "founder" | "executive" | "system" | "council";
  action: string;
  target: string;
  reason?: string;
  evidence?: string[];
  confidence?: number;
  occurredAt: string;
  correlationId?: string;
  auditable: true;
}

export interface ActivityCenterFeed {
  companyId: string;
  entries: ActivityCenterEntry[];
  assembledAt: string;
}

export interface ActivityCenterPort {
  getFeed(companyId: string, options?: { limit?: number }): Promise<ActivityCenterFeed>;
}
