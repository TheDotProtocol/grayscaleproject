"use client";

import { cn } from "@/lib/utils";
import type { WidgetDataResult, WidgetInstanceConfig } from "@/hooks/use-mission-control";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Lightbulb,
  Plug,
  Radio,
  Target,
  Zap,
  Shield,
  Gauge,
  Stethoscope,
  Layers,
} from "lucide-react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "platform-health": Activity,
  "pulse-feed": Radio,
  "operational-timeline": Zap,
  "integrations-health": Plug,
  recommendations: Lightbulb,
  "upcoming-bills": DollarSign,
  "timeline-today": Calendar,
  "graph-summary": BarChart3,
  "readiness-matrix": Target,
  "founder-brief": Target,
  "plugin-status": Plug,
  "integration-cost": DollarSign,
  "reliability-dashboard": Gauge,
  "diagnostics-panel": Stethoscope,
  "performance-metrics": BarChart3,
  "platform-cost": DollarSign,
  "foundation-readiness": Target,
  "platform-evolution": Layers,
  "security-health": Shield,
};

function WidgetShell({
  title,
  icon: Icon,
  collapsed,
  pinned,
  children,
  onRefresh,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed?: boolean;
  pinned?: boolean;
  children: React.ReactNode;
  onRefresh?: () => void;
  className?: string;
}) {
  return (
    <section className={cn("glass-card p-6", pinned && "ring-1 ring-blue-500/30", className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="text-xs text-slate-500 hover:text-slate-300"
          >
            Refresh
          </button>
        )}
      </div>
      {!collapsed && children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-slate-500">{message}</p>;
}

function renderWidgetBody(widgetId: string, result: WidgetDataResult | undefined, emptyState?: string) {
  if (!result || result.status === "error") {
    return (
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
        {result?.error ?? "Widget unavailable"}
      </p>
    );
  }
  if (result.status === "empty" || result.data == null) {
    return <EmptyState message={emptyState ?? "No data yet"} />;
  }

  const data = result.data;

  switch (widgetId) {
    case "platform-health":
      return (
        <div>
          <p className="text-4xl font-bold text-white">{(data as { score?: number }).score ?? 0}%</p>
          <p className="mt-1 capitalize text-sm text-slate-400">{(data as { status?: string }).status}</p>
        </div>
      );
    case "pulse-feed": {
      const pulseData = data as { recent?: Array<{ id: string; title: string; summary?: string; type: string; severity: string }> };
      const recent = pulseData.recent ?? [];
      return (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {recent.map((p) => (
            <li key={p.id} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
              <span className="font-medium">{p.title}</span>
              {p.summary && <p className="mt-0.5 text-xs opacity-70">{p.summary}</p>}
            </li>
          ))}
        </ul>
      );
    }
    case "operational-timeline": {
      const entries = data as Array<{ id: string; title: string; type: string; occurredAt: string }>;
      if (!Array.isArray(entries)) return <EmptyState message={emptyState ?? "No events"} />;
      return (
        <ul className="max-h-64 space-y-2 overflow-y-auto">
          {entries.map((e) => (
            <li key={e.id} className="text-sm text-slate-400">
              <span className="text-slate-300">{e.title}</span>
              <span className="ml-2 text-xs text-slate-600">{e.type}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "integrations-health": {
      const items = data as Array<{ state: string; providerId: string }>;
      if (!Array.isArray(items)) return <EmptyState message="No integrations connected" />;
      return (
        <ul className="space-y-2">
          {items.map((i, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span className="text-slate-300">{i.providerId}</span>
              <span className="capitalize text-slate-500">{i.state}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "recommendations": {
      const recs = data as Array<{ id: string; title: string; summary: string }>;
      if (!Array.isArray(recs)) return <EmptyState message="No open recommendations" />;
      return (
        <ul className="space-y-2">
          {recs.map((r) => (
            <li key={r.id} className="text-sm text-slate-300">{r.title}</li>
          ))}
        </ul>
      );
    }
    case "upcoming-bills": {
      const bills = data as Array<{ id: string; name: string; amountCents: number; dueDate: string }>;
      if (!Array.isArray(bills)) return <EmptyState message="No bills tracked" />;
      return (
        <ul className="space-y-2">
          {bills.slice(0, 8).map((b) => (
            <li key={b.id} className="flex justify-between text-sm">
              <span className="text-slate-300">{b.name}</span>
              <span className="text-slate-500">${(b.amountCents / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "timeline-today": {
      const events = data as Array<{ id: string; title: string; eventType: string }>;
      if (!Array.isArray(events) || events.length === 0) return <EmptyState message="No events today" />;
      return (
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="text-sm text-slate-300">• {e.title}</li>
          ))}
        </ul>
      );
    }
    case "graph-summary": {
      const g = data as { nodeCount?: number; edgeCount?: number };
      return (
        <div className="flex gap-8 text-sm">
          <div><p className="text-2xl font-bold text-white">{g.nodeCount ?? 0}</p><p className="text-slate-500">Nodes</p></div>
          <div><p className="text-2xl font-bold text-white">{g.edgeCount ?? 0}</p><p className="text-slate-500">Edges</p></div>
        </div>
      );
    }
    case "readiness-matrix": {
      const dims = (data as { dimensions?: Array<{ name: string; score: number; status: string }> }).dimensions ?? [];
      return (
        <ul className="space-y-3">
          {dims.slice(0, 8).map((d) => (
            <li key={d.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">{d.name}</span>
                <span className="text-slate-500">{d.status === "unknown" ? "—" : `${d.score}%`}</span>
              </div>
              {d.status !== "unknown" && (
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${d.score}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>
      );
    }
    case "founder-brief": {
      const brief = data as { sections?: { workload?: { intensity: string; score: number } } };
      const workload = brief.sections?.workload;
      return workload ? (
        <div>
          <p className="text-2xl font-bold capitalize text-white">{workload.intensity}</p>
          <p className="text-sm text-slate-500">Workload intensity score: {workload.score}</p>
        </div>
      ) : (
        <EmptyState message="Brief assembling…" />
      );
    }
    case "plugin-status": {
      const plugins = data as Array<{ pluginId: string; state: string }>;
      if (!Array.isArray(plugins) || plugins.length === 0) return <EmptyState message="No plugins installed" />;
      return (
        <ul className="space-y-2">
          {plugins.map((p) => (
            <li key={p.pluginId} className="flex justify-between text-sm">
              <span className="text-slate-300">{p.pluginId}</span>
              <span className="text-slate-500">{p.state}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "integration-cost": {
      const costs = data as Array<{ provider: string; estimatedCostCents: number }>;
      if (!Array.isArray(costs) || costs.length === 0) return <EmptyState message="No integration usage recorded" />;
      return (
        <ul className="space-y-2">
          {costs.map((c, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span className="text-slate-300">{c.provider}</span>
              <span className="text-slate-500">${(c.estimatedCostCents / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "reliability-dashboard": {
      const profiles = data as Array<{ serviceId: string; errorBudget: { remaining: number }; slo: { availability: number } }>;
      if (!Array.isArray(profiles)) return <EmptyState message="Reliability data unavailable" />;
      return (
        <ul className="space-y-3">
          {profiles.slice(0, 6).map((p) => (
            <li key={p.serviceId}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-300">{p.serviceId}</span>
                <span className="text-slate-500">{p.slo.availability.toFixed(1)}% avail</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${p.errorBudget.remaining}%` }} />
              </div>
            </li>
          ))}
        </ul>
      );
    }
    case "diagnostics-panel": {
      const snap = data as { summary?: { critical: number; error: number; warning: number }; findings?: Array<{ title: string; severity: string }> };
      const summary = snap.summary;
      return (
        <div>
          {summary && (
            <div className="mb-3 flex gap-4 text-sm">
              <span className="text-red-400">{summary.critical} critical</span>
              <span className="text-amber-400">{summary.error} errors</span>
              <span className="text-slate-400">{summary.warning} warnings</span>
            </div>
          )}
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm text-slate-400">
            {(snap.findings ?? []).slice(0, 8).map((f, i) => (
              <li key={i}>• {f.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    case "performance-metrics": {
      const trends = data as Array<{ name: string; p95: number; category: string }>;
      if (!Array.isArray(trends) || trends.length === 0) return <EmptyState message="No metrics yet" />;
      return (
        <ul className="space-y-2">
          {trends.slice(0, 6).map((t) => (
            <li key={t.name} className="flex justify-between text-sm">
              <span className="text-slate-300">{t.name}</span>
              <span className="text-slate-500">{t.p95.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      );
    }
    case "platform-cost": {
      const cost = data as { totalEstimatedCents?: number; categories?: Record<string, { estimatedCents: number }> };
      return (
        <div>
          <p className="text-2xl font-bold text-white">${((cost.totalEstimatedCents ?? 0) / 100).toFixed(2)}</p>
          <p className="text-sm text-slate-500">Estimated platform cost (period)</p>
        </div>
      );
    }
    case "foundation-readiness": {
      const report = data as { verdict?: string; overallScore?: number; blockers?: Array<{ title: string }> };
      if (!report?.verdict) return <EmptyState message="Generate readiness report first" />;
      const ready = report.verdict === "READY FOR SPRINT 2";
      return (
        <div>
          <p className={cn("text-2xl font-bold", ready ? "text-emerald-400" : "text-amber-400")}>{report.verdict}</p>
          <p className="text-sm text-slate-500">Score: {report.overallScore ?? 0}/100</p>
          {(report.blockers ?? []).length > 0 && (
            <ul className="mt-2 text-xs text-slate-400">
              {report.blockers!.slice(0, 3).map((b, i) => (
                <li key={i}>• {b.title}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    case "platform-evolution": {
      const evo = data as { platformVersion?: string; schemaVersion?: string; migrationVersion?: string };
      return (
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between"><span className="text-slate-400">Platform</span><span className="text-slate-300">{evo.platformVersion}</span></li>
          <li className="flex justify-between"><span className="text-slate-400">Schema</span><span className="text-slate-300">{evo.schemaVersion}</span></li>
          <li className="flex justify-between"><span className="text-slate-400">Migration</span><span className="text-slate-300">{evo.migrationVersion}</span></li>
        </ul>
      );
    }
    case "security-health": {
      const sec = data as { score?: number; status?: string; findings?: Array<{ title: string; severity: string }> };
      return (
        <div>
          <p className="text-4xl font-bold text-white">{sec.score ?? 0}</p>
          <p className="mt-1 capitalize text-sm text-slate-400">{sec.status ?? "unknown"}</p>
          {(sec.findings ?? []).length > 0 && (
            <ul className="mt-2 text-xs text-slate-500">
              {sec.findings!.slice(0, 4).map((f, i) => (
                <li key={i}>{f.severity}: {f.title}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }
    default:
      return <EmptyState message={emptyState ?? "No data"} />;
  }
}

export function WidgetRenderer({
  instance,
  result,
  catalogName,
  emptyState,
  onRefresh,
}: {
  instance: WidgetInstanceConfig;
  result?: WidgetDataResult;
  catalogName: string;
  emptyState?: string;
  onRefresh?: () => void;
}) {
  const Icon = ICONS[instance.widgetId] ?? AlertTriangle;
  const colSpan = instance.width === 2 ? "lg:col-span-2" : "";

  return (
    <WidgetShell
      title={catalogName}
      icon={Icon}
      collapsed={instance.collapsed}
      pinned={instance.pinned}
      onRefresh={onRefresh}
      className={colSpan}
    >
      {renderWidgetBody(instance.widgetId, result, emptyState)}
    </WidgetShell>
  );
}
