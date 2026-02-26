// ─── FeatureSection ──────────────────────────────────────────────────────────
// Renders one Feature from the Epic → Feature → WI hierarchy.
// Shows feature title, project tag, and a list of WICards.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { Feature, WorkItem } from "../types/scrum";
import { WICard } from "./WICard";

interface FeatureSectionProps {
  feature: Feature;
  sprintFilter: string;
  onWIClick: (wi: WorkItem) => void;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  feature,
  sprintFilter,
  onWIClick,
}) => {
  const visible = sprintFilter === "all"
    ? feature.work_items
    : feature.work_items.filter((wi) => wi.sprint === sprintFilter);

  if (visible.length === 0) return null;

  return (
    <section
      className="eva-feature-section"
      aria-label={`Feature: ${feature.title}`}
      style={{ marginBottom: "24px" }}
    >
      {/* Feature header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
          paddingBottom: "6px",
          borderBottom: "2px solid #b1b4b6",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1rem", color: "#0b0c0e" }}>
          {feature.title}
        </h2>
        <span
          style={{
            border: "1px solid #b1b4b6",
            borderRadius: "2px",
            padding: "1px 8px",
            fontSize: "0.75rem",
            color: "#505a5f",
          }}
        >
          {feature.project}
        </span>
        <span style={{ fontSize: "0.78rem", color: "#6f777b" }}>
          {visible.length} WI{visible.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* WI cards */}
      <div className="eva-wi-list">
        {visible.map((wi) => (
          <WICard key={wi.ado_id} wi={wi} onClick={onWIClick} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
