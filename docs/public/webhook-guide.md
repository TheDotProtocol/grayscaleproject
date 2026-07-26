# Webhooks

Receive and send organizational events through Grayscale webhooks.

---

## Overview

Webhooks enable real-time integration between Grayscale and external systems. All webhook-triggered actions are subject to **Policy Engine** evaluation.

---

## Inbound Webhooks

Register an inbound endpoint to receive external signals:

1. Configure integration via Integration API
2. Register webhook URL and signing secret
3. Map incoming payloads to organizational events
4. Sandbox validates before production enablement

```bash
curl -X POST http://localhost:4000/companies/{companyId}/integrations/webhook \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-app.com/grayscale/webhook","events":["memory.updated"]}'
```

---

## Outbound Webhooks

Subscribe to Grayscale platform events:

| Event Category | Examples |
|----------------|----------|
| Memory | `memory.created`, `memory.synced` |
| Goals | `goal.updated`, `goal.alignment.changed` |
| Integration | `integration.sync.completed` |
| Timeline | `timeline.entry.created` |

Events follow persist-then-publish semantics — delivery after durable write.

---

## Security

- **HMAC signing** on all webhook payloads
- **Credential Vault** for secrets — never in plugin source
- **Retry policy** with exponential backoff
- **Sandbox gates** for uncertified integrations

---

## Related

- [Authentication](/docs/authentication)
- [API Reference](/docs/api)
- [Plugin Development](/docs/plugins)
