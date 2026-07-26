# Workspace Personalization

**RC1 Track B — Founder Dashboard Controls**

---

## Founder Preferences API

```
GET   /founder/preferences
PATCH /founder/preferences
```

Stored in `FounderProfile.preferences` (Prisma JSON).

## Configurable Settings

| Setting | Options |
|---------|---------|
| Theme | dark, light, system |
| Default executive | Constitutional executive ID |
| Favorite company | Company ID |
| Notification preferences | Per-category toggles |
| Pinned widget IDs | Mission Control widget IDs |
| Workspace preset | Named layout preset |

## Widget Layout

Mission Control widget layout persists via:

```
PUT /companies/:id/mission-control/widgets/layout
```

UI supports pin/unpin per widget from Mission Control page.

## Settings UI

`/dashboard/settings` — Workspace Personalization section with theme, default executive, and notification toggles.

## Defaults

Defined in `@grayscale/platform` — `DEFAULT_FOUNDER_PREFERENCES`.

Preferences are versioned in FounderProfile and survive across sessions.
