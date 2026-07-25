import { Module } from "@nestjs/common";
import { ExecutiveSkepticService } from "./executive-skeptic.service";

@Module({
  providers: [ExecutiveSkepticService],
  exports: [ExecutiveSkepticService],
})
export class ExecutiveSkepticModule {}
