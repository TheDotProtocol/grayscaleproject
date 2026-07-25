/** Permission actions — independent of capabilities */

export const EXECUTIVE_PERMISSION_ACTIONS = [
  "read",
  "write",
  "approve",
  "reject",
  "execute",
  "escalate",
  "notify",
  "delegate",
] as const;

export type ExecutivePermissionAction = (typeof EXECUTIVE_PERMISSION_ACTIONS)[number];

export interface ExecutivePermission {
  action: ExecutivePermissionAction;
  resource: string;
  scope?: string;
  granted: boolean;
}

export interface ExecutivePermissionGrant {
  executiveId: string;
  permissions: ExecutivePermission[];
  grantedBy: string;
  grantedAt: string;
}

export interface PermissionCheckInput {
  executiveId: string;
  action: ExecutivePermissionAction;
  resource: string;
  scope?: string;
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason: string;
  matchedPermission?: ExecutivePermission;
}

export interface ExecutivePermissionPort {
  grant(grant: ExecutivePermissionGrant): Promise<void>;
  check(input: PermissionCheckInput): Promise<PermissionCheckResult>;
  list(executiveId: string): Promise<ExecutivePermission[]>;
}
