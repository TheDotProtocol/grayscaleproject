import { Module } from "@nestjs/common";
import { EventsModule } from "../events/events.module";
import { ExecutiveNetworkService } from "./executive-network.service";
import { ExecutiveNetworkController } from "./executive-network.controller";

@Module({
  imports: [EventsModule],
  controllers: [ExecutiveNetworkController],
  providers: [ExecutiveNetworkService],
  exports: [ExecutiveNetworkService],
})
export class ExecutiveNetworkModule {}
