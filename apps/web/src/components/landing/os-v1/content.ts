/** Grayscale OS v1.0 — landing page content (enterprise copy) */

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Documentation", href: "/docs" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Governance", href: "#governance" },
  { label: "Pricing", href: "#pricing" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Leadership", href: "/leadership" },
  { label: "Contact", href: "/contact" },
] as const;

export const HERO = {
  eyebrow: "Grayscale OS v1.0 · Codename Bedrock",
  headline: "The Organizational Operating System for decisive leadership.",
  subheadline:
    "Run your company with institutional memory, executive explainability, and constitutional governance — not fragmented tools and opaque automation.",
  primaryCta: "Request Access",
  secondaryCta: "View Platform",
};

export const WHY = {
  id: "why",
  title: "Why organizations need Grayscale",
  subtitle: "Mission-critical clarity for every stage of growth",
  points: [
    {
      title: "Decision quality at scale",
      body: "When context lives in twelve systems, judgment degrades. Grayscale unifies organizational state so every decision traces to evidence, goals, and institutional memory.",
    },
    {
      title: "Founder confidence preserved",
      body: "You retain final authority. Every recommendation reduces cognitive load without surrendering control. Overrides become learning — not failures to hide.",
    },
    {
      title: "Operational clarity",
      body: "Strategy, execution, and governance converge in one command surface. Boards, COOs, and strategy teams see the same truth — not competing dashboards.",
    },
    {
      title: "Institutional memory that compounds",
      body: "Knowledge belongs to the organization, not individuals. Notebook, memory, graph, and DNA are org-owned assets — custodied, not siloed.",
    },
  ],
};

export const PLATFORM = {
  id: "platform",
  title: "The Organizational Operating System",
  subtitle: "Not a productivity tool. Infrastructure for collective judgment.",
  body: "Grayscale OS treats your company as a digital organization — with perception, reasoning, governance, and operation as first-class layers. Everything is deterministic, explainable, versioned, and auditable.",
  pillars: [
    { label: "Event-sourced bedrock", desc: "Persist-then-publish. Every action traceable." },
    { label: "Unified CompanyContext", desc: "One read-only organizational state. No duplicate storage." },
    { label: "Constitutional hierarchy", desc: "Founder Constitution → Policy Engine → Governance Kernel." },
    { label: "Mission Control", desc: "Founder command surface for health, timeline, and readiness." },
  ],
};

export type ArchitectureLayerId =
  | "architecture-lock"
  | "founder-constitution"
  | "organizational-runtime"
  | "policy-governance"
  | "mission-control";

export const ARCHITECTURE_LAYERS: Array<{
  id: ArchitectureLayerId;
  label: string;
  title: string;
  subtitle: string;
  body: string;
  points?: string[];
  accent?: boolean;
}> = [
  {
    id: "architecture-lock",
    label: "Architecture Lock",
    title: "Architecture Lock",
    subtitle: "Constitutional foundation",
    body: "Architecture Lock is the immutable declaration that Bedrock is frozen. No rewrites. All future capabilities extend Foundation through constitutional documents and ADRs — never through breaking changes to the certified platform.",
    points: [
      "Foundation certified at 96/100 — FROZEN",
      "89 Architecture Decision Records accepted",
      "Sprint work extends Bedrock; never replaces it",
      "Executive and automation layers inherit Bedrock constraints",
    ],
  },
  {
    id: "founder-constitution",
    label: "Founder Constitution",
    title: "Founder Constitution",
    subtitle: "Founder authority",
    body: "The Founder Constitution defines the immutable relationship between the Founder and the platform. Founder intent survives executive evolution. Every executive inherits these principles through CompanyContext.",
    points: [
      "Founder retains final authority unless explicitly delegated",
      "Overrides become organizational learning",
      "Automation must be explicit, auditable, and reversible",
      "Every action traces to approval, policy, or evidence",
    ],
  },
  {
    id: "organizational-runtime",
    label: "Organizational Runtime",
    title: "Organizational Runtime (OrgOS)",
    subtitle: "Continuous operation",
    body: "OrgOS is the constitutional runtime layer for continuous organizational operation — heartbeat, scheduling, certification, and explainability. It keeps the organization running without requiring constant founder intervention.",
    points: [
      "10-step organizational heartbeat",
      "Runtime-owned scheduling — not executive-owned",
      "11 certification gates for runtime readiness",
      "Context version 2.0.0-s4a-org-runtime",
    ],
  },
  {
    id: "policy-governance",
    label: "Policy Engine · Governance Kernel",
    title: "Policy Engine & Governance Kernel",
    subtitle: "Permission before execution",
    body: "The Organizational Policy Engine evaluates what is permitted. The Governance Kernel is the final checkpoint before any action executes. Default deny. Explicit allow. No implicit permissions.",
    points: [
      "Policy Engine answers: permitted, prohibited, requires approval",
      "Governance Kernel validates — never reasons",
      "Founder, council, and executive approval routing",
      "Append-only audit and policy history",
    ],
  },
  {
    id: "mission-control",
    label: "Mission Control",
    title: "Mission Control",
    subtitle: "Founder command surface",
    body: "Mission Control is the live operational command center for founders, COOs, and boards. Health, readiness, timeline, widgets, and search — one surface for organizational truth.",
    points: [
      "Live widget framework with 80+ backend contracts",
      "Platform Health ≠ Company Readiness — distinct metrics",
      "Unified organizational timeline and search",
      "Founder briefing and command palette integration",
    ],
    accent: true,
  },
];

export const SECTIONS = [
  {
    id: "intelligence",
    eyebrow: "Executive Intelligence",
    title: "Augment judgment. Never replace it.",
    body: "Multi-executive reasoning framework with certification gates, deliberation pipelines, and explainable recommendations. Executives advise, debate, and challenge — they do not manipulate.",
    highlights: ["Recommendation pipeline with evidence", "Executive Compliance Suite", "Per-executive certification before activation"],
  },
  {
    id: "mission-control",
    eyebrow: "Mission Control",
    title: "One surface for organizational truth.",
    body: "Health, readiness, timeline, widgets, and search — designed for founders, COOs, and boards who need operational clarity without noise.",
    highlights: ["Live widget framework", "Unified organizational timeline", "Platform vs company readiness distinction"],
  },
  {
    id: "digital-twin",
    eyebrow: "Digital Twin",
    title: "Your organization, modeled with integrity.",
    body: "Living organizational twin assembled from CompanyContext — twin-centric executive reasoning without fabricated confidence.",
    highlights: ["Twin health and state on context", "Signal correlation and homeostasis", "Alignment with strategic goals"],
  },
  {
    id: "simulation",
    eyebrow: "Simulation Engine",
    title: "Explore consequences before commitment.",
    body: "Organizational simulation with constitutional explainability. Scenarios, foresight, and antifragility — not black-box predictions.",
    highlights: ["Explainable simulation sessions", "Scenario planning runtime", "Decision economy modeling"],
  },
  {
    id: "council",
    eyebrow: "Executive Council",
    title: "Structured deliberation at scale.",
    body: "Continuous Executive Council with deterministic deliberation stages, collaboration network, and immutable council memory.",
    highlights: ["12-stage deliberation pipeline", "Council scheduling modes", "Searchable minutes and votes"],
  },
  {
    id: "governance",
    eyebrow: "Constitutional Governance",
    title: "Permission before execution.",
    body: "Organizational Policy Engine evaluates what is permitted. Governance Kernel enforces the final checkpoint. Default deny. Explicit allow. No implicit permissions.",
    highlights: ["Policy Engine + Governance Kernel", "Founder and council approval routing", "Append-only audit and history"],
  },
  {
    id: "founder",
    eyebrow: "Founder First",
    title: "Your authority is constitutional.",
    body: "Founder intent survives executive evolution, model changes, and team turnover. Automation is explicit, auditable, reversible, and policy-driven.",
    highlights: ["Founder Constitution on every context", "Override → organizational learning", "Founder approval validation gates"],
  },
  {
    id: "security",
    eyebrow: "Security",
    title: "Enterprise-grade by architecture.",
    body: "Company-scoped data plane, credential vault, sandbox gates, and security observatory. Event-driven audit trails for every material action.",
    highlights: ["Company guard on all routes", "Integration sandbox and health", "Security validation framework"],
  },
  {
    id: "enterprise",
    eyebrow: "Enterprise Ready",
    title: "Built for boards, holding companies, and PE.",
    body: "SSO, private cloud, custom policies, and dedicated deployment paths. Governance and compliance are constitutional — not add-ons.",
    highlights: ["Enterprise federation roadmap", "Policy marketplace (upcoming)", "Multi-organization intelligence (upcoming)"],
  },
] as const;

export const TRUST = {
  id: "trust",
  title: "Architecture you can defend in a board meeting",
  items: [
    { title: "Architecture First", desc: "89 ADRs. Frozen Bedrock. Constitutional extensions only." },
    { title: "Constitutional AI", desc: "Hierarchy documents govern every capability — not prompt engineering." },
    { title: "Explainable Decisions", desc: "Every verdict, allocation, and recommendation records why." },
    { title: "Deterministic Reasoning", desc: "Same inputs → same outputs. No stochastic governance." },
    { title: "No Black Box Decisions", desc: "Unknown is preferable to fabricated confidence." },
    { title: "Executive Governance", desc: "ECS gates before any executive activation." },
    { title: "Founder Control", desc: "Final authority retained unless explicitly delegated." },
    { title: "Auditability", desc: "Append-only trails. Event store source of truth." },
    { title: "Event Driven", desc: "Persist-then-publish across the platform." },
    { title: "Enterprise Ready", desc: "SSO, private cloud, compliance packs on roadmap." },
  ],
  timeline: [
    { phase: "Foundation", status: "Certified", date: "Jul 2026", score: "96/100" },
    { phase: "Sprint 2", status: "Complete", date: "Jul 2026", score: "Executive Intelligence" },
    { phase: "Sprint 3", status: "Complete", date: "Jul 2026", score: "Organizational Nervous System" },
    { phase: "Sprint 4", status: "Complete", date: "Jul 2026", score: "OrgOS + Governance" },
    { phase: "Grayscale OS v1", status: "Released", date: "Jul 2026", score: "Commercial launch" },
  ],
};

export const PRICING = {
  id: "pricing",
  title: "Pricing built for organizational scale",
  subtitle: "From solo founders to enterprise holding companies",
  plans: [
    {
      id: "explorer",
      name: "Explorer",
      price: "$15",
      period: "/month",
      audience: "Solo founders",
      description: "Essential organizational clarity for founders building alone.",
      features: ["Mission Control core", "Institutional memory", "Goals & constraints", "Founder workspace", "Event audit trail"],
      cta: "Start Explorer",
      highlighted: false,
    },
    {
      id: "builder",
      name: "Builder",
      price: "$29",
      period: "/month",
      audience: "Growing companies",
      description: "Multi-capability organizational intelligence as teams form.",
      features: ["Everything in Explorer", "Digital twin", "Executive framework", "Knowledge graph", "Integration connectors"],
      cta: "Start Builder",
      highlighted: true,
    },
    {
      id: "scale",
      name: "Scale",
      price: "$99",
      period: "/month",
      audience: "Multi-team organizations",
      description: "Full organizational operating system for scaling judgment.",
      features: ["Everything in Builder", "Executive Council", "Simulation engine", "Policy engine", "Attention budget"],
      cta: "Start Scale",
      highlighted: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      audience: "Unlimited executives",
      description: "Dedicated deployment for boards, PE, and holding companies.",
      features: ["Unlimited executives", "Dedicated deployment", "Custom policies", "Private cloud", "SSO & support", "Governance & compliance"],
      cta: "Contact Sales",
      highlighted: false,
    },
  ],
  founding: {
    name: "Founding Member",
    badge: "Limited launch",
    benefits: [
      "Special founding badge",
      "Lifetime pricing lock",
      "Priority roadmap influence",
      "Founding community access",
      "Early access to industry packs",
    ],
  },
  comparisonFeatures: [
    { name: "Mission Control", explorer: true, builder: true, scale: true, enterprise: true },
    { name: "Digital Twin", explorer: false, builder: true, scale: true, enterprise: true },
    { name: "Executive Council", explorer: false, builder: false, scale: true, enterprise: true },
    { name: "Simulation Engine", explorer: false, builder: false, scale: true, enterprise: true },
    { name: "Policy Engine", explorer: false, builder: false, scale: true, enterprise: true },
    { name: "Custom Policies", explorer: false, builder: false, scale: false, enterprise: true },
    { name: "Private Cloud", explorer: false, builder: false, scale: false, enterprise: true },
    { name: "SSO", explorer: false, builder: false, scale: false, enterprise: true },
    { name: "Dedicated Support", explorer: false, builder: false, scale: false, enterprise: true },
  ],
};

export const ROADMAP = {
  id: "roadmap",
  title: "Public roadmap",
  subtitle: "Delivered with constitutional discipline",
  completed: [
    { name: "Foundation (Bedrock)", detail: "Event store, memory, graph, intelligence, Mission Control" },
    { name: "EIL — Executive Intelligence Layer", detail: "Multi-executive framework, recommendation pipeline, ECS" },
    { name: "ONS — Organizational Nervous System", detail: "Attention, twin, signals, simulation, foresight" },
    { name: "OrgOS — Organizational Runtime", detail: "OrgOS, Council, Attention Budget, Policy Engine" },
    { name: "Grayscale OS v1.0", detail: "Commercial release — Bedrock codename" },
  ],
  upcoming: [
    { name: "Executive Marketplace", detail: "Certified executive implementations" },
    { name: "Industry Packs", detail: "Vertical organizational templates" },
    { name: "Policy Marketplace", detail: "Compliance and regulatory policy packs" },
    { name: "Enterprise Federation", detail: "Cross-company policy and governance" },
    { name: "Digital Enterprise", detail: "Full organizational twin at scale" },
    { name: "Multi-Organization Intelligence", detail: "Portfolio and holding company intelligence" },
  ],
};

export const FAQ = {
  id: "faq",
  title: "Frequently asked questions",
  items: [
    {
      q: "Is Grayscale an AI chatbot?",
      a: "No. Grayscale OS is an Organizational Operating System — infrastructure for decision quality, institutional memory, and constitutional governance. It is not a conversational interface or productivity copilot.",
    },
    {
      q: "Who is Grayscale built for?",
      a: "Solo founders, startups, SMEs, enterprises, investors, holding companies, family offices, corporate strategy teams, boards, COOs, CEOs, CTOs, CFOs, VC firms, private equity, and corporate innovation teams.",
    },
    {
      q: "What does 'Bedrock' mean?",
      a: "Bedrock is the Foundation codename — the certified, frozen platform layer (v1.0.0-bedrock) that all organizational capabilities extend without architectural rewrites.",
    },
    {
      q: "Are executives automatically active?",
      a: "No. EXECUTIVES_ENABLED remains false until per-executive certification passes the Executive Compliance Suite. The framework is complete; activation is governance-gated.",
    },
    {
      q: "How does Grayscale handle automation?",
      a: "Autonomous execution is disabled by default. The Policy Engine and Governance Kernel determine permission before any action. Automation must be explicit, auditable, reversible, and policy-driven.",
    },
    {
      q: "Can I deploy in a private cloud?",
      a: "Enterprise plans include dedicated deployment, private cloud, SSO, custom policies, and compliance support. Contact sales for architecture review.",
    },
    {
      q: "What makes decisions explainable?",
      a: "Every policy verdict, attention allocation, and executive recommendation records why, what evidence was consulted, and which constitutional sources apply. Unknown is preferable to fabricated confidence.",
    },
    {
      q: "What is a Founding Member?",
      a: "Limited launch pricing with lifetime benefits, founding badge, priority roadmap influence, and founding community access.",
    },
  ],
};

export const CTA = {
  title: "Build organizational judgment that compounds.",
  subtitle: "Join founders, boards, and strategy teams running on Grayscale OS v1.0.",
  placeholder: "Work email",
  button: "Request Access",
};

export const FOOTER = {
  tagline: "Grayscale OS v1.0 · Codename Bedrock",
  links: [
    { label: "Documentation", href: "/docs" },
    { label: "Leadership", href: "/leadership" },
    { label: "Contact", href: "/contact" },
    { label: "Platform", href: "#platform" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Login", href: "/login" },
  ],
  legal: "© 2026 Project Grayscale — The Dot Protocol Company Limited — A AR Holdings Group Company",
};

export const LEADERSHIP = [
  {
    initials: "AK",
    name: "Arun Kumar",
    role: "Founder & Chairman",
    bio: "Visionary founder whose foresight and entrepreneurial spirit laid the foundation for Project Grayscale and the Organizational Operating System vision. His legacy of innovation and strategy continues to shape the platform's constitutional culture.",
  },
  {
    initials: "RD",
    name: "Robb Duran",
    role: "Chief Business Officer",
    bio: "Brings operational expertise and strategic insight to Project Grayscale. With extensive experience leading complex technology and corporate initiatives, he ensures seamless execution across the platform and go-to-market.",
  },
  {
    initials: "TB",
    name: "Timothy Burton",
    role: "Veteran Advisor",
    bio: "Seasoned leader with decades of experience in technology, blockchain, and logistics. His expertise strengthens Project Grayscale's long-term direction and enterprise market leadership.",
  },
  {
    initials: "ST",
    name: "Saleena Thamani",
    role: "Group CEO",
    bio: "Pioneering technologist and architect of innovative token standards. She merges technical excellence with strategic vision, driving Grayscale OS at the intersection of enterprise intelligence and constitutional governance.",
  },
  {
    initials: "RN",
    name: "Rudra Narayanan",
    role: "Head of Business & Strategy",
    bio: "Leads business development, strategic partnerships, and go-to-market execution. With a background in cross-border ventures, he focuses on sustainable growth and expanding Grayscale's global footprint.",
  },
];

export const CONTACT = {
  emails: [
    { label: "General inquiries", address: "info@projectgrayscale.com", desc: "Platform questions, partnerships, and press" },
    { label: "Sales & enterprise", address: "sales@projectgrayscale.com", desc: "Enterprise plans, demos, and private deployment" },
    { label: "Billing & accounts", address: "billing@projectgrayscale.com", desc: "Subscriptions, invoices, and account management" },
  ],
  company: "Project Grayscale",
  parent: "A AR Holdings Group Company",
};
