"use client";

import { useParams } from "next/navigation";
import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchExecutive, fetchCouncil } from "@/lib/api/workspace";
import { api } from "@/lib/api";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";
import { CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { Panel } from "@/components/workspace/panel";
import { GenericDataView } from "@/components/workspace/data-display";

export default function ExecutiveWorkspacePage() {
  const params = useParams();
  const executiveId = params.id as string;
  const exec = CONSTITUTIONAL_EXECUTIVES.find((e) => e.id === executiveId);

  const status = useWorkspaceQuery((id, t) => fetchExecutive(id, t, executiveId, "/status"));
  const participation = useWorkspaceQuery((id, t) => fetchCouncil(id, t, "/collaboration/participation"));
  const certification = useWorkspaceQuery((id, t) =>
    api(`/companies/${id}/executive-compliance/${executiveId}/certify`, { token: t }),
  );

  if (!exec) {
    return (
      <WorkspacePageShell title="Executive" error="Unknown executive">
        <></>
      </WorkspacePageShell>
    );
  }

  const participationData = Array.isArray(participation.data)
    ? (participation.data as Array<{ executiveId: string }>).find((p) => p.executiveId === executiveId)
    : participation.data;

  return (
    <WorkspacePageShell
      title={exec.name}
      subtitle={exec.title}
      error={status.error}
    >
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        Certified dormant — EXECUTIVES_ENABLED=false. No chat interface. Organizational leader workspace only.
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Identity & Role">
          <GenericDataView data={{ ...exec, lifecycle: "certified_dormant", department: exec.department }} />
        </Panel>
        <ApiPanel title="Status" data={status.data} loading={status.loading} />
        <ApiPanel title="Certification (ECS)" data={certification.data} loading={certification.loading} />
        <ApiPanel title="Council Participation" data={participationData} loading={participation.loading} />
        <ApiPanel title="Discovery" subtitle="Twin-centric discovery pipeline" data={{ status: (status.data as { discoveryStatus?: string })?.discoveryStatus ?? "not_started" }} />
        <ApiPanel title="Recommendations" subtitle="Draft recommendations with explainability" data={{ executivesEnabled: false }} />
      </div>
    </WorkspacePageShell>
  );
}
