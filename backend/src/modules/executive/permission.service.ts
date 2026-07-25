import { Injectable } from "@nestjs/common";
import type {
  ExecutivePermissionPort,
  ExecutivePermission,
  ExecutivePermissionGrant,
  PermissionCheckInput,
  PermissionCheckResult,
} from "@grayscale/platform";

@Injectable()
export class PermissionService implements ExecutivePermissionPort {
  private readonly grants = new Map<string, ExecutivePermission[]>();

  async grant(grant: ExecutivePermissionGrant): Promise<void> {
    const existing = this.grants.get(grant.executiveId) ?? [];
    const merged = [...existing];
    for (const perm of grant.permissions) {
      const idx = merged.findIndex(
        (p) => p.action === perm.action && p.resource === perm.resource && p.scope === perm.scope,
      );
      if (idx >= 0) merged[idx] = perm;
      else merged.push(perm);
    }
    this.grants.set(grant.executiveId, merged);
  }

  async check(input: PermissionCheckInput): Promise<PermissionCheckResult> {
    const permissions = this.grants.get(input.executiveId) ?? [];
    const match = permissions.find(
      (p) =>
        p.action === input.action &&
        p.resource === input.resource &&
        (input.scope ? p.scope === input.scope : true) &&
        p.granted,
    );

    if (match) {
      return { allowed: true, reason: "Permission granted", matchedPermission: match };
    }

    const wildcard = permissions.find(
      (p) =>
        p.action === input.action &&
        p.resource === "*" &&
        p.granted,
    );

    if (wildcard) {
      return { allowed: true, reason: "Wildcard permission granted", matchedPermission: wildcard };
    }

    return {
      allowed: false,
      reason: `Denied: ${input.action} on ${input.resource}`,
    };
  }

  async list(executiveId: string): Promise<ExecutivePermission[]> {
    return [...(this.grants.get(executiveId) ?? [])];
  }
}
