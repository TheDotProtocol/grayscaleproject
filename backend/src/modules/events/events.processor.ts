import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import type { PlatformEvent } from "@grayscale/platform";
import {
  EVENT_BUS_QUEUE,
  EVENT_DLQ_QUEUE,
  EventsService,
} from "./events.service";
import { EventStoreService } from "./event-store.service";
import { ProjectorRegistryService } from "./projector-registry.service";

/**
 * Processes domain events from BullMQ → projectors → mark processed.
 * Failures are recorded in domain_event_failures and routed to DLQ.
 */
@Processor(EVENT_BUS_QUEUE)
export class EventsProcessor extends WorkerHost {
  private readonly logger = new Logger(EventsProcessor.name);

  constructor(
    private readonly eventStore: EventStoreService,
    private readonly projectors: ProjectorRegistryService,
    private readonly events: EventsService,
  ) {
    super();
  }

  async process(job: Job<PlatformEvent>): Promise<void> {
    const event = job.data;

    this.logger.log(
      `Processing ${event.type} [${event.metadata.correlationId}] attempt=${job.attemptsMade + 1}`,
    );

    await this.eventStore.markStatus(event.id, "processing");

    try {
      await this.projectors.project(event);
      await this.eventStore.markStatus(event.id, "processed");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? err.stack : undefined;

      await this.eventStore.recordFailure({
        domainEventId: event.id,
        error: message,
        stack,
        attempt: job.attemptsMade + 1,
      });

      const isFinalAttempt = job.attemptsMade + 1 >= (job.opts.attempts ?? 1);
      if (isFinalAttempt) {
        await this.events.sendToDlq(event, message);
      }

      throw err;
    }
  }
}

@Processor(EVENT_DLQ_QUEUE)
export class EventsDlqProcessor extends WorkerHost {
  private readonly logger = new Logger(EventsDlqProcessor.name);

  async process(
    job: Job<{ event: PlatformEvent; error: string }>,
  ): Promise<void> {
    this.logger.error(
      `DLQ: ${job.data.event.type} [${job.data.event.metadata.correlationId}] — ${job.data.error}`,
    );
  }
}
