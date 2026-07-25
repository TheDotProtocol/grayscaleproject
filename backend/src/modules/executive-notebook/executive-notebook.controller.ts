import { Controller, Get, Post, Body, Param, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import type { CreateNotebookEntryInput, NotebookEntryType } from "@grayscale/platform";
import { ExecutiveNotebookService } from "./executive-notebook.service";

@ApiTags("executive-notebook")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("companies/:companyId/executives/:executiveId/notebook")
export class ExecutiveNotebookController {
  constructor(private readonly notebook: ExecutiveNotebookService) {}

  @Post()
  record(
    @Param("companyId") companyId: string,
    @Param("executiveId") executiveId: string,
    @Body() body: Omit<CreateNotebookEntryInput, "companyId" | "executiveId">,
  ) {
    return this.notebook.record({ ...body, companyId, executiveId });
  }

  @Get()
  search(
    @Param("companyId") companyId: string,
    @Param("executiveId") executiveId: string,
    @Query("type") type?: NotebookEntryType,
    @Query("q") q?: string,
    @Query("limit") limit?: string,
  ) {
    return this.notebook.search(companyId, executiveId, {
      type,
      q,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(":entryId")
  get(@Param("entryId") entryId: string) {
    return this.notebook.get(entryId);
  }
}
