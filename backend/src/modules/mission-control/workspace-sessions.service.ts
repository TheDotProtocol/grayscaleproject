import { Injectable } from "@nestjs/common";
import type { WorkspaceSessionPort, WorkspaceSessionState } from "@grayscale/platform";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class WorkspaceSessionsService implements WorkspaceSessionPort {
  private readonly cache = new Map<string, WorkspaceSessionState>();

  constructor(private readonly prisma: PrismaService) {}

  private key(userId: string, companyId: string) {
    return `${userId}:${companyId}`;
  }

  private empty(userId: string, companyId: string): WorkspaceSessionState {
    return {
      userId,
      companyId,
      recentSearches: [],
      pinnedNotebooks: [],
      recentCouncilSessions: [],
      openSimulations: [],
      draftRecommendations: [],
      updatedAt: new Date().toISOString(),
    };
  }

  async getSession(userId: string, companyId: string): Promise<WorkspaceSessionState> {
    const k = this.key(userId, companyId);
    if (this.cache.has(k)) return this.cache.get(k)!;

    const profile = await this.prisma.founderProfile.findUnique({ where: { userId } });
    const prefs = (profile?.preferences ?? {}) as Record<string, unknown>;
    const sessions = prefs.workspaceSessions as Record<string, WorkspaceSessionState> | undefined;
    const stored = sessions?.[companyId];
    const session = stored ?? this.empty(userId, companyId);
    this.cache.set(k, session);
    return session;
  }

  async updateSession(
    userId: string,
    companyId: string,
    patch: Partial<WorkspaceSessionState>,
  ): Promise<WorkspaceSessionState> {
    const current = await this.getSession(userId, companyId);
    const next: WorkspaceSessionState = {
      ...current,
      ...patch,
      userId,
      companyId,
      updatedAt: new Date().toISOString(),
    };
    this.cache.set(this.key(userId, companyId), next);

    const profile = await this.prisma.founderProfile.findUnique({ where: { userId } });
    const prefs = (profile?.preferences ?? {}) as Record<string, unknown>;
    const sessions = (prefs.workspaceSessions as Record<string, WorkspaceSessionState>) ?? {};
    sessions[companyId] = next;

    if (profile) {
      await this.prisma.founderProfile.update({
        where: { userId },
        data: { preferences: { ...prefs, workspaceSessions: sessions } as unknown as Prisma.InputJsonValue },
      });
    } else {
      await this.prisma.founderProfile.create({
        data: { userId, preferences: { workspaceSessions: sessions } as unknown as Prisma.InputJsonValue },
      });
    }

    return next;
  }
}
