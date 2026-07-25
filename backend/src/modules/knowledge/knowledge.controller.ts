import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { KnowledgeService } from "./knowledge.service";

@ApiTags("knowledge-graph")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/knowledge")
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeService) {}

  @Get()
  getGraph(@Param("companyId") companyId: string) {
    return this.knowledge.getGraph(companyId);
  }

  @Post("nodes")
  createNode(
    @Param("companyId") companyId: string,
    @Body() body: { label: string; nodeType: string; content?: string },
  ) {
    return this.knowledge.createNode(companyId, body);
  }

  @Post("edges")
  createEdge(
    @Param("companyId") companyId: string,
    @Body() body: { fromNodeId: string; toNodeId: string; relationship: string },
  ) {
    return this.knowledge.createEdge(companyId, body);
  }
}
