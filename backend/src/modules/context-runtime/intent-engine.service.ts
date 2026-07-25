import { Injectable } from "@nestjs/common";
import type {
  IntentContext,
  IntentEnginePort,
  IntentHierarchyNode,
  IntentCoverage,
} from "@grayscale/platform";

@Injectable()
export class IntentEngineService implements IntentEnginePort {
  readonly engineId = "organizational-intent" as const;

  private emptyCoverage(): IntentCoverage {
    return { totalStrategicObjects: 0, linkedToIntent: 0, coveragePercent: 0, unlinkedEntityIds: [] };
  }

  async getHierarchy(_companyId: string): Promise<IntentHierarchyNode[]> {
    return [];
  }

  async getContext(companyId: string): Promise<IntentContext> {
    return {
      companyId,
      assembledAt: new Date().toISOString(),
      rootIntents: [],
      coverage: this.emptyCoverage(),
    };
  }

  async get(_companyId: string, _intentId: string) {
    return null;
  }

  async propose(_input: Parameters<IntentEnginePort["propose"]>[0]): Promise<never> {
    throw new Error("IntentEngineService: propose not implemented in Phase A.4");
  }

  async approve(_companyId: string, _intentId: string, _approverId: string): Promise<never> {
    throw new Error("IntentEngineService: approve not implemented in Phase A.4");
  }

  async validateTrace(_companyId: string, _entityType: string, _entityId: string) {
    return { valid: false, chain: [] };
  }

  async getCoverage(_companyId: string): Promise<IntentCoverage> {
    return this.emptyCoverage();
  }

  async captureSnapshot(companyId: string) {
    const ctx = await this.getContext(companyId);
    return {
      companyId,
      capturedAt: new Date().toISOString(),
      hierarchy: ctx.rootIntents,
      coverage: ctx.coverage,
    };
  }
}
