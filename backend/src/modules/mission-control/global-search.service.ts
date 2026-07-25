import { Injectable } from "@nestjs/common";
import type { GlobalSearchPort, GlobalSearchQuery, GlobalSearchResult, SearchDomain } from "@grayscale/platform";
import { MemoryQueryService } from "../memory/memory-query.service";
import { GraphSearchService } from "../graph/graph-search.service";
import { RecommendationEngineService } from "../intelligence/recommendation-engine.service";
import { GoalEngineService } from "../intelligence/goal-engine.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PluginRuntimeService } from "../integration-platform/plugin-runtime.service";

/** Global search — architecture reserve with initial memory + graph implementation */
@Injectable()
export class GlobalSearchService implements GlobalSearchPort {
  constructor(
    private readonly memory: MemoryQueryService,
    private readonly graph: GraphSearchService,
    private readonly recommendations: RecommendationEngineService,
    private readonly goals: GoalEngineService,
    private readonly prisma: PrismaService,
    private readonly plugins: PluginRuntimeService,
  ) {}

  async search(companyId: string, query: GlobalSearchQuery): Promise<GlobalSearchResult[]> {
    const domains = query.domains ?? [
      "memory", "graph", "goals", "bills", "meetings", "recommendations", "plugins", "integrations",
    ];
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
        results.push({ domain: "integrations", id: i.id, title: i.provider, score: 0.6 });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}
