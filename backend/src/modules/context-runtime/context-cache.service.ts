import { Injectable } from "@nestjs/common";
import type { ContextCachePort, ImmutableCompanyContext } from "@grayscale/platform";

@Injectable()
export class ContextCacheService implements ContextCachePort {
  private readonly store = new Map<string, { context: ImmutableCompanyContext; expiresAt: number }>();
  private readonly defaultTtlSeconds = 60;

  buildCacheKey(companyId: string, founderUserId?: string): string {
    return `ctx:${companyId}:${founderUserId ?? "default"}`;
  }

  async get(key: string): Promise<ImmutableCompanyContext | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return { ...entry.context, contextRuntime: { ...entry.context.contextRuntime, cached: true } };
  }

  async set(key: string, context: ImmutableCompanyContext, ttlSeconds = this.defaultTtlSeconds): Promise<void> {
    this.store.set(key, {
      context,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async invalidate(companyId: string): Promise<void> {
    for (const key of this.store.keys()) {
      if (key.startsWith(`ctx:${companyId}:`)) {
        this.store.delete(key);
      }
    }
  }
}
