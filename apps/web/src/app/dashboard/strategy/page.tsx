"use client";

import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchEvolution, fetchGoals } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";

export default function StrategyPage() {
  const proposals = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/strategy-evolution"));
  const goals = useWorkspaceQuery((id, t) => fetchGoals(id, t));
  const wisdom = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/wisdom/approved"));

  return (
    <WorkspacePageShell title="Strategy" subtitle="Founder intent and strategy evolution proposals">
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Active Goals" data={goals.data} loading={goals.loading} />
        <ApiPanel title="Approved Wisdom" subtitle="Institutional truths guiding strategy" data={wisdom.data} loading={wisdom.loading} />
        <ApiPanel title="Strategy Evolution Proposals" subtitle="Propose-only — nothing auto-updates" data={proposals.data} loading={proposals.loading} />
      </div>
    </WorkspacePageShell>
  );
}
