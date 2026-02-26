// ─── RecentSprintSummaryBar ───────────────────────────────────────────────────
// Thin banner below the product tile grid showing the latest closed WI per
// active project.  Refreshed every 24 h via the sprint summary API.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { WorkItem } from "../types/scrum";

interface SummaryEntry {
  project: string;
  latestClosedWI: WorkItem | null;
}

interface RecentSprintSummaryBarProps {
  entries: SummaryEntry[];
}

export const RecentSprintSummaryBar: React.FC<RecentSprintSummaryBarProps> = ({
  entries,
}) => {
  if (entries.length === 0) return null;

  return (
    <aside
      className="eva-recent-sprint-bar"
      aria-label="Recent sprint activity"
      style={{
        borderTop: "1px solid #b1b4b6",
        padding: "8px 16px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        fontSize: "0.78rem",
        color: "#505a5f",
        background: "#f8f8f8",
      }}
    >
      {entries.map(({ project, latestClosedWI }) => (
        <span key={project}>
          <strong>{project}:</strong>{" "}
          {latestClosedWI ? (
            <>
              {latestClosedWI.wi_tag} — {latestClosedWI.title}
              {latestClosedWI.closed_at && (
                <> (closed {latestClosedWI.closed_at.slice(0, 10)})</>
              )}
            </>
          ) : (
            "No closed WIs yet"
          )}
        </span>
      ))}
    </aside>
  );
};

export default RecentSprintSummaryBar;
