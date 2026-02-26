# PROJECT-39 — EVA ADO Dashboard

**Project name:** `39-ado-dashboard`  
**Folder:** `C:\AICOE\eva-foundation\39-ado-dashboard`  
**Status:** ✅ Scaffolding complete — 2026-02-20 10:55 ET  
**Created by:** EVA ADO Command Center ROADMAP  
**Date created:** 2026-02-20

---

## Vision

`39-ado-dashboard` builds the **EVA Portal** — the home page and navigation hub of `31-eva-faces`. Think of it as the [eva-suite home page](https://marcopolo483.github.io/eva-suite) brought inside the real EVA platform: product tiles, sprint state tiles, ADO board views, and project status panels — all surfaced to authenticated EVA users without them needing ADO access.

The EVA Suite has **23 products across 5 categories** (User Products, AI Intelligence, Platform, Developer, Moonshot). Each numbered `eva-foundation` project (14 through 39, and beyond) will eventually map to an ADO Epic. `39-ado-dashboard` makes that portfolio *visible* inside EVA Faces.

**Two delivery modes:**
- **EVA Home page** (`/`) — product tile grid (like eva-suite.github.io), with live sprint badge per product showing current ADO state
- **ADO embedded views** (`/devops/...`) — sprint progress, WI cards, feature rollups, velocity — sourced from ADO REST via eva-brain APIM, no direct ADO login required

**Scope relationship to `31-eva-faces`:**  
`31-eva-faces` owns all screens. `39-ado-dashboard` is the *content package* — React components, page definitions, and API integration — that `31-eva-faces` imports and routes.

---

## User Stories

### EVA Home (product portal)
| # | Story | Priority |
|---|-------|----------|
| US-H1 | As any EVA user, I land on a home page with product tiles (EVA Chat, EVA DA, EVA Portal, ...) and can click to launch any product | P0 |
| US-H2 | Each product tile shows a live sprint badge (Active / Done / Blocked) sourced from ADO | P1 |
| US-H3 | The home page is bilingual (EN/FR) and WCAG 2.1 AA compliant, matching GC Design System | P0 |
| US-H4 | Each tile links to the product's page inside EVA Faces or to an external URL | P0 |

### ADO Embedded Views (`/devops/...`)
| # | Story | Priority |
|---|-------|----------|
| US-A1 | As a stakeholder, I can see the current sprint's active WI for each project, its title, and state | P0 |
| US-A2 | As a stakeholder, I can navigate to past sprints and see what was delivered | P0 |
| US-A3 | As a developer, I can drill into a WI and see its DoD, test count, coverage %, and close date | P1 |
| US-A4 | As a stakeholder, I can filter the view by project (Brain, Faces, Agents, ...) | P1 |
| US-A5 | As a stakeholder, I can see the full Feature rollup (Epic → Feature → Sprint → WI) | P1 |
| US-A6 | As a developer, I can see which data model entities were affected by a given WI | P2 |
| US-A7 | As a stakeholder, I can see a velocity sparkline (tests added per sprint) | P2 |
| US-A8 | As a FinOps analyst, I can see attributed cost for a sprint by project and WI | P3 |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  31-eva-faces  (host — routing, auth, layout)                        │
│                                                                      │
│  /  → EVAHomePage.tsx (product tile grid — 23+ products)             │
│       ├── ProductTile × N  (title, icon, badge: ADO sprint state)    │
│       └── live sprint badge ← GET /v1/scrum/summary (APIM)           │
│                                                                      │
│  /devops/sprint  → SprintBoardPage.tsx                               │
│       ├── SprintSelector                                             │
│       ├── ProjectFilter (Brain / Faces / Agents / ...)               │
│       ├── FeatureRollup (Epic → Feature → WI cards)                  │
│       ├── WIDetailDrawer (DoD, tests, coverage, close date)          │
│       └── VelocityChart (tests per sprint sparkline)                 │
│                                                                      │
│  All pages import components from  39-ado-dashboard/src/             │
│                │                                                     │
│                │  GET /v1/scrum/dashboard?project=all&sprint=6       │
│                ▼                                                     │
│  17-apim  (marco-sandbox-apim) ─────────────────────────────────▶   │
│                │                                                     │
│                ▼                                                     │
│  33-eva-brain-v2 : GET /v1/scrum/dashboard                           │
│  ├── Cosmos cache (TTL 24h, key: sprint+project)                     │
│  └── ADO REST API (refresh trigger: daily Logic App / Fn)            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## API Contract

### `GET /v1/scrum/dashboard`

**Query params:**
```
project  : "all" | "brain-v2" | "faces" | "agents" | ...
sprint   : "all" | "Sprint-6" | "Sprint-5" | ...
```

**Response shape:**
```json
{
  "refreshed_at": "2026-02-20T06:00:00Z",
  "epic": {
    "id": 4,
    "title": "EVA Platform",
    "features": [
      {
        "id": 5,
        "title": "EVA Brain v2",
        "project": "brain-v2",
        "work_items": [
          {
            "ado_id": 7,
            "wi_tag": "WI-7",
            "title": "Deploy to sandbox",
            "sprint": "Sprint-6",
            "state": "Active",
            "dod": "Both APIs deployed; APIM routing verified; smoke tests pass",
            "test_count": null,
            "coverage_pct": null,
            "closed_at": null,
            "entities_affected": []
          }
        ]
      }
    ]
  }
}
```

---

## eva-brain Endpoint

New file: `app/routes/scrum.py`

```python
@router.get("/v1/scrum/dashboard")
async def scrum_dashboard(project: str = "all", sprint: str = "all"):
    """
    Returns sprint data from ADO, cached in Cosmos (TTL 24h).
    Refresh triggered daily by a Logic App or Azure Function.
    """
```

**Cosmos container:** `scrum-cache`  
**Partition key:** `/sprint_key` (e.g. `"all-all"`, `"brain-v2-Sprint-6"`)  
**TTL:** 86400 seconds  
**Fallback:** If Cosmos cache miss, call ADO REST live and populate cache.

---

## eva-faces Page

**Routes:** `/` → `EVAHomePage.tsx` (product tile grid); `/devops/sprint` → `SprintBoardPage.tsx`  
**Component files:** `src/pages/EVAHomePage.tsx`, `src/pages/SprintBoardPage.tsx`  
**Nav entry:** Sidebar link "Sprint Board" (role guard: `viewer` and above)

**Component tree:**
```
EVAHomePage
├── NavHeader (bilingual EN/FR, GC Design System, user role badge)
├── ProductTileGrid
│   └── ProductTile × N (icon, title, category, sprint badge, click → route)
└── RecentSprintSummaryBar (latest closed WI per active project)

SprintBoardPage
├── DashboardHeader (last refreshed timestamp, sprint selector)
├── ProjectFilterBar
├── FeatureSection (per Feature)
│   └── WICard[] (per WI — state badge, sprint tag, test count chip)
│       └── WIDetailDrawer (on click — full DoD, metrics, entity tags)
└── VelocityPanel (test count per sprint, coverage trend)
```

---

## ADO Work Items for Project 39

When created in ADO under a new Feature `EVA ADO Dashboard` (child of Epic id=4):

| WI | Title | Sprint | DoD |
|----|-------|--------|-----|
| WI-0 | eva-brain `/v1/scrum/dashboard` endpoint + Cosmos cache | Sprint-1 | Endpoint returns shaped ADO data; Cosmos TTL works; unit tests pass |
| WI-1 | APIM route registration for `/v1/scrum/dashboard` | Sprint-1 | Route live in sandbox; auth enforced |
| WI-2 | `EVAHomePage.tsx` — product tile grid, static (US-H1, US-H3, US-H4) | Sprint-2 | Home page renders 23 product tiles; GC Design System; bilingual |
| WI-3 | Live sprint badge on product tiles via `/v1/scrum/summary` (US-H2) | Sprint-2 | Each tile shows current ADO WI state badge; refreshes daily |
| WI-4 | `SprintBoardPage.tsx` — skeleton + API integration (US-A1, US-A2) | Sprint-3 | Page renders sprint WI list; sprint selector works |
| WI-5 | WI detail drawer + feature rollup (US-A3, US-A4, US-A5) | Sprint-3 | Drawer opens; Epic→Feature→WI hierarchy visible |
| WI-6 | Data model entity tags + velocity charts (US-A6, US-A7) | Sprint-4 | Entity links shown; sparklines render |

---

## Dependencies

| Dependency | Status | Blocks |
|------------|--------|--------|
| WI-7 done (eva-brain deployed) | 🔲 Active Sprint-6 | WI-0 (endpoint work) |
| APIM integration verified (WI-7 scope) | 🔲 Sprint-6 | WI-1 (route registration) |
| Cosmos available in sandbox | 🔲 Infrastructure | WI-0 (cache layer) |
| `37-data-model` `sprint-context.json` | 🔲 M2 work | WI-5 (entity tags) |
| `29-foundry` skill versioning | 🔲 M1 work | Skills for agent runner |
| ATRIB-0 APIM import (cost attribution headers live) | 🔲 After WI-7 | US-8 (FinOps cost column in dashboard) |
| `14-az-finops` FinOps Dashboard | 🔲 M4 work | Sibling project — same APIM attribution data |

---

## Skill Requirements for the Runner

Project 39's copilot-agent DPDCA runner will use:
- `29-foundry` skills (SESSION-WORKFLOW, documentator, self-improvement, ado-sync)
- Python FastAPI skills (from `33-eva-brain-v2` runner experience)
- React + TypeScript skills (from `31-eva-faces` runner experience)
- ADO Command Center scripts (this repo)

The runner is dispatched from `38-ado-poc` via `ado-bootstrap-pull.ps1` once a Feature WI is created for project 39 in ADO.

---

## Scope Note — EVA Platform Scale

The [EVA Suite home page](https://marcopolo483.github.io/eva-suite) shows 23 products across 5 categories (User Products, AI Intelligence, Platform, Developer, Moonshot). The `39-ado-dashboard` `EVAHomePage.tsx` must eventually tile all of them with live ADO sprint badges. Each tile = one numbered `eva-foundation` project = one future ADO Epic.

Current `eva-foundation` numbered projects (18 Epics to eventually register):
`14-az-finops`, `15-cdc`, `16-engineered-case-law`, `17-apim`, `18-azure-best`, `19-ai-gov`, `20-AssistMe`, `24-eva-brain`, `29-foundry`, `30-ui-bench`, `31-eva-faces`, `33-eva-brain-v2`, `34-eva-agents`, `35-agentic-code-fixing`, `36-red-teaming`, `37-data-model`, `38-ado-poc`, `39-ado-dashboard`

They will be imported into ADO one by one (each as a Feature or Epic under the main EVA Epic). Not all are active — some are complete, some are future. The home page badges will reflect that.

---

## Relationship to FinOps Dashboard & Cost Attribution

`39-ado-dashboard` and `14-az-finops` are **sibling consumers** of the same APIM cost attribution pipeline:

```
APIM inbound policy
  ╰── x-eva-project-id, x-eva-wi-tag, x-eva-business-unit, x-eva-client-id
        ├── 39-ado-dashboard        ≤─ delivery metrics: what was built, when, how many tests
        └── 14-az-finops            ≤─ cost attribution: what it cost, per sprint, WI, client
```

**Key insight:** ADO WI tags (`eva-brain;wi-7`) are not just labels — they are **cost attribution dimensions**. Every API call made during Sprint-6 while WI-7 is active can be tagged `x-eva-sprint=Sprint-6`, `x-eva-wi-tag=eva-brain;wi-7`. This closes the loop from code execution to FinOps billing.

**`eva-roles-api /evaluate-cost-tags` (already deployed):** This endpoint is the bridge. It takes a project + sprint + WI context and returns the full cost tag set (`business_unit`, `client_id`, `cost_tags[]`). Both `39-ado-dashboard` (delivery metrics) and `14-az-finops` (Power BI cost reports) consume this data.

**Future US-8 implementation:** When ATRIB-0 is complete (APIM import), the Sprint Board page can add a cost column to the sprint view — showing approximate token/compute cost per WI alongside delivery metrics, sourced from the same `x-eva-*` telemetry that feeds the Power BI FinOps reports.
