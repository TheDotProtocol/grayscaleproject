"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchOrganizationalTimeline } from "@/lib/api/workspace";
import { WorkspacePageShell } from "@/components/workspace/workspace-page";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  category: string;
  title: string;
  summary?: string;
  occurredAt: string;
  source: string;
  executiveId?: string;
  confidence?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  council: "border-purple-500/40 bg-purple-500/5",
  executive_discovery: "border-blue-500/40 bg-blue-500/5",
  learning: "border-emerald-500/40 bg-emerald-500/5",
  wisdom: "border-amber-500/40 bg-amber-500/5",
  simulation: "border-cyan-500/40 bg-cyan-500/5",
  forecast: "border-indigo-500/40 bg-indigo-500/5",
  evolution: "border-teal-500/40 bg-teal-500/5",
  mission_control: "border-slate-500/40 bg-slate-500/5",
};

export default function TimelinePage() {
  const timeline = useWorkspaceQuery<TimelineEntry[]>((id, t) => fetchOrganizationalTimeline(id, t, 100));

  return (
    <WorkspacePageShell
      title="Organizational Timeline"
      subtitle="Unified chronological history — Mission Control, council, evolution, and more"
      loading={timeline.loading}
      error={timeline.error}
    >
      <div className="relative space-y-0">
        {(timeline.data ?? []).map((entry, idx) => (
          <div key={entry.id} className="relative flex gap-4 pb-8">
            {idx < (timeline.data?.length ?? 0) - 1 && (
              <div className="absolute left-[7px] top-4 h-full w-px bg-white/10" />
            )}
            <div className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-blue-500 bg-[#0A0A0F]" />
            <div className={cn("flex-1 rounded-xl border p-4", CATEGORY_COLORS[entry.category] ?? "border-white/10 bg-white/[0.02]")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">{entry.category.replace(/_/g, " ")}</p>
                  <p className="font-medium text-white">{entry.title}</p>
                  {entry.summary && <p className="mt-1 text-sm text-slate-400">{entry.summary}</p>}
                </div>
                <time className="text-xs text-slate-600">
                  {new Date(entry.occurredAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-2 text-xs text-slate-600">Source: {entry.source}</p>
            </div>
          </div>
        ))}
        {!timeline.loading && (timeline.data ?? []).length === 0 && (
          <p className="text-sm text-slate-500">No timeline entries yet.</p>
        )}
      </div>
    </WorkspacePageShell>
  );
}
