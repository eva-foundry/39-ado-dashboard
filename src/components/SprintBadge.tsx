// ─── SprintBadge ─────────────────────────────────────────────────────────────
// Coloured pill showing current sprint state: Active | Done | Blocked.
// Used on ProductTile and WICard.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { SprintBadgeState } from "../types/scrum";

interface SprintBadgeProps {
  state: SprintBadgeState;
  /** Optional: show WI count inside badge */
  count?: number;
}

const config: Record<SprintBadgeState, { label: string; color: string }> = {
  Active: { label: "Active", color: "#1d70b8" },   // GC blue
  Done: { label: "Done", color: "#00703c" },        // GC green
  Blocked: { label: "Blocked", color: "#d4351c" },  // GC red
};

export const SprintBadge: React.FC<SprintBadgeProps> = ({ state, count }) => {
  const { label, color } = config[state];
  return (
    <span
      className="eva-sprint-badge"
      style={{
        backgroundColor: color,
        color: "#fff",
        borderRadius: "3px",
        padding: "2px 8px",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.03em",
        display: "inline-block",
      }}
      aria-label={`Sprint state: ${label}${count != null ? `, ${count} work items` : ""}`}
    >
      {label}
      {count != null && (
        <span
          style={{ marginLeft: "6px", opacity: 0.85 }}
          aria-hidden="true"
        >
          {count}
        </span>
      )}
    </span>
  );
};

export default SprintBadge;
