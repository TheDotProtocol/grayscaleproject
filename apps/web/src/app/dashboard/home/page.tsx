"use client";

import Link from "next/link";
import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import { fetchFounderHome, fetchCouncil, fetchEvolution, fetchMissionControl } from "@/lib/api/workspace";
import { WorkspacePageShell, ApiPanel } from "@/components/workspace/workspace-page";
import { StatCard } from "@/components/workspace/panel";
import { CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { ArrowUpRight, Target, Users, GitBranch } from "lucide-react";

interface FounderDashboard {
  memoryCount: number;
  journalStreak: number;
}

export default function FounderHomePage() {
  const founder = useWorkspaceQuery<FounderDashboard>((id, t) => fetchFounderHome(id, t));
  const council = useWorkspaceQuery((id, t) => fetchCouncil<{ status?: string }>(id, t, "/health"));
  const evolution = useWorkspaceQuery((id, t) => fetchEvolution(id, t, "/overview"));
  const mc = useWorkspaceQuery((id, t) => fetchMissionControl<{ platformHealth?: { score: number } }>(id, t, "/health"));

  const loading = founder.loading || council.loading;

  return (
    <WorkspacePageShell
      title="Founder Home"
      subtitle="Understand your organization in 60 seconds"
      loading={loading}
      error={founder.error || council.error}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Memories" value={founder.data?.memoryCount ?? "—"} hint="Institutional memory" />
        <StatCard label="Platform Health" value={`${mc.data?.platformHealth?.score ?? "—"}%`} hint="Mission Control" />
        <StatCard label="Executives" value={CONSTITUTIONAL_EXECUTIVES.length} hint="Certified dormant" />
        <StatCard label="Journal Streak" value={`${founder.data?.journalStreak ?? 0}d`} hint="Daily reflection" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Link href="/dashboard/mission-control" className="glass-card group p-6 transition hover:border-blue-600/40">
          <Target className="h-6 w-6 text-blue-400" />
          <p className="mt-3 font-semibold text-white">Mission Control</p>
          <p className="text-sm text-slate-500">Operational command center</p>
          <ArrowUpRight className="mt-2 h-4 w-4 text-slate-600 group-hover:text-blue-400" />
        </Link>
        <Link href="/dashboard/council" className="glass-card group p-6 transition hover:border-purple-600/40">
          <Users className="h-6 w-6 text-purple-400" />
          <p className="mt-3 font-semibold text-white">Executive Council</p>
          <p className="text-sm text-slate-500">Deliberation & decisions</p>
          <ArrowUpRight className="mt-2 h-4 w-4 text-slate-600 group-hover:text-purple-400" />
        </Link>
        <Link href="/dashboard/twin" className="glass-card group p-6 transition hover:border-emerald-600/40">
          <GitBranch className="h-6 w-6 text-emerald-400" />
          <p className="mt-3 font-semibold text-white">Organizational Twin</p>
          <p className="text-sm text-slate-500">Single organizational truth</p>
          <ArrowUpRight className="mt-2 h-4 w-4 text-slate-600 group-hover:text-emerald-400" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ApiPanel title="Today's Brief" subtitle="Founder briefing" data={founder.data} />
        <ApiPanel title="Organizational Evolution" subtitle="Learning, wisdom, reflection" data={evolution.data} loading={evolution.loading} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Executive Highlights</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CONSTITUTIONAL_EXECUTIVES.map((exec) => (
            <Link key={exec.id} href={`/dashboard/executives/${exec.id}`} className="glass-card p-4 transition hover:border-white/20">
              <p className="font-medium text-white">{exec.name}</p>
              <p className="text-xs text-slate-500">{exec.title}</p>
              <p className="mt-2 text-xs text-amber-400/80">Certified dormant</p>
            </Link>
          ))}
        </div>
      </div>
    </WorkspacePageShell>
  );
}
