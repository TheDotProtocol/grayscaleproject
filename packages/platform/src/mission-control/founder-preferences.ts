/** Founder workspace personalization — RC1 Track B */

export interface FounderWorkspacePreferences {
  theme: "dark" | "light" | "system";
  defaultExecutiveId?: string;
  favoriteCompanyId?: string;
  notificationPreferences: {
    riskAlerts: boolean;
    councilFinished: boolean;
    simulationCompleted: boolean;
    forecastChanged: boolean;
    learningMilestones: boolean;
    automationApproval: boolean;
  };
  workspacePreset?: string;
  pinnedWidgetIds: string[];
}

export interface FounderPreferencesPort {
  getPreferences(userId: string): Promise<{ preferences: FounderWorkspacePreferences; timezone: string }>;
  updatePreferences(userId: string, patch: Partial<FounderWorkspacePreferences>): Promise<FounderWorkspacePreferences>;
}

export const DEFAULT_FOUNDER_PREFERENCES: FounderWorkspacePreferences = {
  theme: "dark",
  notificationPreferences: {
    riskAlerts: true,
    councilFinished: true,
    simulationCompleted: true,
    forecastChanged: true,
    learningMilestones: true,
    automationApproval: true,
  },
  pinnedWidgetIds: ["platform-health", "pulse-feed"],
};
