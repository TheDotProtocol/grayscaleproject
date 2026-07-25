/** Performance Observatory — AIP-35 */

export const METRIC_CATEGORIES = [
  "api_latency",
  "queue_depth",
  "worker_throughput",
  "slow_query",
  "cache_hit_rate",
  "database",
  "event_processing",
  "memory_usage",
  "cpu",
  "storage",
  "bandwidth",
] as const;

export type MetricCategory = (typeof METRIC_CATEGORIES)[number];

export interface PlatformMetric {
  name: string;
  category: MetricCategory;
  value: number;
  unit: string;
  labels?: Record<string, string>;
  recordedAt: string;
}

export interface MetricTrend {
  category: MetricCategory;
  name: string;
  window: string;
  points: Array<{ value: number; recordedAt: string }>;
  p50?: number;
  p95?: number;
  p99?: number;
}

export interface PerformanceObservatoryPort {
  record(metric: Omit<PlatformMetric, "recordedAt">): Promise<void>;
  getCurrent(): Promise<PlatformMetric[]>;
  getTrends(window: string, category?: MetricCategory): Promise<MetricTrend[]>;
}
