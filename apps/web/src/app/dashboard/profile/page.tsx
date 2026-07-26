"use client";

import { useAuth } from "@/lib/auth-context";
import { WorkspacePageShell } from "@/components/workspace/workspace-page";
import { Panel } from "@/components/workspace/panel";
import { KeyValueGrid } from "@/components/workspace/data-display";

export default function ProfilePage() {
  const { user, company } = useAuth();

  return (
    <WorkspacePageShell title="Founder Profile" subtitle="Your identity and company context">
      <Panel title="Founder">
        <KeyValueGrid data={{ name: user?.name ?? "—", email: user?.email ?? "—" }} />
      </Panel>
      <Panel title="Company" className="mt-6">
        <KeyValueGrid data={{ company: company?.name ?? "—", id: company?.id ?? "—" }} />
      </Panel>
    </WorkspacePageShell>
  );
}
