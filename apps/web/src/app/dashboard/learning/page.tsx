"use client";

import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";
import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution } from "@/lib/api/workspace";

export default function LearningPage() {
  const timeline = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/learning"));
  const health = useWorkspaceQuery((id, t) => fetchEvolution<{ learning?: { healthScore?: number } }>(id, t, "/overview"));

  return (
    <WorkspacePageShell title="Organizational Learning" subtitle="Organization-owned learning — executives contribute">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Learning Timeline" data={timeline.data} loading={timeline.loading} />
        <ApiPanel title="Learning Health" data={health.data} loading={health.loading} />
      </div>
    </WorkspacePageShell>
  );
}
