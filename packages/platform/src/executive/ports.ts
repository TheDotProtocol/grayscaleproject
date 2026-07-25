import type { PlatformEvent } from "../events/envelope.js";
import type { CreateRecommendationInput, Recommendation } from "../intelligence/recommendations.js";
import type { CompanyContext } from "./context.js";
import type { CreateExecutiveOutputInput, ExecutiveOutput } from "./explainability.js";
import type { ExecutiveIdentity, ExecutiveHealth } from "./runtime.js";
import type { ExecutiveLifecycleState } from "./lifecycle.js";
import type { PermissionCheckInput, PermissionCheckResult } from "./permissions.js";
import type { ExecutiveCapability } from "./capabilities.js";

/** Port interfaces — executives interact only through these */

export interface EventBusPort {
  publish(type: string, companyId: string, payload: unknown, options?: {
    correlationId?: string;
    traceId?: string;
    causationId?: string;
    userId?: string;
    source?: string;
  }): Promise<PlatformEvent>;
}

export interface RecommendationPort {
  create(input: CreateRecommendationInput): Promise<Recommendation>;
}

export interface StrategyContextPort {
  buildContext(companyId: string): Promise<import("../intelligence/context.js").StrategicIntelligenceContext>;
}

/**
 * Abstract executive base — runtime infrastructure only.
 * No LLM, no personality, no business logic.
 * Sprint 2+ executives extend this class.
 */
export abstract class ExecutiveBase {
  abstract readonly identity: ExecutiveIdentity;
  abstract readonly capabilities: ExecutiveCapability[];

  constructor(
    protected readonly instanceId: string,
    protected readonly companyId: string,
  ) {}

  /** Called when context is injected — override in Sprint 2 */
  abstract onContext(context: CompanyContext): Promise<void>;

  /** React to platform events — override in Sprint 2 */
  abstract onEvent(event: PlatformEvent): Promise<void>;

  /** Health check — override in Sprint 2 */
  abstract health(): Promise<ExecutiveHealth>;

  /** Lifecycle hook — override in Sprint 2 */
  abstract onLifecycleChange(from: ExecutiveLifecycleState, to: ExecutiveLifecycleState): Promise<void>;

  /** Record structured output with explainability */
  protected formatOutput(
    input: Omit<CreateExecutiveOutputInput, "companyId" | "executiveId" | "instanceId">,
  ): CreateExecutiveOutputInput {
    return {
      ...input,
      companyId: this.companyId,
      executiveId: this.identity.id,
      instanceId: this.instanceId,
    };
  }
}

export type {
  CreateExecutiveOutputInput,
  ExecutiveOutput,
  PermissionCheckInput,
  PermissionCheckResult,
};
