"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchTwin } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function TwinPage() {
  const twin = useWorkspaceQuery((id, t) => fetchTwin(id, t));
  const health = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/health"));
  const timeline = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/timeline"));
  const evolution = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/evolution"));
  const integrity = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/integrity"));
  const sync = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/synchronization"));
  const versions = useWorkspaceQuery((id, t) => fetchTwin(id, t, "/versions"));

  return (
    <WorkspacePageShell title="Living Organizational Twin" subtitle="Current state, history, evolution, and integrity" error={twin.error}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Current State" data={twin.data} loading={twin.loading} />
        <ApiPanel title="Twin Health" data={health.data} loading={health.loading} />
        <ApiPanel title="Timeline" data={timeline.data} loading={timeline.loading} />
        <ApiPanel title="Evolution" data={evolution.data} loading={evolution.loading} />
        <ApiPanel title="Integrity" data={integrity.data} loading={integrity.loading} />
        <ApiPanel title="Synchronization" data={sync.data} loading={sync.loading} />
        <ApiPanel title="Version Explorer" data={versions.data} loading={versions.loading} />
      </div>
    </WorkspacePageShell>
  );
}
