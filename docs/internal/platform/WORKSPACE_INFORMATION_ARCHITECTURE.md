# Workspace Information Architecture

**RC1 Track A**

---

## Top Level

| Section | Routes |
|---------|--------|
| Founder | Home, Organization, Profile |
| Operations | Mission Control, Council, Twin |
| Organization | Strategy, Projects, Goals |
| Intelligence | Memory, Graph, Notebook |
| Evolution | Learning, Wisdom, Reflection |
| Future | Simulation, Forecasts, Automation |
| System | Integrations, Settings |
| Executives | `/dashboard/executives/[id]` × 7 |

---

## Data Sources

Each page maps 1:1 to backend API modules — no client-side business logic duplication.

---

## Global UX

- Command palette (⌘K)
- Sidebar grouped navigation
- Reusable Panel, StatCard, GenericDataView components
