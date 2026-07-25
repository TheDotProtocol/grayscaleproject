import { Module, forwardRef } from "@nestjs/common";
import { MemoryService } from "./memory.service";
import { MemoryController } from "./memory.controller";
import { MemoryIndexModule } from "./memory-index.module";
import { EventsModule } from "../events/events.module";
import { IntegrationPlatformModule } from "../integration-platform/integration-platform.module";

@Module({
  imports: [EventsModule, MemoryIndexModule, forwardRef(() => IntegrationPlatformModule)],
  controllers: [MemoryController],
  providers: [MemoryService],
  exports: [MemoryService, MemoryIndexModule],
})
export class MemoryModule {}
