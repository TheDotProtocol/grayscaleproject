import type { PlatformEventType } from "./catalog.js";
import type { PlatformEvent } from "./envelope.js";

/** Event projector — subscribes to event types and projects side effects */
export interface EventProjector {
  readonly name: string;
  /** Event types this projector handles (empty = all) */
  readonly handles: readonly (PlatformEventType | string)[];
  project(event: PlatformEvent): Promise<void>;
}

export interface ProjectorResult {
  projector: string;
  success: boolean;
  error?: string;
  durationMs: number;
}

export interface ReplayOptions {
  companyId: string;
  fromSequence?: bigint;
  toSequence?: bigint;
  types?: string[];
  /** If true, skip projectors that already processed (idempotent replay) */
  dryRun?: boolean;
}

export interface ReplayResult {
  eventsReplayed: number;
  projectorResults: ProjectorResult[];
}
