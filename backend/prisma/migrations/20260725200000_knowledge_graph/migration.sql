-- Phase 1.5C-0: Memory v2 fields
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "visibility" TEXT NOT NULL DEFAULT 'company';
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "provenance" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "confidence" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "parent_id" TEXT;
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "related_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "owner_id" TEXT;
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "project_id" TEXT;
ALTER TABLE "memory_records" ADD COLUMN IF NOT EXISTS "graph_node_id" TEXT;
CREATE INDEX IF NOT EXISTS "memory_records_graph_node_id_idx" ON "memory_records"("graph_node_id");

-- Phase 1.5C-2: Company Knowledge Graph
CREATE TABLE "graph_nodes" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "node_type" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "summary" TEXT,
    "lifecycle_status" TEXT NOT NULL DEFAULT 'active',
    "source_table" TEXT,
    "source_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'system',
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "memory_record_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graph_nodes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "graph_edges" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "source_node_id" TEXT NOT NULL,
    "target_node_id" TEXT NOT NULL,
    "relationship_type" TEXT NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "confidence" TEXT NOT NULL DEFAULT 'unknown',
    "direction" TEXT NOT NULL DEFAULT 'directed',
    "lifecycle_status" TEXT NOT NULL DEFAULT 'active',
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "reason" TEXT,
    "created_by" TEXT,
    "edge_source" TEXT NOT NULL DEFAULT 'system',
    "source_event_id" TEXT,
    "correlation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graph_edges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "graph_nodes_company_source_key" ON "graph_nodes"("company_id", "source_table", "source_id");
CREATE INDEX "graph_nodes_company_id_node_type_idx" ON "graph_nodes"("company_id", "node_type");
CREATE INDEX "graph_nodes_company_id_lifecycle_status_idx" ON "graph_nodes"("company_id", "lifecycle_status");

CREATE UNIQUE INDEX "graph_edges_unique_rel" ON "graph_edges"("company_id", "source_node_id", "target_node_id", "relationship_type");
CREATE INDEX "graph_edges_company_id_source_node_id_idx" ON "graph_edges"("company_id", "source_node_id");
CREATE INDEX "graph_edges_company_id_target_node_id_idx" ON "graph_edges"("company_id", "target_node_id");
CREATE INDEX "graph_edges_company_id_relationship_type_idx" ON "graph_edges"("company_id", "relationship_type");

ALTER TABLE "graph_nodes" ADD CONSTRAINT "graph_nodes_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate legacy knowledge_nodes → graph_nodes
INSERT INTO "graph_nodes" (
    "id", "company_id", "node_type", "display_name", "summary",
    "lifecycle_status", "source_table", "source_id", "source",
    "schema_version", "version", "metadata", "created_at", "updated_at"
)
SELECT
    kn."id",
    kn."company_id",
    CASE WHEN kn."node_type" IN ('decision', 'architecture_decision') THEN kn."node_type" ELSE 'knowledge_article' END,
    kn."label",
    kn."content",
    'active',
    'knowledge_nodes',
    kn."id",
    'migration',
    1,
    1,
    kn."metadata",
    kn."created_at",
    kn."created_at"
FROM "knowledge_nodes" kn
ON CONFLICT ("company_id", "source_table", "source_id") DO NOTHING;

-- Map legacy knowledge edge relationships to graph_edges (resolve node ids via knowledge_nodes migration ids)
INSERT INTO "graph_edges" (
    "id", "company_id", "source_node_id", "target_node_id",
    "relationship_type", "strength", "confidence", "direction",
    "lifecycle_status", "schema_version", "version", "metadata",
    "evidence", "edge_source", "created_at", "updated_at"
)
SELECT
    ke."id",
    ke."company_id",
    ke."from_node_id",
    ke."to_node_id",
    UPPER(REPLACE(ke."relationship", ' ', '_')),
    ke."weight",
    'imported',
    'directed',
    'active',
    1,
    1,
    '{}',
    '[]',
    'migration',
    ke."created_at",
    ke."created_at"
FROM "knowledge_edges" ke
WHERE EXISTS (SELECT 1 FROM "graph_nodes" gn WHERE gn."id" = ke."from_node_id")
  AND EXISTS (SELECT 1 FROM "graph_nodes" gn WHERE gn."id" = ke."to_node_id")
ON CONFLICT ("company_id", "source_node_id", "target_node_id", "relationship_type") DO NOTHING;
