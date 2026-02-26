# ACCEPTANCE.md -- 39-ado-dashboard

**Project:** EVA ADO Dashboard -- Sprint views and metrics content package  
**DoD Version:** 1.0.0  
**Date:** 2026-02-25
**Last updated:** 2026-02-26 Session 10 -- WI-3 CLOSED

---

## Definition of Done

A story in `39-ado-dashboard` is DONE when ALL criteria below are met.

### Functional Criteria

- [ ] The component renders without errors in 31-eva-faces (portal-face)
- [ ] Live API data flows from APIM -> 33-eva-brain-v2 -> Cosmos -> component (or mock is documented as temporary)
- [ ] Bilingual support: EN and FR labels render correctly
- [ ] Role guard: component is visible only to correct `userRole` (viewer+)

### Quality Gates

- [ ] `vitest run` exits 0, coverage >=70%
- [ ] `tsc --noEmit` exits 0 (zero TypeScript errors)
- [ ] `jest-axe` reports 0 accessibility violations
- [ ] No `console.error` in test output

### Data Model

- [ ] Screen registered in `37-data-model` with correct `app`, `route`, `api_calls`, `wbs_id`
- [ ] All called endpoints have `status=implemented` in data model
- [ ] `POST /model/admin/commit` returns `violation_count=0`

### Governance

- [ ] Story ID tagged in source file (`// EVA-STORY: F39-XX-XXX`)
- [ ] `STORY F39-XX-XXX: 100%` entry added to STATUS.md (veritas compatibility)
- [ ] PLAN.md story updated to `[DONE]` with completion date
- [ ] veritas MTI >= 70 (`eva audit --repo . --warn-only` exits 0)

---

## Sprint 1 (WI-0 + WI-1) -- DONE

- [x] brain /v1/scrum/dashboard + Cosmos cache (WI-0)
- [x] APIM route /v1/scrum/* registration -- brain/v1 API in marco-sandbox-apim; smoke [PASS]

## Sprint 2 (WI-2 + WI-3)

- [x] EVAHomePage.tsx static tile grid (WI-2) -- 9 vitest tests, jest-axe 0 violations
- [x] Live sprint badges (WI-3) -- DONE 2026-02-26 Session 10; .env.local created; scrumApi.ts headers fixed (X-Actor-OID, X-Correlation-ID, X-Acting-Session); APIM smoke [PASS] 200; vitest 43/43 [PASS]

## Sprint 3 (WI-4 + WI-5)

- [x] SprintBoardPage.tsx skeleton + API (WI-4) -- 10 vitest tests, jest-axe 0 violations
- [x] WI detail drawer + feature rollup (WI-5) -- scaffold complete

## Sprint 4 (WI-6)

- [x] Entity tags + velocity charts (WI-6) -- scaffold complete; live data after APIM/brain

## Session 10 Evidence (2026-02-26) -- WI-3 Closure

| Check | Evidence | Result |
|---|---|---|
| APIM /v1/scrum/summary smoke | HTTP 200 body=[] via marco-sandbox-apim | [PASS] |
| APIM /v1/scrum/dashboard smoke | HTTP 200 body={refreshed_at, epic:{id:4}} via marco-sandbox-apim | [PASS] |
| portal-face/.env.local created | VITE_APIM_BASE_URL=https://marco-sandbox-apim.azure-api.net/brain | [PASS] |
| scrumApi.ts apimHeaders() | Added X-Actor-OID, X-Correlation-ID, X-Acting-Session (required by brain-api middleware) | [PASS] |
| tsc --noEmit | exit 0, 0 errors | [PASS] |
| vitest run (session 10) | 43 passed (4 files, up from 20), exit 0 | [PASS] |
| .env.local gitignored | Confirmed in root .gitignore | [PASS] |

---

## Exit Criteria (project complete)

1. MTI >= 80 sustained across 3 consecutive veritas audits
2. All WIs in Sprint 1-4 DONE (no BLOCKED items that are not external dependencies)
3. 31-eva-faces portal-face passes full vitest suite (>= 24 tests) with live APIM data
4. SprintBoardPage shows real ADO data (no mock) when `VITE_APIM_BASE_URL` is set
5. `37-data-model` commit: violations=0 with all F39 screens and endpoints registered
