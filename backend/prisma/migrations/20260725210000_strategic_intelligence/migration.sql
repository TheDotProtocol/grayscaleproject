-- Phase 1.5D: Strategic Intelligence Framework

CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "department" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "success_criteria" JSONB NOT NULL DEFAULT '[]',
    "priority_weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "status" TEXT NOT NULL DEFAULT 'active',
    "health" TEXT NOT NULL DEFAULT 'unknown',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "owner_id" TEXT,
    "deadline" TIMESTAMP(3),
    "graph_node_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "objectives" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "owner_id" TEXT,
    "dependency_objective_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "linked_project_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "graph_node_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "objectives_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "alternatives" JSONB NOT NULL DEFAULT '[]',
    "confidence_sources" JSONB NOT NULL DEFAULT '[]',
    "trade_off" JSONB NOT NULL DEFAULT '{}',
    "dependencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "risk_assessment_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimated_cost_cents" INTEGER,
    "engineering_cost" DOUBLE PRECISION,
    "estimated_roi" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence_band" TEXT NOT NULL DEFAULT 'unknown',
    "priority_score_id" TEXT,
    "department" TEXT,
    "source" TEXT NOT NULL DEFAULT 'system',
    "source_ref" TEXT,
    "requires_approval" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "expected_outcome" TEXT,
    "expected_timeline" TEXT,
    "rollback_strategy" TEXT,
    "graph_node_id" TEXT,
    "memory_record_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scenario_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "policy_violations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "constraint_violations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recommendation_audits" (
    "id" TEXT NOT NULL,
    "recommendation_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "recommendation_audits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "recommendation_id" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "alternatives_considered" JSONB NOT NULL DEFAULT '[]',
    "decision_maker_id" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reasoning" TEXT NOT NULL,
    "evidence" JSONB NOT NULL DEFAULT '[]',
    "implementation_state" TEXT NOT NULL DEFAULT 'not_started',
    "outcome" JSONB,
    "review_date" TIMESTAMP(3),
    "graph_node_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "decision_audits" (
    "id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "decision_audits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "risk_assessments" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "likelihood" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "impact" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "mitigation" TEXT,
    "linked_entity_type" TEXT,
    "linked_entity_id" TEXT,
    "graph_node_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_value_cents" INTEGER,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "linked_recommendation_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'identified',
    "graph_node_id" TEXT,
    "source" TEXT NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "priority_scores" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER,
    "reasoning" JSONB NOT NULL,
    "config_id" TEXT,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "priority_scores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "priority_configs" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scope_ref" TEXT,
    "weights" JSONB NOT NULL,
    "operating_mode" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "priority_configs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "decision_policies" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "decision_policies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "strategic_constraints" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "limit_value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "current_usage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "is_hard" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "strategic_constraints_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "scenario_plans" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "case_type" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL DEFAULT '{}',
    "outcomes" JSONB NOT NULL DEFAULT '{}',
    "linked_recommendation_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scenario_plans_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "company_operating_modes" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "company_operating_modes_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "goals_company_id_status_idx" ON "goals"("company_id", "status");
CREATE INDEX "objectives_company_id_goal_id_idx" ON "objectives"("company_id", "goal_id");
CREATE INDEX "recommendations_company_id_status_idx" ON "recommendations"("company_id", "status");
CREATE INDEX "decisions_company_id_status_idx" ON "decisions"("company_id", "status");
CREATE INDEX "risk_assessments_company_id_category_idx" ON "risk_assessments"("company_id", "category");
CREATE INDEX "opportunities_company_id_status_idx" ON "opportunities"("company_id", "status");
CREATE INDEX "priority_scores_company_id_entity_type_idx" ON "priority_scores"("company_id", "entity_type");
CREATE INDEX "priority_configs_company_id_scope_idx" ON "priority_configs"("company_id", "scope");

-- Foreign keys
ALTER TABLE "goals" ADD CONSTRAINT "goals_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recommendation_audits" ADD CONSTRAINT "recommendation_audits_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_recommendation_id_fkey" FOREIGN KEY ("recommendation_id") REFERENCES "recommendations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "decision_audits" ADD CONSTRAINT "decision_audits_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "priority_scores" ADD CONSTRAINT "priority_scores_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "priority_configs" ADD CONSTRAINT "priority_configs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "decision_policies" ADD CONSTRAINT "decision_policies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "strategic_constraints" ADD CONSTRAINT "strategic_constraints_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "scenario_plans" ADD CONSTRAINT "scenario_plans_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "company_operating_modes" ADD CONSTRAINT "company_operating_modes_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate legacy agent_recommendations → recommendations
INSERT INTO "recommendations" (
    "id", "company_id", "title", "summary", "reasoning", "confidence",
    "estimated_roi", "requires_approval", "status", "source", "source_ref", "created_by",
    "created_at", "updated_at", "confidence_sources", "trade_off"
)
SELECT
    ar."id",
    ag."company_id",
    ar."title",
    ar."summary",
    ar."reasoning",
    ar."confidence",
    ar."roi_estimate",
    ar."requires_approval",
    COALESCE(ar."approval_status", 'pending_approval'),
    'executive',
    ar."agent_run_id",
    'migration',
    ar."created_at",
    ar."created_at",
    '[]'::jsonb,
    '{}'::jsonb
FROM "agent_recommendations" ar
JOIN "agent_runs" ag ON ag."id" = ar."agent_run_id"
ON CONFLICT ("id") DO NOTHING;
