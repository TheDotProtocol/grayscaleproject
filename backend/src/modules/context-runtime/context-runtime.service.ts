import { Injectable } from "@nestjs/common";
import type { ContextRuntimePort, ImmutableCompanyContext } from "@grayscale/platform";
import { ContextCacheService } from "./context-cache.service";
import { CompanyContextAssemblerService } from "./company-context-assembler.service";

@Injectable()
export class ContextRuntimeService implements ContextRuntimePort {
  private readonly cacheTtlSeconds = 60;

  constructor(
    private readonly cache: ContextCacheService,
    private readonly assembler: CompanyContextAssemblerService,
  ) {}

  async assemble(
    companyId: string,
    options?: { correlationId?: string; founderUserId?: string; bypassCache?: boolean },
  ): Promise<ImmutableCompanyContext> {
    const cacheKey = this.cache.buildCacheKey(companyId, options?.founderUserId);

    if (!options?.bypassCache) {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const context = await this.assembler.assemble(companyId, options);
    await this.cache.set(cacheKey, context, this.cacheTtlSeconds);
    return context;
  }

  async invalidateCache(companyId: string): Promise<void> {
    await this.cache.invalidate(companyId);
  }
}
