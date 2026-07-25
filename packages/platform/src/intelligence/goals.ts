export type GoalScope = "company" | "department" | "founder";
export type GoalStatus = "active" | "paused" | "achieved" | "abandoned";
export type GoalHealth = "on_track" | "at_risk" | "off_track" | "unknown";

export interface SuccessCriterion {
  id: string;
  description: string;
  metric?: string;
  target?: string;
  current?: string;
}

export interface Goal {
  id: string;
  companyId: string;
  scope: GoalScope;
  department?: string;
  title: string;
  description?: string;
  successCriteria: SuccessCriterion[];
  priorityWeight: number;
  status: GoalStatus;
  health: GoalHealth;
  progress: number;
  ownerId?: string;
  deadline?: string;
  graphNodeId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ObjectiveStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

export interface Objective {
  id: string;
  companyId: string;
  goalId: string;
  title: string;
  description?: string;
  status: ObjectiveStatus;
  completion: number;
  deadline?: string;
  ownerId?: string;
  dependencyObjectiveIds: string[];
  linkedProjectIds: string[];
  graphNodeId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalInput {
  companyId: string;
  scope: GoalScope;
  department?: string;
  title: string;
  description?: string;
  successCriteria?: SuccessCriterion[];
  priorityWeight?: number;
  ownerId?: string;
  deadline?: string;
}

export interface CreateObjectiveInput {
  companyId: string;
  goalId: string;
  title: string;
  description?: string;
  deadline?: string;
  ownerId?: string;
}
