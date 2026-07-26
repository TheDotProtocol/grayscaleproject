"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Navigation,
  Plus,
  FlaskConical,
  TrendingUp,
  Users,
  BookMarked,
  Building2,
  Clock,
  Pin,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { WORKSPACE_NAV, CONSTITUTIONAL_EXECUTIVES } from "@/lib/workspace/navigation";
import { fetchGlobalSearch, fetchQuickActions, updateWorkspaceSession } from "@/lib/api/workspace";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchResult {
  domain: string;
  id: string;
  title: string;
  summary?: string;
  route?: string;
  group?: string;
}

interface QuickAction {
  id: string;
  name: string;
  description?: string;
  actionId: string;
  target: string;
}

type CommandItem = {
  id: string;
  label: string;
  detail?: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
};

const RECENT_KEY = "grayscale-recent-commands";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [searching, setSearching] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const router = useRouter();
  const { token, company } = useAuth();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecent(JSON.parse(stored) as string[]);
  }, []);

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

  useEffect(() => {
    if (!open || !company?.id || !token || token === "dev-session-token") return;
    fetchQuickActions<QuickAction[]>(company.id, token).then(setQuickActions).catch(() => setQuickActions([]));
  }, [open, company?.id, token]);

  useEffect(() => {
    if (!query.trim() || !company?.id || !token || token === "dev-session-token") {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await fetchGlobalSearch<SearchResult[]>(company.id, token, query);
        setSearchResults(results);
        await updateWorkspaceSession(company.id, token, {
          recentSearches: [query, ...recent.filter((r) => r !== query)].slice(0, 10),
        }).catch(() => undefined);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query, company?.id, token, recent]);

  const recordRecent = (label: string) => {
    const next = [label, ...recent.filter((r) => r !== label)].slice(0, 8);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const navigate = (href: string, label: string) => {
    recordRecent(label);
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  const runAction = async (actionId: string, label: string) => {
    if (!company?.id || !token) return;
    recordRecent(label);
    await api(`/companies/${company.id}/mission-control/actions`, {
      method: "POST",
      token,
      body: JSON.stringify({ actionId, payload: {} }),
    }).catch(() => undefined);
    setOpen(false);
    setQuery("");
  };

  const q = query.toLowerCase();

  const commands = useMemo(() => {
    const items: CommandItem[] = [];

    if (!query.trim()) {
      for (const label of recent) {
        items.push({
          id: `recent-${label}`,
          label,
          group: "Recent",
          icon: Clock,
          onSelect: () => setQuery(label),
        });
      }
    }

    for (const item of WORKSPACE_NAV.filter((n) => n.label.toLowerCase().includes(q))) {
      items.push({
        id: `nav-${item.href}`,
        label: item.label,
        group: "Navigate",
        icon: Navigation,
        onSelect: () => navigate(item.href, item.label),
      });
    }

    for (const exec of CONSTITUTIONAL_EXECUTIVES.filter(
      (e) => e.name.toLowerCase().includes(q) || e.title.toLowerCase().includes(q),
    )) {
      items.push({
        id: `exec-${exec.id}`,
        label: exec.name,
        detail: exec.title,
        group: "Executives",
        onSelect: () => navigate(`/dashboard/executives/${exec.id}`, exec.name),
      });
    }

    for (const action of quickActions.filter((a) => a.name.toLowerCase().includes(q))) {
      items.push({
        id: action.id,
        label: action.name,
        detail: action.description,
        group: "Actions",
        icon: Plus,
        onSelect: () => runAction(action.actionId, action.name),
      });
    }

    const pinned: CommandItem[] = [
      { id: "run-sim", label: "Run Simulation", group: "Create", icon: FlaskConical, onSelect: () => navigate("/dashboard/simulation", "Run Simulation") },
      { id: "forecast", label: "Generate Forecast", group: "Create", icon: TrendingUp, onSelect: () => navigate("/dashboard/forecasts", "Generate Forecast") },
      { id: "council", label: "Start Council Session", group: "Create", icon: Users, onSelect: () => navigate("/dashboard/council", "Start Council") },
      { id: "notebook", label: "Open Notebook", group: "Create", icon: BookMarked, onSelect: () => navigate("/dashboard/notebook", "Open Notebook") },
      { id: "org", label: "Open Organization", group: "Navigate", icon: Building2, onSelect: () => navigate("/dashboard/organization", "Organization") },
    ].filter((c) => c.label.toLowerCase().includes(q));

    items.push(...pinned);

    for (const result of searchResults) {
      items.push({
        id: `${result.domain}-${result.id}`,
        label: result.title,
        detail: result.summary ?? result.domain,
        group: result.group ?? "Search",
        icon: Search,
        onSelect: () => navigate(result.route ?? `/dashboard/${result.domain}`, result.title),
      });
    }

    return items;
  }, [q, query, recent, quickActions, searchResults, navigate]);

  const groups = [...new Set(commands.map((c) => c.group))];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-card shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Navigate, search, create, run… (⌘K)"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-muted-foreground/70"
            aria-label="Command search"
          />
          {searching && <span className="text-xs text-muted-foreground/70">Searching…</span>}
        </div>
        <div className="max-h-[28rem] overflow-y-auto p-2">
          {groups.map((group) => (
            <div key={group} className="mb-2">
              <p className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">{group}</p>
              {commands.filter((c) => c.group === group).map((cmd) => {
                const Icon = cmd.icon ?? Pin;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground/80 hover:bg-white/[0.06] focus:bg-white/[0.06] focus:outline-none"
                    onClick={cmd.onSelect}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.detail && <span className="truncate text-xs text-muted-foreground">{cmd.detail}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          {commands.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No commands match your search.</p>
          )}
        </div>
        <div className="border-t border-white/10 px-4 py-2 text-xs text-muted-foreground/70">
          ↑↓ navigate · ↵ select · esc close
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
        "flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-muted-foreground",
        "transition hover:border-white/20 hover:text-foreground/80",
      )}
    >
      <Search className="h-4 w-4" />
      <span>Command</span>
      <kbd className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-xs">⌘K</kbd>
    </button>
  );
}

export function openCommandPalette() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}
