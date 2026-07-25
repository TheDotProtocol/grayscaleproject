import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsController } from "./agents.controller";
import { EventsModule } from "../events/events.module";
import { MemoryIndexModule } from "../memory/memory-index.module";

@Module({
  imports: [EventsModule, MemoryIndexModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}
