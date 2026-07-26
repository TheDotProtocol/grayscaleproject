"use client";

import { Activity, RefreshCw, Pin, PinOff } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { WidgetRenderer } from "@/components/mission-control/widget-renderer";
import { useMissionControl } from "@/hooks/use-mission-control";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { PanelSkeleton } from "@/components/workspace/skeleton";

export default function MissionControlPage() {
  const { token, company } = useAuth();
  const { dashboard, loading, error, refresh, dispatchAction, saveLayout } = useMissionControl(
    company?.id,
    token,
  );

  const health = dashboard?.platformHealth;
  const readiness = dashboard?.readiness;
  const layout = dashboard?.layout.widgets.filter((w) => w.visible).sort((a, b) => a.order - b.order) ?? [];

  const widgetDataMap = new Map(
    (dashboard?.widgets ?? []).map((w) => [w.instanceId, w]),
  );
  const catalogMap = new Map(
    (dashboard?.catalog ?? []).map((c) => [c.id, c]),
  );

  return (
    <div>
      <DashboardHeader
        title="Mission Control"
        subtitle="Live operational command center — Project Grayscale"
        actions={
          <button
            type="button"
            onClick={() => refresh()}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </button>
        }
      />

      {/* Platform health banner */}
      <div className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-400">Platform Health</p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              {loading && !dashboard ? "Loading…" : `${health?.score ?? "—"}%`}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Live aggregation from {dashboard ? "registered platform services" : "Core Platform APIs"}
            </p>
          </div>
          <div className="flex gap-8 text-right text-sm">
            <div>
              <p className={cn(
                "text-lg font-semibold capitalize",
                health?.status === "healthy" ? "text-emerald-400" : health?.status === "attention" ? "text-amber-400" : "text-red-400",
              )}>
                {health?.status ?? "—"}
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{readiness?.overallScore ?? "—"}%</p>
              <p className="text-xs uppercase tracking-widest text-slate-500">Company Readiness</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-300">
                {readiness ? `${Math.round(readiness.dataCompleteness * 100)}%` : "—"}
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-500">Data Completeness</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {error}. Run <code className="text-amber-200">pnpm setup:dev</code> for live data.
        </p>
      )}

      {loading && !dashboard && (
        <div className="grid gap-6 lg:grid-cols-2">
          <PanelSkeleton />
          <PanelSkeleton />
        </div>
      )}

      {/* Quick actions */}
      {dashboard && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => dispatchAction("brief.refresh")}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:border-blue-500/30 hover:text-white"
          >
            Refresh Brief
          </button>
          <button
            type="button"
            onClick={() => dispatchAction("integration.retry-sync", { provider: "github" })}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:border-blue-500/30 hover:text-white"
          >
            Retry GitHub Sync
          </button>
          <button
            type="button"
            onClick={() => {
              const next = layout.map((w) => ({ ...w, pinned: !w.pinned }));
              saveLayout(next);
            }}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:border-purple-500/30 hover:text-white"
          >
            Toggle Pin Layout
          </button>
        </div>
      )}

      {/* Widget grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {layout.map((inst) => {
          const cat = catalogMap.get(inst.widgetId);
          return (
            <div key={inst.instanceId} className="relative">
              <button
                type="button"
                onClick={() => {
                  const next = layout.map((w) =>
                    w.instanceId === inst.instanceId ? { ...w, pinned: !w.pinned } : w,
                  );
                  saveLayout(next);
                }}
                className="absolute right-3 top-3 z-10 rounded-lg border border-white/10 bg-black/40 p-1.5 text-slate-500 hover:text-white"
                aria-label={inst.pinned ? "Unpin widget" : "Pin widget"}
              >
                {inst.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              </button>
              <WidgetRenderer
                instance={inst}
                result={widgetDataMap.get(inst.instanceId)}
                catalogName={cat?.name ?? inst.widgetId}
                emptyState={cat?.emptyState}
                onRefresh={refresh}
              />
            </div>
          );
        })}
      </div>

      {dashboard && layout.length === 0 && (
        <p className="text-sm text-slate-500">No widgets configured.</p>
      )}

      <p className="mt-8 flex items-center gap-1.5 text-xs text-slate-600">
        <Activity className="h-3 w-3 animate-pulse text-blue-500" />
        Mission Control Live — polls every 30s · actions execute asynchronously via platform jobs
      </p>
    </div>
  );
}
