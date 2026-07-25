import { Injectable, Logger } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { GraphNodeService } from "../graph/graph-node.service";
import { GraphEdgeService } from "../graph/graph-edge.service";

const STRATEGIC_EVENTS = [
  "recommendation.generated",
  "goal.created",
  "decision.recorded",
  "risk.assessed",
  "opportunity.identified",
] as const;

/** AIP-11: graph-aware strategic entities */
@Injectable()
export class StrategicGraphProjector implements EventProjector {
  readonly name = "strategic-intelligence";
  readonly handles = [...STRATEGIC_EVENTS];

  private readonly logger = new Logger(StrategicGraphProjector.name);

  constructor(
    private readonly nodes: GraphNodeService,
    private readonly edges: GraphEdgeService,
  ) {}

  async project(event: PlatformEvent): Promise<void> {
    const payload = event.payload as Record<string, unknown>;

    switch (event.type) {
      case "recommendation.generated":
        await this.upsertEntityNode(event, "recommendation", payload.recommendationId as string, payload.title as string);
        break;
      case "goal.created":
        await this.upsertEntityNode(event, "goal", payload.goalId as string, payload.title as string);
        break;
      case "decision.recorded":
        await this.upsertEntityNode(event, "decision", payload.decisionId as string, payload.title as string);
        break;
      case "risk.assessed":
        await this.upsertEntityNode(event, "risk", payload.riskId as string, payload.title as string);
        break;
      case "opportunity.identified":
        await this.upsertEntityNode(event, "opportunity", payload.opportunityId as string, payload.title as string);
        break;
      default:
        this.logger.debug(`No strategic projection for ${event.type}`);
    }
  }

  private async upsertEntityNode(
    event: PlatformEvent,
    nodeType: string,
    sourceId: string,
    displayName: string,
  ): Promise<void> {
    if (!sourceId) return;

    const tableMap: Record<string, string> = {
      recommendation: "recommendations",
      goal: "goals",
      decision: "decisions",
      risk: "risk_assessments",
      opportunity: "opportunities",
    };

    const node = await this.nodes.upsertFromEntity({
      companyId: event.companyId,
      nodeType: nodeType as never,
      displayName,
      sourceTable: tableMap[nodeType],
      sourceId,
      source: "event",
      metadata: { sourceEventId: event.id, correlationId: event.metadata.correlationId },
    });

    const companyNode = await this.nodes.ensureCompanyNode(event.companyId, event.companyId);
    await this.edges.upsert({
      companyId: event.companyId,
      sourceNodeId: node.id,
      targetNodeId: companyNode.id,
      relationshipType: "BELONGS_TO",
      source: "event",
      sourceEventId: event.id,
      correlationId: event.metadata.correlationId,
    });
  }
}
