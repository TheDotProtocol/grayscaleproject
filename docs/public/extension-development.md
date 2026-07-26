# Extension Development

Extend Grayscale beyond plugins — executives, widgets, and organizational modules.

---

## Extension Types

### Connectors (Plugins)

Data sync and external system integration. See [Plugin Development](/docs/plugins).

### Custom Widgets

Mission Control widgets consume approved backend contracts. Widgets are **read-only** displays of organizational state — they do not mutate Bedrock directly.

### Executive Modules

Domain-specific executives (e.g., industry strategists) require:

- Executive Compliance Suite (ECS) certification
- Constitutional pipeline adherence
- Founder approval for activation

Contact [sales@projectgrayscale.com](/contact) for executive partner programs.

### Automation Policies

Define organizational rules evaluated by Policy Engine:

- Permitted actions
- Prohibited actions
- Requires founder / council approval

Policies are explicit, versioned, and auditable.

---

## Architecture Rules

1. Read organizational state via **CompanyContext** APIs — never duplicate storage
2. Write through **event-sourced** approved commands only
3. Respect **contextVersion** compatibility
4. Provide **explainability** for every recommendation or action proposal

---

## Sandbox

All extensions start in sandbox mode:

- Limited event publication
- No production executive activation
- Integration health monitoring
- Security validation framework

---

## Related

- [Plugin Development](/docs/plugins)
- [SDK Guide](/docs/sdk)
- [API Reference](/docs/api)
- [Webhooks](/docs/webhooks)
