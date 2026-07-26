# ADR-056: Founder Preferences via FounderProfile

**Status:** Accepted  
**Date:** 2026-07-26  
**Track:** RC1 Track B

## Context

Track B requires founder-controlled personalization (theme, notifications, default executive, pinned widgets) without new tables or Bedrock changes.

## Decision

Use existing `FounderProfile.preferences` JSON column with typed `FounderWorkspacePreferences` contract. Expose REST API at `/founder/preferences`.

Workspace sessions nested under `preferences.workspaceSessions[companyId]`.

## Consequences

- Zero schema migration
- Preferences versioned via FounderProfile.updatedAt
- Defaults in `DEFAULT_FOUNDER_PREFERENCES`
- UI in Settings page
