// ─── WICard ──────────────────────────────────────────────────────────────────
// Single work item row card inside a FeatureSection.
// Shows: WI tag, title, state badge, sprint chip, test count chip.
// Click opens WIDetailDrawer.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { WorkItem, WIState } from "../types/scrum";

const STATE_COLORS: Record<WIState, string> = {
  Active:   "#1d70b8",
  New:      "#6f777b",
  Resolved: "#00703c",
  Closed:   "#505a5f",
  Blocked:  "#d4351c",
};

interface WICardProps {
  wi: WorkItem;
  onClick: (wi: WorkItem) => void;
}

export const WICard: React.FC<WICardProps> = ({ wi, onClick }) => {
  return (
    <div
      className="eva-wi-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick(wi)}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(wi); }}
      aria-label={`${wi.wi_tag}: ${wi.title} — ${wi.state}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#fff",
        border: "1px solid #b1b4b6",
        borderLeft: `4px solid ${STATE_COLORS[wi.state]}`,
        borderRadius: "2px",
        padding: "10px 14px",
        cursor: "pointer",
        fontSize: "0.88rem",
        marginBottom: "6px",
      }}
    >
      {/* WI tag */}
      <code
        style={{ fontFamily: "monospace", color: "#505a5f", minWidth: "54px" }}
      >
        {wi.wi_tag}
      </code>

      {/* Title */}
      <span style={{ flex: 1, color: "#0b0c0e" }}>{wi.title}</span>

      {/* State badge */}
      <span
        style={{
          background: STATE_COLORS[wi.state],
          color: "#fff",
          padding: "1px 8px",
          borderRadius: "2px",
          fontSize: "0.75rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {wi.state}
      </span>

      {/* Sprint chip */}
      <span
        style={{
          border: "1px solid #b1b4b6",
          borderRadius: "2px",
          padding: "1px 8px",
          fontSize: "0.75rem",
          color: "#505a5f",
          whiteSpace: "nowrap",
        }}
      >
        {wi.sprint}
      </span>

      {/* Test count chip */}
      {wi.test_count != null && (
        <span
          aria-label={`${wi.test_count} tests`}
          style={{
            background: "#f3f2f1",
            borderRadius: "2px",
            padding: "1px 8px",
            fontSize: "0.75rem",
            color: "#0b0c0e",
          }}
        >
          🧪 {wi.test_count}
        </span>
      )}
    </div>
  );
};

export default WICard;
