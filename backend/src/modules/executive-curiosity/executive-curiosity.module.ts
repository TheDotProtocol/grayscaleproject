import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ExecutiveCuriosityService } from "./executive-curiosity.service";

@Module({
  imports: [PrismaModule],
  providers: [ExecutiveCuriosityService],
  exports: [ExecutiveCuriosityService],
})
export class ExecutiveCuriosityModule {}
