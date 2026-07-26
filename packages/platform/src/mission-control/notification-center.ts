/** Organizational Notification Center — RC1 Track B */

export type OrganizationalNotificationCategory =
  | "risk_alert"
  | "opportunity_alert"
  | "council_finished"
  | "simulation_completed"
  | "forecast_changed"
  | "learning_milestone"
  | "evolution_milestone"
  | "certification_change"
  | "automation_approval"
  | "general";

export interface OrganizationalNotification {
  id: string;
  companyId: string;
  userId: string;
  category: OrganizationalNotificationCategory;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  correlationId?: string;
}

export interface NotificationCenterPort {
  list(companyId: string, userId: string, options?: { unreadOnly?: boolean }): Promise<OrganizationalNotification[]>;
  markRead(id: string, userId: string): Promise<void>;
}
