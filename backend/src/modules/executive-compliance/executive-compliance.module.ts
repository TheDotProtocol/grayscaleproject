import { Module } from "@nestjs/common";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { AthenaModule } from "../athena/athena.module";
import { ExecutiveNotebookModule } from "../executive-notebook/executive-notebook.module";
import { ExecutiveCuriosityModule } from "../executive-curiosity/executive-curiosity.module";
import { ExecutiveSkepticModule } from "../executive-skeptic/executive-skeptic.module";
import { ExecutiveComplianceService } from "./executive-compliance.service";
import { ExecutiveComplianceController } from "./executive-compliance.controller";

@Module({
  imports: [
    ContextRuntimeModule,
    AthenaModule,
    ExecutiveNotebookModule,
    ExecutiveCuriosityModule,
    ExecutiveSkepticModule,
  ],
  controllers: [ExecutiveComplianceController],
  providers: [ExecutiveComplianceService],
  exports: [ExecutiveComplianceService],
})
export class ExecutiveComplianceModule {}
