"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Compass,
  FlaskConical,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useWorkspaceQuery } from "@/hooks/use-workspace-query";
import {
  fetchFounderBrief,
  fetchOrganizationalTimeline,
  fetchNotifications,
  fetchMissionControl,
} from "@/lib/api/workspace";
import { WorkspacePageShell } from "@/components/workspace/workspace-page";
import { BriefingCard, BriefingListItem, WorkloadBadge } from "@/components/workspace/briefing-cards";
import { BriefingSkeleton } from "@/components/workspace/skeleton";
import { WorkspaceErrorBoundary } from "@/components/workspace/error-boundary";
import { StatCard } from "@/components/workspace/panel";

interface FounderBrief {
  briefingDate: string;
  sections: {
    todaysPriorities: Array<{ title?: string; name?: string }>;
    blockedWork: Array<{ title?: string; reason?: string }>;
    topRecommendations: Array<{ title: string; summary?: string }>;
    recentEvents: Array<{ title: string; summary?: string }>;
    riskChanges: Array<{ title?: string; severity?: string }>;
    workload: { intensity: string; score: number; meetingCount: number; deadlineCount: number };
    engineeringStatus: Record<string, unknown>;
    platformHealth: { score?: number };
  };
}

interface TimelineEntry {
  id: string;
  category: string;
  title: string;
  summary?: string;
  occurredAt: string;
}

export default function FounderHomePage() {
  const brief = useWorkspaceQuery<FounderBrief>((id, t) => fetchFounderBrief(id, t));
  const timeline = useWorkspaceQuery<TimelineEntry[]>((id, t) => fetchOrganizationalTimeline(id, t, 8));
  const notifications = useWorkspaceQuery<Array<{ isRead: boolean }>>((id, t) => fetchNotifications(id, t, true));
  const health = useWorkspaceQuery<{ score: number; status: string }>((id, t) =>
    fetchMissionControl<{ score: number; status: string }>(id, t, "/health"),
  );

  const loading = brief.loading;
  const sections = brief.data?.sections;
  const unread = notifications.data?.length ?? 0;
  const todayChanges = timeline.data?.length ?? 0;

  return (
    <WorkspaceErrorBoundary fallbackTitle="Founder Home unavailable">
      <WorkspacePageShell
        title="Command Bridge"
        subtitle="Executive briefing — what requires your attention today"
        loading={loading}
        error={brief.error}
      >
        {loading && !brief.data ? (
          <BriefingSkeleton />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {sections?.workload && <WorkloadBadge intensity={sections.workload.intensity} />}
              <span className="text-sm text-slate-500">
                Briefing for {brief.data?.briefingDate ?? "today"}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Requires Attention" value={unread + (sections?.blockedWork?.length ?? 0)} hint="Notifications + blockers" />
              <StatCard label="Changed Today" value={todayChanges} hint="Organizational timeline" />
              <StatCard label="Decisions Waiting" value={sections?.topRecommendations?.length ?? 0} hint="Open recommendations" />
              <StatCard label="Platform Health" value={`${health.data?.score ?? sections?.platformHealth?.score ?? "—"}%`} hint="Mission Control" />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              <BriefingCard title="Requires Attention" subtitle="Blockers & urgent items" icon={Zap} accent="amber" href="/dashboard/activity">
                <ul>
                  {(sections?.blockedWork ?? []).slice(0, 4).map((item, i) => (
                    <BriefingListItem key={i} label={item.title ?? "Blocked item"} detail={item.reason} urgent />
                  ))}
                  {(sections?.blockedWork ?? []).length === 0 && (
                    <p className="text-sm text-slate-500">No blockers detected.</p>
                  )}
                </ul>
              </BriefingCard>

              <BriefingCard title="What Changed Today" subtitle="Organizational timeline" icon={Sparkles} accent="purple" href="/dashboard/timeline">
                <ul>
                  {(timeline.data ?? []).slice(0, 4).map((entry) => (
                    <BriefingListItem
                      key={entry.id}
                      label={entry.title}
                      detail={entry.category.replace(/_/g, " ")}
                    />
                  ))}
                  {(timeline.data ?? []).length === 0 && (
                    <p className="text-sm text-slate-500">No changes recorded today.</p>
                  )}
                </ul>
              </BriefingCard>

              <BriefingCard title="Decisions Waiting" subtitle="Recommendations & council" icon={CheckCircle2} accent="blue" href="/dashboard/council">
                <ul>
                  {(sections?.topRecommendations ?? []).slice(0, 4).map((rec, i) => (
                    <BriefingListItem key={i} label={rec.title} detail={rec.summary?.slice(0, 40)} />
                  ))}
                  {(sections?.topRecommendations ?? []).length === 0 && (
                    <p className="text-sm text-slate-500">No pending decisions.</p>
                  )}
                </ul>
              </BriefingCard>

              <BriefingCard title="Risks Increased" subtitle="Risk assessment changes" icon={Shield} accent="red" href="/dashboard/strategy">
                <ul>
                  {(sections?.riskChanges ?? []).slice(0, 4).map((risk, i) => (
                    <BriefingListItem key={i} label={risk.title ?? "Risk change"} detail={risk.severity} urgent />
                  ))}
                  {(sections?.riskChanges ?? []).length === 0 && (
                    <p className="text-sm text-slate-500">No new risk escalations.</p>
                  )}
                </ul>
              </BriefingCard>

              <BriefingCard title="Today's Priorities" subtitle="Strategic focus" icon={Compass} accent="emerald" href="/dashboard/goals">
                <ul>
                  {(sections?.todaysPriorities ?? []).slice(0, 4).map((p, i) => (
                    <BriefingListItem key={i} label={p.title ?? p.name ?? "Priority"} />
                  ))}
                  {(sections?.todaysPriorities ?? []).length === 0 && (
                    <p className="text-sm text-slate-500">Priorities assembling from strategy engine.</p>
                  )}
                </ul>
              </BriefingCard>

              <BriefingCard title="Executive Council" subtitle="Recent conclusions" icon={Users} accent="purple" href="/dashboard/council">
                <ul>
                  {(sections?.recentEvents ?? [])
                    .filter((e) => e.title.toLowerCase().includes("council"))
                    .slice(0, 3)
                    .map((e, i) => (
                      <BriefingListItem key={i} label={e.title} detail={e.summary?.slice(0, 30)} />
                    ))}
                  {(sections?.recentEvents ?? []).filter((e) => e.title.toLowerCase().includes("council")).length === 0 && (
                    <p className="text-sm text-slate-500">No recent council activity.</p>
                  )}
                </ul>
              </BriefingCard>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <BriefingCard title="Simulations & Forecasts" subtitle="Future modeling" icon={FlaskConical} accent="blue" href="/dashboard/simulation">
                <p className="text-sm text-slate-400">
                  {(sections?.recentEvents ?? []).filter((e) =>
                    /simulation|forecast/i.test(e.title),
                  ).length || 0}{" "}
                  active model runs ·{" "}
                  <Link href="/dashboard/forecasts" className="text-blue-400 hover:underline">View forecasts</Link>
                </p>
              </BriefingCard>

              <BriefingCard title="Opportunities" subtitle="Discovery signals" icon={Lightbulb} accent="emerald" href="/dashboard/learning">
                <p className="text-sm text-slate-400">
                  Review evolution milestones and learning signals in the organizational timeline.
                </p>
              </BriefingCard>

              <BriefingCard title="Athena Discoveries" subtitle="Chief of Staff insights" icon={TrendingUp} accent="amber" href="/dashboard/executives/athena">
                <p className="text-sm text-slate-400">
                  {(sections?.recentEvents ?? []).slice(0, 2).map((e) => e.title).join(" · ") || "No discoveries yet."}
                </p>
              </BriefingCard>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard/mission-control" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-blue-500/40 hover:text-white">
                Open Mission Control
              </Link>
              <Link href="/dashboard/timeline" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-purple-500/40 hover:text-white">
                Full Timeline
              </Link>
              <Link href="/dashboard/activity" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:border-amber-500/40 hover:text-white">
                Activity Center
              </Link>
            </div>
          </>
        )}
      </WorkspacePageShell>
    </WorkspaceErrorBoundary>
  );
}
