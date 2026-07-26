import { Injectable } from "@nestjs/common";
import type {
  NotificationCenterPort,
  OrganizationalNotification,
  OrganizationalNotificationCategory,
} from "@grayscale/platform";
import { NotificationsService } from "../notifications/notifications.service";

const TYPE_CATEGORY: Record<string, OrganizationalNotificationCategory> = {
  risk_alert: "risk_alert",
  opportunity: "opportunity_alert",
  council_finished: "council_finished",
  simulation_completed: "simulation_completed",
  forecast_changed: "forecast_changed",
  learning_milestone: "learning_milestone",
  evolution_milestone: "evolution_milestone",
  certification: "certification_change",
  automation_approval: "automation_approval",
};

@Injectable()
export class NotificationCenterService implements NotificationCenterPort {
  constructor(private readonly notifications: NotificationsService) {}

  async list(
    companyId: string,
    userId: string,
    options?: { unreadOnly?: boolean },
  ): Promise<OrganizationalNotification[]> {
    const rows = await this.notifications.list(userId, options?.unreadOnly ?? false);
    return rows
      .filter((n) => n.companyId === companyId || !n.companyId)
      .map((n) => ({
        id: n.id,
        companyId: n.companyId,
        userId: n.userId,
        category: this.mapCategory(n.type),
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      }));
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.notifications.markRead(id, userId);
  }

  private mapCategory(type: string): OrganizationalNotificationCategory {
    return TYPE_CATEGORY[type] ?? "general";
  }
}
