import type {
  PlatformEvent,
  GraphNodeType,
  UpsertGraphNodeInput,
  CreateGraphEdgeInput,
} from "@grayscale/platform";
import { DOMAIN_EVENTS } from "@grayscale/platform";

export type GraphProjectionResult =
  | { action: "upsert_node"; input: UpsertGraphNodeInput }
  | { action: "archive_node"; sourceTable: string; sourceId: string }
  | { action: "upsert_edge"; input: CreateGraphEdgeInput; pendingTargetSource?: { table: string; id: string } }
  | { action: "skip" };

export function mapEventToGraphProjection(event: PlatformEvent): GraphProjectionResult[] {
  const results: GraphProjectionResult[] = [];
  const payload = event.payload as Record<string, unknown>;

  switch (event.type) {
    case DOMAIN_EVENTS.MEMORY_CREATED:
    case DOMAIN_EVENTS.MEMORY_UPDATED: {
      const m = payload as {
        id: string;
        title: string;
        content?: string;
        summary?: string | null;
        source?: string;
        metadata?: Record<string, unknown>;
      };
      const nodeType: GraphNodeType = m.source === "github" ? "git_commit" : "memory";
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType,
          displayName: m.title,
          summary: (m.summary ?? m.content?.slice(0, 300)) || undefined,
          sourceTable: "memories",
          sourceId: m.id,
          source: "event",
          metadata: { ...m.metadata, domainEventType: event.type },
        },
      });
      if (event.userId) {
        results.push({
          action: "upsert_edge",
          input: {
            companyId: event.companyId,
            sourceNodeId: event.userId,
            targetNodeId: m.id,
            relationshipType: "CREATED",
            source: "event",
            sourceEventId: event.id,
            correlationId: event.metadata.correlationId,
            createdBy: event.userId,
          },
          pendingTargetSource: { table: "memories", id: m.id },
        });
      }
      break;
    }

    case DOMAIN_EVENTS.MEMORY_DELETED: {
      const m = payload as { id: string };
      results.push({ action: "archive_node", sourceTable: "memories", sourceId: m.id });
      break;
    }

    case DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED: {
      const j = payload as { id: string; content: string; summary?: string | null };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "journal_entry",
          displayName: j.content.split("\n")[0]?.slice(0, 80) ?? "Journal entry",
          summary: j.summary ?? undefined,
          sourceTable: "journal_entries",
          sourceId: j.id,
          source: "event",
        },
      });
      break;
    }

    case DOMAIN_EVENTS.TIMELINE_EVENT_CREATED: {
      const t = payload as {
        id: string;
        title: string;
        description?: string | null;
        eventType: string;
      };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: t.eventType === "meeting" ? "meeting" : "timeline_event",
          displayName: t.title,
          summary: t.description ?? undefined,
          sourceTable: "timeline_events",
          sourceId: t.id,
          source: "event",
          metadata: { eventType: t.eventType },
        },
      });
      break;
    }

    case DOMAIN_EVENTS.NOTIFICATION_CREATED: {
      const n = payload as { id: string; title: string; body: string };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "notification",
          displayName: n.title,
          summary: n.body.slice(0, 300),
          sourceTable: "notifications",
          sourceId: n.id,
          source: "event",
        },
      });
      break;
    }

    case DOMAIN_EVENTS.BILL_DUE_SOON:
    case DOMAIN_EVENTS.BILL_OVERDUE: {
      const b = payload as { id: string; name: string };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "bill",
          displayName: b.name,
          sourceTable: "bills",
          sourceId: b.id,
          source: "event",
        },
      });
      break;
    }

    case DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED: {
      const r = payload as { id: string; title: string; summary: string };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "recommendation",
          displayName: r.title,
          summary: r.summary,
          sourceTable: "agent_recommendations",
          sourceId: r.id,
          source: "event",
        },
      });
      break;
    }

    case DOMAIN_EVENTS.INTEGRATION_CONNECTED: {
      const i = payload as { integrationId: string; provider: string };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "integration",
          displayName: i.provider,
          sourceTable: "integrations",
          sourceId: i.integrationId,
          source: "event",
          metadata: { provider: i.provider },
        },
      });
      break;
    }

    case DOMAIN_EVENTS.GIT_COMMIT_RECEIVED: {
      const c = payload as {
        sha: string;
        message: string;
        url?: string;
        provider?: string;
        normalizedEntityId?: string;
      };
      const sourceId = c.normalizedEntityId ?? c.sha;
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "git_commit",
          displayName: c.message,
          summary: c.url,
          sourceTable: "normalized_entity_records",
          sourceId,
          source: "event",
          metadata: { sha: c.sha, url: c.url, provider: c.provider ?? "github" },
        },
      });
      break;
    }

    case DOMAIN_EVENTS.PLUGIN_INSTALLED: {
      const p = payload as { pluginId: string; version: string };
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType: "plugin",
          displayName: p.pluginId,
          summary: `v${p.version}`,
          sourceTable: "installed_plugins",
          sourceId: p.pluginId,
          source: "event",
          metadata: { version: p.version },
        },
      });
      break;
    }

    case DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED: {
      const kn = payload as {
        id: string;
        label: string;
        nodeType: string;
        content?: string | null;
      };
      const nodeType: GraphNodeType =
        kn.nodeType === "decision" || kn.nodeType === "architecture_decision"
          ? (kn.nodeType as GraphNodeType)
          : "knowledge_article";
      results.push({
        action: "upsert_node",
        input: {
          companyId: event.companyId,
          nodeType,
          displayName: kn.label,
          summary: kn.content ?? undefined,
          sourceTable: "knowledge_nodes",
          sourceId: kn.id,
          source: "event",
        },
      });
      break;
    }

    default:
      results.push({ action: "skip" });
  }

  return results;
}
