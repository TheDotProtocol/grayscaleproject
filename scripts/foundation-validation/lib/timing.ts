export interface TimingResult {
  name: string;
  durationMs: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export async function measure(
  name: string,
  fn: () => Promise<void>,
  metadata?: Record<string, unknown>,
): Promise<TimingResult> {
  const start = performance.now();
  try {
    await fn();
    return { name, durationMs: performance.now() - start, success: true, metadata };
  } catch (e) {
    return {
      name,
      durationMs: performance.now() - start,
      success: false,
      error: e instanceof Error ? e.message : String(e),
      metadata,
    };
  }
}

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)] ?? 0;
}

export async function measureIterations(
  name: string,
  iterations: number,
  fn: () => Promise<void>,
): Promise<{ name: string; samples: number[]; p50: number; p95: number; p99: number; success: boolean }> {
  const samples: number[] = [];
  let success = true;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    try {
      await fn();
      samples.push(performance.now() - start);
    } catch {
      success = false;
      break;
    }
  }
  return {
    name,
    samples,
    p50: percentile(samples, 50),
    p95: percentile(samples, 95),
    p99: percentile(samples, 99),
    success,
  };
}
