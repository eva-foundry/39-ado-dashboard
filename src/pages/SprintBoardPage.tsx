// ─── SprintBoardPage ─────────────────────────────────────────────────────────
// Route: /devops/sprint
// Embedded ADO sprint view — no direct ADO login required.
// US-A1 … US-A7 (PROJECT-39)
// Generated: 2026-02-20 10:55 ET

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { WorkItem, VelocityPoint } from "../types/scrum";
import { fetchScrumDashboard } from "../api/scrumApi";
import { NavHeader } from "../components/NavHeader";
import { SprintSelector } from "../components/SprintSelector";
import { ProjectFilterBar } from "../components/ProjectFilterBar";
import { FeatureSection } from "../components/FeatureSection";
import { WIDetailDrawer } from "../components/WIDetailDrawer";
import { VelocityPanel } from "../components/VelocityPanel";
import type { Locale } from "../components/NavHeader";

interface SprintBoardPageProps {
  userRole?: "viewer" | "developer" | "admin";
  userName?: string;
  defaultLocale?: Locale;
}

export const SprintBoardPage: React.FC<SprintBoardPageProps> = ({
  userRole = "viewer",
  userName,
  defaultLocale = "en",
}) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [selectedSprint, setSelectedSprint] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [dashboardData, setDashboardData] = useState<Awaited<ReturnType<typeof fetchScrumDashboard>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWI, setActiveWI] = useState<WorkItem | null>(null);
  const lastFetchKey = useRef("");

  // ─── Fetch dashboard data when project or sprint filter changes ───────────
  useEffect(() => {
    const key = `${selectedProject}-${selectedSprint}`;
    if (key === lastFetchKey.current) return;
    lastFetchKey.current = key;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchScrumDashboard({ project: selectedProject, sprint: selectedSprint })
      .then((data) => {
        if (!cancelled) {
          setDashboardData(data);
          setLoading(false);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [selectedProject, selectedSprint]);

  // ─── Derived values ────────────────────────────────────────────────────────
  const features = dashboardData?.epic.features ?? [];

  const projects = useMemo(
    () => [...new Set(features.map((f) => f.project))].sort(),
    [features]
  );

  const sprints = useMemo(() => {
    const all: string[] = [];
    for (const f of features) {
      for (const wi of f.work_items) {
        if (!all.includes(wi.sprint)) all.push(wi.sprint);
      }
    }
    return all.sort();
  }, [features]);

  const filteredFeatures = useMemo(() => {
    if (selectedProject === "all") return features;
    return features.filter((f) => f.project === selectedProject);
  }, [features, selectedProject]);

  // ─── Velocity data (aggregated from WIs) ──────────────────────────────────
  const velocityData = useMemo((): VelocityPoint[] => {
    if (!dashboardData) return [];
    const sprintMap = new Map<string, { tests: number; coverage: number[] }>();
    for (const f of features) {
      for (const wi of f.work_items) {
        const entry = sprintMap.get(wi.sprint) ?? { tests: 0, coverage: [] };
        if (wi.test_count != null) entry.tests += wi.test_count;
        if (wi.coverage_pct != null) entry.coverage.push(wi.coverage_pct);
        sprintMap.set(wi.sprint, entry);
      }
    }
    return [...sprintMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([sprint, { tests, coverage }]) => ({
        sprint,
        tests_added: tests,
        coverage_pct:
          coverage.length > 0
            ? Math.round(coverage.reduce((s, v) => s + v, 0) / coverage.length)
            : null,
      }));
  }, [dashboardData, features]);

  const refreshedAt = dashboardData?.refreshed_at
    ? new Date(dashboardData.refreshed_at).toLocaleString(locale === "fr" ? "fr-CA" : "en-CA")
    : null;

  return (
    <div className="eva-sprint-board-page" lang={locale}>
      {/* Navigation */}
      <NavHeader
        locale={locale}
        onLocaleChange={setLocale}
        userRole={userRole}
        userName={userName}
      />

      <main id="main-content" style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Dashboard header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>
            {locale === "fr" ? "Tableau de bord Sprint" : "Sprint Board"}
          </h1>
          {refreshedAt && (
            <span style={{ fontSize: "0.78rem", color: "#6f777b" }}>
              {locale === "fr" ? "Mis à jour :" : "Last refreshed:"} {refreshedAt}
            </span>
          )}
          <SprintSelector
            sprints={sprints}
            value={selectedSprint}
            onChange={setSelectedSprint}
          />
        </div>

        {/* Project filter */}
        <ProjectFilterBar
          projects={projects}
          selected={selectedProject}
          onSelect={setSelectedProject}
        />

        {/* Status messages */}
        {loading && (
          <p role="status" aria-live="polite" style={{ fontSize: "0.85rem", color: "#505a5f" }}>
            {locale === "fr" ? "Chargement…" : "Loading…"}
          </p>
        )}
        {error && (
          <p role="alert" style={{ color: "#d4351c", fontSize: "0.85rem" }}>
            {error}
          </p>
        )}

        {/* Feature sections — Epic → Feature → WI cards */}
        {!loading && filteredFeatures.length > 0 && (
          <div style={{ marginTop: "8px" }}>
            {dashboardData && (
              <p style={{ fontSize: "0.82rem", color: "#505a5f", marginBottom: "12px" }}>
                <strong>Epic:</strong> {dashboardData.epic.title} (id={dashboardData.epic.id})
              </p>
            )}
            {filteredFeatures.map((f) => (
              <FeatureSection
                key={f.id}
                feature={f}
                sprintFilter={selectedSprint}
                onWIClick={setActiveWI}
              />
            ))}
          </div>
        )}

        {!loading && filteredFeatures.length === 0 && !error && (
          <p style={{ fontSize: "0.88rem", color: "#505a5f" }}>
            {locale === "fr" ? "Aucune donnée pour les filtres sélectionnés." : "No data for the selected filters."}
          </p>
        )}

        {/* Velocity panel */}
        {!loading && velocityData.length > 0 && (
          <div style={{ marginTop: "32px" }}>
            <VelocityPanel data={velocityData} />
          </div>
        )}
      </main>

      {/* WI detail drawer */}
      <WIDetailDrawer wi={activeWI} onClose={() => setActiveWI(null)} />
    </div>
  );
};

export default SprintBoardPage;
