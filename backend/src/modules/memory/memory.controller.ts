import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { MemoryService } from "./memory.service";
import { MemoryQueryService } from "./memory-query.service";
import { MemoryBackfillService } from "./memory-backfill.service";
import { MemoryIngestionService } from "./memory-ingestion.service";
import { CurrentUser } from "../auth/auth.decorators";
import type { MemoryRecordInput, MemoryType } from "@grayscale/platform";

@ApiTags("memory")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/memory")
export class MemoryController {
  constructor(
    private readonly memory: MemoryService,
    private readonly query: MemoryQueryService,
    private readonly backfillService: MemoryBackfillService,
    private readonly ingestion: MemoryIngestionService,
  ) {}

  /** Unified cross-type search across the memory index */
  @Get("search")
  search(
    @Param("companyId") companyId: string,
    @Query("q") q?: string,
    @Query("type") type?: string,
    @Query("tags") tags?: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
  ) {
    const types = type?.split(",").filter(Boolean) as MemoryType[] | undefined;
    const tagList = tags?.split(",").filter(Boolean);
    return this.query.search(companyId, {
      q,
      type: types?.length === 1 ? types[0] : types,
      tags: tagList,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  /** Index row with hydrated source entity */
  @Get("records/:recordId")
  getRecord(
    @Param("companyId") companyId: string,
    @Param("recordId") recordId: string,
  ) {
    return this.query.getWithSource(companyId, recordId);
  }

  /** Internal ingestion endpoint — for admin/replay tooling */
  @Post("ingest")
  ingest(
    @Param("companyId") companyId: string,
    @Body() body: Omit<MemoryRecordInput, "companyId">,
  ) {
    return this.ingestion.upsert({ ...body, companyId });
  }

  /** Backfill index from existing domain tables */
  @Post("backfill")
  backfill(@Param("companyId") companyId: string) {
    return this.backfillService.backfillCompany(companyId);
  }

  @Get()
  list(@Param("companyId") companyId: string) {
    return this.memory.list(companyId);
  }

  @Post()
  create(
    @Param("companyId") companyId: string,
    @Body()
    body: { title: string; content: string; tags?: string[]; source?: string; category?: string },
  ) {
    return this.memory.create(companyId, body);
  }

  @Get("journal/entries")
  listJournal(@Param("companyId") companyId: string) {
    return this.memory.listJournal(companyId);
  }

  @Post("journal/entries")
  createJournal(
    @Param("companyId") companyId: string,
    @CurrentUser() user: { userId: string },
    @Body() body: { content: string; mood?: string; tags?: string[] },
  ) {
    return this.memory.createJournalEntry(companyId, user.userId, body);
  }

  @Get("journal/entries/:entryId")
  getJournal(
    @Param("companyId") companyId: string,
    @Param("entryId") entryId: string,
  ) {
    return this.memory.getJournalEntry(companyId, entryId);
  }

  @Post("journal/entries/:entryId/summarize")
  summarizeJournal(
    @Param("companyId") companyId: string,
    @Param("entryId") entryId: string,
  ) {
    return this.memory.summarizeJournalEntry(companyId, entryId);
  }

  @Post("sync/github")
  syncGitHub(@Param("companyId") companyId: string) {
    return this.memory.syncFromGitHub(companyId);
  }

  @Get(":id")
  getOne(@Param("companyId") companyId: string, @Param("id") id: string) {
    return this.memory.getOne(companyId, id);
  }

  @Patch(":id")
  update(
    @Param("companyId") companyId: string,
    @Param("id") id: string,
    @Body() body: { title?: string; content?: string; tags?: string[]; category?: string },
  ) {
    return this.memory.update(companyId, id, body);
  }

  @Delete(":id")
  remove(@Param("companyId") companyId: string, @Param("id") id: string) {
    return this.memory.remove(companyId, id);
  }
}
