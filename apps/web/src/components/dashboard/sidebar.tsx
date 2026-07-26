"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { WORKSPACE_NAV, CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const { user, company, logout } = useAuth();

  const sections = [...new Set(WORKSPACE_NAV.map((n) => n.section ?? "General"))];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-[#0A0A0F]/95 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-2.5 border-b border-white/5 px-5">
        <Link href="/dashboard/home" className="flex items-center gap-2.5">
          <Image src="/grayscale-logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-[4px] object-cover object-top" />
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Grayscale</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Founder Workspace</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {sections.map((section) => (
          <div key={section} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-slate-600">{section}</p>
            {WORKSPACE_NAV.filter((n) => (n.section ?? "General") === section).map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard/home" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                    active ? "bg-blue-600/15 text-blue-300" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active && "text-blue-400")} />
                  <span className="flex-1 truncate">{label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-60" />}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="mb-2 mt-2">
          <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-slate-600">Executives</p>
          {CONSTITUTIONAL_EXECUTIVES.map((exec) => {
            const href = `/dashboard/executives/${exec.id}`;
            const active = pathname === href;
            return (
              <Link
                key={exec.id}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-all",
                  active ? "bg-purple-600/15 text-purple-300" : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-300",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                {exec.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="truncate text-sm font-medium text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{company?.name ?? "No company"}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
