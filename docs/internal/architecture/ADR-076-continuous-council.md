# ADR-076: Continuous Executive Council

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase B

## Context

Sprint 3 Council Runtime supports manual sessions. Continuous operation requires runtime-owned council scheduling across 7 modes without executives self-scheduling.

## Decision

1. Upgrade Council Runtime to v2.0.0
2. Implement `CouncilSchedulerService` with 7 modes
3. Delegate scheduling authority to Organizational Runtime via `RuntimeSchedulerService`
4. Executives never create councils — runtime opens sessions

## Consequences

- Council sessions can be continuous, scheduled, event-driven, founder-requested, emergency, or policy-triggered
- Mission Control exposes scheduler status via widget contracts

## Bedrock Extension Test

Runtime scheduler (Phase A) orchestrates sub-runtimes — council scheduler is specialized delegation, not Bedrock rewrite.
