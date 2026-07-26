# ADR-078: Executive Collaboration Network

**Status:** Accepted  
**Date:** 2026-07-26  
**Sprint:** Sprint 4 Phase B

## Context

Executive network (Sprint 3 Phase D) models relationships but does not enforce that **all** inter-executive communication flows through a single auditable channel.

## Decision

1. Implement `ExecutiveCollaborationNetworkService` with 11 request kinds
2. No executive communicates outside the network
3. Requests emit `collaboration.request.sent/responded` events
4. Extend `ExecutiveNetworkService` relationship model — network assembly unchanged

## Consequences

- Opinion, evidence, challenge, delegation, escalation all auditable
- Minority opinions and dissent reports preserved
- Trust edges update from collaboration evidence

## Bedrock Extension Test

Executive bus messages exist in framework — collaboration network is constitutional routing layer with certification gates.
