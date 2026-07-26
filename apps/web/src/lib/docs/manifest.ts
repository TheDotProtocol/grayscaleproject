/** Public documentation manifest — docs/public/ allowlist only. See PUBLIC_DOCUMENTATION_GUIDE.md */

export const DOCS_VERSION = "Grayscale OS v1.0";

export type DocVisibility = "public" | "developer";

export interface DocEntry {
  slug: string;
  title: string;
  description: string;
  file: string;
  section: string;
  visibility: DocVisibility;
}

export const DOC_ENTRIES: DocEntry[] = [
  // Overview
  { slug: "", title: "Introduction", description: "Grayscale OS v1.0 Documentation", file: "docs/public/index.md", section: "Overview", visibility: "public" },
  { slug: "quick-start", title: "Quick Start", description: "Run Grayscale in minutes", file: "docs/public/quick-start.md", section: "Overview", visibility: "public" },
  { slug: "installation", title: "Installation", description: "Detailed setup guide", file: "docs/public/installation.md", section: "Overview", visibility: "public" },
  { slug: "architecture", title: "Architecture Overview", description: "High-level platform layers", file: "docs/public/architecture-overview.md", section: "Overview", visibility: "public" },
  { slug: "faq", title: "FAQ", description: "Frequently asked questions", file: "docs/public/faq.md", section: "Overview", visibility: "public" },
  { slug: "release-notes", title: "Release Notes", description: "Grayscale OS v1.0 release", file: "docs/public/release-notes.md", section: "Overview", visibility: "public" },
  { slug: "roadmap", title: "Public Roadmap", description: "Delivered and upcoming", file: "docs/public/public-roadmap.md", section: "Overview", visibility: "public" },
  { slug: "license", title: "License", description: "Licensing overview", file: "docs/public/license.md", section: "Overview", visibility: "public" },
  { slug: "code-of-conduct", title: "Code of Conduct", description: "Community standards", file: "docs/public/code-of-conduct.md", section: "Overview", visibility: "public" },
  { slug: "community", title: "Community Guidelines", description: "How to engage", file: "docs/public/community-guidelines.md", section: "Overview", visibility: "public" },
  { slug: "contributing", title: "Contributing", description: "Contribution guide", file: "docs/public/contribution-guide.md", section: "Overview", visibility: "public" },
  { slug: "developer-platform", title: "Build on Grayscale", description: "Developer platform positioning", file: "docs/public/developer-platform.md", section: "Overview", visibility: "public" },

  // Platform
  { slug: "bedrock", title: "Bedrock", description: "Foundation platform layer", file: "docs/public/bedrock.md", section: "Platform", visibility: "public" },
  { slug: "mission-control", title: "Mission Control", description: "Founder command center", file: "docs/public/mission-control.md", section: "Platform", visibility: "public" },
  { slug: "executives", title: "Executives", description: "Executive Intelligence overview", file: "docs/public/executives.md", section: "Platform", visibility: "public" },
  { slug: "athena", title: "Athena", description: "Reference executive", file: "docs/public/athena.md", section: "Platform", visibility: "public" },
  { slug: "council", title: "Executive Council", description: "Structured deliberation", file: "docs/public/council.md", section: "Platform", visibility: "public" },
  { slug: "twin", title: "Digital Twin", description: "Organizational model", file: "docs/public/twin.md", section: "Platform", visibility: "public" },
  { slug: "simulation", title: "Simulation", description: "Scenario engine", file: "docs/public/simulation.md", section: "Platform", visibility: "public" },
  { slug: "forecast", title: "Foresight & Forecast", description: "Forward-looking intelligence", file: "docs/public/forecast.md", section: "Platform", visibility: "public" },
  { slug: "security", title: "Security", description: "Security model", file: "docs/public/security.md", section: "Security", visibility: "public" },

  // Developer
  { slug: "api", title: "API Reference", description: "HTTP APIs", file: "docs/public/api-reference.md", section: "Developer", visibility: "developer" },
  { slug: "sdk", title: "SDK Guide", description: "Plugin SDK", file: "docs/public/sdk-guide.md", section: "Developer", visibility: "developer" },
  { slug: "authentication", title: "Authentication", description: "API authentication", file: "docs/public/authentication.md", section: "Developer", visibility: "developer" },
  { slug: "deployment", title: "Deployment", description: "Production deployment", file: "docs/public/deployment.md", section: "Developer", visibility: "developer" },
  { slug: "plugins", title: "Plugin Development", description: "Build plugins", file: "docs/public/plugin-development.md", section: "Developer", visibility: "developer" },
  { slug: "extensions", title: "Extension Development", description: "Widgets and modules", file: "docs/public/extension-development.md", section: "Developer", visibility: "developer" },
  { slug: "marketplace", title: "Marketplace", description: "Marketplace overview", file: "docs/public/marketplace-overview.md", section: "Developer", visibility: "developer" },
  { slug: "webhooks", title: "Webhooks", description: "Event webhooks", file: "docs/public/webhook-guide.md", section: "Developer", visibility: "developer" },

  // Licensing
  { slug: "licensing/community", title: "Community Edition", description: "Developer evaluation", file: "docs/public/licensing/community-edition.md", section: "Licensing", visibility: "public" },
  { slug: "licensing/commercial", title: "Commercial Edition", description: "Grayscale Cloud", file: "docs/public/licensing/commercial-edition.md", section: "Licensing", visibility: "public" },
  { slug: "licensing/enterprise", title: "Enterprise Edition", description: "Dedicated deployment", file: "docs/public/licensing/enterprise-edition.md", section: "Licensing", visibility: "public" },
  { slug: "licensing/oem", title: "OEM Licensing", description: "Embed Grayscale", file: "docs/public/licensing/oem-licensing.md", section: "Licensing", visibility: "public" },
  { slug: "licensing/partner", title: "Partner Program", description: "Technology partners", file: "docs/public/licensing/partner-program.md", section: "Licensing", visibility: "public" },
  { slug: "licensing/marketplace", title: "Marketplace Program", description: "Certified publishers", file: "docs/public/licensing/marketplace-program.md", section: "Licensing", visibility: "public" },
];

export const DOC_SECTIONS = ["Overview", "Platform", "Security", "Developer", "Licensing"] as const;

export function getDocBySlug(slug: string): DocEntry | undefined {
  return DOC_ENTRIES.find((d) => d.slug === slug);
}

export function getDocNav(slug: string): { prev?: DocEntry; next?: DocEntry } {
  const idx = DOC_ENTRIES.findIndex((d) => d.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? DOC_ENTRIES[idx - 1] : undefined,
    next: idx < DOC_ENTRIES.length - 1 ? DOC_ENTRIES[idx + 1] : undefined,
  };
}

export function getDocsBySection(section: string): DocEntry[] {
  return DOC_ENTRIES.filter((d) => d.section === section);
}
