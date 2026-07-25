import { Injectable } from "@nestjs/common";
import type {
  CreateNotebookEntryInput,
  ExecutiveNotebookEntry,
  ExecutiveNotebookPort,
} from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ExecutiveNotebookService implements ExecutiveNotebookPort {
  constructor(private readonly prisma: PrismaService) {}

  private toEntry(row: {
    id: string;
    companyId: string;
    executiveId: string;
    entryType: string;
    title: string;
    content: string;
    version: number;
    previousEntryId: string | null;
    memoryIds: string[];
    graphNodeIds: string[];
    eventIds: string[];
    investigationIds: string[];
    correlationId: string;
    sourceEventId: string | null;
    metadata: unknown;
    createdAt: Date;
  }): ExecutiveNotebookEntry {
    return {
      id: row.id,
      companyId: row.companyId,
      executiveId: row.executiveId,
      entryType: row.entryType as ExecutiveNotebookEntry["entryType"],
      title: row.title,
      content: row.content,
      version: row.version,
      previousEntryId: row.previousEntryId ?? undefined,
      links: {
        memoryIds: row.memoryIds,
        graphNodeIds: row.graphNodeIds,
        eventIds: row.eventIds,
        investigationIds: row.investigationIds,
      },
      correlationId: row.correlationId,
      sourceEventId: row.sourceEventId ?? undefined,
      immutable: true,
      createdAt: row.createdAt.toISOString(),
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    };
  }

  async record(input: CreateNotebookEntryInput): Promise<ExecutiveNotebookEntry> {
    const row = await this.prisma.executiveNotebookEntry.create({
      data: {
        companyId: input.companyId,
        executiveId: input.executiveId,
        entryType: input.entryType,
        title: input.title,
        content: input.content,
        memoryIds: input.links?.memoryIds ?? [],
        graphNodeIds: input.links?.graphNodeIds ?? [],
        eventIds: input.links?.eventIds ?? [],
        investigationIds: input.links?.investigationIds ?? [],
        correlationId: input.correlationId,
        sourceEventId: input.sourceEventId,
        metadata: (input.metadata ?? {}) as object,
      },
    });
    return this.toEntry(row);
  }

  async get(id: string): Promise<ExecutiveNotebookEntry | null> {
    const row = await this.prisma.executiveNotebookEntry.findUnique({ where: { id } });
    return row ? this.toEntry(row) : null;
  }

  async search(
    companyId: string,
    executiveId: string,
    query?: { type?: ExecutiveNotebookEntry["entryType"]; q?: string; limit?: number },
  ): Promise<ExecutiveNotebookEntry[]> {
    const rows = await this.prisma.executiveNotebookEntry.findMany({
      where: {
        companyId,
        executiveId,
        ...(query?.type ? { entryType: query.type } : {}),
        ...(query?.q
          ? {
              OR: [
                { title: { contains: query.q, mode: "insensitive" as const } },
                { content: { contains: query.q, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: query?.limit ?? 50,
    });
    return rows.map((r) => this.toEntry(r));
  }

  async appendVersion(
    entryId: string,
    content: string,
    correlationId: string,
  ): Promise<ExecutiveNotebookEntry> {
    const prev = await this.prisma.executiveNotebookEntry.findUnique({ where: { id: entryId } });
    if (!prev) throw new Error("Notebook entry not found");

    const row = await this.prisma.executiveNotebookEntry.create({
      data: {
        companyId: prev.companyId,
        executiveId: prev.executiveId,
        entryType: prev.entryType,
        title: prev.title,
        content,
        version: prev.version + 1,
        previousEntryId: prev.id,
        memoryIds: prev.memoryIds,
        graphNodeIds: prev.graphNodeIds,
        eventIds: prev.eventIds,
        investigationIds: prev.investigationIds,
        correlationId,
        metadata: prev.metadata as object,
      },
    });
    return this.toEntry(row);
  }
}
