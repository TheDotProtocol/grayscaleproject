import type { PlatformEvent, MemoryRecordInput, MemoryType } from "@grayscale/platform";
import {
  DOMAIN_EVENTS,
  MEMORY_SOURCE_TABLES,
} from "@grayscale/platform";

type MemoryEventMapping =
  | { action: "upsert"; input: MemoryRecordInput }
  | { action: "remove"; sourceTable: string; sourceId: string }
  | { action: "skip" };

/** Maps domain events → memory index operations */
export function mapEventToMemoryIndex(event: PlatformEvent): MemoryEventMapping {
  const payload = event.payload as Record<string, unknown>;

  switch (event.type) {
    case DOMAIN_EVENTS.MEMORY_CREATED:
    case DOMAIN_EVENTS.MEMORY_UPDATED: {
      const memory = payload as {
        id: string;
        title: string;
        content?: string;
        summary?: string | null;
        tags?: string[];
        source?: string;
        metadata?: Record<string, unknown>;
        createdAt?: string | Date;
        updatedAt?: string | Date;
      };
      const memoryType = resolveNoteMemoryType(memory.source, memory.metadata);
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType,
          sourceTable: MEMORY_SOURCE_TABLES.MEMORIES,
          sourceId: memory.id,
          title: memory.title,
          summary: memory.summary ?? truncate(memory.content, 300),
          tags: memory.tags ?? [],
          metadata: {
            ...memory.metadata,
            source: memory.source,
          },
          occurredAt: toIso(memory.updatedAt ?? memory.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.MEMORY_DELETED: {
      const memory = payload as { id: string };
      return {
        action: "remove",
        sourceTable: MEMORY_SOURCE_TABLES.MEMORIES,
        sourceId: memory.id,
      };
    }

    case DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED: {
      const entry = payload as {
        id: string;
        userId: string;
        content: string;
        summary?: string | null;
        mood?: string | null;
        tags?: string[];
        entryDate?: string | Date;
        createdAt?: string | Date;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          userId: entry.userId,
          memoryType: "journal",
          sourceTable: MEMORY_SOURCE_TABLES.JOURNAL_ENTRIES,
          sourceId: entry.id,
          title: journalTitle(entry.content),
          summary: entry.summary ?? truncate(entry.content, 300),
          tags: entry.tags ?? [],
          metadata: { mood: entry.mood },
          occurredAt: toIso(entry.entryDate ?? entry.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.TIMELINE_EVENT_CREATED: {
      const timeline = payload as {
        id: string;
        title: string;
        description?: string | null;
        eventType: string;
        occurredAt?: string | Date;
        metadata?: Record<string, unknown>;
      };
      const memoryType: MemoryType =
        timeline.eventType === "meeting" ? "meeting" : "timeline";
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType,
          sourceTable: MEMORY_SOURCE_TABLES.TIMELINE_EVENTS,
          sourceId: timeline.id,
          title: timeline.title,
          summary: timeline.description ?? undefined,
          tags: [timeline.eventType],
          metadata: timeline.metadata ?? {},
          occurredAt: toIso(timeline.occurredAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED: {
      const node = payload as {
        id: string;
        label: string;
        nodeType: string;
        content?: string | null;
        metadata?: Record<string, unknown>;
        createdAt?: string | Date;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType: "knowledge",
          sourceTable: MEMORY_SOURCE_TABLES.KNOWLEDGE_NODES,
          sourceId: node.id,
          title: node.label,
          summary: node.content ?? undefined,
          tags: [node.nodeType],
          metadata: node.metadata ?? {},
          occurredAt: toIso(node.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.KNOWLEDGE_EDGE_CREATED: {
      const edge = payload as {
        id: string;
        fromNodeId: string;
        toNodeId: string;
        relationship: string;
        createdAt?: string | Date;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType: "knowledge",
          sourceTable: MEMORY_SOURCE_TABLES.KNOWLEDGE_EDGES,
          sourceId: edge.id,
          title: `Relationship: ${edge.relationship}`,
          summary: `${edge.fromNodeId} → ${edge.toNodeId}`,
          tags: ["relationship", edge.relationship],
          metadata: {
            fromNodeId: edge.fromNodeId,
            toNodeId: edge.toNodeId,
          },
          occurredAt: toIso(edge.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.NOTIFICATION_CREATED: {
      const notification = payload as {
        id: string;
        userId: string;
        title: string;
        body: string;
        type: string;
        metadata?: Record<string, unknown>;
        createdAt?: string | Date;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          userId: notification.userId,
          memoryType: "notification",
          sourceTable: MEMORY_SOURCE_TABLES.NOTIFICATIONS,
          sourceId: notification.id,
          title: notification.title,
          summary: truncate(notification.body, 300),
          tags: [notification.type],
          metadata: notification.metadata ?? {},
          occurredAt: toIso(notification.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.BILL_DUE_SOON:
    case DOMAIN_EVENTS.BILL_OVERDUE: {
      const bill = payload as {
        id: string;
        name: string;
        amountCents: number;
        currency?: string;
        dueDate?: string | Date;
        category?: string | null;
      };
      const overdue = event.type === DOMAIN_EVENTS.BILL_OVERDUE;
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType: "bill",
          sourceTable: MEMORY_SOURCE_TABLES.BILLS,
          sourceId: bill.id,
          title: bill.name,
          summary: `${formatAmount(bill.amountCents, bill.currency)} due ${toIso(bill.dueDate).slice(0, 10)}`,
          tags: overdue ? ["overdue", "billing"] : ["due-soon", "billing"],
          metadata: {
            amountCents: bill.amountCents,
            currency: bill.currency ?? "USD",
            dueDate: toIso(bill.dueDate),
            status: overdue ? "overdue" : "due_soon",
          },
          occurredAt: toIso(bill.dueDate ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED: {
      const rec = payload as {
        id: string;
        title: string;
        summary: string;
        reasoning?: string;
        confidence?: number;
        roiEstimate?: string | null;
        createdAt?: string | Date;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType: "recommendation",
          sourceTable: MEMORY_SOURCE_TABLES.AGENT_RECOMMENDATIONS,
          sourceId: rec.id,
          title: rec.title,
          summary: rec.summary,
          tags: ["recommendation", "agent"],
          metadata: {
            reasoning: rec.reasoning,
            confidence: rec.confidence,
            roiEstimate: rec.roiEstimate,
          },
          occurredAt: toIso(rec.createdAt ?? event.metadata.timestamp),
        },
      };
    }

    case DOMAIN_EVENTS.GIT_COMMIT_RECEIVED: {
      const commit = payload as {
        sha: string;
        message: string;
        url?: string;
        provider?: string;
        normalizedEntityId?: string;
      };
      return {
        action: "upsert",
        input: {
          companyId: event.companyId,
          memoryType: "git_activity",
          sourceTable: MEMORY_SOURCE_TABLES.NORMALIZED_ENTITIES,
          sourceId: commit.normalizedEntityId ?? commit.sha,
          title: commit.message,
          summary: commit.url,
          tags: ["git", commit.provider ?? "github"],
          metadata: { sha: commit.sha, url: commit.url, provider: commit.provider },
          occurredAt: toIso(event.metadata.timestamp),
        },
      };
    }

    default:
      return { action: "skip" };
  }
}

function resolveNoteMemoryType(
  source?: string,
  metadata?: Record<string, unknown>,
): MemoryType {
  if (source === "github") return "git_activity";
  if (metadata?.category === "idea") return "idea";
  return "note";
}

function journalTitle(content: string): string {
  const line = content.split("\n")[0]?.trim() ?? "Journal entry";
  return line.length > 80 ? `${line.slice(0, 77)}...` : line;
}

function truncate(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

function toIso(value: string | Date | undefined): string {
  if (!value) return new Date().toISOString();
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function formatAmount(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}
