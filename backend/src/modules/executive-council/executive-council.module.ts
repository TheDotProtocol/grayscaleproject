import { Module } from "@nestjs/common";
import { ExecutiveCouncilService } from "./executive-council.service";

@Module({
  providers: [ExecutiveCouncilService],
  exports: [ExecutiveCouncilService],
})
export class ExecutiveCouncilModule {}
