import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import type { ActionDispatchPort, PlatformJob } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { ActionRegistryService } from "./action-registry.service";

export const PLATFORM_JOBS_QUEUE = "platform-jobs";

@Injectable()
export class ActionDispatcherService implements ActionDispatchPort {
  private readonly logger = new Logger(ActionDispatcherService.name);

  constructor(
    @InjectQueue(PLATFORM_JOBS_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
    private readonly registry: ActionRegistryService,
  ) {}

  async dispatch(
    companyId: string,
    actionId: string,
    payload: Record<string, unknown>,
    userId?: string,
  ): Promise<PlatformJob> {
    const action = this.registry.get(actionId);
    if (!action) throw new NotFoundException(`Unknown action: ${actionId}`);

    const correlationId = crypto.randomUUID();
    const row = await this.prisma.platformJob.create({
      data: {
        companyId,
        actionId,
        status: "pending",
        payload: payload as object,
        userId,
        correlationId,
      },
    });

    await this.events.publish("mission-control.action.requested", companyId, {
      jobId: row.id,
      actionId,
      correlationId,
    }, { source: "mission-control", userId });

    await this.queue.add(
      "execute",
      { jobId: row.id, companyId, actionId, payload, userId, correlationId },
      { jobId: row.id, attempts: 3, backoff: { type: "exponential", delay: 1000 } },
    );

    this.logger.log(`Queued action ${actionId} job=${row.id}`);
    return this.toJob(row);
  }

  async getJob(jobId: string): Promise<PlatformJob | null> {
    const row = await this.prisma.platformJob.findUnique({ where: { id: jobId } });
    return row ? this.toJob(row) : null;
  }

  listActions(filters?: { category?: never }) {
    return this.registry.list(filters);
  }

  private toJob(row: {
    id: string;
    companyId: string;
    actionId: string;
    status: string;
    payload: unknown;
    result: unknown;
    error: string | null;
    userId: string | null;
    correlationId: string;
    createdAt: Date;
    completedAt: Date | null;
  }): PlatformJob {
    return {
      id: row.id,
      companyId: row.companyId,
      actionId: row.actionId,
      status: row.status as PlatformJob["status"],
      payload: (row.payload ?? {}) as Record<string, unknown>,
      result: row.result ? (row.result as Record<string, unknown>) : undefined,
      error: row.error ?? undefined,
      userId: row.userId ?? undefined,
      correlationId: row.correlationId,
      createdAt: row.createdAt.toISOString(),
      completedAt: row.completedAt?.toISOString(),
    };
  }
}
