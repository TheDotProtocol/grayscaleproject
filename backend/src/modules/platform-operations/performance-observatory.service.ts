import { Injectable } from "@nestjs/common";
import type { PerformanceObservatoryPort, PlatformMetric, MetricTrend, MetricCategory } from "@grayscale/platform";
import { PrismaService } from "../../prisma/prisma.service";
import * as os from "os";

@Injectable()
export class PerformanceObservatoryService implements PerformanceObservatoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async record(metric: Omit<PlatformMetric, "recordedAt">): Promise<void> {
    await this.prisma.platformMetricSnapshot.create({
      data: {
        name: metric.name,
        category: metric.category,
        value: metric.value,
        unit: metric.unit,
        labels: (metric.labels ?? {}) as object,
      },
    });
  }

  async getCurrent(): Promise<PlatformMetric[]> {
    await this.collectSystemMetrics();
    const rows = await this.prisma.platformMetricSnapshot.findMany({
      orderBy: { recordedAt: "desc" },
      take: 50,
      distinct: ["name"],
    });
    return rows.map((r) => ({
      name: r.name,
      category: r.category as MetricCategory,
      value: r.value,
      unit: r.unit,
      labels: r.labels as Record<string, string>,
      recordedAt: r.recordedAt.toISOString(),
    }));
  }

  async getTrends(window: string, category?: MetricCategory): Promise<MetricTrend[]> {
    const since = new Date();
    if (window === "1h") since.setHours(since.getHours() - 1);
    else if (window === "7d") since.setDate(since.getDate() - 7);
    else if (window === "30d") since.setDate(since.getDate() - 30);
    else since.setDate(since.getDate() - 1);

    const rows = await this.prisma.platformMetricSnapshot.findMany({
      where: { recordedAt: { gte: since }, ...(category ? { category } : {}) },
      orderBy: { recordedAt: "asc" },
      take: 500,
    });

    const byName = new Map<string, typeof rows>();
    for (const r of rows) {
      const list = byName.get(r.name) ?? [];
      list.push(r);
      byName.set(r.name, list);
    }

    return [...byName.entries()].map(([name, points]) => ({
      category: (points[0]?.category ?? "api_latency") as MetricCategory,
      name,
      window,
      points: points.map((p) => ({ value: p.value, recordedAt: p.recordedAt.toISOString() })),
      p50: percentile(points.map((p) => p.value), 50),
      p95: percentile(points.map((p) => p.value), 95),
    }));
  }

  private async collectSystemMetrics() {
    const mem = process.memoryUsage();
    await this.record({ name: "heap_used", category: "memory_usage", value: mem.heapUsed, unit: "bytes" });
    await this.record({ name: "cpu_load", category: "cpu", value: os.loadavg()[0] ?? 0, unit: "load" });
  }
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)] ?? 0;
}
