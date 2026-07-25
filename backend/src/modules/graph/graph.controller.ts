import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type {
  UpsertGraphNodeInput,
  CreateGraphEdgeInput,
  GraphRelationshipType,
} from "@grayscale/platform";
import { GraphNodeService } from "./graph-node.service";
import { GraphEdgeService } from "./graph-edge.service";
import { GraphTraversalService } from "./graph-traversal.service";
import { GraphSearchService } from "./graph-search.service";
import { GraphSummaryService } from "./graph-summary.service";
import { GraphImportService, GraphExportService } from "./graph-import-export.service";

@ApiTags("graph")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/graph")
export class GraphController {
  constructor(
    private readonly nodes: GraphNodeService,
    private readonly edges: GraphEdgeService,
    private readonly traversal: GraphTraversalService,
    private readonly search: GraphSearchService,
    private readonly summary: GraphSummaryService,
    private readonly graphImport: GraphImportService,
    private readonly graphExport: GraphExportService,
  ) {}

  @Get("summary")
  getSummary(@Param("companyId") companyId: string) {
    return this.summary.getSummary(companyId);
  }

  @Get("health")
  getHealth(@Param("companyId") companyId: string) {
    return this.summary.getCompanyHealthSummary(companyId);
  }

  @Get("nodes")
  listNodes(
    @Param("companyId") companyId: string,
    @Query("q") q?: string,
    @Query("type") type?: string,
    @Query("limit") limit?: string,
  ) {
    const types = type?.split(",").filter(Boolean);
    return this.search.searchNodes(companyId, {
      q,
      nodeType: types?.length === 1 ? (types[0] as never) : (types as never),
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get("nodes/:nodeId")
  getNode(@Param("companyId") companyId: string, @Param("nodeId") nodeId: string) {
    return this.nodes.getById(companyId, nodeId);
  }

  @Post("nodes")
  createNode(
    @Param("companyId") companyId: string,
    @Body() body: UpsertGraphNodeInput,
  ) {
    return this.nodes.upsertFromEntity({ ...body, companyId, source: body.source ?? "manual" });
  }

  @Get("nodes/:nodeId/neighbors")
  neighbors(
    @Param("companyId") companyId: string,
    @Param("nodeId") nodeId: string,
    @Query("direction") direction?: "outbound" | "inbound" | "both",
    @Query("relationship") relationship?: string,
  ) {
    const rels = relationship?.split(",").filter(Boolean) as GraphRelationshipType[] | undefined;
    return this.traversal.neighbors(companyId, nodeId, {
      direction: direction ?? "both",
      relationshipTypes: rels,
    });
  }

  @Get("nodes/:nodeId/expand")
  expand(
    @Param("companyId") companyId: string,
    @Param("nodeId") nodeId: string,
    @Query("depth") depth?: string,
  ) {
    return this.traversal.expand(companyId, nodeId, depth ? parseInt(depth, 10) : 2);
  }

  @Get("path")
  shortestPath(
    @Param("companyId") companyId: string,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.traversal.shortestPath(companyId, from, to);
  }

  @Get("related")
  relatedTo(
    @Param("companyId") companyId: string,
    @Query("q") q?: string,
    @Query("type") type?: string,
    @Query("depth") depth?: string,
  ) {
    return this.traversal.relatedTo(companyId, {
      q,
      nodeType: type?.split(","),
      depth: depth ? parseInt(depth, 10) : 2,
    });
  }

  @Post("edges")
  createEdge(
    @Param("companyId") companyId: string,
    @Body() body: CreateGraphEdgeInput,
  ) {
    return this.edges.create({ ...body, companyId, source: body.source ?? "manual" });
  }

  @Post("import")
  importGraph(
    @Param("companyId") companyId: string,
    @Body() body: { nodes: UpsertGraphNodeInput[]; edges: CreateGraphEdgeInput[] },
  ) {
    return this.graphImport.importJson(companyId, body);
  }

  @Get("export")
  exportGraph(@Param("companyId") companyId: string) {
    return this.graphExport.exportJson(companyId);
  }
}
