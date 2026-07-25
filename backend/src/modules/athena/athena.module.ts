import { Module } from "@nestjs/common";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { ExecutiveModule } from "../executive/executive.module";
import { ExecutiveCuriosityModule } from "../executive-curiosity/executive-curiosity.module";
import { ExecutiveNotebookModule } from "../executive-notebook/executive-notebook.module";
import { ExecutiveSkepticModule } from "../executive-skeptic/executive-skeptic.module";
import { AthenaService } from "./athena.service";
import { AthenaController } from "./athena.controller";
import { DiscoveryEngineService } from "./discovery-engine.service";

@Module({
  imports: [
    ContextRuntimeModule,
    ExecutiveModule,
    ExecutiveCuriosityModule,
    ExecutiveNotebookModule,
    ExecutiveSkepticModule,
  ],
  controllers: [AthenaController],
  providers: [AthenaService, DiscoveryEngineService],
  exports: [AthenaService, DiscoveryEngineService],
})
export class AthenaModule {}
