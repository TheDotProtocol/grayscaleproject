"use client";

import { NotificationCenter } from "@/components/workspace/notification-center";
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
        <NotificationCenter />
      </div>
    </header>
  );
}
