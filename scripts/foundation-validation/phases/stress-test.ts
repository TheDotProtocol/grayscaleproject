import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { measure, measureIterations } from "../lib/timing.js";

export interface StressTestConfig {
  companies: number;
  projects: number;
  domainEvents: number;
  memoryRecords: number;
  graphNodes: number;
  recommendations: number;
}

export interface StressTestResult {
  seeded: Record<string, number>;
  timings: Awaited<ReturnType<typeof measure>>[];
  benchmarks: Awaited<ReturnType<typeof measureIterations>>[];
  dbStats: Record<string, number>;
  passed: boolean;
  blockers: string[];
}

const BATCH = 500;

async function batchCreateMany<T>(
  items: T[],
  chunkSize: number,
  insert: (chunk: T[]) => Promise<{ count: number }>,
): Promise<number> {
  let total = 0;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const result = await insert(chunk);
    total += result.count;
  }
  return total;
}

export async function runStressTest(
  prisma: PrismaClient,
  config: StressTestConfig,
  validationUserId: string,
): Promise<StressTestResult> {
  const blockers: string[] = [];
  const timings: Awaited<ReturnType<typeof measure>>[] = [];
  const seeded: Record<string, number> = {};

  const prefix = `fv-${Date.now()}`;

  // Seed companies
  const companyIds: string[] = [];
  timings.push(
    await measure("seed_companies", async () => {
      const companies = Array.from({ length: config.companies }, (_, i) => ({
        id: randomUUID(),
        name: `Validation Co ${i}`,
        slug: `${prefix}-co-${i}`,
        stage: i % 3 === 0 ? "idea" : i % 3 === 1 ? "building" : "launch",
      }));
      await batchCreateMany(companies, BATCH, (chunk) => prisma.company.createMany({ data: chunk }));
      companyIds.push(...companies.map((c) => c.id));

      await prisma.companyMember.createMany({
        data: companies.map((c) => ({
          companyId: c.id,
          userId: validationUserId,
          role: "founder",
        })),
      });
      seeded.companies = companies.length;
    }),
  );

  const primaryCompanyId = companyIds[0]!;

  // Projects as graph nodes (nodeType=project)
  timings.push(
    await measure("seed_projects", async () => {
      const perCompany = Math.ceil(config.projects / config.companies);
      const nodes: Parameters<typeof prisma.graphNode.createMany>[0]["data"] = [];
      for (const companyId of companyIds) {
        for (let i = 0; i < perCompany && nodes.length < config.projects; i++) {
          const sourceId = randomUUID();
          nodes.push({
            id: randomUUID(),
            companyId,
            nodeType: "project",
            displayName: `Project ${nodes.length}`,
            sourceTable: "validation_projects",
            sourceId,
          });
        }
      }
      seeded.projects = await batchCreateMany(nodes.slice(0, config.projects), BATCH, (chunk) =>
        prisma.graphNode.createMany({ data: chunk, skipDuplicates: true }),
      );
    }),
  );

  // Domain events
  timings.push(
    await measure("seed_domain_events", async () => {
      const perCompany = Math.ceil(config.domainEvents / config.companies);
      const events: Parameters<typeof prisma.domainEvent.createMany>[0]["data"] = [];
      for (const companyId of companyIds) {
        for (let i = 0; i < perCompany && events.length < config.domainEvents; i++) {
          events.push({
            id: randomUUID(),
            companyId,
            type: "memory.created",
            version: 1,
            payload: { title: `Event ${events.length}`, validation: true },
            correlationId: randomUUID(),
            source: "foundation-validation",
            status: i % 100 === 0 ? "failed" : "processed",
            processedAt: new Date(),
          });
        }
      }
      seeded.domainEvents = await batchCreateMany(events.slice(0, config.domainEvents), BATCH, (chunk) =>
        prisma.domainEvent.createMany({ data: chunk }),
      );
    }),
  );

  // Memory records
  timings.push(
    await measure("seed_memory_records", async () => {
      const perCompany = Math.ceil(config.memoryRecords / config.companies);
      const records: Parameters<typeof prisma.memoryRecord.createMany>[0]["data"] = [];
      for (const companyId of companyIds) {
        for (let i = 0; i < perCompany && records.length < config.memoryRecords; i++) {
          const sourceId = randomUUID();
          records.push({
            id: randomUUID(),
            companyId,
            userId: validationUserId,
            memoryType: "note",
            sourceTable: "validation_memory",
            sourceId,
            title: `Memory ${records.length}`,
            summary: `Validation memory record ${records.length}`,
            tags: ["validation"],
            occurredAt: new Date(),
          });
        }
      }
      seeded.memoryRecords = await batchCreateMany(records.slice(0, config.memoryRecords), BATCH, (chunk) =>
        prisma.memoryRecord.createMany({ data: chunk, skipDuplicates: true }),
      );
    }),
  );

  // Additional graph nodes (non-project)
  timings.push(
    await measure("seed_graph_nodes", async () => {
      const projectCount = seeded.projects ?? 0;
      const remaining = Math.max(0, config.graphNodes - projectCount);
      const perCompany = Math.ceil(remaining / config.companies);
      const nodes: Parameters<typeof prisma.graphNode.createMany>[0]["data"] = [];
      for (const companyId of companyIds) {
        for (let i = 0; i < perCompany && nodes.length < remaining; i++) {
          const sourceId = randomUUID();
          nodes.push({
            id: randomUUID(),
            companyId,
            nodeType: ["person", "concept", "document", "task"][i % 4]!,
            displayName: `Node ${projectCount + nodes.length}`,
            sourceTable: "validation_nodes",
            sourceId,
          });
        }
      }
      const count = await batchCreateMany(nodes.slice(0, remaining), BATCH, (chunk) =>
        prisma.graphNode.createMany({ data: chunk, skipDuplicates: true }),
      );
      seeded.graphNodes = projectCount + count;
    }),
  );

  // Recommendations
  timings.push(
    await measure("seed_recommendations", async () => {
      const perCompany = Math.ceil(config.recommendations / config.companies);
      const recs: Parameters<typeof prisma.recommendation.createMany>[0]["data"] = [];
      for (const companyId of companyIds) {
        for (let i = 0; i < perCompany && recs.length < config.recommendations; i++) {
          recs.push({
            id: randomUUID(),
            companyId,
            title: `Recommendation ${recs.length}`,
            summary: "Validation recommendation",
            reasoning: "Generated for foundation stress test",
            status: i % 5 === 0 ? "open" : "draft",
          });
        }
      }
      seeded.recommendations = await batchCreateMany(recs.slice(0, config.recommendations), BATCH, (chunk) =>
        prisma.recommendation.createMany({ data: chunk }),
      );
    }),
  );

  // Benchmarks on primary company
  const benchmarks = await Promise.all([
    measureIterations("memory_search", 10, async () => {
      await prisma.memoryRecord.findMany({
        where: { companyId: primaryCompanyId, title: { contains: "Memory", mode: "insensitive" } },
        take: 20,
        orderBy: { occurredAt: "desc" },
      });
    }),
    measureIterations("graph_traversal", 10, async () => {
      const node = await prisma.graphNode.findFirst({ where: { companyId: primaryCompanyId } });
      if (!node) return;
      await prisma.graphEdge.findMany({
        where: { companyId: primaryCompanyId, OR: [{ sourceNodeId: node.id }, { targetNodeId: node.id }] },
        take: 50,
      });
    }),
    measureIterations("event_store_query", 10, async () => {
      await prisma.domainEvent.findMany({
        where: { companyId: primaryCompanyId },
        orderBy: { sequence: "desc" },
        take: 100,
      });
    }),
    measureIterations("recommendation_list", 10, async () => {
      await prisma.recommendation.findMany({
        where: { companyId: primaryCompanyId, status: "open" },
        take: 50,
      });
    }),
    measureIterations("mission_control_health_query", 10, async () => {
      await Promise.all([
        prisma.platformHealthSnapshot.findFirst({ where: { companyId: primaryCompanyId }, orderBy: { recordedAt: "desc" } }),
        prisma.pulseEvent.findMany({ where: { companyId: primaryCompanyId }, take: 30, orderBy: { createdAt: "desc" } }),
        prisma.readinessSnapshot.findFirst({ where: { companyId: primaryCompanyId }, orderBy: { recordedAt: "desc" } }),
      ]);
    }),
  ]);

  const dbStats = {
    companies: await prisma.company.count({ where: { slug: { startsWith: prefix } } }),
    domainEvents: await prisma.domainEvent.count({ where: { source: "foundation-validation" } }),
    memoryRecords: await prisma.memoryRecord.count({ where: { sourceTable: "validation_memory" } }),
    graphNodes: await prisma.graphNode.count({
      where: { OR: [{ sourceTable: "validation_projects" }, { sourceTable: "validation_nodes" }] },
    }),
    recommendations: await prisma.recommendation.count({ where: { reasoning: "Generated for foundation stress test" } }),
  };

  // Thresholds
  if (benchmarks.some((b) => !b.success)) blockers.push("One or more benchmark iterations failed");
  if (benchmarks.some((b) => b.p95 > 2000)) blockers.push("p95 latency exceeds 2000ms on one or more queries");
  if (dbStats.companies < config.companies) blockers.push(`Expected ${config.companies} companies, got ${dbStats.companies}`);

  return {
    seeded,
    timings,
    benchmarks,
    dbStats,
    passed: blockers.length === 0,
    blockers,
    primaryCompanyId,
    prefix,
  } as StressTestResult & { primaryCompanyId: string; prefix: string };
}
