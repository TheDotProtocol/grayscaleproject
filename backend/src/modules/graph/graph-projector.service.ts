import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { DOMAIN_EVENTS } from "@grayscale/platform";
import { GraphNodeService } from "./graph-node.service";
import { GraphEdgeService } from "./graph-edge.service";
import { MemoryIngestionService } from "../memory/memory-ingestion.service";
import { mapEventToGraphProjection } from "./graph-event.mapper";
import { PrismaService } from "../../prisma/prisma.service";

const GRAPH_EVENTS = [
  DOMAIN_EVENTS.MEMORY_CREATED,
  DOMAIN_EVENTS.MEMORY_UPDATED,
  DOMAIN_EVENTS.MEMORY_DELETED,
  DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED,
  DOMAIN_EVENTS.TIMELINE_EVENT_CREATED,
  DOMAIN_EVENTS.NOTIFICATION_CREATED,
  DOMAIN_EVENTS.BILL_DUE_SOON,
  DOMAIN_EVENTS.BILL_OVERDUE,
  DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED,
  DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED,
] as const;

@Injectable()
export class GraphProjector implements EventProjector {
  readonly name = "graph";
  readonly handles = GRAPH_EVENTS;

  private readonly logger = new Logger(GraphProjector.name);

  constructor(
    private readonly nodes: GraphNodeService,
    private readonly edges: GraphEdgeService,
    private readonly memoryIngestion: MemoryIngestionService,
    private readonly prisma: PrismaService,
  ) {}

  async project(event: PlatformEvent): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id: event.companyId },
    });
    if (!company) return;

    const companyNode = await this.nodes.ensureCompanyNode(
      event.companyId,
      company.name,
    );

    const mappings = mapEventToGraphProjection(event);
    const nodeIdBySource = new Map<string, string>();

    for (const mapping of mappings) {
      if (mapping.action === "skip") continue;

      if (mapping.action === "archive_node") {
        const node = await this.nodes.getBySource(
          event.companyId,
          mapping.sourceTable,
          mapping.sourceId,
        );
        if (node) await this.nodes.archiveNode(event.companyId, node.id);
        continue;
      }

      if (mapping.action === "upsert_node") {
        const node = await this.nodes.upsertFromEntity(mapping.input);
        const key = `${mapping.input.sourceTable}:${mapping.input.sourceId}`;
        nodeIdBySource.set(key, node.id);

        const memory = await this.memoryIngestion.linkGraphNodeBySource(
          mapping.input.sourceTable!,
          mapping.input.sourceId!,
          node.id,
        );
        if (memory && !node.memoryRecordId) {
          await this.nodes.upsertFromEntity({
            ...mapping.input,
            memoryRecordId: memory.id,
          });
        }

        await this.edges.upsert({
          companyId: event.companyId,
          sourceNodeId: node.id,
          targetNodeId: companyNode.id,
          relationshipType: "BELONGS_TO",
          source: "event",
          sourceEventId: event.id,
          correlationId: event.metadata.correlationId,
        });
        continue;
      }

      if (mapping.action === "upsert_edge") {
        let targetNodeId = mapping.input.targetNodeId;
        if (mapping.pendingTargetSource) {
          const key = `${mapping.pendingTargetSource.table}:${mapping.pendingTargetSource.id}`;
          targetNodeId = nodeIdBySource.get(key) ?? targetNodeId;
          const resolved = await this.nodes.getBySource(
            event.companyId,
            mapping.pendingTargetSource.table,
            mapping.pendingTargetSource.id,
          );
          if (resolved) targetNodeId = resolved.id;
        }

        let sourceNodeId = mapping.input.sourceNodeId;
        const userNode = await this.ensureUserNode(
          event.companyId,
          sourceNodeId,
        );
        if (userNode) sourceNodeId = userNode.id;

        if (sourceNodeId && targetNodeId && sourceNodeId !== targetNodeId) {
          try {
            await this.edges.upsert({
              ...mapping.input,
              sourceNodeId,
              targetNodeId,
            });
          } catch (err) {
            this.logger.warn(
              `Edge projection skipped: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }
      }
    }
  }

  private async ensureUserNode(companyId: string, userId: string) {
    const existing = await this.nodes.getBySource(companyId, "users", userId);
    if (existing) return existing;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return this.nodes.upsertFromEntity({
      companyId,
      nodeType: "user",
      displayName: user.name,
      sourceTable: "users",
      sourceId: userId,
      source: "event",
    });
  }
}
