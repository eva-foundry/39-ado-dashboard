# DEPENDENCIES — 39-ado-dashboard

**Last updated:** 2026-02-20  
**ADO org:** `dev.azure.com/marcopresta/eva-poc`  
**Epic:** id=4 `EVA Platform` · Feature: `EVA ADO Dashboard`

This document describes everything that `39-ado-dashboard` needs from neighbouring projects to ship to production.  
It does **not** list runtime npm dependencies (see `package.json`) or Azure infrastructure outside these projects.

---

## 1. Summary Table

| Depends on | What we need | Blocking WI | Status |
|---|---|---|---|
| `33-eva-brain-v2` | `GET /v1/scrum/dashboard` endpoint live | WI-0 | 🔲 route coded, not deployed |
| `33-eva-brain-v2` | `GET /v1/scrum/summary` endpoint live | WI-0 | 🔲 route coded, not deployed |
| `33-eva-brain-v2` | Cosmos `scrum-cache` container created | WI-0 | 🔲 infra not provisioned |
| `33-eva-brain-v2` | Service deployed to sandbox (WI-7) | WI-1 | 🔲 not yet deployed |
| `17-apim` | `/v1/scrum/dashboard` + `/v1/scrum/summary` registered in APIM | WI-1 | 🔲 blocked on WI-0 + WI-7 |
| `31-eva-faces` | Routes `/` and `/devops/sprint` defined in host app | FACES-WI-A/B | 🔲 not started |
| `31-eva-faces` | Sidebar entry wired + role guard applied | FACES-WI-B | 🔲 not started |
| `31-eva-faces` | Auth context exposed (`user.role`, `language`) | FACES-WI-C | 🔲 not started |
| `38-ado-poc` | WIQL patterns + ADO org/project slugs | reference | ✅ documented |
| `38-ado-poc` | ADO WI creation tooling (`ado-setup.ps1`) | ADO WI creation | ✅ available |
| `38-ado-poc` | Full cross-project dependency graph | `DEPENDENCIES.md` | ✅ see §5 below |

---

## 2. Dependencies on `33-eva-brain-v2`

`39-ado-dashboard` (via the web app in `31-eva-faces`) calls two eva-brain endpoints through APIM.  
The backend code lives at:  
`33-eva-brain-v2/services/eva-brain-api/app/routes/scrum.py`

### 2.1 Endpoints Required

| Route | Method | Purpose | Defined in |
|---|---|---|---|
| `/v1/scrum/dashboard` | GET | Full sprint/WI payload per project + sprint filter | `scrum.py` |
| `/v1/scrum/summary` | GET | Badge-level summary (Active / Done / Blocked) per feature | `scrum.py` |

**Query params for `/v1/scrum/dashboard`:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `project` | string | `all` | ADO project slug, or `all` |
| `sprint` | string | `all` | Sprint name, or `all` (latest active) |

**Response shape** (matches `ScrumDashboardResponse` in `src/types/scrum.ts`):

```typescript
{
  sprint_name: string
  products: Product[]           //  each: { id, name_en, name_fr, ado_project, category, features, sprint_badge }
  generated_at: string          // ISO timestamp
  cache_hit: boolean
}
```

### 2.2 Infra Requirements on eva-brain-v2 Side

| Item | Detail | Command / File |
|---|---|---|
| Cosmos container | `scrum-cache` in database `eva-foundation`, partition key `/sprint_key`, TTL 86400 s | `az cosmosdb sql container create --account-name <acct> --database-name eva-foundation --name scrum-cache --partition-key-path /sprint_key --default-ttl 86400` |
| Environment variables | See table below | `33-eva-brain-v2/.env` (do not commit) |
| WI-7 deployment | Service must be deployed to sandbox before APIM can import | ADO WI-7 (33-eva-brain-v2 backlog) |

**Environment variables needed in `33-eva-brain-v2/.env`:**

| Variable | Example value | Notes |
|---|---|---|
| `COSMOS_ENDPOINT` | `https://<acct>.documents.azure.com:443/` | Azure Cosmos DB account URI |
| `COSMOS_KEY` | `<primary-key>` | Rotate via Key Vault; never commit |
| `COSMOS_DATABASE` | `eva-foundation` | Already used by other routes |
| `ADO_ORG_URL` | `https://dev.azure.com/GCDigital` | Or `marcopresta` for sandbox |
| `ADO_PROJECT` | `EVA` | ADO project name |
| `ADO_PAT` | `<pat>` | Read-only PAT; rotate monthly |
| `ADO_EPIC_ID` | `4` | Epic "EVA Platform" id |

Template already exists at [`33-eva-brain-v2/.env.ado.example`](../33-eva-brain-v2/.env.ado.example).

### 2.3 Blocking Chain

```
WI-0: scrum.py deployed + Cosmos container live
  └──[blocks]── WI-1: APIM registration
                  └──[blocks]── WI-3: live sprint badges on EVAHomePage
                  └──[blocks]── WI-4/5/6: SprintBoardPage data
```

WI-2 (static product tile grid) is **unblocked** — it can be implemented in `31-eva-faces` from the YAML spec with no API calls.

---

## 3. Dependencies on `31-eva-faces`

`39-ado-dashboard` does **not** import any React components from `31-eva-faces`, and `31-eva-faces` does **not** import from `39-ado-dashboard`.  
The interface is the YAML spec file at:  
[`31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml`](../31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml)

What we need eva-faces to **build and own**:

### 3.1 Routing (FACES-WI-A + FACES-WI-B)

| Route | Page component | Spec section |
|---|---|---|
| `/` | `EVAHomePage` — 23 product tiles + sprint badges | `screens[0]` in epic YAML |
| `/devops/sprint` | `SprintBoardPage` — sprint selector, WI cards, velocity panel | `screens[1]` in epic YAML |

Both routes must be registered in the eva-faces React Router root, within whichever layout shell handles authenticated pages.

### 3.2 Sidebar Navigation (FACES-WI-B)

The sidebar must include an **ADO Dashboard** entry pointing to `/devops/sprint`.  
Role guard: visible to all authenticated users (`viewer` role and above).  
Spec: `navigation.sidebar_entries` in the epic YAML.

### 3.3 Auth Context (FACES-WI-C)

The `SprintBoardPage` will need to gate the `/devops/sprint` route on APIM auth.  
We need eva-faces to expose:

| Context value | Type | Used for |
|---|---|---|
| `user.role` | `'viewer' \| 'contributor' \| 'admin'` | Route guard on `/devops/sprint` |
| `language` | `'en' \| 'fr'` | All component strings switch on this |
| `apimSubscriptionKey` | string (env-sourced, never user-facing) | Injected into fetch headers by `scrumApi.ts` |

If a dedicated `useAuth()` / `AuthContext` hook already exists in eva-faces, the APIM key injection in `scrumApi.ts` should follow the same pattern.

### 3.4 GC Design System

All components must be implemented with the **GC Design System** shared package at `31-eva-faces/shared/gc-design-system`.  
Design tokens are documented in the epic YAML under `design.colour_tokens` and `design.design_system`.  
WCAG 2.1 AA compliance is required on both screens.

### 3.5 Environment Variable (Frontend)

The `scrumApi.ts` module (reference impl in `src/api/scrumApi.ts`) reads:

| Variable | Set in | Notes |
|---|---|---|
| `VITE_APIM_BASE_URL` | `31-eva-faces/.env` | `https://marco-sandbox-apim.azure-api.net` |
| `VITE_APIM_SUBSCRIPTION_KEY` | `31-eva-faces/.env` | `Ocp-Apim-Subscription-Key` header value |

Template: [`39-ado-dashboard/.env.example`](.env.example)

---

## 4. Dependencies on `38-ado-poc`

`38-ado-poc` is the predecessor project (EVA ADO Command Center / POC). It does not deliver runtime code to `39-ado-dashboard`, but it is the reference source for the following:

### 4.1 WIQL Query Patterns

The ADO query structure in `scrum.py` (`_fetch_from_ado`) was derived from the WIQL patterns proven in the `38-ado-poc` POC scripts.  
If the ADO query shape needs to change (e.g. different field set, different WI type filter), check `38-ado-poc` for working examples before modifying `scrum.py`.

**Key WIQL reference:**  
ADO org: `dev.azure.com/marcopresta` (sandbox) → production target: `dev.azure.com/GCDigital`  
ADO project: `eva-poc` (sandbox) → production target: `EVA`

### 4.2 ADO Work Item Creation Tooling

To create the ADO WIs for this sprint (WI-0 through WI-6 + FACES-WI-A/B/C), use the tooling in `38-ado-poc`:

| Script | Purpose |
|---|---|
| `38-ado-poc/ado-setup.ps1` | Creates Feature + WIs under Epic id=4; reads from `.env.ado` |
| `38-ado-poc/.env.ado.example` | Template for ADO PAT + org/project config |

WI backlog with full DoD text: [`39-ado-dashboard/ADO-WORK-ITEMS.md`](ADO-WORK-ITEMS.md)  
FACES WI backlog: `ado_work_items_eva_faces` section in the epic YAML.

### 4.3 Cross-Project Dependency Graph

The EVA-wide dependency chain (ATRIB, RBAC, FinOps, Foundry, Brain, etc.) is maintained in:  
[`38-ado-poc/DEPENDENCIES.md`](../38-ado-poc/DEPENDENCIES.md)

When WI-0 and WI-1 for this project close, update that file to reflect `39-ado-dashboard` as a successor of ATRIB-0 (APIM import), since the scrum dashboard routes go through APIM.

---

## 5. Dependency on `17-apim`

`17-apim` (marco-sandbox-apim gateway) sits between the frontend and eva-brain.  
This project does **not** own APIM routing — that is owned by `17-apim` and tracked as WI-1 in this backlog.

**What WI-1 requires from 17-apim:**

| Item | Detail |
|---|---|
| Routes to register | `GET /v1/scrum/dashboard`, `GET /v1/scrum/summary` |
| Backend | eva-brain sandbox URL (from WI-7 deploy output) |
| Auth | `Ocp-Apim-Subscription-Key` subscription key validation |
| Pass-through headers | Forward all `x-eva-*` cost attribution headers from inbound policy (per ATRIB-1) |
| Smoke test | `GET https://marco-sandbox-apim.azure-api.net/v1/scrum/summary` → HTTP 200 |

**Blocked by:** WI-7 (eva-brain deployed to sandbox) + ATRIB-0 (APIM import scheduled Mar 29-30, 2026 per 38-ado-poc DEPENDENCIES.md).

---

## 6. No-Import Architecture — Why We Don't Import From Each Other

```
39-ado-dashboard  ─── publishes ──→  31-eva-faces/docs/epics/eva-ado-dashboard.epic.yaml
                                          │
                                          └───  31-eva-faces reads spec,
                                                builds screens independently

                              Both projects call:
                              APIM → eva-brain /v1/scrum/*
```

**Why:**  
If `31-eva-faces` imported `@eva-foundation/ado-dashboard` as an npm package and `39-ado-dashboard` depended on shared types from `31-eva-faces`, the projects would be in a circular dependency.  
The YAML spec pattern breaks the cycle: `39-ado-dashboard` is the **spec author**, `31-eva-faces` is the **implementer**, API is the only shared runtime surface.

The `src/` components in `39-ado-dashboard` are reference implementations that describe the intended UX — not a published package for eva-faces to import.

---

## 7. Critical Path

```
Infra (any order)
  ├─ Create Cosmos scrum-cache container           →  unblocks WI-0 cache path
  └─ Set env vars in 33-eva-brain-v2/.env          →  unblocks WI-0 ADO path

WI-0: scrum.py endpoint verified (unit test pass)
  └──[blocks]── WI-7: eva-brain deployed to sandbox
                  └──[blocks]── WI-1: APIM routes registered
                                  └──[blocks]── WI-3 live badges
                                  └──[blocks]── WI-4/5/6 SprintBoard

Parallel (unblocked now):
  FACES-WI-A: EVAHomePage tiles (mock SprintSummary data until WI-1 is live)
  FACES-WI-B: Sidebar entry + SprintBoardPage shell (static)
  WI-2: EVAHomePage static tiles (same spec as FACES-WI-A — owned by eva-faces)
```

---

*For the complete EVA cross-project dependency graph, see [`38-ado-poc/DEPENDENCIES.md`](../38-ado-poc/DEPENDENCIES.md).*
