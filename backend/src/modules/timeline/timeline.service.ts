import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { EventsService } from "../events/events.service";
import { DOMAIN_EVENTS } from "@grayscale/shared";

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async list(companyId: string) {
    return this.prisma.timelineEvent.findMany({
      where: { companyId },
      orderBy: { occurredAt: "desc" },
    });
  }

  async create(
    companyId: string,
    data: { title: string; description?: string; eventType: string; occurredAt?: string },
  ) {
    const event = await this.prisma.timelineEvent.create({
      data: {
        companyId,
        title: data.title,
        description: data.description,
        eventType: data.eventType,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : new Date(),
      },
    });
    await this.events.publish(DOMAIN_EVENTS.TIMELINE_EVENT_CREATED, companyId, event);
    return event;
  }
}
