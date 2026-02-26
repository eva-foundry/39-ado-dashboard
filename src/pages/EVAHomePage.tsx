// ─── EVAHomePage ─────────────────────────────────────────────────────────────
// Route: /
// EVA Portal home page — 23-product tile grid with live sprint badges.
// US-H1, US-H2, US-H3, US-H4 (PROJECT-39)
// Generated: 2026-02-20 10:55 ET

import React, { useEffect, useState } from "react";
import type { SprintSummary } from "../types/scrum";
import { fetchSprintSummaries } from "../api/scrumApi";
import { NavHeader } from "../components/NavHeader";
import { ProductTileGrid } from "../components/ProductTileGrid";
import { RecentSprintSummaryBar } from "../components/RecentSprintSummaryBar";
import type { Locale } from "../components/NavHeader";

const labels = {
  en: {
    title: "EVA Portal",
    subtitle: "Government of Canada AI Platform",
    loading: "Loading sprint data…",
    error: "Sprint data temporarily unavailable.",
  },
  fr: {
    title: "Portail EVA",
    subtitle: "Plateforme IA du gouvernement du Canada",
    loading: "Chargement des données de sprint…",
    error: "Données de sprint temporairement indisponibles.",
  },
};

interface EVAHomePageProps {
  /** injected by 31-eva-faces auth layer */
  userRole?: "viewer" | "developer" | "admin";
  userName?: string;
  defaultLocale?: Locale;
}

export const EVAHomePage: React.FC<EVAHomePageProps> = ({
  userRole = "viewer",
  userName,
  defaultLocale = "en",
}) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [summaries, setSummaries] = useState<SprintSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const t = labels[locale];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchSprintSummaries()
      .then((data) => {
        if (!cancelled) {
          setSummaries(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  // Build RecentSprintSummaryBar entries from flat summaries
  const recentEntries = summaries.map((s) => ({
    project: s.project,
    latestClosedWI: null, // populated in US-H2 / WI-3 when full summary endpoint is wired
  }));

  return (
    <div className="eva-home-page" lang={locale}>
      {/* Navigation */}
      <NavHeader
        locale={locale}
        onLocaleChange={setLocale}
        userRole={userRole}
        userName={userName}
      />

      {/* Main content */}
      <main id="main-content" style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page heading */}
        <div style={{ marginBottom: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "1.6rem" }}>{t.title}</h1>
          <p style={{ margin: "4px 0 0", color: "#505a5f", fontSize: "0.9rem" }}>
            {t.subtitle}
          </p>
        </div>

        {/* Sprint badge load status */}
        {loading && (
          <p role="status" aria-live="polite" style={{ fontSize: "0.85rem", color: "#505a5f" }}>
            {t.loading}
          </p>
        )}
        {error && (
          <p role="alert" style={{ fontSize: "0.85rem", color: "#d4351c" }}>
            {t.error}
          </p>
        )}

        {/* Product tile grid — 23 products × 5 categories */}
        <ProductTileGrid
          locale={locale}
          sprintSummaries={summaries}
        />
      </main>

      {/* Recent sprint summary bar */}
      {!loading && recentEntries.length > 0 && (
        <RecentSprintSummaryBar entries={recentEntries} />
      )}
    </div>
  );
};

export default EVAHomePage;
