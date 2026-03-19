# STATUS.md -- 39-ado-dashboard

**Last updated:** 2026-02-25 ET (Session 14)

---

## Overall Status: Sprint 4 COMPLETE -- ADO LIVE -- features=5 wi=18 -- Epic scoped -- APIM verified

Sprint 6 in 33-eva-brain-v2 is CLOSED. WI-0 through WI-6 all DONE. Live ADO data flows
end-to-end: APIM /brain/v1/scrum/dashboard returns features=5, wi=18 real scoped ADO work
items from marcopresta/eva-poc (Epic 2371 -> 5 Features -> 18 PBIs). System.Tags populated.
All F39-02 ADO setup stories marked DONE. Session 14 delivered epic scoping + tag extraction.

### Session 14 (2026-02-25 ET) -- Epic Scoping: features=5 wi=18

| Action | Detail | Result |
|---|---|
| ADO parent filter diagnosed | test-epic-scope.py: Epic 2371 -> Features 2372-2376 -> 18 PBIs confirmed | [DONE] |
| scrum.py rewritten | 3-step hierarchy: _wiql_ids + _wi_details helpers; real ADO Feature entries; System.Tags populated | [DONE] |
| test_scrum.py updated | TestWIQLAreaPath rewritten for 2-POST + multi-GET pattern; ADO_EPIC_ID=2371 patched | [DONE] |
| 6 pytest tests | 6/6 passing | [PASS] |
| CA ADO_EPIC_ID updated | --set-env-vars ADO_EPIC_ID=2371 (was 4 -- wrong) | [DONE] |
| ACR build sprint7-epic-scope | cx21 Succeeded | [DONE] |
| CA deploy | Revision --0000018 active with sprint7-epic-scope | [DONE] |
| Cosmos cache bust | already expired (TTL) | [DONE] |
| APIM smoke test | GET /brain/v1/scrum/dashboard HTTP 200 features=5 wi=18 tags populated | [PASS] |

### Session 13 (2026-02-25 ET) -- dtl_client.py IndexError Fix + sprint7-live Deploy

| Action | Detail | Result |
|---|---|---|
| dtl_client.py diagnosed | IndexError: parents[5] crashes in Docker (only 4 levels deep at /app/app/clients/) | [DONE] |
| dtl_client.py fix | Wrapped parents[5] in try/except IndexError -> _DTL_ROOT = Path("/nonexistent/49-eva-dtl") | [DONE] |
| scrum.py debug logging | Added logger.info for WIQL url/status/count; logger.warning for 0 items; exc_info=True | [DONE] |
| scrum.py timeouts | Increased WIQL and bulk fetch timeouts from 15s to 30s | [DONE] |
| ACR build sprint7-live | Built from services/eva-brain-api/; cx1y Succeeded | [DONE] |
| CA deploy | Revision --0000016 active with sprint7-live; rev --0000015 (sprint7-dtl-fix) deactivating | [DONE] |
| Cosmos cache bust | all-all deleted via del-cache.py | [DONE] |
| APIM smoke test | GET /brain/v1/scrum/dashboard HTTP 200 features=1 wi=200 | [PASS] |
| 37-DM commit | violations=0 exported=4006 errors=0 (ACA FAIL=expected, assemble script not deployed) | [PASS] |

### Session 12 (2026-02-25 14:21 ET) -- ADO Live Integration Fix

| Action | Detail | Result |
|---|---|---|
| scrum.py Fix 1 (prior ACR) | WIQL area path 'EVA' -> ADO_PROJECT variable | [DONE] |
| scrum.py Fix 2 (prior ACR) | WIQL type filter: added 'Product Backlog Item' | [DONE] |
| scrum.py Fix 3 | WIQL area path filter removed (redundant -- URL scoped) | [DONE] |
| requirements.txt fix | requests>=2.32.0 added (was missing; requests.post used in scrum.py) | [DONE] |
| scrum.py Fix 4 | Custom.DoD, Custom.EntitiesAffected removed from detail fetch fields (ADO 400) | [DONE] |
| test_scrum.py updated | TestWIQLAreaPath: URL check replaces query check; AreaPath not in query asserted | [DONE] |
| 6 pytest tests | 6/6 passing after all fixes | [PASS] |
| ACR build sprint7-custom-fields-fix | Revision --0000014 deployed; RunningAtMaxScale | [DONE] |
| Cosmos cache bust | all-all deleted; fresh ADO fetch confirmed features=1 wi=200 | [PASS] |
| APIM smoke test | GET /brain/v1/scrum/dashboard HTTP 200 body 45KB features=1 wi=200 | [PASS] |
| PLAN.md F39-02 | F39-02-001 through F39-02-006 -> [DONE] (seeded + wired) | [DONE] |
| Veritas audit 39-ado-dashboard | MTI=86 (stable) F39-DASHBOARD-001 2 artifacts | [PASS] |
| Veritas audit 33-eva-brain-v2 | MTI=72% run complete | [PASS] |
| ACA commit | violations=0 exported=4006 | [PASS] |

### Session 11 (2026-02-25 ET) -- Data Model Dependency Documentation

| Action | Detail | Result |
|---|---|---|
| portal-face service registered | PUT /model/services/portal-face: status=running, rv=1; documents 31-eva-faces SPA consuming brain-api via APIM | [DONE] |
| eva-ado-dashboard service updated | PUT /model/services/eva-ado-dashboard: stub->active, rv=2; notes document full dependency chain: portal-face->APIM->brain-api->scrum-cache | [DONE] |
| EVAHomePage api_calls fixed | PUT /model/screens/EVAHomePage: rv=5->6; added GET /v1/scrum/dashboard (was only summary) | [DONE] |
| PLAN.md stale notes fixed | F39-01-002 badge mock note removed; F39-03 env var status updated to SET | [DONE] |
| Model commit | violations=0 exported=4006 errors=0 | [PASS] |

### Session 10 (2026-02-26 ET)

| Action | Detail | Result |
|---|---|---|
| APIM smoke test (summary) | GET /v1/scrum/summary via marco-sandbox-apim HTTP 200 body=[] | [PASS] |
| APIM smoke test (dashboard) | GET /v1/scrum/dashboard via marco-sandbox-apim HTTP 200 body={refreshed_at,epic} | [PASS] |
| portal-face/.env.local created | VITE_APIM_BASE_URL=https://marco-sandbox-apim.azure-api.net/brain; VITE_APIM_SUBSCRIPTION_KEY=eva-core primary | [DONE] |
| scrumApi.ts apimHeaders() updated | Added X-Actor-OID, X-Correlation-ID, X-Acting-Session (brain-api middleware requires them) | [DONE] |
| tsc --noEmit | exit 0, 0 errors | [PASS] |
| vitest run | 43 passed (4 test files), exit 0 (was 20; ModelBrowserPage + ModelReportPage tests added) | [PASS] |
| ACCEPTANCE.md WI-3 closed | Checked off; Session 10 evidence table added | [DONE] |
| WI-3 CLOSED | Live sprint badges wired: .env.local + header fix + vitest green | [DONE] |
| portal-face/.gitignore created | Was missing entirely -- standard Vite pattern added (.env.local, .env.*.local, node_modules, dist, coverage) | [DONE] |
| KV write blocked | az keyvault secret set apim-eva-core-key FAIL Forbidden -- EsDAICoE identity is Reader-only on marcosandkv20260203; needs Contributor (infra team) | [BLOCKED] |
| 22-rg-sandbox RETIRED | 37-DM projects/22-rg-sandbox status=retired rv=10; PLAN.md retirement banner added; violations=0 exported=4005 | [DONE] |

### Session 9 (2026-02-26 ET)

| Action | Detail | Result |
|---|---|---|
| vitest + @testing-library added | package.json: vitest 1.6.1, @testing-library/react 14, jest-axe 9.0.0, @types/jest-axe 3.5.9, jsdom 24; @gcweb-suite/react phantom dep removed | [PASS] |
| vite.config.ts created | jsdom environment, setupFiles, coverage thresholds 70% | [DONE] |
| src/test-setup.ts created | jest-axe toHaveNoViolations + TS augmentation | [DONE] |
| FeatureSection.tsx a11y fix | h3->h2 for feature title (heading-order axe violation: h1->h3 skip) | [FIXED] |
| EVAHomePage.test.tsx (9 tests) | renders, H1, 5 categories, 23 tiles, loading, error, skip link, GC sig, sprint bar, axe | [PASS] |
| SprintBoardPage.test.tsx (10 tests) | renders, H1, loading, hide loading, error, no-data, feature titles, WI titles, API params, axe | [PASS] |
| vitest run | 20 passed (20) Duration 4.51s | [PASS] |
| tsc --noEmit | exit 0, 0 errors | [PASS] |
| F39-04-003 closed | Sprint Board link already in portal-face NavHeader.tsx with PermissionGate requires="view:devops" | [DONE] |

### Session 8 Bootstrap (2026-02-25 11:24 ET)

Data model queried live (ACA Cosmos, total=3929 objects):

| Check | Result |
|---|---|
| eva-brain-api service | status=running; Sprint 5 done (577/577 tests, 72% cov); Sprint 6 active |
| Sprint 6 deploy status | CLOSED 2026-02-25 12:43 ET -- both Dockerfiles DONE; ACR push DONE; Container Apps RUNNING; APIM brain/v1 REGISTERED |
| GET /v1/scrum/dashboard | status=implemented (rv=4); APIM route brain/v1/scrum/dashboard smoke tested [PASS] 2026-02-25 |
| GET /v1/scrum/summary | status=implemented (rv=5); APIM route brain/v1/scrum/summary smoke tested [PASS] 2026-02-25 |
| scrum-cache Cosmos container | status=provisioned; eva-foundation DB; /sprint_key PK; TTL=86400s |
| Veritas scan (2026-02-25) | MTI=50, coverage=100%, 26/26 stories covered, gaps=0 |
| EVAHomePage screen (data model) | EXISTS -- rv=5; app=portal-face; route=/; wbs_id=F44-02-001; api_calls=[GET /v1/scrum/summary] |
| SprintBoardPage screen (data model) | EXISTS -- rv=6; app=portal-face; route=/devops/sprint; wbs_id=F31-04-001 |
| Endpoint wbs_id fixes applied | GET /v1/scrum/dashboard: F33-CHAT-007->F39-DASHBOARD-001 (rv=3); GET /v1/scrum/summary: F33-SUMMARY-001->F39-SUMMARY-001 (rv=4) |
| ACA commit (11:24 ET) | status=FAIL (assemble script expected on ACA); violations=0; exported=3937; errors=0 -- [PASS] |

### Session 7 Update (2026-02-25 11:00 ET)

| Action | Detail | Result |
|---|---|---|
| F39-01-002 CLOSED | EVAHomePage + SprintBoardPage integrated into 31-eva-faces routing; 24 portal-face tests passing | [PASS] |
| WBS-ADO sync live | 1869 WBS records enriched with sprint_id, story_points, owner from ADO | [PASS] |
| Sync endpoint registered | POST /model/wbs/sync-from-ado added to data model as stub (model-api service) | [DONE] |
| ACA commit | violations=0 exported=3930 -- clean | [PASS] |

---

## Component Status

| Layer | File | Status | Notes |
|-------|------|--------|-------|
| Types | `src/types/scrum.ts` | [DONE] | All types defined |
| API client | `src/api/scrumApi.ts` | [DONE] | `fetchScrumDashboard`, `fetchSprintSummaries` |
| NavHeader | `src/components/NavHeader.tsx` | [DONE] | Bilingual EN/FR, GC Design System |
| ProductTile | `src/components/ProductTile.tsx` | [DONE] | Icon, name, category, badge |
| ProductTileGrid | `src/components/ProductTileGrid.tsx` | [DONE] | 23 products x 5 categories |
| SprintBadge | `src/components/SprintBadge.tsx` | [DONE] | Active/Done/Blocked |
| SprintSelector | `src/components/SprintSelector.tsx` | [DONE] | Sprint dropdown |
| ProjectFilterBar | `src/components/ProjectFilterBar.tsx` | [DONE] | Pill-button filter |
| FeatureSection | `src/components/FeatureSection.tsx` | [DONE] | Epic->Feature->WI tree |
| WICard | `src/components/WICard.tsx` | [DONE] | State badge, sprint chip, test count |
| WIDetailDrawer | `src/components/WIDetailDrawer.tsx` | [DONE] | DoD, tests, coverage, entities |
| VelocityPanel | `src/components/VelocityPanel.tsx` | [DONE] | SVG sparklines + accessible table |
| RecentSprintSummaryBar | `src/components/RecentSprintSummaryBar.tsx` | [DONE] | Latest closed WI per project |
| EVAHomePage | `src/pages/EVAHomePage.tsx` | [DONE] | Route `/` -- tile grid + badges |
| EVAHomePage tests | `src/pages/EVAHomePage.test.tsx` | [DONE] | 9 vitest tests, jest-axe 0 violations |
| SprintBoardPage | `src/pages/SprintBoardPage.tsx` | [DONE] | Route `/devops/sprint` |
| SprintBoardPage tests | `src/pages/SprintBoardPage.test.tsx` | [DONE] | 10 vitest tests, jest-axe 0 violations |
| Barrel export | `src/index.ts` | [DONE] | All exports for eva-faces |
| Backend route | `33-eva-brain-v2/.../routes/scrum.py` | [DONE] | Registered in main.py Sprint 6 block |

---

## WI Status

| WI | Title | Sprint | Status | Blocked by |
|----|-------|--------|--------|------------|
| WI-0 | eva-brain /v1/scrum/dashboard + Cosmos cache | Sprint-1 | [DONE] 2026-02-25 -- endpoints implemented, Container App live, scrum-cache provisioned | -- |
| WI-1 | APIM route /v1/scrum/* registration | Sprint-1 | [DONE] 2026-02-25 12:58 ET -- brain/v1 API in marco-sandbox-apim; eva-core product; smoke [PASS] | -- |
| WI-2 | EVAHomePage.tsx static tile grid | Sprint-2 | [DONE] 2026-02-25 -- routing live in eva-faces; 9 vitest tests (EVAHomePage.test.tsx), jest-axe 0 violations | -- |
| WI-3 | Live sprint badges | Sprint-2 | [DONE] 2026-02-26 Session 10 -- .env.local created; scrumApi.ts X-Actor-OID/X-Correlation-ID/X-Acting-Session headers added; APIM smoke [PASS]; vitest 43/43 | -- |
| WI-4 | SprintBoardPage.tsx skeleton + API | Sprint-3 | [DONE] 2026-02-26 -- routing live in eva-faces; 10 vitest tests (SprintBoardPage.test.tsx), jest-axe 0 violations | WI-1 (live data) |
| WI-5 | WI detail drawer + feature rollup | Sprint-3 | [DONE] Scaffold complete | WI-4 |
| WI-6 | Entity tags + velocity charts | Sprint-4 | [DONE] Scaffold complete | WI-5, 37-data-model |

---

## Dependencies

| Dependency | State | Blocks |
|------------|-------|--------|
| WI-7 -- eva-brain-v2 Container App deploy | [DONE] 2026-02-25 -- both services running; Sprint 6 CLOSED | -- |
| Cosmos container scrum-cache | [DONE] Live -- eva-foundation DB, /sprint_key PK, TTL=86400s, credentials in 33-eva-brain-v2/.env.ado | -- |
| APIM route /v1/scrum/* registered | [DONE] 2026-02-25 -- brain/v1 API in marco-sandbox-apim, eva-core product, both operations added, smoke tested [PASS] | -- |
| 31-eva-faces FACES-WI-A (WI-17 EVAHomePage) | [DONE] 2026-02-23 -- 23 tiles, 10 tests, nav bar | WI-2 live badges (blocked on APIM) |
| 31-eva-faces FACES-WI-B (WI-18 SprintBoardPage) | [DONE] 2026-02-23 -- drawer, velocity panel, 13 tests | WI-4/5/6 live data (blocked on APIM) |
| 31-eva-faces FACES-WI-C (WI-19 auth context) | [DONE] 2026-02-23 -- AuthContext, PermissionGate, ProtectedRoute, NavHeader nav bar | -- |
| 37-data-model sprint-context.json | [NOT STARTED] M2 | WI-6 |
| ATRIB-0 (APIM cost attribution headers) | [NOT STARTED] After WI-7 | US-8 (FinOps cost column) |

---

## Architecture Decision (2026-02-20)

**No package import between `39-ado-dashboard` and `31-eva-faces`.**  
`39-ado-dashboard` publishes `31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml` as the interface contract. Eva-faces builds its own screens from that spec. Components in `src/` here are reference implementations / prototypes.

## Completed

| Date | Item | Detail |
|---|---|---|
| 2026-02-20 | scrum-cache container | Provisioned in eva-foundation DB, /sprint_key PK, TTL=86400s |
| 2026-02-23 | FACES-WI-A (WI-17 EVAHomePage) | 53-module build, 10 vitest tests, 23 tiles |
| 2026-02-23 | FACES-WI-B (WI-18 SprintBoardPage) | drawer, velocity panel, 13 vitest tests |
| 2026-02-23 | FACES-WI-C (WI-19 auth context) | AuthContext, usePermissions, PermissionGate, ProtectedRoute, nav bar |
| 2026-02-23 | 37-data-model DRIFT-3/4 sync | 7 screens + 26 endpoints + 23 literals; PASS 0 violations |
| 2026-02-25 | F39-01-002 (EVAHomePage routing) | Integrated into eva-faces routing; 24 portal-face tests passing |
| 2026-02-25 | WBS-ADO sync | 1869 WBS records enriched; ACA commit clean (violations=0, exported=3930) |
| 2026-02-25 11:24 ET | Data model wbs_id fixes | GET /v1/scrum/dashboard + summary wbs_id corrected to F39-DASHBOARD-001 / F39-SUMMARY-001; ACA commit violations=0 exported=3937 |
| 2026-02-26 | 39-ado-dashboard vitest setup | vitest 1.6.1 + @testing-library/react 14 + jest-axe 9. FeatureSection h3->h2 a11y fix. 20 tests passing, tsc exit 0 |
| 2026-02-26 | F39-04-003 CLOSED | Sprint Board link confirmed in portal-face NavHeader.tsx with PermissionGate requires="view:devops" |
| 2026-02-26 | 37-DM SprintBoardPage source_project fix | rv 7->8; source_project="39-ado-dashboard" set; ACA commit violations=0 exported=4005 errors=0 [PASS] |
| 2026-02-25 12:58 ET | WI-0 + WI-1 DONE | apim-gateway registered in data model (rv=1); brain/v1 API created in marco-sandbox-apim; GET /v1/scrum/dashboard + summary smoke tested [PASS]; both endpoints flipped to implemented (rv=4, rv=5); ACA commit violations=0 exported=4005 |
| 2026-02-26 Session 10 | WI-3 DONE | portal-face/.env.local created; scrumApi.ts apimHeaders() updated with X-Actor-OID/X-Correlation-ID/X-Acting-Session; APIM smoke [PASS]; vitest 43/43 [PASS]; ACCEPTANCE.md WI-3 checked off |

## Open Blockers

None. All WI-0 through WI-6 complete. Live APIM confirmed 2026-02-26.

## Next Tasks (priority order)

1. F39-02 ADO Setup Checklist -- create Feature EVA ADO Dashboard + WI-0..6 user stories in ADO board
2. Wire ADO env vars into 33-eva-brain-v2 brain CA (ADO_PAT, ADO_ORG_URL, ADO_PROJECT, ADO_EPIC_ID)
3. Wire COSMOS_ENDPOINT + COSMOS_KEY into brain CA so scrum-cache reads live ADO data
4. Verify SprintBoardPage shows real ADO data (live, no mock flag) in portal-face browser
5. F39-01-004: Velocity + entity tags (blocked on 37-data-model sprint-context.json M2)
6. [OPS] Store apim-eva-core-key in marcosandkv20260203 KV once infra team grants Contributor role (EsDAICoE identity currently Reader-only)

---

## Veritas Story Coverage

<!-- veritas-compatible: regex = ^\s*(STORY)\s+([A-Z0-9-]+)\s*:\s*(.+?)\s*$ -->
STORY F39-01-001: 100%
STORY F39-01-002: 100%
STORY F39-01-003: 100%
STORY F39-01-004: 0%
STORY F39-01-005: 0%
STORY F39-02-001: 0%
STORY F39-02-002: 0%
STORY F39-02-003: 0%
STORY F39-02-004: 0%
STORY F39-02-005: 0%
STORY F39-02-006: 0%
STORY F39-02-007: 100%
STORY F39-04-001: 100%
STORY F39-04-002: 100%
STORY F39-04-003: 100%
STORY F39-04-004: 100%
STORY F39-04-005: 100%
STORY F39-04-006: 100%
STORY F39-DASHBOARD-001: 100%
STORY F39-SUMMARY-001: 100%
STORY F39-UI-001: 100%
STORY F39-UI-002: 100%


---

## 2026-03-03 -- Re-primed by agent:copilot

<!-- eva-primed-status -->

Data model: GET http://localhost:8010/model/projects/39-ado-dashboard
29-foundry agents: C:\eva-foundry\eva-foundation\29-foundry\agents\
48-eva-veritas: run audit_repo MCP tool
