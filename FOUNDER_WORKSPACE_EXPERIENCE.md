# Founder Workspace Experience

**RC1 Track B — Organizational Experience & Product Polish**

---

## Overview

The Founder Workspace is the product layer of Project Grayscale. Mission Control is the operational layer embedded within it. Track B transforms the workspace from functional modules into an executive briefing experience founders immediately understand.

## Command Bridge (Founder Home)

`GET /companies/:id/mission-control/brief` powers the redesigned Founder Home. The briefing answers:

- What requires my attention?
- What changed today?
- What decisions are waiting?
- What risks increased?
- What did the Executive Council conclude?

Home consumes existing platform APIs only — no direct database access from the UI.

## Key Routes

| Route | Purpose |
|-------|---------|
| `/dashboard/home` | Executive briefing — Command Bridge |
| `/dashboard/timeline` | Unified organizational timeline |
| `/dashboard/activity` | Auditable activity feed |
| `/dashboard/mission-control` | Operational widgets (embedded MC) |

## Personalization

Founder preferences persist via `FounderProfile.preferences`:

- `GET/PATCH /founder/preferences`
- Theme, default executive, notification preferences, pinned widgets

## Workspace Sessions

Resume work across sessions:

- `GET/PUT /companies/:id/mission-control/workspace-session`
- Recent searches, pinned notebooks, council sessions, open simulations

## Non-Negotiables

- `EXECUTIVES_ENABLED=false`
- Bedrock frozen
- API-first UI
- Event-driven, auditable, versioned
