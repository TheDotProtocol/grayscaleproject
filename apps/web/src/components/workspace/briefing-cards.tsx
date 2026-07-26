"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefingCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  icon: LucideIcon;
  accent?: "gold" | "emerald" | "amber" | "red";
  children: React.ReactNode;
}

const ACCENT: Record<string, string> = {
  gold: "text-primary",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function BriefingCard({ title, subtitle, href, icon: Icon, accent = "gold", children }: BriefingCardProps) {
  const header = (
    <>
      <Icon className={cn("h-5 w-5 shrink-0", ACCENT[accent] ?? ACCENT.gold)} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 group-hover:text-primary" />
      )}
    </>
  );

  return (
    <div className={cn("glass-card group h-full p-5 transition hover:border-primary/15", href && "cursor-pointer")}>
      {href ? (
        <Link href={href} className="mb-3 flex items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-primary/50">
          {header}
        </Link>
      ) : (
        <div className="mb-3 flex items-center gap-2">{header}</div>
      )}
      {children}
    </div>
  );
}

export function BriefingListItem({ label, detail, urgent }: { label: string; detail?: string; urgent?: boolean }) {
  return (
    <li className={cn("flex items-start justify-between gap-2 border-b border-white/5 py-2 text-sm last:border-0", urgent && "text-amber-300")}>
      <span className="text-foreground/80">{label}</span>
      {detail && <span className="shrink-0 text-xs text-muted-foreground">{detail}</span>}
    </li>
  );
}

export function WorkloadBadge({ intensity }: { intensity: string }) {
  const styles: Record<string, string> = {
    low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    moderate: "border-primary/30 bg-primary/10 text-primary",
    high: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    critical: "border-red-500/30 bg-red-500/10 text-red-300",
  };
  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider", styles[intensity] ?? styles.moderate)}>
      {intensity} workload
    </span>
  );
}
