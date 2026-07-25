import { Module } from "@nestjs/common";
import { PulseEngineService } from "./pulse-engine.service";
import { PulseController } from "./pulse.controller";
import { PluginsModule } from "../plugins/plugins.module";

@Module({
  imports: [PluginsModule],
  controllers: [PulseController],
  providers: [PulseEngineService],
  exports: [PulseEngineService],
})
export class PulseModule {}
