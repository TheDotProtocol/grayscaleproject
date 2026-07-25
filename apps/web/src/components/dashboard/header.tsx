"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-blue-400/80">
          Welcome back, {user?.name?.split(" ")[0]}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          type="button"
          className="relative rounded-xl border border-white/10 bg-white/[0.02] p-2.5 text-slate-400 transition hover:border-white/20 hover:text-slate-200"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
}
