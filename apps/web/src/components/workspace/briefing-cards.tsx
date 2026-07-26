"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefingCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  icon: LucideIcon;
  accent?: string;
  children: React.ReactNode;
}

const ACCENT: Record<string, string> = {
  blue: "text-blue-400",
  purple: "text-purple-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function BriefingCard({ title, subtitle, href, icon: Icon, accent = "blue", children }: BriefingCardProps) {
  const content = (
    <div className={cn("glass-card h-full p-5 transition hover:border-white/20", href && "group cursor-pointer")}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn("h-5 w-5", ACCENT[accent] ?? ACCENT.blue)} />
        <div>
          <p className="font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export function BriefingListItem({ label, detail, urgent }: { label: string; detail?: string; urgent?: boolean }) {
  return (
    <li className={cn("flex items-start justify-between gap-2 border-b border-white/5 py-2 text-sm last:border-0", urgent && "text-amber-300")}>
      <span className="text-slate-300">{label}</span>
      {detail && <span className="shrink-0 text-xs text-slate-500">{detail}</span>}
    </li>
  );
}

export function WorkloadBadge({ intensity }: { intensity: string }) {
  const colors: Record<string, string> = {
    low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    moderate: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    high: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    critical: "text-red-400 bg-red-500/10 border-red-500/30",
  };
  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", colors[intensity] ?? colors.moderate)}>
      {intensity} workload
    </span>
  );
}
