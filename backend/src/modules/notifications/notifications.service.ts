import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DOMAIN_EVENTS } from "@grayscale/shared";
import { EventsService } from "../events/events.service";

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventsService,
  ) {}

  async list(userId: string, unreadOnly = false) {
    return this.prisma.notification.findMany({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async create(data: {
    companyId: string;
    userId: string;
    title: string;
    body: string;
    type: string;
  }) {
    const notification = await this.prisma.notification.create({ data });
    await this.events.publish(
      DOMAIN_EVENTS.NOTIFICATION_CREATED,
      data.companyId,
      notification,
    );
    return notification;
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }
}
