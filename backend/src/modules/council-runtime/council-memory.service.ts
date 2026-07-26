import { Injectable } from "@nestjs/common";
import type {
  CouncilMemoryEntry,
  CouncilMemoryEntryType,
  CouncilMemoryPort,
  CouncilMemorySearchResult,
  CouncilMinutes,
} from "@grayscale/platform";
import { EventsService } from "../events/events.service";
import { CouncilStoreService } from "./council-store.service";

/** Immutable searchable council memory — no duplicate storage */
@Injectable()
export class CouncilMemoryService implements CouncilMemoryPort {
  constructor(
    private readonly store: CouncilStoreService,
    private readonly events: EventsService,
  ) {}

  async append(entry: Omit<CouncilMemoryEntry, "entryId" | "immutable" | "recordedAt">): Promise<CouncilMemoryEntry> {
    const full: CouncilMemoryEntry = {
      ...entry,
      entryId: this.store.newId("cmem"),
      immutable: true,
      recordedAt: new Date().toISOString(),
    };
    const list = this.store.memoryEntries.get(entry.sessionId) ?? [];
    list.push(full);
    this.store.memoryEntries.set(entry.sessionId, list);

    await this.events.publish("council.memory.appended", entry.companyId, {
      entryId: full.entryId,
      entryType: entry.entryType,
    }, { correlationId: entry.correlationId });

    return full;
  }

  async recordMinutes(input: Omit<CouncilMinutes, "minutesId" | "recordedAt">): Promise<CouncilMinutes> {
    const minutes: CouncilMinutes = {
      ...input,
      minutesId: this.store.newId("min"),
      recordedAt: new Date().toISOString(),
    };
    this.store.minutes.set(minutes.minutesId, minutes);
    await this.append({
      companyId: input.companyId,
      sessionId: input.sessionId,
      issueId: input.issueId,
      entryType: "minutes",
      refId: minutes.minutesId,
      summary: input.content.slice(0, 200),
      payload: { content: input.content, participants: input.participatingExecutiveIds },
      correlationId: input.correlationId,
    });
    return minutes;
  }

  async search(
    companyId: string,
    query: string,
    filters?: { sessionId?: string; entryType?: CouncilMemoryEntryType },
  ): Promise<CouncilMemorySearchResult> {
    const q = query.toLowerCase();
    let entries = [...this.store.memoryEntries.values()].flat();
    entries = entries.filter((e) => e.companyId === companyId);
    if (filters?.sessionId) entries = entries.filter((e) => e.sessionId === filters.sessionId);
    if (filters?.entryType) entries = entries.filter((e) => e.entryType === filters.entryType);
    if (q) entries = entries.filter((e) => e.summary.toLowerCase().includes(q) || e.entryType.includes(q));

    return {
      companyId,
      query,
      entries,
      total: entries.length,
      searchedAt: new Date().toISOString(),
    };
  }

  async getBySession(sessionId: string): Promise<CouncilMemoryEntry[]> {
    return this.store.memoryEntries.get(sessionId) ?? [];
  }

  async replay(sessionId: string): Promise<CouncilMemoryEntry[]> {
    return this.getBySession(sessionId);
  }
}
