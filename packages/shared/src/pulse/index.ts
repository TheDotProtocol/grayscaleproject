import type { DomainEvent } from "../events/index.js";
import { DOMAIN_EVENTS } from "../events/index.js";

/**
 * The Pulse Engine — operational heartbeat events.
 * Every capability emits pulses; Mission Control subscribes for company health.
 */
export const PULSE_EVENTS = {
  PROJECT_UPDATED: "project.updated",
  BILL_DUE: "bill.due",
  SPRINT_COMPLETED: "sprint.completed",
  REPOSITORY_CHANGED: "repository.changed",
  MEETING_ADDED: "meeting.added",
  INTEGRATION_FAILED: "integration.failed",
  AI_RECOMMENDATION_CREATED: "ai.recommendation.created",
} as const;

export type PulseEventType = (typeof PULSE_EVENTS)[keyof typeof PULSE_EVENTS];

export type PulseSeverity = "info" | "success" | "warning" | "critical";
export type PulseCategory =
  | "project"
  | "billing"
  | "sprint"
  | "repository"
  | "meeting"
  | "integration"
  | "ai"
  | "system";

/** Persisted heartbeat — stored by Pulse Engine, consumed by Mission Control */
export interface PulseHeartbeat {
  id: string;
  companyId: string;
  type: PulseEventType;
  domainType?: string;
  title: string;
  summary?: string;
  severity: PulseSeverity;
  category: PulseCategory;
  payload: Record<string, unknown>;
  correlationId: string;
  source: string;
  timestamp: string;
}

export interface CompanyPulseHealth {
  companyId: string;
  score: number;
  status: "healthy" | "attention" | "critical";
  lastPulseAt: string | null;
  counts: {
    last24h: number;
    critical: number;
    warning: number;
  };
  byCategory: Record<PulseCategory, number>;
  recent: PulseHeartbeat[];
}

/** Maps internal domain events → founder-facing pulse heartbeats */
export function domainEventToPulse(event: DomainEvent): Omit<
  PulseHeartbeat,
  "id" | "timestamp"
> | null {
  const base = {
    companyId: event.companyId,
    domainType: event.type,
    correlationId: event.metadata.correlationId,
    source: event.metadata.source,
    payload: event.payload as Record<string, unknown>,
  };

  switch (event.type) {
    case DOMAIN_EVENTS.MEMORY_CREATED:
    case DOMAIN_EVENTS.MEMORY_UPDATED:
    case DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED:
      return {
        ...base,
        type: PULSE_EVENTS.PROJECT_UPDATED,
        title: "Project updated",
        summary: pulseSummary(event, "Company memory or journal changed"),
        severity: "info",
        category: "project",
      };

    case DOMAIN_EVENTS.BILL_DUE_SOON:
    case DOMAIN_EVENTS.BILL_OVERDUE:
      return {
        ...base,
        type: PULSE_EVENTS.BILL_DUE,
        title: "Bill due",
        summary: pulseSummary(event, "Upcoming or overdue bill"),
        severity: event.type === DOMAIN_EVENTS.BILL_OVERDUE ? "critical" : "warning",
        category: "billing",
      };

    case DOMAIN_EVENTS.INTEGRATION_SYNC_COMPLETED:
      return {
        ...base,
        type: PULSE_EVENTS.REPOSITORY_CHANGED,
        title: "Repository changed",
        summary: pulseSummary(event, "Integration sync completed"),
        severity: "success",
        category: "repository",
      };

    case DOMAIN_EVENTS.INTEGRATION_SYNC_FAILED:
      return {
        ...base,
        type: PULSE_EVENTS.INTEGRATION_FAILED,
        title: "Integration failed",
        summary: pulseSummary(event, "Integration sync failed"),
        severity: "critical",
        category: "integration",
      };

    case DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED:
      return {
        ...base,
        type: PULSE_EVENTS.AI_RECOMMENDATION_CREATED,
        title: "AI recommendation created",
        summary: pulseSummary(event, "Executive agent produced a recommendation"),
        severity: "info",
        category: "ai",
      };

    case DOMAIN_EVENTS.TIMELINE_EVENT_CREATED: {
      const payload = event.payload as { eventType?: string; title?: string };
      if (payload.eventType === "meeting") {
        return {
          ...base,
          type: PULSE_EVENTS.MEETING_ADDED,
          title: "Meeting added",
          summary: payload.title ?? "New meeting on timeline",
          severity: "info",
          category: "meeting",
        };
      }
      return {
        ...base,
        type: PULSE_EVENTS.PROJECT_UPDATED,
        title: "Project updated",
        summary: payload.title ?? "Timeline event recorded",
        severity: "info",
        category: "project",
      };
    }

    case DOMAIN_EVENTS.SPRINT_COMPLETED:
      return {
        ...base,
        type: PULSE_EVENTS.SPRINT_COMPLETED,
        title: "Sprint completed",
        summary: pulseSummary(event, "Sprint milestone reached"),
        severity: "success",
        category: "sprint",
      };

    default:
      return null;
  }
}

function pulseSummary(event: DomainEvent, fallback: string): string {
  const p = event.payload as Record<string, unknown>;
  if (typeof p.title === "string") return p.title;
  if (typeof p.name === "string") return p.name;
  if (typeof p.summary === "string") return p.summary;
  return fallback;
}

export function createPulseHeartbeat(
  input: Omit<PulseHeartbeat, "id" | "timestamp">,
): PulseHeartbeat {
  return {
    ...input,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
}
