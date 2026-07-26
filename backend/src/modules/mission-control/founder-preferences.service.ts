import { Injectable } from "@nestjs/common";
import type {
  FounderPreferencesPort,
  FounderWorkspacePreferences,
} from "@grayscale/platform";
import { DEFAULT_FOUNDER_PREFERENCES } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class FounderPreferencesService implements FounderPreferencesPort {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const profile = await this.prisma.founderProfile.findUnique({ where: { userId } });
    const stored = (profile?.preferences ?? {}) as Partial<FounderWorkspacePreferences>;
    return {
      preferences: this.mergeDefaults(stored),
      timezone: profile?.timezone ?? "UTC",
    };
  }

  async updatePreferences(userId: string, patch: Partial<FounderWorkspacePreferences>) {
    const current = await this.getPreferences(userId);
    const next = this.mergeDefaults({ ...current.preferences, ...patch });

    if (await this.prisma.founderProfile.findUnique({ where: { userId } })) {
      await this.prisma.founderProfile.update({
        where: { userId },
        data: { preferences: next as object },
      });
    } else {
      await this.prisma.founderProfile.create({
        data: { userId, preferences: next as object },
      });
    }

    return next;
  }

  private mergeDefaults(partial: Partial<FounderWorkspacePreferences>): FounderWorkspacePreferences {
    return {
      ...DEFAULT_FOUNDER_PREFERENCES,
      ...partial,
      notificationPreferences: {
        ...DEFAULT_FOUNDER_PREFERENCES.notificationPreferences,
        ...partial.notificationPreferences,
      },
      pinnedWidgetIds: partial.pinnedWidgetIds ?? DEFAULT_FOUNDER_PREFERENCES.pinnedWidgetIds,
    };
  }
}
