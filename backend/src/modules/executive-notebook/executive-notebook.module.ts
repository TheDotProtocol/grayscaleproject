import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ExecutiveNotebookService } from "./executive-notebook.service";
import { ExecutiveNotebookController } from "./executive-notebook.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ExecutiveNotebookController],
  providers: [ExecutiveNotebookService],
  exports: [ExecutiveNotebookService],
})
export class ExecutiveNotebookModule {}
