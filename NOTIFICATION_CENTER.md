# Notification Center

**RC1 Track B — Organizational Notifications**

---

## Backend

Organizational notifications wrap the existing `Notification` model with categorized types:

| Category | Description |
|----------|-------------|
| risk_alert | Risk escalation |
| opportunity_alert | New opportunity signal |
| council_finished | Council session completed |
| simulation_completed | Simulation run finished |
| forecast_changed | Forecast updated |
| learning_milestone | Learning milestone reached |
| evolution_milestone | Organizational evolution event |
| certification_change | Certification status change |
| automation_approval | Automation awaiting founder approval |

## Endpoints

```
GET  /companies/:id/mission-control/notifications?unreadOnly=true
PATCH /companies/:id/mission-control/notifications/:id/read
```

Legacy endpoint remains: `GET /notifications`

## UI

Notification bell in dashboard header with unread count badge and dropdown panel.

## Preferences

Founder notification preferences via `PATCH /founder/preferences`:

```json
{
  "notificationPreferences": {
    "riskAlerts": true,
    "councilFinished": true,
    "simulationCompleted": true,
    "forecastChanged": true,
    "learningMilestones": true,
    "automationApproval": true
  }
}
```

All notifications remain auditable via domain events.
