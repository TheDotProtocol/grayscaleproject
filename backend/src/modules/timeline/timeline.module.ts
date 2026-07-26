import { Module } from "@nestjs/common";
import { TimelineService } from "./timeline.service";
import { TimelineController } from "./timeline.controller";
import { EventsModule } from "../events/events.module";

@Module({
  imports: [EventsModule],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
