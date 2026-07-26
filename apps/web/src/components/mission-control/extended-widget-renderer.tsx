"use client";

import { GenericDataView } from "@/components/workspace/data-display";

/** Extended widget rendering for Sprint 3/4 widgets — API-backed generic views */
export function renderExtendedWidget(widgetId: string, data: unknown, emptyState?: string): React.ReactNode {
  if (data == null) return <p className="text-sm text-slate-500">{emptyState ?? "No data"}</p>;

  // Council widgets
  if (widgetId.startsWith("council-") || widgetId === "executive-council") {
    return <GenericDataView data={data} />;
  }

  // Twin widgets
  if (widgetId.startsWith("twin-") || widgetId === "living-organizational-twin") {
    return <GenericDataView data={data} />;
  }

  // Executive / Athena widgets
  if (widgetId.startsWith("athena-") || widgetId.startsWith("executive-")) {
    return <GenericDataView data={data} />;
  }

  // Evolution widgets
  if (
    widgetId.startsWith("organizational-") ||
    widgetId.startsWith("learning-") ||
    widgetId.startsWith("wisdom-") ||
    widgetId.startsWith("reflection-") ||
    widgetId.startsWith("autonomy-") ||
    widgetId.startsWith("institutional-") ||
    widgetId.startsWith("evolution-") ||
    widgetId.startsWith("forecast-accuracy") ||
    widgetId.startsWith("simulation-accuracy") ||
    widgetId.startsWith("reality-vs")
  ) {
    return <GenericDataView data={data} />;
  }

  // Simulation / forecast MC widgets
  if (
    widgetId.startsWith("simulation-") ||
    widgetId.startsWith("scenario-") ||
    widgetId.startsWith("forecast-") ||
    widgetId.startsWith("reality-vs-forecast")
  ) {
    return <GenericDataView data={data} />;
  }

  // Decision / network
  if (widgetId.startsWith("decision-") || widgetId === "council-collaboration" || widgetId === "council-consensus" || widgetId === "council-replay") {
    return <GenericDataView data={data} />;
  }

  return null;
}
