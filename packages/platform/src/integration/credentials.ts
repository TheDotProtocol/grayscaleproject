/** Credential management — AIP-17 encryption + rotation */

export interface EncryptedCredential {
  id: string;
  companyId: string;
  provider: string;
  keyVersion: number;
  expiresAt?: string;
  createdAt: string;
  rotatedAt?: string;
}

export interface CredentialAuditEntry {
  id: string;
  credentialId: string;
  companyId: string;
  provider: string;
  action: "created" | "rotated" | "refreshed" | "revoked" | "expired";
  actorId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CredentialVaultPort {
  store(companyId: string, provider: string, secret: Record<string, unknown>, expiresAt?: Date): Promise<EncryptedCredential>;
  retrieve(companyId: string, provider: string): Promise<Record<string, unknown> | null>;
  rotate(companyId: string, provider: string, newSecret: Record<string, unknown>): Promise<EncryptedCredential>;
  revoke(companyId: string, provider: string, actorId?: string): Promise<void>;
  auditLog(credentialId: string, limit?: number): Promise<CredentialAuditEntry[]>;
}
