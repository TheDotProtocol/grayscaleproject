"use client";

import { WorkspacePageShell } from "@/components/workspace/workspace-page";
import { Panel, EmptyState } from "@/components/workspace/panel";

export default function ProjectsPage() {
  return (
    <WorkspacePageShell title="Projects" subtitle="Project outcomes feed organizational learning">
      <Panel title="Projects" subtitle="API-driven project tracking — extend via integrations">
        <EmptyState message="Connect integrations or create project records to populate this view." />
      </Panel>
    </WorkspacePageShell>
  );
}
