# RC1 Track B Changelog

**Release:** RC1-Track-B-OrganizationalExperience-v1.0  
**Date:** 2026-07-26

---

## Platform (`@grayscale/platform`)

- Added `OrganizationalTimelinePort`, `ActivityCenterPort`, `WorkspaceSessionPort`, `FounderPreferencesPort`, `NotificationCenterPort`
- Extended `SEARCH_DOMAINS` with executives, council, events, learning, wisdom, forecasts, simulations, signals, insights, policies, strategies
- Extended `QUICK_ACTION_TARGETS` with simulation, forecasts, council
- Added `DEFAULT_FOUNDER_PREFERENCES`

## Backend

- `OrganizationalTimelineService` — unified timeline aggregation
- `ActivityCenterService` — auditable activity feed from domain events
- `WorkspaceSessionsService` — session persistence in FounderProfile JSON
- `FounderPreferencesService` — typed preferences CRUD
- `NotificationCenterService` — categorized notification wrapper
- Expanded `GlobalSearchService` — 12+ new search domains
- New endpoints on Mission Control controller + `FounderExperienceController`
- Expanded quick actions catalog

## Frontend (`apps/web`)

- Redesigned `/dashboard/home` as Command Bridge briefing
- New `/dashboard/timeline` and `/dashboard/activity` pages
- Expanded command palette with search, actions, create commands
- Notification Center component in header
- Workspace skeletons and error boundary
- Settings personalization section
- Mission Control widget pin/layout controls
- Navigation: Timeline + Activity Center routes
- Sidebar command palette trigger

## Documentation

- FOUNDER_WORKSPACE_EXPERIENCE.md
- GLOBAL_SEARCH.md
- COMMAND_PALETTE.md
- NOTIFICATION_CENTER.md
- ACTIVITY_CENTER.md
- WORKSPACE_PERSONALIZATION.md
- RC1_TRACK_B.md
- ADR-055, ADR-056, ADR-057
- RC1_TRACK_B_CERTIFICATE.md
- PRODUCT_UX_REPORT.md

## Non-Changes (Verified)

- Bedrock untouched
- Constitutional hierarchy untouched
- Executive runtime untouched
- EXECUTIVES_ENABLED remains false
