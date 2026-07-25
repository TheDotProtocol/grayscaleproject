/** Identity Engine — operator identity & presentation (ADR-014)
 *  Grayscale is an Organization OS — not merely a Founder OS.
 *  Executives consume identity read-only; never mutate.
 */

export type CommunicationStyle = "professional" | "conversational" | "mixed";
export type ReportStyle = "executive_summary" | "detailed" | "bullet" | "narrative";
export type DecisionStyle = "deliberative" | "decisive" | "collaborative" | "data_driven";
export type LeadershipStyle = "directive" | "coaching" | "delegative" | "participative";
export type WorkingStyle = "deep_focus" | "multitask" | "structured_blocks" | "flexible";
export type FocusPattern = "morning" | "afternoon" | "evening" | "variable";
export type ReminderBehaviour = "minimal" | "standard" | "aggressive" | "quiet";

export interface ExecutivePresentationPrefs {
  /** Display name override per executive canonical id */
  displayNames: Record<string, string>;
  avatars: Record<string, string>;
  voices: Record<string, string>;
  nicknames: Record<string, string>;
}

export interface AccessibilityPreferences {
  reducedMotion?: boolean;
  highContrast?: boolean;
  screenReaderOptimized?: boolean;
  fontScale?: number;
}

export interface OperatorIdentityProfile {
  operatorId: string;
  companyId: string;
  /** Primary operator display name */
  displayName: string;
  timezone: string;
  language: string;

  personalPreferences: Record<string, unknown>;
  communicationStyle: CommunicationStyle;
  leadershipStyle: LeadershipStyle;
  decisionStyle: DecisionStyle;
  workingStyle: WorkingStyle;
  focusPattern: FocusPattern;
  reminderBehaviour: ReminderBehaviour;

  professionalReportStyle: ReportStyle;
  conversationStyle: CommunicationStyle;

  workingHours?: { start: string; end: string; days: number[] };
  focusHours?: { start: string; end: string; days: number[] };

  displayPreferences: Record<string, unknown>;
  executivePresentation: ExecutivePresentationPrefs;
  accessibility: AccessibilityPreferences;

  emojiUsage: boolean;
  formalityLevel: "low" | "medium" | "high";
  approvalStyle: "explicit" | "implicit_delegation" | "batch";
  meetingStyle: "async_first" | "sync_preferred" | "hybrid";

  version: number;
  updatedAt: string;
}

export interface IdentityEnginePort {
  /** Read operator identity — executives MUST use this, never write */
  getProfile(companyId: string, operatorId: string): Promise<OperatorIdentityProfile | null>;
  /** Platform/admin update only — not callable by executives */
  updateProfile(
    companyId: string,
    operatorId: string,
    patch: Partial<Omit<OperatorIdentityProfile, "operatorId" | "companyId" | "version" | "updatedAt">>,
  ): Promise<OperatorIdentityProfile>;
}
