import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { DOMAIN_EVENTS } from "@grayscale/shared";
import { createProviderAdapter } from "@grayscale/agents";
import { SyncOrchestratorService } from "../integration-platform/sync-orchestrator.service";

@Injectable()
export class MemoryService {
  private readonly aiAdapter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    @Inject(forwardRef(() => SyncOrchestratorService))
    private readonly syncOrchestrator: SyncOrchestratorService,
    config: ConfigService,
  ) {
    this.aiAdapter = createProviderAdapter({
      openaiApiKey: config.get("OPENAI_API_KEY"),
      ollamaBaseUrl: config.get("OLLAMA_BASE_URL"),
    });
  }

  async list(companyId: string) {
    return this.prisma.memory.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    companyId: string,
    data: {
      title: string;
      content: string;
      tags?: string[];
      source?: string;
      category?: string;
    },
  ) {
    const memory = await this.prisma.memory.create({
      data: {
        companyId,
        title: data.title,
        content: data.content,
        tags: data.tags ?? [],
        source: data.source ?? "manual",
        metadata: { category: data.category ?? "general" },
      },
    });

    await this.events.publish(DOMAIN_EVENTS.MEMORY_CREATED, companyId, memory);
    return memory;
  }

  async update(
    companyId: string,
    id: string,
    data: { title?: string; content?: string; tags?: string[]; category?: string },
  ) {
    const existing = await this.getOne(companyId, id);
    const metadata = {
      ...(existing.metadata as object),
      ...(data.category ? { category: data.category } : {}),
    };
    const { category: _, ...rest } = data;
    return this.prisma.memory.update({
      where: { id },
      data: { ...rest, metadata },
    }).then(async (memory) => {
      await this.events.publish(DOMAIN_EVENTS.MEMORY_UPDATED, companyId, memory);
      return memory;
    });
  }

  async remove(companyId: string, id: string) {
    const memory = await this.getOne(companyId, id);
    await this.prisma.memory.delete({ where: { id } });
    await this.events.publish(DOMAIN_EVENTS.MEMORY_DELETED, companyId, {
      id: memory.id,
      title: memory.title,
    });
    return { deleted: true };
  }

  async getOne(companyId: string, id: string) {
    const memory = await this.prisma.memory.findFirst({
      where: { id, companyId },
    });
    if (!memory) throw new NotFoundException("Memory not found");
    return memory;
  }

  async createJournalEntry(
    companyId: string,
    userId: string,
    data: { content: string; mood?: string; tags?: string[] },
  ) {
    const entry = await this.prisma.journalEntry.create({
      data: { companyId, userId, ...data, tags: data.tags ?? [] },
    });

    let summary: string | null = null;
    try {
      const available = await this.aiAdapter.isAvailable();
      if (available) {
        const response = await this.aiAdapter.chat({
          model: "default",
          messages: [
            {
              role: "system",
              content:
                "Summarize this founder journal entry in 2-3 actionable sentences. Focus on decisions, blockers, and priorities.",
            },
            { role: "user", content: data.content },
          ],
          temperature: 0.3,
          maxTokens: 256,
        });
        summary = response.content;
        await this.prisma.journalEntry.update({
          where: { id: entry.id },
          data: { summary },
        });
      }
    } catch {
      summary = data.content.slice(0, 200);
    }

    await this.events.publish(
      DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED,
      companyId,
      { ...entry, summary },
    );

    return { ...entry, summary };
  }

  async listJournal(companyId: string) {
    return this.prisma.journalEntry.findMany({
      where: { companyId },
      orderBy: { entryDate: "desc" },
    });
  }

  async getJournalEntry(companyId: string, id: string) {
    const entry = await this.prisma.journalEntry.findFirst({
      where: { id, companyId },
    });
    if (!entry) throw new NotFoundException("Journal entry not found");
    return entry;
  }

  async summarizeJournalEntry(companyId: string, entryId: string) {
    const entry = await this.getJournalEntry(companyId, entryId);
    const available = await this.aiAdapter.isAvailable();
    if (!available) {
      throw new BadRequestException("No AI provider available");
    }
    const response = await this.aiAdapter.chat({
      model: "default",
      messages: [
        {
          role: "system",
          content:
            "Summarize this founder journal entry in 2-3 actionable sentences. Focus on decisions, blockers, and priorities.",
        },
        { role: "user", content: entry.content },
      ],
      temperature: 0.3,
      maxTokens: 256,
    });
    return this.prisma.journalEntry.update({
      where: { id: entryId },
      data: { summary: response.content },
    });
  }

  /** @deprecated Use POST /companies/:id/platform/integrations/github/sync */
  async syncFromGitHub(companyId: string) {
    const result = await this.syncOrchestrator.runSync(companyId, "github");
    return { imported: result.imported, skipped: result.skipped, memories: [] };
  }
}
