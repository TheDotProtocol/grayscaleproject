/** Founder Daily Brief Framework — AIP-32 */

export type WorkloadIntensity = "low" | "moderate" | "high" | "critical";

export interface WorkloadIndicators {
  intensity: WorkloadIntensity;
  score: number;
  meetingCount: number;
  taskCount: number;
  deadlineCount: number;
  billCount: number;
  calendarEventCount: number;
}

export interface FounderDailyBrief {
  companyId: string;
  briefingDate: string;
  sections: {
    todaysPriorities: unknown[];
    blockedWork: unknown[];
    upcomingBills: unknown[];
    upcomingMeetings: unknown[];
    engineeringStatus: Record<string, unknown>;
    platformHealth: Record<string, unknown>;
    cashPosition: Record<string, unknown>;
    topRecommendations: unknown[];
    recentEvents: unknown[];
    riskChanges: unknown[];
    workload: WorkloadIndicators;
  };
  assembledAt: string;
  version: number;
}

export interface FounderBriefPort {
  assemble(companyId: string, date?: string): Promise<FounderDailyBrief>;
}
