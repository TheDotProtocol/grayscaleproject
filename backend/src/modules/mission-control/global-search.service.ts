import { Injectable } from "@nestjs/common";
import type { GlobalSearchPort, GlobalSearchQuery, GlobalSearchResult, ScenarioPlan, DecisionPolicy } from "@grayscale/platform";
import { PHASE_D_EXECUTIVE_IDS, getExecutiveRecord } from "@grayscale/platform";
import { MemoryQueryService } from "../memory/memory-query.service";
import { GraphSearchService } from "../graph/graph-search.service";
import { RecommendationEngineService } from "../intelligence/recommendation-engine.service";
import { GoalEngineService } from "../intelligence/goal-engine.service";
import { ScenarioService } from "../intelligence/scenario.service";
import { PolicyService } from "../intelligence/policy.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PluginRuntimeService } from "../integration-platform/plugin-runtime.service";
import { CouncilSessionService } from "../council-runtime/council-session.service";

/** Global search — architecture reserve with initial memory + graph implementation */
@Injectable()
export class GlobalSearchService implements GlobalSearchPort {
  constructor(
    private readonly memory: MemoryQueryService,
    private readonly graph: GraphSearchService,
    private readonly recommendations: RecommendationEngineService,
    private readonly goals: GoalEngineService,
    private readonly scenarios: ScenarioService,
    private readonly policies: PolicyService,
    private readonly prisma: PrismaService,
    private readonly plugins: PluginRuntimeService,
    private readonly councilSessions: CouncilSessionService,
  ) {}

  async search(companyId: string, query: GlobalSearchQuery): Promise<GlobalSearchResult[]> {
    const domains: string[] = (query.domains ?? [
      "memory", "graph", "goals", "bills", "meetings", "recommendations", "plugins", "integrations",
      "executives", "council", "events", "learning", "wisdom", "forecasts", "simulations", "signals", "insights", "policies", "strategies",
    ]) as string[];
    const limit = query.limit ?? 20;
    const results: GlobalSearchResult[] = [];

    if (domains.includes("memory") && query.q) {
      const mem = await this.memory.search(companyId, { q: query.q, limit: 5 });
      for (const m of mem.items ?? []) {
        results.push({
          domain: "memory",
          id: m.id,
          title: m.title,
          summary: m.summary ?? undefined,
          score: 0.9,
          route: `/dashboard/memory`,
        });
      }
    }

    if (domains.includes("graph") && query.q) {
      const nodes = await this.graph.searchNodes(companyId, { q: query.q, limit: 5 });
      for (const n of nodes) {
        results.push({
          domain: "graph",
          id: n.id,
          title: n.displayName,
          summary: n.summary ?? undefined,
          score: 0.85,
          route: `/dashboard/graph`,
        });
      }
    }

    if (domains.includes("recommendations")) {
      const recs = await this.recommendations.listOpen(companyId);
      const filtered = query.q
        ? recs.filter((r) => r.title.toLowerCase().includes(query.q.toLowerCase()))
        : recs;
      for (const r of filtered.slice(0, 5)) {
        results.push({
          domain: "recommendations",
          id: r.id,
          title: r.title,
          summary: r.summary,
          score: 0.8,
        });
      }
    }

    if (domains.includes("goals")) {
      const goals = await this.goals.listActive(companyId);
      const filtered = query.q
        ? goals.filter((g) => g.title.toLowerCase().includes(query.q.toLowerCase()))
        : goals;
      for (const g of filtered.slice(0, 5)) {
        results.push({ domain: "goals", id: g.id, title: g.title, summary: g.description, score: 0.75 });
      }
    }

    if (domains.includes("bills") && query.q) {
      const bills = await this.prisma.bill.findMany({
        where: { companyId, name: { contains: query.q, mode: "insensitive" } },
        take: 5,
      });
      for (const b of bills) {
        results.push({ domain: "bills", id: b.id, title: b.name, score: 0.7 });
      }
    }

    if (domains.includes("meetings") && query.q) {
      const events = await this.prisma.timelineEvent.findMany({
        where: { companyId, title: { contains: query.q, mode: "insensitive" } },
        take: 5,
      });
      for (const e of events) {
        results.push({ domain: "meetings", id: e.id, title: e.title, score: 0.7 });
      }
    }

    if (domains.includes("plugins")) {
      const installed = await this.plugins.listInstalled(companyId);
      for (const p of installed.slice(0, 5)) {
        results.push({ domain: "plugins", id: p.pluginId, title: p.pluginId, score: 0.6 });
      }
    }

    if (domains.includes("integrations")) {
      const integrations = await this.prisma.integration.findMany({ where: { companyId } });
      for (const i of integrations) {
        results.push({ domain: "integrations", id: i.id, title: i.provider, score: 0.6, group: "Integrations" });
      }
    }

    if (domains.includes("executives")) {
      const q = query.q.toLowerCase();
      for (const id of PHASE_D_EXECUTIVE_IDS) {
        const identity = getExecutiveRecord(id);
        if (!identity) continue;
        const label = identity.canonicalName.charAt(0).toUpperCase() + identity.canonicalName.slice(1);
        if (!query.q || label.toLowerCase().includes(q) || identity.title.toLowerCase().includes(q)) {
          results.push({
            domain: "executives",
            id,
            title: label,
            summary: identity.title,
            score: 0.95,
            route: `/dashboard/executives/${id}`,
            group: "Executives",
          });
        }
      }
    }

    if (domains.includes("council")) {
      const sessions = this.councilSessions.listSessions(companyId);
      const filtered = query.q
        ? sessions.filter((s) => s.title.toLowerCase().includes(query.q.toLowerCase()))
        : sessions;
      for (const s of filtered.slice(0, 5)) {
        results.push({
          domain: "council",
          id: s.id,
          title: s.title,
          summary: s.status,
          score: 0.88,
          route: "/dashboard/council",
          group: "Council",
        });
      }
    }

    if (domains.includes("events") && query.q) {
      const events = await this.prisma.domainEvent.findMany({
        where: { companyId, type: { contains: query.q, mode: "insensitive" } },
        take: 5,
        orderBy: { createdAt: "desc" },
      });
      for (const e of events) {
        results.push({ domain: "events", id: e.id, title: e.type, score: 0.65, group: "Events" });
      }
    }

    if (domains.includes("strategies")) {
      const strategies = await this.scenarios.list(companyId).catch((): ScenarioPlan[] => []);
      const filtered = query.q
        ? strategies.filter((s) => s.name.toLowerCase().includes(query.q.toLowerCase()))
        : strategies;
      for (const s of filtered.slice(0, 5)) {
        results.push({ domain: "strategies", id: s.id, title: s.name, score: 0.72, group: "Strategy" });
      }
    }

    if (domains.includes("learning") && query.q) {
      const memories = await this.memory.search(companyId, { q: query.q, tags: ["learning"], limit: 5 }).catch(() => ({ items: [] }));
      for (const m of memories.items ?? []) {
        results.push({ domain: "learning", id: m.id, title: m.title, summary: m.summary ?? undefined, score: 0.7, group: "Learning" });
      }
    }

    if (domains.includes("wisdom") && query.q) {
      const memories = await this.memory.search(companyId, { q: query.q, tags: ["wisdom"], limit: 5 }).catch(() => ({ items: [] }));
      for (const m of memories.items ?? []) {
        results.push({ domain: "wisdom", id: m.id, title: m.title, summary: m.summary ?? undefined, score: 0.7, group: "Wisdom" });
      }
    }

    if (domains.includes("forecasts") || domains.includes("simulations") || domains.includes("signals") || domains.includes("insights")) {
      const eventTypes = [
        ...(domains.includes("forecasts") ? ["forecast"] : []),
        ...(domains.includes("simulations") ? ["simulation"] : []),
        ...(domains.includes("signals") ? ["signal"] : []),
        ...(domains.includes("insights") ? ["insight"] : []),
      ];
      if (eventTypes.length) {
        const events = await this.prisma.domainEvent.findMany({
          where: {
            companyId,
            OR: eventTypes.map((t) => ({ type: { contains: t, mode: "insensitive" as const } })),
            ...(query.q ? { type: { contains: query.q, mode: "insensitive" } } : {}),
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        });
        for (const e of events) {
          const domain = e.type.includes("forecast") ? "forecasts"
            : e.type.includes("simulation") ? "simulations"
            : e.type.includes("signal") ? "signals" : "insights";
          if (!domains.includes(domain)) continue;
          results.push({ domain, id: e.id, title: e.type, score: 0.68, group: domain });
        }
      }
    }

    if (domains.includes("policies") && query.q) {
      const policyRows = await this.policies.listActive(companyId).catch((): DecisionPolicy[] => []);
      const filtered = policyRows.filter((p) => p.name.toLowerCase().includes(query.q.toLowerCase()));
      for (const p of filtered.slice(0, 5)) {
        results.push({ domain: "policies", id: p.id, title: p.name, score: 0.66, group: "Policies" });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
