# ADR-079: Collaborative Governance

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase B

## Context

Council governance (Sprint 3) covers quorum and Founder review. Phase B requires certification that collaboration respects Founder Constitution, Organizational Runtime, and Architecture Lock simultaneously.

## Decision

1. Implement `ExecutiveCollaborationCertificationService` with 12 gates
2. Immutable council memory for audit, replay, and search
3. Collaborative governance inherits all upstream constitutional documents
4. Certification independent of `EXECUTIVES_ENABLED` — collaboration layer must certify first

## Consequences

- Collaboration ECS gates block incomplete cooperation infrastructure
- Council memory provides immutable searchable history
- Founder overrides and learning entries preserved

## Bedrock Extension Test

Platform governance log exists — collaborative governance is executive-layer constitutional enforcement, not duplicate audit store.
