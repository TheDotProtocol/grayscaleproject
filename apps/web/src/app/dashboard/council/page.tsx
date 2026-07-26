"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchCouncil } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";
import { Panel } from "@/components/workspace/panel";
import { GenericDataView } from "@/components/workspace/data-display";

export default function CouncilPage() {
  const health = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/health"));
  const sessions = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/sessions"));
  const metrics = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/metrics"));
  const collaboration = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/collaboration"));
  const participation = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/collaboration/participation"));
  const history = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/history"));

  return (
    <WorkspacePageShell title="Executive Council" subtitle="Constitutional deliberation and consensus" error={health.error}>
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Council Health" data={health.data} loading={health.loading} />
        <ApiPanel title="Council Metrics" data={metrics.data} loading={metrics.loading} />
        <ApiPanel title="Sessions" data={sessions.data} loading={sessions.loading} />
        <ApiPanel title="Collaboration" data={collaboration.data} loading={collaboration.loading} />
        <ApiPanel title="Executive Participation" data={participation.data} loading={participation.loading} />
        <ApiPanel title="Decision History" data={history.data} loading={history.loading} />
      </div>
      <Panel title="Council Certification" subtitle="Deterministic governance gates" className="mt-6">
        <CouncilCertify />
      </Panel>
    </WorkspacePageShell>
  );
}

function CouncilCertify() {
  const { data, loading } = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/certify"));
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  return <GenericDataView data={data} />;
}
