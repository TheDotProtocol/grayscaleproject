/** Workspace sessions — resume founder work — RC1 Track B */

export interface WorkspaceSessionState {
  userId: string;
  companyId: string;
  recentSearches: string[];
  pinnedNotebooks: string[];
  recentCouncilSessions: string[];
  openSimulations: string[];
  draftRecommendations: string[];
  lastRoute?: string;
  updatedAt: string;
}

export interface WorkspaceSessionPort {
  getSession(userId: string, companyId: string): Promise<WorkspaceSessionState>;
  updateSession(userId: string, companyId: string, patch: Partial<WorkspaceSessionState>): Promise<WorkspaceSessionState>;
}
