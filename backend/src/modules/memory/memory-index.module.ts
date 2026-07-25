import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { MemoryIngestionService } from "./memory-ingestion.service";
import { MemoryQueryService } from "./memory-query.service";
import { MemoryBackfillService } from "./memory-backfill.service";
import { MemoryIndexProjector } from "./memory-index.projector";

/** Memory index layer — no EventsModule dependency (avoids circular imports) */
@Module({
  imports: [PrismaModule],
  providers: [
    MemoryIngestionService,
    MemoryQueryService,
    MemoryBackfillService,
    MemoryIndexProjector,
  ],
  exports: [
    MemoryIngestionService,
    MemoryQueryService,
    MemoryBackfillService,
    MemoryIndexProjector,
  ],
})
export class MemoryIndexModule {}
