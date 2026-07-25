import { Module, forwardRef } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import {
  EventsService,
  EVENT_BUS_QUEUE,
  EVENT_DLQ_QUEUE,
} from "./events.service";
import { EventsProcessor, EventsDlqProcessor } from "./events.processor";
import { EventStoreService } from "./event-store.service";
import { ProjectorRegistryService } from "./projector-registry.service";
import { PulseProjector } from "./projectors/pulse.projector";
import { PluginsProjector } from "./projectors/plugins.projector";
import { PulseModule } from "../pulse/pulse.module";
import { PluginsModule } from "../plugins/plugins.module";

import { MemoryIndexModule } from "../memory/memory-index.module";
import { GraphModule } from "../graph/graph.module";
import { IntelligenceModule } from "../intelligence/intelligence.module";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: EVENT_BUS_QUEUE },
      { name: EVENT_DLQ_QUEUE },
    ),
    PulseModule,
    PluginsModule,
    MemoryIndexModule,
    GraphModule,
    forwardRef(() => IntelligenceModule),
  ],
  providers: [
    EventStoreService,
    ProjectorRegistryService,
    PulseProjector,
    PluginsProjector,
    EventsService,
    EventsProcessor,
    EventsDlqProcessor,
  ],
  exports: [EventsService, EventStoreService],
})
export class EventsModule {}
