# Mission Control UI

**RC1 Track A**

---

## Page

`/dashboard/mission-control` — existing page enhanced with extended widget rendering.

---

## Widget Coverage

- Bedrock widgets: full specialized renderers
- Council, Twin, Athena, Network, Evolution widgets: `GenericDataView` via `renderExtendedWidget`
- Backend catalog now includes council + twin + network + evolution + athena widgets

---

## Data Flow

`GET /companies/:id/mission-control/dashboard` → 30s polling → WidgetRenderer

No placeholder data — all from API.
