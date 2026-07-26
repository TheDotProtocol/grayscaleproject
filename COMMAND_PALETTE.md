# Command Palette

**RC1 Track B — Organizational Command System**

---

## Activation

- **Keyboard:** ⌘K (macOS) / Ctrl+K
- **Sidebar:** Command palette button

## Capabilities

| Category | Actions |
|----------|---------|
| Navigate | All workspace routes |
| Search | Universal search API (grouped results) |
| Executives | Jump to any constitutional executive |
| Create | Run simulation, generate forecast, start council, open notebook |
| Actions | Quick actions from MC API |
| Recent | Recent commands (localStorage) |

## API Dependencies

- `GET /companies/:id/mission-control/search`
- `GET /companies/:id/mission-control/quick-actions`
- `POST /companies/:id/mission-control/actions`

## Accessibility

- Keyboard-first navigation
- Escape to close
- Focus trap within dialog
- ARIA dialog label

## Implementation

`apps/web/src/components/workspace/command-palette.tsx`

Everything remains API-driven. No direct Prisma access from the palette.
