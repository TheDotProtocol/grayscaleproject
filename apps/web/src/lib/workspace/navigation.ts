import type { LucideIcon } from "lucide-react";
import {
  Home,
  Building2,
  Target,
  Users,
  GitBranch,
  Compass,
  FolderKanban,
  Flag,
  Brain,
  Network,
  BookMarked,
  GraduationCap,
  Sparkles,
  Eye,
  FlaskConical,
  TrendingUp,
  Bot,
  Plug,
  Settings,
  User,
  History,
  Activity,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export const WORKSPACE_NAV: NavItem[] = [
  { href: "/dashboard/home", label: "Home", icon: Home, section: "Founder" },
  { href: "/dashboard/timeline", label: "Timeline", icon: History, section: "Founder" },
  { href: "/dashboard/activity", label: "Activity Center", icon: Activity, section: "Founder" },
  { href: "/dashboard/organization", label: "Organization", icon: Building2, section: "Founder" },
  { href: "/dashboard/mission-control", label: "Mission Control", icon: Target, section: "Operations" },
  { href: "/dashboard/council", label: "Executive Council", icon: Users, section: "Operations" },
  { href: "/dashboard/twin", label: "Living Organizational Twin", icon: GitBranch, section: "Operations" },
  { href: "/dashboard/strategy", label: "Strategy", icon: Compass, section: "Organization" },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, section: "Organization" },
  { href: "/dashboard/goals", label: "Goals", icon: Flag, section: "Organization" },
  { href: "/dashboard/memory", label: "Memory", icon: Brain, section: "Intelligence" },
  { href: "/dashboard/graph", label: "Knowledge Graph", icon: Network, section: "Intelligence" },
  { href: "/dashboard/notebook", label: "Notebook", icon: BookMarked, section: "Intelligence" },
  { href: "/dashboard/learning", label: "Learning", icon: GraduationCap, section: "Evolution" },
  { href: "/dashboard/wisdom", label: "Wisdom", icon: Sparkles, section: "Evolution" },
  { href: "/dashboard/reflection", label: "Reflection", icon: Eye, section: "Evolution" },
  { href: "/dashboard/simulation", label: "Simulation", icon: FlaskConical, section: "Future" },
  { href: "/dashboard/forecasts", label: "Forecasts", icon: TrendingUp, section: "Future" },
  { href: "/dashboard/automation", label: "Automation", icon: Bot, section: "Future" },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug, section: "System" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, section: "System" },
  { href: "/dashboard/profile", label: "Founder Profile", icon: User, section: "System" },
];

export const CONSTITUTIONAL_EXECUTIVES = [
  { id: "athena", name: "Athena", title: "Chief Executive Strategist", department: "operations" },
  { id: "atlas", name: "Atlas", title: "Chief Operations Executive", department: "operations" },
  { id: "ledger", name: "Ledger", title: "Chief Financial Executive", department: "finance" },
  { id: "mercury", name: "Mercury", title: "Chief Communications Executive", department: "communications" },
  { id: "sentinel", name: "Sentinel", title: "Chief Risk & Security Executive", department: "risk" },
  { id: "navigator", name: "Navigator", title: "Chief Strategy Executive", department: "strategy" },
  { id: "forge", name: "Forge", title: "Chief Innovation Executive", department: "innovation" },
] as const;

export type ConstitutionalExecutiveId = (typeof CONSTITUTIONAL_EXECUTIVES)[number]["id"];
