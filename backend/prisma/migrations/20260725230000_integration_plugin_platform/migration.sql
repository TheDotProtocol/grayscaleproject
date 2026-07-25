-- Phase 1.5F: Integration & Plugin Platform

CREATE TABLE "installed_plugins" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "plugin_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'registered',
    "config" JSONB NOT NULL DEFAULT '{}',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "sandbox_policy" JSONB NOT NULL DEFAULT '{}',
    "manifest" JSONB NOT NULL DEFAULT '{}',
    "installed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "installed_plugins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "integration_credentials" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "encrypted_secret" TEXT NOT NULL,
    "key_version" INTEGER NOT NULL DEFAULT 1,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rotated_at" TIMESTAMP(3),
    CONSTRAINT "integration_credentials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "credential_audit_logs" (
    "id" TEXT NOT NULL,
    "credential_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credential_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "plugin_sync_jobs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "plugin_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "idempotency_key" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error" TEXT,
    "stats" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "plugin_sync_jobs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "normalized_entity_records" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "source_provider" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "payload_hash" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "summary" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "memory_record_id" TEXT,
    "graph_node_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "normalized_entity_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "integration_health_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "plugin_id" TEXT,
    "state" TEXT NOT NULL,
    "message" TEXT,
    "auth_status" TEXT NOT NULL,
    "last_sync_at" TIMESTAMP(3),
    "webhook_status" TEXT NOT NULL DEFAULT 'inactive',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "integration_health_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "integration_cost_snapshots" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "api_requests" INTEGER NOT NULL DEFAULT 0,
    "rate_limit_hits" INTEGER NOT NULL DEFAULT 0,
    "monthly_usage_units" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimated_cost_cents" INTEGER NOT NULL DEFAULT 0,
    "bandwidth_bytes" BIGINT NOT NULL DEFAULT 0,
    "storage_bytes" BIGINT NOT NULL DEFAULT 0,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "integration_cost_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "platform_idempotency_keys" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "result" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "platform_idempotency_keys_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "installed_plugins_company_id_plugin_id_key" ON "installed_plugins"("company_id", "plugin_id");
CREATE INDEX "installed_plugins_company_id_state_idx" ON "installed_plugins"("company_id", "state");
CREATE UNIQUE INDEX "integration_credentials_company_id_provider_key" ON "integration_credentials"("company_id", "provider");
CREATE INDEX "credential_audit_logs_credential_id_idx" ON "credential_audit_logs"("credential_id");
CREATE INDEX "plugin_sync_jobs_company_id_plugin_id_idx" ON "plugin_sync_jobs"("company_id", "plugin_id");
CREATE UNIQUE INDEX "normalized_entity_records_company_id_idempotency_key_key" ON "normalized_entity_records"("company_id", "idempotency_key");
CREATE INDEX "integration_health_snapshots_company_id_provider_idx" ON "integration_health_snapshots"("company_id", "provider");
CREATE UNIQUE INDEX "integration_cost_snapshots_company_id_provider_period_key" ON "integration_cost_snapshots"("company_id", "provider", "period");
CREATE UNIQUE INDEX "platform_idempotency_keys_company_id_key_key" ON "platform_idempotency_keys"("company_id", "key");

ALTER TABLE "installed_plugins" ADD CONSTRAINT "installed_plugins_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "integration_credentials" ADD CONSTRAINT "integration_credentials_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "credential_audit_logs" ADD CONSTRAINT "credential_audit_logs_credential_id_fkey" FOREIGN KEY ("credential_id") REFERENCES "integration_credentials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "normalized_entity_records" ADD CONSTRAINT "normalized_entity_records_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
