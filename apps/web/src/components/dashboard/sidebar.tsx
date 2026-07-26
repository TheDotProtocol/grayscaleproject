"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { WORKSPACE_NAV, CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { openCommandPalette } from "@/components/workspace/command-palette";

export function Sidebar() {
  const pathname = usePathname();
  const { user, company, logout } = useAuth();

  const sections = [...new Set(WORKSPACE_NAV.map((n) => n.section ?? "General"))];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-card/95 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/5 px-5 md:h-[4.5rem]">
        <Link href="/dashboard/home" className="flex items-center gap-2.5">
          <Image src="/grayscale-logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-[4px] object-cover object-top" />
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">Grayscale</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Founder Workspace</p>
          </div>
        </Link>
      </div>

      <div className="border-b border-white/5 px-3 py-3">
        <button
          type="button"
          onClick={() => openCommandPalette()}
          className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-muted-foreground transition hover:border-primary/20 hover:text-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Command palette</span>
          <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {sections.map((section) => (
          <div key={section} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">{section}</p>
            {WORKSPACE_NAV.filter((n) => (n.section ?? "General") === section).map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/dashboard/home" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                    active ? "nav-active" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                  <span className="flex-1 truncate">{label}</span>
                  {active && <ChevronRight className="h-3 w-3 opacity-60" />}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="mb-2 mt-2">
          <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">Executives</p>
          {CONSTITUTIONAL_EXECUTIVES.map((exec) => {
            const href = `/dashboard/executives/${exec.id}`;
            const active = pathname === href;
            return (
              <Link
                key={exec.id}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-all",
                  active ? "nav-active" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-primary" : "bg-muted-foreground/40")} />
                {exec.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="mb-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{company?.name ?? "No company"}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/[0.04] hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
