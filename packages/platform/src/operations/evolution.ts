/** Platform Evolution — AIP-41 */

export interface PlatformVersionInfo {
  platformVersion: string;
  schemaVersion: string;
  apiVersion: string;
  migrationVersion: string;
  connectorCompatibility: Record<string, string>;
  pluginCompatibility: { minPlatformVersion: string };
  executiveRuntimeVersion: string;
  upgradePath?: string;
  rollbackPath?: string;
  recordedAt: string;
}

export interface PlatformEvolutionPort {
  getCurrent(): Promise<PlatformVersionInfo>;
}
