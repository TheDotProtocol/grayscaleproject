# Founder Experience Report

**Generated:** 2026-07-25T16:49:53.975Z  
**Journey Score:** 83/100

## Idea → Launch Journey

| Phase | Action | Status | Route |
|-------|--------|--------|-------|
| Ideation | Create company & founder profile | available | POST /auth/register, POST /companies |
| Ideation | Capture initial ideas in memory | available | POST /companies/:id/memory/ingest |
| Ideation | Journal daily reflections | available | POST /companies/:id/memory/journal/entries |
| Planning | Define strategic goals | available | POST /companies/:id/intelligence/goals |
| Planning | Review AI recommendations | available | GET /companies/:id/intelligence/recommendations |
| Planning | View company readiness | available | GET /companies/:id/mission-control/readiness |
| Building | Connect GitHub integration | available | POST /companies/:id/integrations/github |
| Building | Sync repository data | available | POST /companies/:id/integrations/:id/sync |
| Building | Install plugins | available | POST /companies/:id/plugins/install |
| Building | Track projects explicitly | partial | Graph nodes (nodeType=project) |
| Operations | Monitor platform health | available | GET /companies/:id/mission-control/health |
| Operations | View operational timeline | available | GET /companies/:id/mission-control/timeline |
| Operations | Global search across domains | available | GET /companies/:id/mission-control/search |
| Operations | Founder daily brief | available | GET /companies/:id/mission-control/brief |
| Finance | Track upcoming bills | available | GET /companies/:id/billing |
| Finance | View integration costs | available | Mission Control widget integration-cost |
| Launch | Generate platform readiness report | available | POST /platform/operations/readiness/generate |
| Launch | Activate executives | missing | Executive runtime |
| Launch | One-click launch checklist | missing | N/A |
| Launch | Public-facing landing/deployment | manual | N/A |

## Friction Points

- Connect GitHub integration: OAuth flow requires external provider setup
- Track projects explicitly: No first-class Project entity; projects modeled as graph nodes
- One-click launch checklist: No guided launch wizard UI
- Public-facing landing/deployment: Deployment not automated in platform

## Missing Workflows

- Activate executives
- One-click launch checklist

## UX Gaps

- No first-class Project model — projects require graph node creation
- Mission Control has 18+ widgets; no onboarding tour for new founders
- Global search does not yet index all domains uniformly
- No unified 'launch readiness' UX flow connecting company readiness + platform readiness
- Executive inbox UI deferred to Sprint 2 (expected)

## Operational Bottlenecks

- Large event store replay is synchronous — may block on high volume
- Integration OAuth requires manual provider configuration
- Memory semantic search (pgvector) deferred to Sprint 2+
- No automated CI/CD pipeline for founder deployments
