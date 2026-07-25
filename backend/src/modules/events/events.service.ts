import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import {
  createPlatformEvent,
  type PlatformEvent,
  type PlatformEventType,
  type ReplayOptions,
  type ReplayResult,
} from "@grayscale/platform";
import { EventStoreService } from "./event-store.service";
import { ProjectorRegistryService } from "./projector-registry.service";

export const EVENT_BUS_QUEUE = "domain-events";
export const EVENT_DLQ_QUEUE = "domain-events-dlq";

/**
 * Event bus — persist-then-publish pattern.
 * Postgres is the source of truth; BullMQ is transport.
 */
@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectQueue(EVENT_BUS_QUEUE) private readonly queue: Queue,
    @InjectQueue(EVENT_DLQ_QUEUE) private readonly dlq: Queue,
    private readonly eventStore: EventStoreService,
    private readonly projectors: ProjectorRegistryService,
  ) {}

  async publish<T>(
    type: PlatformEventType | string,
    companyId: string,
    payload: T,
    options?: {
      userId?: string;
      source?: string;
      correlationId?: string;
      causationId?: string;
      traceId?: string;
    },
  ): Promise<PlatformEvent<T>> {
    const event = createPlatformEvent(type, companyId, payload, {
      userId: options?.userId,
      source: options?.source ?? "api",
      correlationId: options?.correlationId,
      causationId: options?.causationId,
      traceId: options?.traceId,
    });

    await this.eventStore.append(event);

    await this.queue.add(type, event, {
      jobId: event.id,
      removeOnComplete: 1000,
      removeOnFail: false,
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    });

    this.logger.debug(
      `Published ${type} for company ${companyId} [${event.metadata.correlationId}]`,
    );

    return event;
  }

  async replay(options: ReplayOptions): Promise<ReplayResult> {
    const stored = await this.eventStore.findForReplay({
      companyId: options.companyId,
      fromSequence: options.fromSequence,
      toSequence: options.toSequence,
      types: options.types,
    });

    const events = stored.map((row) => this.eventStore.toPlatformEvent(row));
    return this.projectors.replay(events, options);
  }

  async sendToDlq(event: PlatformEvent, error: string): Promise<void> {
    await this.dlq.add("failed-event", { event, error }, {
      removeOnComplete: false,
      removeOnFail: false,
    });
    this.logger.warn(
      `Event ${event.id} (${event.type}) sent to DLQ: ${error}`,
    );
  }
}
