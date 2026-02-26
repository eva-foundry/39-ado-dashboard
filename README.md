# 39-ado-dashboard — EVA ADO Dashboard

**Part of:** `eva-foundation` portfolio  
**Host app:** `31-eva-faces` (imports components from this package)  
**Created:** 2026-02-20 10:55 ET  
**Status:** Sprint-1 scaffolding in progress

---

## What This Is

`39-ado-dashboard` is the **content package** for the EVA Portal. It provides:

1. **EVA Home page** (`/`) — 23-product tile grid with live ADO sprint badges
2. **Sprint Board** (`/devops/sprint`) — embedded ADO views (no direct ADO login required)

`31-eva-faces` owns routing and auth. This package exports React components and page definitions that `eva-faces` imports and mounts.

---

## Package Structure

```
39-ado-dashboard/
├── README.md                          ← this file
├── package.json
├── tsconfig.json
├── src/
│   ├── types/
│   │   └── scrum.ts                   ← shared types (WorkItem, Feature, Epic, etc.)
│   ├── api/
│   │   └── scrumApi.ts                ← APIM /v1/scrum/dashboard client
│   ├── components/
│   │   ├── NavHeader.tsx              ← bilingual GC Design System header
│   │   ├── RecentSprintSummaryBar.tsx ← latest closed WI per active project
│   │   ├── ProductTile.tsx            ← single product tile
│   │   ├── ProductTileGrid.tsx        ← 23-product grid
│   │   ├── SprintBadge.tsx            ← Active / Done / Blocked badge
│   │   ├── SprintSelector.tsx         ← sprint dropdown
│   │   ├── ProjectFilterBar.tsx       ← Brain / Faces / Agents / ... filter
│   │   ├── FeatureSection.tsx         ← Epic → Feature → WI tree
│   │   ├── WICard.tsx                 ← single WI row card
│   │   ├── WIDetailDrawer.tsx         ← slide-in: DoD, tests, coverage
│   │   └── VelocityPanel.tsx          ← test-count sparklines per sprint
│   └── pages/
│       ├── EVAHomePage.tsx            ← route: /
│       └── SprintBoardPage.tsx        ← route: /devops/sprint
├── eva-brain/
│   └── app/routes/scrum.py            ← new FastAPI route for sprint data
└── ADO-WORK-ITEMS.md                  ← WI backlog (WI-0 … WI-6)
```

---

## API

All data flows through `17-apim` (`marco-sandbox-apim`). No direct ADO calls from the browser.

```
GET /v1/scrum/dashboard?project={all|brain-v2|faces|...}&sprint={all|Sprint-6|...}
```

Response cached in `33-eva-brain-v2` Cosmos container `scrum-cache`, TTL 24 h.

---

## ADO Work Items (Sprint Plan)

| WI    | Title                                              | Sprint   |
|-------|----------------------------------------------------|----------|
| WI-0  | eva-brain `/v1/scrum/dashboard` endpoint + Cosmos  | Sprint-1 |
| WI-1  | APIM route registration                            | Sprint-1 |
| WI-2  | `EVAHomePage.tsx` — static product tile grid       | Sprint-2 |
| WI-3  | Live sprint badges via `/v1/scrum/summary`         | Sprint-2 |
| WI-4  | `SprintBoardPage.tsx` skeleton + API               | Sprint-3 |
| WI-5  | WI detail drawer + feature rollup                  | Sprint-3 |
| WI-6  | Entity tags + velocity charts                      | Sprint-4 |

---

## Interface Contract

`39-ado-dashboard` does **not** export React components to `31-eva-faces`. The interface is a declarative YAML epic spec:

```
31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml
```

Eva-faces reads that spec and builds screens independently. No circular dependency.

## Related Projects

| Project | Role |
|---------|------|
| `31-eva-faces` | Screen builder — reads epic YAML, implements routes + sidebar |
| `33-eva-brain-v2` | Backend — `/v1/scrum/dashboard` + `/v1/scrum/summary` |
| `17-apim` | Gateway — APIM proxy, auth enforcement |
| `37-data-model` | Entity tags for WI-6 (M2) |
| `14-az-finops` | Sibling — shares APIM attribution data (M4) |
