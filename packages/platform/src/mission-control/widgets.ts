/** Widget Framework — AIP-29 */

export const WIDGET_CATEGORIES = [
  "health",
  "operations",
  "intelligence",
  "integration",
  "finance",
  "engineering",
  "brief",
] as const;

export type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];

export const REFRESH_MODES = ["realtime", "polling", "manual"] as const;
export type RefreshMode = (typeof REFRESH_MODES)[number];

export interface WidgetRefreshPolicy {
  mode: RefreshMode;
  intervalSeconds?: number;
  sseEndpoint?: string;
}

export interface WidgetLayoutMetadata {
  defaultWidth: 1 | 2;
  defaultHeight: "compact" | "standard" | "tall";
  minHeight?: number;
  order: number;
  collapsible: boolean;
  resizable: boolean;
  exportable: boolean;
}

export interface MissionControlWidgetDefinition {
  id: string;
  name: string;
  category: WidgetCategory;
  dataProvider: string;
  refreshPolicy: WidgetRefreshPolicy;
  permissions: string[];
  actions?: string[];
  configSchema?: Record<string, unknown>;
  layout: WidgetLayoutMetadata;
  emptyState?: string;
  supportsMultipleInstances: boolean;
  deepLinkPath?: string;
}

/** Per-user widget instance configuration */
export interface WidgetInstanceConfig {
  instanceId: string;
  widgetId: string;
  visible: boolean;
  order: number;
  collapsed: boolean;
  pinned: boolean;
  favorite: boolean;
  width: 1 | 2;
  height: "compact" | "standard" | "tall";
  config?: Record<string, unknown>;
}

export interface WidgetDataResult {
  instanceId: string;
  widgetId: string;
  status: "ok" | "empty" | "error";
  data: unknown;
  error?: string;
  fetchedAt: string;
}

export interface WidgetDataPort {
  fetchWidget(companyId: string, widgetId: string, config?: Record<string, unknown>): Promise<unknown>;
  fetchAll(companyId: string, instances: WidgetInstanceConfig[]): Promise<WidgetDataResult[]>;
}
