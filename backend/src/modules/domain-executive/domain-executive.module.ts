import { Module } from "@nestjs/common";
import { ContextRuntimeModule } from "../context-runtime/context-runtime.module";
import { ExecutiveModule } from "../executive/executive.module";
import { AthenaModule } from "../athena/athena.module";
import { ExecutiveNotebookModule } from "../executive-notebook/executive-notebook.module";
import { ExecutiveCuriosityModule } from "../executive-curiosity/executive-curiosity.module";
import { ExecutiveSkepticModule } from "../executive-skeptic/executive-skeptic.module";
import { DomainExecutiveService } from "./domain-executive.service";
import {
  AtlasController,
  LedgerController,
  MercuryController,
  SentinelController,
  NavigatorController,
  ForgeController,
} from "./domain-executive.controllers";

@Module({
  imports: [
    ContextRuntimeModule,
    ExecutiveModule,
    AthenaModule,
    ExecutiveNotebookModule,
    ExecutiveCuriosityModule,
    ExecutiveSkepticModule,
  ],
  controllers: [
    AtlasController,
    LedgerController,
    MercuryController,
    SentinelController,
    NavigatorController,
    ForgeController,
  ],
  providers: [DomainExecutiveService],
  exports: [DomainExecutiveService],
})
export class DomainExecutiveModule {}
