"use client";

import { cn } from "@/lib/utils";

export function KeyValueGrid({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, v]) => v != null && typeof v !== "object");
  if (entries.length === 0) return null;
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {entries.map(([key, value]) => (
        <div key={key} className="rounded-lg bg-white/[0.03] px-3 py-2">
          <dt className="text-xs uppercase tracking-wider text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground/90">{String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function DataList<T extends { id?: string }>({
  items,
  render,
  emptyMessage = "No items",
}: {
  items: T[];
  render: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  return <ul className="space-y-2">{items.map((item, i) => render(item, i))}</ul>;
}

export function TimelineList({
  items,
}: {
  items: Array<{ id?: string; label: string; sublabel?: string; at?: string }>;
}) {
  return (
    <ul className="space-y-3 border-l border-white/10 pl-4">
      {items.map((item, i) => (
        <li key={item.id ?? i} className="relative">
          <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
          <p className="text-sm text-foreground/90">{item.label}</p>
          {item.sublabel && <p className="text-xs text-muted-foreground">{item.sublabel}</p>}
          {item.at && <p className="text-xs text-muted-foreground/70">{item.at}</p>}
        </li>
      ))}
    </ul>
  );
}

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const color = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  return <span className={cn("text-2xl font-bold", color, className)}>{score}%</span>;
}

export function GenericDataView({ data }: { data: unknown }) {
  if (data == null) return <p className="text-sm text-muted-foreground">No data</p>;
  if (Array.isArray(data)) {
    if (data.length === 0) return <p className="text-sm text-muted-foreground">No items</p>;
    return (
      <ul className="max-h-80 space-y-2 overflow-y-auto">
        {data.slice(0, 20).map((item, i) => (
          <li key={i} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground/80">
            {typeof item === "object" && item !== null
              ? (item as { title?: string; name?: string; summary?: string; observation?: string; statement?: string }).title ??
                (item as { name?: string }).name ??
                (item as { summary?: string }).summary ??
                (item as { observation?: string }).observation ??
                (item as { statement?: string }).statement ??
                JSON.stringify(item).slice(0, 120)
              : String(item)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if ("score" in obj || "overallScore" in obj || "healthScore" in obj) {
      const score = (obj.score ?? obj.overallScore ?? obj.healthScore) as number;
      return (
        <div>
          <ScoreBadge score={Math.round(score)} />
          <KeyValueGrid data={obj} />
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <KeyValueGrid data={obj} />
        {Object.entries(obj)
          .filter(([, v]) => Array.isArray(v))
          .map(([key, arr]) => (
            <div key={key}>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{key}</p>
              <GenericDataView data={arr} />
            </div>
          ))}
      </div>
    );
  }
  return <p className="text-sm text-foreground/80">{String(data)}</p>;
}
