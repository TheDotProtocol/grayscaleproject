"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchActivityFeed } from "@/lib/api/workspace";
import { WorkspacePageShell } from "@/components/workspace/workspace-page";
import { cn } from "@/lib/utils";

interface ActivityEntry {
  id: string;
  actor: string;
  actorType: string;
  action: string;
  target: string;
  reason?: string;
  confidence?: number;
  occurredAt: string;
}

const ACTOR_COLORS: Record<string, string> = {
  founder: "text-blue-400",
  executive: "text-purple-400",
  council: "text-amber-400",
  system: "text-slate-400",
};

export default function ActivityPage() {
  const feed = useWorkspaceQuery<{ entries: ActivityEntry[] }>((id, t) => fetchActivityFeed(id, t, 100));

  return (
    <WorkspacePageShell
      title="Activity Center"
      subtitle="Who changed what, when, and why — fully auditable"
      loading={feed.loading}
      error={feed.error}
    >
      <div className="space-y-3">
        {(feed.data?.entries ?? []).map((entry) => (
          <div key={entry.id} className="glass-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={cn("font-medium capitalize", ACTOR_COLORS[entry.actorType] ?? ACTOR_COLORS.system)}>
                    {entry.actor}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{entry.action}</span>
                </div>
                <p className="mt-1 text-white">{entry.target}</p>
                {entry.reason && <p className="mt-1 text-sm text-slate-500">Why: {entry.reason}</p>}
              </div>
              <div className="text-right text-xs text-slate-600">
                <time>{new Date(entry.occurredAt).toLocaleString()}</time>
                {entry.confidence != null && (
                  <p className="mt-1">Confidence: {Math.round(entry.confidence * 100)}%</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {!feed.loading && (feed.data?.entries ?? []).length === 0 && (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        )}
      </div>
    </WorkspacePageShell>
  );
}
