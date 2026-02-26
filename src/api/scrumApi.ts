// ─── APIM client — GET /v1/scrum/dashboard ───────────────────────────────────
// EVA-STORY: F39-DASHBOARD-001
// EVA-STORY: F39-SUMMARY-001
// EVA-STORY: F39-01-001
// Routes through marco-sandbox-apim (17-apim). No direct ADO calls from browser.
// Generated: 2026-02-20 10:55 ET

import type {
  ScrumDashboardResponse,
  SprintSummary,
} from "../types/scrum";

// APIM base URL injected via env at build time (Vite convention)
const APIM_BASE = import.meta.env.VITE_APIM_BASE_URL ?? "";

/** Subscription key header name expected by marco-sandbox-apim */
const APIM_KEY_HEADER = "Ocp-Apim-Subscription-Key";

function apimHeaders(): HeadersInit {
  const key = import.meta.env.VITE_APIM_SUBSCRIPTION_KEY;
  return key ? { [APIM_KEY_HEADER]: key } : {};
}

// ─── /v1/scrum/dashboard ─────────────────────────────────────────────────────

export interface DashboardParams {
  /** "all" | "brain-v2" | "faces" | "agents" | ... */
  project?: string;
  /** "all" | "Sprint-6" | "Sprint-5" | ... */
  sprint?: string;
}

/**
 * Fetches sprint dashboard data from 33-eva-brain-v2 via 17-apim.
 * Cosmos cache TTL = 24 h; cache key = {project}-{sprint}.
 */
export async function fetchScrumDashboard(
  params: DashboardParams = {}
): Promise<ScrumDashboardResponse> {
  const { project = "all", sprint = "all" } = params;
  const url = new URL(`${APIM_BASE}/v1/scrum/dashboard`);
  url.searchParams.set("project", project);
  url.searchParams.set("sprint", sprint);

  const res = await fetch(url.toString(), {
    headers: apimHeaders(),
    cache: "default",
  });

  if (!res.ok) {
    throw new Error(
      `[scrumApi] GET /v1/scrum/dashboard failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json() as Promise<ScrumDashboardResponse>;
}

// ─── /v1/scrum/summary (sprint badges for product tiles) ─────────────────────

/**
 * Returns a lightweight summary array used to populate sprint badges on product tiles.
 * Maps to the same eva-brain endpoint with reduced projection.
 */
export async function fetchSprintSummaries(): Promise<SprintSummary[]> {
  const url = new URL(`${APIM_BASE}/v1/scrum/summary`);

  const res = await fetch(url.toString(), {
    headers: apimHeaders(),
    cache: "default",
  });

  if (!res.ok) {
    // Degrade gracefully — home page renders without badges
    console.warn(
      `[scrumApi] GET /v1/scrum/summary failed: ${res.status} — badges will be hidden`
    );
    return [];
  }

  return res.json() as Promise<SprintSummary[]>;
}
