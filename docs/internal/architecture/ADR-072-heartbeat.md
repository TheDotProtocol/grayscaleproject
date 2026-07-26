# ADR-072: Organizational Heartbeat

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 — Phase A

## Context

Continuous operation requires a deterministic pulse that refreshes organizational state across all sub-runtimes. Without a heartbeat, context becomes stale and sub-runtimes drift out of synchronization.

## Decision

1. Implement 10-step deterministic heartbeat in fixed order
2. Default interval: 300 seconds, configurable per company
3. Phase A: context refresh executes; steps 2–10 are orchestration markers
4. Every cycle publishes `runtime.heartbeat.completed` with correlation/trace IDs
5. Heartbeat explainability recorded via `RuntimeExplainabilityService`

## Consequences

- Organization has a measurable operational pulse
- Heartbeat stability is a certification gate
- Future phases wire direct sub-runtime delegation for marker steps

## Non-negotiables

- Step order is deterministic (never reordered at runtime)
- Individual step failure does not abort the cycle
- Executives never trigger heartbeat

## Bedrock Extension Test

Context Runtime assembles CompanyContext on demand — it does not provide continuous refresh orchestration. Heartbeat is OrgOS responsibility.
