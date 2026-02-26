# ─── app/routes/scrum.py ─────────────────────────────────────────────────────
# FastAPI router: GET /v1/scrum/dashboard
# Returns sprint / ADO data, cached in Cosmos container "scrum-cache" (TTL 24 h).
# Refresh trigger: daily Azure Logic App or Azure Function (out of scope here).
# New file for 33-eva-brain-v2  —  PROJECT-39 WI-0
# Generated: 2026-02-20 10:55 ET
# ─────────────────────────────────────────────────────────────────────────────

from __future__ import annotations

import logging
import os
import time
from typing import Any

from azure.cosmos import CosmosClient, exceptions as cosmos_exc
from fastapi import APIRouter, HTTPException, Query

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1/scrum", tags=["scrum"])

# ─── Cosmos configuration ─────────────────────────────────────────────────────
COSMOS_ENDPOINT = os.getenv("COSMOS_ENDPOINT", "")
COSMOS_KEY = os.getenv("COSMOS_KEY", "")
COSMOS_DATABASE = os.getenv("COSMOS_DATABASE", "eva-foundation")
SCRUM_CACHE_CONTAINER = "scrum-cache"

# ─── ADO configuration ────────────────────────────────────────────────────────
ADO_ORG_URL = os.getenv("ADO_ORG_URL", "https://dev.azure.com/GCDigital")
ADO_PROJECT = os.getenv("ADO_PROJECT", "EVA")
ADO_PAT = os.getenv("ADO_PAT", "")          # Service principal PAT; rotate monthly
ADO_EPIC_ID = int(os.getenv("ADO_EPIC_ID", "4"))

TTL_SECONDS = 86_400  # 24 h


# ─── Cosmos helpers ───────────────────────────────────────────────────────────

def _cosmos_container() -> Any:
    """Return the scrum-cache Cosmos container client."""
    client = CosmosClient(COSMOS_ENDPOINT, credential=COSMOS_KEY)
    db = client.get_database_client(COSMOS_DATABASE)
    return db.get_container_client(SCRUM_CACHE_CONTAINER)


def _cache_key(project: str, sprint: str) -> str:
    return f"{project}-{sprint}"


def _read_cache(project: str, sprint: str) -> dict | None:
    """Return cached item or None if miss / expired."""
    try:
        container = _cosmos_container()
        key = _cache_key(project, sprint)
        item = container.read_item(item=key, partition_key=key)
        return item.get("payload")
    except cosmos_exc.CosmosResourceNotFoundError:
        return None
    except Exception as exc:
        logger.warning("Cosmos cache read failed: %s", exc)
        return None


def _write_cache(project: str, sprint: str, payload: dict) -> None:
    """Upsert payload into Cosmos with TTL."""
    try:
        container = _cosmos_container()
        key = _cache_key(project, sprint)
        container.upsert_item({
            "id": key,
            "sprint_key": key,
            "payload": payload,
            "ttl": TTL_SECONDS,
            "cached_at": int(time.time()),
        })
    except Exception as exc:
        logger.warning("Cosmos cache write failed: %s", exc)


# ─── ADO REST helpers ─────────────────────────────────────────────────────────

def _ado_headers() -> dict[str, str]:
    import base64
    token = base64.b64encode(f":{ADO_PAT}".encode()).decode()
    return {
        "Authorization": f"Basic {token}",
        "Content-Type": "application/json",
    }


def _fetch_from_ado(project_filter: str, sprint_filter: str) -> dict:
    """
    Pull sprint data from ADO REST, shape it into the dashboard response,
    and return it.  Falls back to an empty structure on error.
    """
    import datetime
    import requests  # type: ignore

    try:
        # 1. Get work items under Epic ADO_EPIC_ID via WIQL
        wiql_url = f"{ADO_ORG_URL}/{ADO_PROJECT}/_apis/wit/wiql?api-version=7.1"
        sprint_clause = "" if sprint_filter == "all" else f" AND [System.IterationPath] CONTAINS '{sprint_filter}'"
        project_clause = "" if project_filter == "all" else f" AND [System.TeamProject] = '{project_filter}'"

        query = {
            "query": (
                f"SELECT [System.Id],[System.Title],[System.State],[System.IterationPath],[System.WorkItemType] "
                f"FROM WorkItems "
                f"WHERE [System.WorkItemType] IN ('User Story','Task','Bug') "
                f"AND [System.AreaPath] UNDER 'EVA' "
                f"{sprint_clause}{project_clause} "
                f"ORDER BY [System.IterationPath] ASC"
            )
        }

        r = requests.post(wiql_url, json=query, headers=_ado_headers(), timeout=15)
        r.raise_for_status()
        ids = [item["id"] for item in r.json().get("workItems", [])]

        if not ids:
            return _empty_dashboard()

        # 2. Bulk fetch WI details
        ids_csv = ",".join(str(i) for i in ids[:200])  # ADO batch limit
        fields = "System.Id,System.Title,System.State,System.IterationPath,Microsoft.VSTS.Scheduling.CompletedWork,Custom.DoD,Custom.EntitiesAffected"
        detail_url = f"{ADO_ORG_URL}/{ADO_PROJECT}/_apis/wit/workitems?ids={ids_csv}&fields={fields}&api-version=7.1"
        dr = requests.get(detail_url, headers=_ado_headers(), timeout=15)
        dr.raise_for_status()

        work_items = []
        for wi in dr.json().get("value", []):
            fields_data = wi.get("fields", {})
            iteration = fields_data.get("System.IterationPath", "")
            sprint_name = iteration.split("\\")[-1] if "\\" in iteration else iteration
            work_items.append({
                "ado_id": wi["id"],
                "wi_tag": f"WI-{wi['id']}",
                "title": fields_data.get("System.Title", ""),
                "sprint": sprint_name,
                "state": fields_data.get("System.State", "New"),
                "dod": fields_data.get("Custom.DoD", ""),
                "test_count": None,
                "coverage_pct": None,
                "closed_at": None,
                "entities_affected": [],
            })

        payload = {
            "refreshed_at": datetime.datetime.utcnow().isoformat() + "Z",
            "epic": {
                "id": ADO_EPIC_ID,
                "title": "EVA Platform",
                "features": [
                    {
                        "id": 5,
                        "title": f"EVA {project_filter.replace('-', ' ').title()}",
                        "project": project_filter,
                        "work_items": work_items,
                    }
                ],
            },
        }
        return payload

    except Exception as exc:
        logger.error("ADO fetch failed: %s", exc)
        return _empty_dashboard()


def _empty_dashboard() -> dict:
    import datetime
    return {
        "refreshed_at": datetime.datetime.utcnow().isoformat() + "Z",
        "epic": {"id": ADO_EPIC_ID, "title": "EVA Platform", "features": []},
    }


# ─── Route ────────────────────────────────────────────────────────────────────

@router.get("/dashboard", summary="Sprint dashboard (cached ADO data)")
async def scrum_dashboard(
    project: str = Query("all", description="'all' or a project slug e.g. 'brain-v2'"),
    sprint: str = Query("all", description="'all' or a sprint name e.g. 'Sprint-6'"),
) -> dict:
    """
    Returns sprint data from ADO, cached in Cosmos (`scrum-cache`, TTL 24 h).

    **Cache key:** `{project}-{sprint}`
    **Cache miss:** calls ADO REST live and populates cache.
    **Partition key:** `/sprint_key`
    """
    # 1. Try cache
    cached = _read_cache(project, sprint)
    if cached:
        logger.debug("scrum_dashboard cache HIT: %s-%s", project, sprint)
        return cached

    logger.info("scrum_dashboard cache MISS: %s-%s — fetching from ADO", project, sprint)

    # 2. Fetch from ADO
    payload = _fetch_from_ado(project, sprint)

    # 3. Populate cache
    _write_cache(project, sprint, payload)

    return payload


@router.get("/summary", summary="Sprint badge summary per project (lightweight)")
async def scrum_summary() -> list[dict]:
    """
    Returns a lightweight list of sprint badge states per project.
    Used by EVA home page product tiles.
    """
    dashboard = await scrum_dashboard(project="all", sprint="all")
    summaries = []
    for feature in dashboard.get("epic", {}).get("features", []):
        wis = feature.get("work_items", [])
        blocked = any(wi["state"] == "Blocked" for wi in wis)
        active = any(wi["state"] == "Active" for wi in wis)
        done = all(wi["state"] in ("Closed", "Resolved") for wi in wis) if wis else False
        badge = "Blocked" if blocked else ("Done" if done else "Active" if active else "Active")
        summaries.append({
            "project": feature["project"],
            "sprint": wis[0]["sprint"] if wis else "all",
            "badge": badge,
            "active_count": sum(1 for wi in wis if wi["state"] == "Active"),
        })
    return summaries
