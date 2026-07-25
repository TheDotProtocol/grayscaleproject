import { Injectable } from "@nestjs/common";
import type { EventProjector, PlatformEvent } from "@grayscale/platform";
import { DOMAIN_EVENTS } from "@grayscale/platform";
import { MemoryIngestionService } from "./memory-ingestion.service";
import { mapEventToMemoryIndex } from "./memory-event.mapper";

const MEMORY_INDEX_EVENTS = [
  DOMAIN_EVENTS.MEMORY_CREATED,
  DOMAIN_EVENTS.MEMORY_UPDATED,
  DOMAIN_EVENTS.MEMORY_DELETED,
  DOMAIN_EVENTS.JOURNAL_ENTRY_CREATED,
  DOMAIN_EVENTS.TIMELINE_EVENT_CREATED,
  DOMAIN_EVENTS.KNOWLEDGE_NODE_CREATED,
  DOMAIN_EVENTS.KNOWLEDGE_EDGE_CREATED,
  DOMAIN_EVENTS.NOTIFICATION_CREATED,
  DOMAIN_EVENTS.BILL_DUE_SOON,
  DOMAIN_EVENTS.BILL_OVERDUE,
  DOMAIN_EVENTS.AGENT_RECOMMENDATION_CREATED,
] as const;

/** Projects domain events into the unified memory index */
@Injectable()
export class MemoryIndexProjector implements EventProjector {
  readonly name = "memory-index";
  readonly handles = MEMORY_INDEX_EVENTS;

  constructor(private readonly ingestion: MemoryIngestionService) {}

  async project(event: PlatformEvent): Promise<void> {
    const mapping = mapEventToMemoryIndex(event);

    if (mapping.action === "skip") return;

    if (mapping.action === "remove") {
      await this.ingestion.remove(mapping.sourceTable, mapping.sourceId);
      return;
    }

    await this.ingestion.upsert(mapping.input);
  }
}
