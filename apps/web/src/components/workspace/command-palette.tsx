"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { WORKSPACE_NAV } from "@/lib/workspace/navigation";
import { CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const navItems = WORKSPACE_NAV.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()));
  const execItems = CONSTITUTIONAL_EXECUTIVES.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) || e.title.toLowerCase().includes(query.toLowerCase()),
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0A0A0F] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-slate-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspace… (⌘K)"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-600"
          />
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-white/[0.06]"
              onClick={() => { router.push(item.href); setOpen(false); }}
            >
              <item.icon className="h-4 w-4 text-blue-400" />
              {item.label}
            </button>
          ))}
          {execItems.map((exec) => (
            <button
              key={exec.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-white/[0.06]"
              onClick={() => { router.push(`/dashboard/executives/${exec.id}`); setOpen(false); }}
            >
              <span className="text-blue-400">{exec.name}</span>
              <span className="text-slate-500">{exec.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommandPaletteTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-500",
        "transition hover:border-white/20 hover:text-slate-300",
      )}
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      <kbd className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-xs">⌘K</kbd>
    </button>
  );
}
