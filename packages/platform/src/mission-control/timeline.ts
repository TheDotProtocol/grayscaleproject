/** Operational Timeline — unified company history */

export interface OperationalTimelineEntry {
  id: string;
  companyId: string;
  type: string;
  category: string;
  title: string;
  summary?: string;
  source: string;
  status: string;
  occurredAt: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface OperationalTimelinePort {
  getTimeline(
    companyId: string,
    options?: { limit?: number; offset?: number; types?: string[] },
  ): Promise<OperationalTimelineEntry[]>;
}
