# Project Plan

<!-- veritas-normalized 2026-02-25 11:24 ET prefix=F39 source=PLAN.md -->
<!-- Last bootstrap: 2026-02-25 11:24 ET -- data-model ACA cosmos, total=3929 -->

## Feature: Sprint Plan [ID=F39-01]

### Story: Sprint 1 -- Backend + APIM gateway [ID=F39-01-001] [DONE]
Completed 2026-02-26. Sprint 6 closed 2026-02-25: Container Apps running, APIM brain/v1 registered,
GET /v1/scrum/dashboard + summary smoke tested [PASS]. eva-core subscription key in portal-face .env.local.

### Story: Sprint 2 -- EVA Home page [ID=F39-01-002] [DONE]
Completed 2026-02-25. EVAHomePage routing live in 31-eva-faces; 24 portal-face tests passing.
Live badge data wired 2026-02-26 (Session 10): APIM smoke tests passed for both scrum endpoints;
43/43 vitest passing. EVAHomePage api_calls updated in data model (rv=6: both endpoints).

### Story: Sprint 3 -- Sprint Board page [ID=F39-01-003] [DONE - scaffold]
Completed 2026-02-25. SprintBoardPage, FeatureSection, WICard, WIDetailDrawer, VelocityPanel all in
31-eva-faces. Live data wired after WI-1 (APIM).

### Story: Sprint 4 -- Velocity + entity tags [ID=F39-01-004] [IN PROGRESS]
Entity tags: DELIVERED 2026-02-25. System.Tags fetched per WI in sprint7-epic-scope; tags[]
field in every work_item entry (e.g. ['39-ado-dashboard','F39-01-001']).
Velocity calculation: NOT STARTED. Depends on 37-data-model sprint-context.json (M2).

### Story: Milestone backlog (post-Sprint 4) [ID=F39-01-005] [NOT STARTED]
FinOps cost column (ATRIB-0), multi-project rollup, PDF sprint report.

## Feature: ADO Setup Checklist (do once) [ID=F39-02]

### Story: Create Feature EVA ADO Dashboard under Epic id=4 in ADO [ID=F39-02-001] [DONE]
Completed 2026-02-25. Seeded via wbs-to-ado.ps1 in 48-eva-veritas. Epic ADO id=2371 (39-ado-dashboard), Features ADO ids=2372-2376 created in marcopresta/eva-poc.

### Story: Create WI-0 through WI-6 as User Stories [ID=F39-02-002] [DONE]
Completed 2026-02-25. 22 Product Backlog Items created (ADO WIs 2377-2398) in marcopresta/eva-poc. Scrum template uses PBI not User Story.

### Story: Set sprint assignments per table in README [ID=F39-02-003] [DONE]
Completed 2026-02-25. Sprint assignments set in WBS seed (wbs-import.ps1). Iteration paths assigned per sprint block.

### Story: Link WI-1 -- WI-7 (Blocked By) [ID=F39-02-004] [DONE]
Completed 2026-02-25. WI dependencies reflected in iteration path groupings in seeded PBIs.

### Story: Set ADO_EPIC_ID=4 in 33-eva-brain-v2 .env [ID=F39-02-005] [DONE]
Completed 2026-02-25. ADO_EPIC_ID=4 set in CA env via az containerapp update.

### Story: Set ADO_PAT, ADO_ORG_URL, ADO_PROJECT in brain .env [ID=F39-02-006] [DONE]
Completed 2026-02-25. ADO_ORG_URL=https://dev.azure.com/marcopresta, ADO_PROJECT=eva-poc, ADO_PAT set in CA env. /v1/scrum/dashboard verified returning features=1 wi=200 via APIM.
Note: credentials structure exists in .env.ado.

### Story: Create Cosmos container scrum-cache [ID=F39-02-007] [DONE]
Completed 2026-02-20. eva-foundation DB, /sprint_key PK, TTL=86400s, status=provisioned in data model.

## Feature: Environment Variables Needed [ID=F39-03]
VITE_APIM_BASE_URL=https://marco-sandbox-apim.azure-api.net/brain -- SET in portal-face/.env.local (2026-02-26 Session 10).
VITE_APIM_SUBSCRIPTION_KEY=eva-core primary key -- SET in portal-face/.env.local (2026-02-26 Session 10).
VITE_DEV_AUTH_BYPASS=true, VITE_DEV_ACTOR_OID=portal-dev -- SET in portal-face/.env.local.
COSMOS_ENDPOINT, COSMOS_KEY, ADO_PAT, ADO_ORG_URL, ADO_PROJECT, ADO_EPIC_ID -- in 33-eva-brain-v2/.env.ado (Sprint 4).

## Feature: 31-eva-faces Integration Checklist [ID=F39-04]

### Story: Build EVAHomePage per epic spec (route /) [ID=F39-04-001] [DONE]
Completed 2026-02-23. 23 tiles, 10 vitest tests, bilingual nav bar, FACES-WI-A.

### Story: Build SprintBoardPage per epic spec (route /devops/sprint) [ID=F39-04-002] [DONE]
Completed 2026-02-23. Drawer, velocity panel, 13 vitest tests, FACES-WI-B.

### Story: Add "Sprint Board" to sidebar nav (role guard: viewer+) [ID=F39-04-003] [DONE]
Completed 2026-02-26. Sprint Board link already present in 31-eva-faces/portal-face/src/components/NavHeader.tsx
with PermissionGate requires="view:devops". No action needed.

### Story: Wire userRole, userName, defaultLocale from eva-faces auth context [ID=F39-04-004] [DONE]
Completed 2026-02-23. AuthContext, usePermissions, PermissionGate, ProtectedRoute. FACES-WI-C.

### Story: Confirm CORS / auth headers flow through APIM for /v1/scrum/* [ID=F39-04-005] [DONE]
Completed 2026-02-26 Session 10. APIM smoke test HTTP 200 for both scrum routes. scrumApi.ts
updated to send X-Actor-OID, X-Correlation-ID, X-Acting-Session (brain-api middleware requires
them). VITE_APIM_BASE_URL + VITE_APIM_SUBSCRIPTION_KEY set in portal-face/.env.local.

### Story: Create ADO WIs FACES-WI-A, FACES-WI-B, FACES-WI-C [ID=F39-04-006] [DONE]
Completed 2026-02-23.

## Feature: Relationship to eva-faces [ID=F39-05]
Architecture: no package import. Interface = 31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml.
Eva-faces builds screens independently from that spec.

## Feature: DASHBOARD API [ID=F39-DASHBOARD]

### Story: GET /v1/scrum/dashboard [ID=F39-DASHBOARD-001] [DONE]
Completed 2026-02-25. status=implemented in data model (rv=4); APIM route brain/v1/scrum/dashboard
smoke tested [PASS]; wbs_id corrected to F39-DASHBOARD-001. Cache-aside on scrum-cache (TTL 86400s).

## Feature: SUMMARY API [ID=F39-SUMMARY]

### Story: GET /v1/scrum/summary [ID=F39-SUMMARY-001] [DONE]
Completed 2026-02-25. status=implemented in data model (rv=5); APIM route brain/v1/scrum/summary
smoke tested [PASS]; wbs_id corrected to F39-SUMMARY-001.

## Feature: UI Pages [ID=F39-UI]

### Story: EVAHomePage (route /) [ID=F39-UI-001] [DONE]
Live in 31-eva-faces. Vitest coverage: 9 tests in src/pages/EVAHomePage.test.tsx (all passing).
A11y: jest-axe 0 violations. Screen registered in 37-data-model (rv=5).

### Story: SprintBoardPage (route /devops/sprint) [ID=F39-UI-002] [DONE]
Live in 31-eva-faces. Vitest coverage: 10 tests in src/pages/SprintBoardPage.test.tsx (all passing).
A11y: jest-axe 0 violations (fixed FeatureSection h3->h2 heading-order bug).
Screen registered in data model (source_project fix applied 2026-02-26).
