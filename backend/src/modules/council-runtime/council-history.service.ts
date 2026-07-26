import { Injectable } from "@nestjs/common";
import type { CouncilHistory, CouncilReplay } from "@grayscale/platform";
import { CouncilStoreService } from "./council-store.service";

@Injectable()
export class CouncilHistoryService {
  constructor(private readonly store: CouncilStoreService) {}

  getHistory(companyId: string, filters?: { from?: string; to?: string }): CouncilHistory {
    const entries = [
      ...[...this.store.sessions.values()].map((s) => ({
        id: this.store.newId("hist"),
        companyId,
        entryType: "session" as const,
        refId: s.id,
        summary: s.title,
        correlationId: s.correlationId,
        recordedAt: s.startedAt ?? new Date().toISOString(),
      })),
      ...[...this.store.decisions.values()].map((d) => ({
        id: this.store.newId("hist"),
        companyId,
        entryType: "decision" as const,
        refId: d.id,
        summary: `Decision approved: ${d.resolutionId}`,
        correlationId: d.correlationId,
        recordedAt: d.effectiveAt,
      })),
    ].filter((e) => !filters?.from || e.recordedAt >= filters.from);

    return this.store.appendHistory(companyId, entries);
  }
}

@Injectable()
export class CouncilReplayService {
  constructor(private readonly store: CouncilStoreService) {}

  replaySession(sessionId: string): CouncilReplay {
    const session = this.store.sessions.get(sessionId);
    if (!session) throw new Error("Session not found");
    return {
      companyId: session.companyId,
      sessionId,
      events: this.store.replayEvents.get(sessionId) ?? [],
      reconstructedAt: new Date().toISOString(),
    };
  }
}

import { CouncilGovernanceService } from "./council-governance.service";
import { AttentionEngineService } from "../context-runtime/attention-engine.service";

@Injectable()
export class CouncilMetricsService {
  constructor(private readonly governance: CouncilGovernanceService) {}

  getMetrics(companyId: string, period: { from: string; to: string }) {
    return this.governance.getMetrics(companyId, period);
  }
}

@Injectable()
export class CouncilAttentionService {
  constructor(private readonly attention: AttentionEngineService) {}

  getAttention(companyId: string) {
    return this.attention.assemble(companyId);
  }
}
