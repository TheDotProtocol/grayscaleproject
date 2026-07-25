import { Module } from "@nestjs/common";
import { KnowledgeService } from "./knowledge.service";
import { KnowledgeController } from "./knowledge.controller";
import { EventsModule } from "../events/events.module";
import { GraphModule } from "../graph/graph.module";

@Module({
  imports: [EventsModule, GraphModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
})
export class KnowledgeModule {}
