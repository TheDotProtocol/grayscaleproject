"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Brain,
  BookOpen,
  Receipt,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn, formatCurrency } from "@/lib/utils";

interface FounderDashboard {
  company: { id: string; name: string; industry: string | null };
  memoryCount: number;
  recentMemories: Array<{ id: string; title: string; category: string; createdAt: string }>;
  journalStreak: number;
  latestJournalSummary: string | null;
  upcomingBills: Array<{
    id: string;
    name: string;
    amountCents: number;
    currency: string;
    dueDate: string;
    isPaid: boolean;
  }>;
  aiProviderStatus: { ollama: boolean; openai: boolean };
}

const executives = [
  { name: "Athena", role: "Chief Strategy", color: "from-purple-600/20 to-blue-600/20", border: "border-purple-600/30" },
  { name: "Atlas", role: "Operations", color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30" },
  { name: "Hermes", role: "Communications", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
  { name: "Chronos", role: "Finance", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
];

export default function DashboardPage() {
  const { token, company } = useAuth();
  const [data, setData] = useState<FounderDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !company?.id) return;
    api<FounderDashboard>(`/dashboard/companies/${company.id}/founder`, { token })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [token, company?.id]);

  const unpaidTotal =
    data?.upcomingBills.filter((b) => !b.isPaid).reduce((s, b) => s + b.amountCents, 0) ?? 0;

  return (
    <>
      <DashboardHeader
        title="Command Center"
        subtitle={company?.name ? `${company.name} — executive overview` : undefined}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Company Memories", value: data?.memoryCount ?? "—", icon: Brain, href: "/dashboard/memory" },
          { label: "Journal Streak", value: `${data?.journalStreak ?? 0} days`, icon: BookOpen, href: "/dashboard/journal" },
          { label: "Bills Due", value: data?.upcomingBills.filter((b) => !b.isPaid).length ?? "—", icon: Receipt, href: "/dashboard/billing" },
          { label: "Unpaid Total", value: data ? formatCurrency(unpaidTotal) : "—", icon: TrendingUp, href: "/dashboard/billing" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="glass-card group p-5 transition hover:border-blue-600/40">
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-blue-600/10 p-2.5">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-600 transition group-hover:text-blue-400" />
            </div>
            <p className="mt-4 text-2xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass-card lg:col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Executive Team</h2>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <Activity className="h-3 w-3" /> Active
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {executives.map((exec) => (
              <div
                key={exec.name}
                className={cn(
                  "rounded-xl border bg-gradient-to-br p-4",
                  exec.color,
                  exec.border,
                )}
              >
                <p className="font-semibold">{exec.name}</p>
                <p className="text-xs text-slate-400">{exec.role}</p>
                <p className="mt-2 text-xs text-slate-500">Ready for delegation</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h2 className="text-lg font-semibold">AI Status</h2>
          </div>
          <div className="space-y-3">
            <StatusRow label="Ollama (local)" ok={data?.aiProviderStatus.ollama} />
            <StatusRow label="OpenAI (cloud)" ok={data?.aiProviderStatus.openai} />
          </div>
          {data?.latestJournalSummary && (
            <div className="mt-5 rounded-xl bg-white/[0.04] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Latest insight</p>
              <p className="mt-2 text-sm text-slate-300 line-clamp-4">{data.latestJournalSummary}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Memories</h2>
            <Link href="/dashboard/memory" className="text-sm text-blue-400 hover:text-blue-300">
              View all
            </Link>
          </div>
          {data?.recentMemories.length ? (
            <ul className="space-y-2">
              {data.recentMemories.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="truncate text-sm">{m.title}</span>
                  <span className="ml-2 shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] uppercase text-slate-400">
                    {m.category}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No memories yet — start building company knowledge.</p>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Bills</h2>
            <Link href="/dashboard/billing" className="text-sm text-blue-400 hover:text-blue-300">
              Manage
            </Link>
          </div>
          {data?.upcomingBills.length ? (
            <ul className="space-y-2">
              {data.upcomingBills.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="text-sm">{b.name}</span>
                  <span className={cn("text-sm font-medium", b.isPaid ? "text-emerald-400" : "text-amber-400")}>
                    {formatCurrency(b.amountCents, b.currency)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No bills tracked yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

function StatusRow({ label, ok }: { label: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={cn("h-2 w-2 rounded-full", ok ? "bg-emerald-400" : "bg-slate-600")} />
    </div>
  );
}
