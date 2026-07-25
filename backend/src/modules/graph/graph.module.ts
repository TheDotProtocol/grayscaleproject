import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { MemoryIndexModule } from "../memory/memory-index.module";
import { GraphNodeService } from "./graph-node.service";
import { GraphEdgeService } from "./graph-edge.service";
import { GraphValidationService } from "./graph-validation.service";
import { GraphTraversalService } from "./graph-traversal.service";
import { GraphSearchService } from "./graph-search.service";
import { GraphSummaryService } from "./graph-summary.service";
import { GraphImportService, GraphExportService } from "./graph-import-export.service";
import { GraphProjector } from "./graph-projector.service";
import { GraphController } from "./graph.controller";

@Module({
  imports: [PrismaModule, MemoryIndexModule],
  controllers: [GraphController],
  providers: [
    GraphNodeService,
    GraphEdgeService,
    GraphValidationService,
    GraphTraversalService,
    GraphSearchService,
    GraphSummaryService,
    GraphImportService,
    GraphExportService,
    GraphProjector,
  ],
  exports: [
    GraphNodeService,
    GraphEdgeService,
    GraphTraversalService,
    GraphSearchService,
    GraphSummaryService,
    GraphImportService,
    GraphExportService,
    GraphProjector,
  ],
})
export class GraphModule {}
