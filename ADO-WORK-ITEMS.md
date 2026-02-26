# ADO Work Items — Project 39 EVA ADO Dashboard

**Feature:** `EVA ADO Dashboard`  
**Epic:** id=4 `EVA Platform`  
**Created:** 2026-02-20 10:55 ET  
**Source:** PROJECT-39.md

---

## Work Item Backlog

### WI-0 — eva-brain `/v1/scrum/dashboard` endpoint + Cosmos cache

**Sprint:** Sprint-1  
**State:** New  
**Project:** brain-v2

**Definition of Done:**
- `GET /v1/scrum/dashboard?project=all&sprint=all` returns shaped ADO data
- Cosmos container `scrum-cache` exists; TTL set to 86400 seconds
- Cache hit path verified (second call returns cached payload)
- Cache miss path verified (live ADO call populates cache)
- Unit tests pass: `test_scrum_dashboard_cache_hit`, `test_scrum_dashboard_cache_miss`, `test_scrum_dashboard_ado_fallback`

**Files:**
- `eva-brain/app/routes/scrum.py` ← new (scaffold in this repo)
- Register router in `eva-brain/app/main.py`

---

### WI-1 — APIM route registration for `/v1/scrum/dashboard`

**Sprint:** Sprint-1  
**State:** New  
**Project:** apim  
**Blocked by:** WI-7 (eva-brain deployed to sandbox)

**Definition of Done:**
- `/v1/scrum/dashboard` and `/v1/scrum/summary` routes live in `marco-sandbox-apim`
- OAuth / subscription key auth enforced on both routes
- Smoke test: `GET https://marco-sandbox-apim.azure-api.net/v1/scrum/summary` returns HTTP 200

---

### WI-2 — `EVAHomePage.tsx` — product tile grid, static

**Sprint:** Sprint-2  
**State:** New  
**Project:** ado-dashboard  
**Addresses:** US-H1, US-H3, US-H4

**Definition of Done:**
- Home page renders 23 product tiles grouped by category
- GC Design System styling applied (colours, typography, spacing)
- EN/FR toggle works; all strings translated
- WCAG 2.1 AA: keyboard navigable, skip link present, colour contrast ≥ 4.5:1
- All tile hrefs route correctly inside eva-faces

**Files:**
- `src/pages/EVAHomePage.tsx`
- `src/components/ProductTileGrid.tsx`
- `src/components/ProductTile.tsx`
- `src/components/NavHeader.tsx`

---

### WI-3 — Live sprint badge on product tiles via `/v1/scrum/summary`

**Sprint:** Sprint-2  
**State:** New  
**Project:** ado-dashboard  
**Addresses:** US-H2  
**Blocked by:** WI-1 (APIM route live)

**Definition of Done:**
- Each tile with `adoProject != null` shows current ADO WI state badge (Active / Done / Blocked)
- Badge refreshes on page load (cached at APIM layer, TTL 24 h)
- Graceful degradation: tile renders normally if API call fails
- `VITE_APIM_BASE_URL` and `VITE_APIM_SUBSCRIPTION_KEY` documented in `.env.example`

**Files:**
- `src/api/scrumApi.ts` — `fetchSprintSummaries()`
- `src/components/SprintBadge.tsx`

---

### WI-4 — `SprintBoardPage.tsx` skeleton + API integration

**Sprint:** Sprint-3  
**State:** New  
**Project:** ado-dashboard  
**Addresses:** US-A1, US-A2  
**Blocked by:** WI-1

**Definition of Done:**
- `/devops/sprint` renders sprint WI list sourced from `/v1/scrum/dashboard`
- Sprint selector works: switching sprints re-fetches and re-renders
- Project filter works: switching project updates visible feature sections
- Loading and error states handled
- Sidebar nav entry "Sprint Board" visible to `viewer` role and above

**Files:**
- `src/pages/SprintBoardPage.tsx`
- `src/components/SprintSelector.tsx`
- `src/components/ProjectFilterBar.tsx`
- `src/components/FeatureSection.tsx`
- `src/components/WICard.tsx`

---

### WI-5 — WI detail drawer + feature rollup

**Sprint:** Sprint-3  
**State:** New  
**Project:** ado-dashboard  
**Addresses:** US-A3, US-A4, US-A5  
**Blocked by:** WI-4, `37-data-model` sprint-context.json (optional)

**Definition of Done:**
- Clicking a WICard opens `WIDetailDrawer` with DoD, test count, coverage %, close date
- Epic → Feature → WI hierarchy visible in `FeatureSection`
- Close drawer via button or backdrop click; ESC key also closes
- Accessible: `role=dialog`, `aria-modal=true`, focus trapped inside drawer

**Files:**
- `src/components/WIDetailDrawer.tsx`

---

### WI-6 — Data model entity tags + velocity charts

**Sprint:** Sprint-4  
**State:** New  
**Project:** ado-dashboard  
**Addresses:** US-A6, US-A7  
**Blocked by:** WI-5, `37-data-model` entity registry

**Definition of Done:**
- WIDetailDrawer shows entity tags sourced from `entities_affected` field
- `VelocityPanel` renders tests-added and coverage-% sparklines per sprint
- Accessible: SVG sparklines have accessible data table fallback
- Velocity data computed client-side from dashboard WI test counts

**Files:**
- `src/components/VelocityPanel.tsx`
- Update `src/components/WIDetailDrawer.tsx` (entity tags section)

---

## Dependencies Summary

| WI | Blocked by | Est. Sprint |
|----|-----------|-------------|
| WI-0 | Cosmos infra ready | Sprint-1 |
| WI-1 | WI-7 (brain deployed), WI-0 | Sprint-1 |
| WI-2 | None | Sprint-2 |
| WI-3 | WI-1 | Sprint-2 |
| WI-4 | WI-1 | Sprint-3 |
| WI-5 | WI-4 | Sprint-3 |
| WI-6 | WI-5 | Sprint-4 |

---

## ADO Creation Checklist

- [ ] Create Feature `EVA ADO Dashboard` under Epic id=4
- [ ] Create WI-0 through WI-6 as User Stories under that Feature
- [ ] Set Sprint assignment per table above
- [ ] Assign to appropriate team members
- [ ] Add DoD text to each WI custom field
- [ ] Link WI-1 to WI-7 (Blocked by relationship)
