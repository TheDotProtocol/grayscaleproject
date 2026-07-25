# Plugin SDK Specification

Phase 1.5F — reusable SDK for first-party and future third-party plugin developers.

## Package

`@grayscale/plugin-sdk` — depends on `@grayscale/platform` ports only.

## PluginManifest v2

```typescript
interface PluginManifestV2 {
  // Identity
  id: string;                          // reverse-domain: "io.grayscale.github"
  name: string;
  version: string;                     // semver
  minPlatformVersion: string;
  description?: string;
  author?: string;
  homepage?: string;
  category: PluginCategory;

  // Connector binding
  connectorId?: string;                // links to ConnectorPort providerId

  // Auth
  auth: PluginAuthConfig;

  // Capabilities & permissions
  capabilities: string[];
  permissions: PluginPermission[];

  // Hooks & events
  hooks: PluginHook[];
  events: PluginEventDeclaration[];      // events this plugin publishes
  subscriptions: PlatformEventType[];    // platform events this plugin listens to

  // Commands
  commands: PluginCommand[];

  // Configuration
  settings: JSONSchema;                // JSON Schema for plugin settings UI

  // Dependencies
  dependencies?: PluginDependency[];

  // UI (consumed by Mission Control 1.5G)
  uiExtensions?: UIExtensionSlot[];

  // Localization
  localization?: Record<string, Record<string, string>>;
}
```

## Plugin Categories

`development`, `communication`, `finance`, `design`, `productivity`, `infrastructure`, `first_party`

## Plugin Commands

```typescript
interface PluginCommand {
  id: string;                          // "sync-now"
  name: string;
  description?: string;
  permission: string;                  // required permission to invoke
  async: boolean;                      // returns job ID if true
}
```

## Plugin Lifecycle Hooks

```typescript
interface PluginLifecycleHooks {
  onInstall?(ctx: PluginContext): Promise<void>;
  onActivate?(ctx: PluginContext): Promise<void>;
  onDeactivate?(ctx: PluginContext): Promise<void>;
  onConfigure?(ctx: PluginContext, settings: unknown): Promise<void>;
  onSync?(ctx: PluginContext): Promise<SyncResult>;
  onHealthCheck?(ctx: PluginContext): Promise<PluginHealth>;
  onUninstall?(ctx: PluginContext): Promise<void>;
}
```

## PluginContext (Sandboxed)

```typescript
interface PluginContext {
  companyId: string;
  pluginId: string;
  installationId: string;
  settings: Record<string, unknown>;
  sandbox: SandboxApiPort;              // gated API access
  events: EventBusPort;                 // publish only allowed events
  logger: PluginLogger;
}
```

Plugins receive `PluginContext` — never raw Prisma, NestJS, or connector credentials.

## Registration

```typescript
// packages/plugins/github/src/index.ts
export function registerPlugin(registry: PluginRegistryPort): void {
  registry.register({
    manifest: GITHUB_MANIFEST,
    lifecycle: githubLifecycle,
    connector: githubConnector,
  });
}
```

## Version Compatibility

| Platform Version | Compatible Plugin Versions |
|------------------|---------------------------|
| 1.5.x | 1.x.x |
| 2.0.x | 2.x.x (breaking) |

`minPlatformVersion` enforced at install time.

## SDK Utilities

- `createManifest()` — builder with validation
- `defineCommand()` — typed command helper
- `defineNormalizer()` — entity mapper helper
- `testPlugin()` — test harness with mock sandbox

See [PLUGIN_SANDBOX_MODEL.md](../architecture/PLUGIN_SANDBOX_MODEL.md) · [PLUGIN_SECURITY_MODEL.md](../architecture/PLUGIN_SECURITY_MODEL.md).
