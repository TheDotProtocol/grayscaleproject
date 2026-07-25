import { PrismaClient } from "@prisma/client";
import { measureIterations, percentile } from "../lib/timing.js";

export interface PerformanceBenchmarkResult {
  benchmarks: Record<
    string,
    { p50: number; p95: number; p99: number; samples: number; success: boolean }
  >;
  baselines: Record<string, { targetP95Ms: number; actualP95Ms: number; pass: boolean }>;
  passed: boolean;
  blockers: string[];
}

export async function runPerformanceBenchmark(
  prisma: PrismaClient,
  companyId: string,
): Promise<PerformanceBenchmarkResult> {
  const blockers: string[] = [];
  const ITERATIONS = 15;

  const raw = await Promise.all([
    measureIterations("memory_engine_search", ITERATIONS, async () => {
      await prisma.memoryRecord.findMany({
        where: { companyId, OR: [{ title: { contains: "Memory" } }, { tags: { has: "validation" } }] },
        take: 25,
        orderBy: { occurredAt: "desc" },
      });
    }),
    measureIterations("knowledge_graph_summary", ITERATIONS, async () => {
      const [nodes, edges] = await Promise.all([
        prisma.graphNode.count({ where: { companyId } }),
        prisma.graphEdge.count({ where: { companyId } }),
      ]);
      if (nodes === undefined) throw new Error("Graph query failed");
      void edges;
    }),
    measureIterations("knowledge_graph_neighbors", ITERATIONS, async () => {
      const node = await prisma.graphNode.findFirst({ where: { companyId } });
      if (!node) return;
      await prisma.graphNode.findUnique({ where: { id: node.id }, include: { edgesFrom: { take: 10 }, edgesTo: { take: 10 } } });
    }),
    measureIterations("mission_control_aggregation", ITERATIONS, async () => {
      await Promise.all([
        prisma.pulseEvent.findMany({ where: { companyId }, take: 30, orderBy: { createdAt: "desc" } }),
        prisma.recommendation.findMany({ where: { companyId, status: "open" }, take: 20 }),
        prisma.timelineEvent.findMany({ where: { companyId }, take: 20, orderBy: { occurredAt: "desc" } }),
        prisma.graphNode.count({ where: { companyId } }),
      ]);
    }),
    measureIterations("global_search_simulation", ITERATIONS, async () => {
      await Promise.all([
        prisma.memoryRecord.findMany({ where: { companyId, title: { contains: "a", mode: "insensitive" } }, take: 5 }),
        prisma.graphNode.findMany({ where: { companyId, displayName: { contains: "a", mode: "insensitive" } }, take: 5 }),
        prisma.recommendation.findMany({ where: { companyId }, take: 5 }),
        prisma.goal.findMany({ where: { companyId, status: "active" }, take: 5 }),
      ]);
    }),
    measureIterations("timeline_query", ITERATIONS, async () => {
      await prisma.timelineEvent.findMany({
        where: { companyId },
        orderBy: { occurredAt: "desc" },
        take: 50,
      });
    }),
    measureIterations("platform_health_compute", ITERATIONS, async () => {
      await Promise.all([
        prisma.platformHealthSnapshot.findFirst({ where: { companyId }, orderBy: { recordedAt: "desc" } }),
        prisma.domainEvent.count({ where: { companyId, status: "failed" } }),
        prisma.integration.count({ where: { companyId } }),
      ]);
    }),
    measureIterations("pulse_v2_aggregation", ITERATIONS, async () => {
      const since = new Date();
      since.setHours(since.getHours() - 24);
      await prisma.pulseEvent.findMany({ where: { companyId, createdAt: { gte: since } } });
    }),
    measureIterations("integration_sync_status", ITERATIONS, async () => {
      await Promise.all([
        prisma.pluginSyncJob.findMany({ where: { companyId }, take: 20, orderBy: { createdAt: "desc" } }),
        prisma.integrationHealthSnapshot.findMany({ where: { companyId }, take: 10, orderBy: { recordedAt: "desc" } }),
      ]);
    }),
  ]);

  const benchmarks: PerformanceBenchmarkResult["benchmarks"] = {};
  for (const b of raw) {
    benchmarks[b.name] = { p50: b.p50, p95: b.p95, p99: b.p99, samples: b.samples.length, success: b.success };
    if (!b.success) blockers.push(`Benchmark failed: ${b.name}`);
  }

  const targets: Record<string, number> = {
    memory_engine_search: 500,
    knowledge_graph_summary: 300,
    knowledge_graph_neighbors: 400,
    mission_control_aggregation: 800,
    global_search_simulation: 600,
    timeline_query: 300,
    platform_health_compute: 400,
    pulse_v2_aggregation: 300,
    integration_sync_status: 500,
  };

  const baselines: PerformanceBenchmarkResult["baselines"] = {};
  for (const [name, target] of Object.entries(targets)) {
    const actual = benchmarks[name]?.p95 ?? 9999;
    const pass = actual <= target;
    baselines[name] = { targetP95Ms: target, actualP95Ms: Math.round(actual), pass };
    if (!pass) blockers.push(`${name} p95 ${Math.round(actual)}ms exceeds target ${target}ms`);
  }

  return { benchmarks, baselines, passed: blockers.length === 0, blockers };
}
