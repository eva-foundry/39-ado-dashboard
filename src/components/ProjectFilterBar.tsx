// ─── ProjectFilterBar ────────────────────────────────────────────────────────
// Horizontal pill-button filter for project selection on Sprint Board.
// e.g. Brain | Faces | Agents | All
// Generated: 2026-02-20 10:55 ET

import React from "react";

interface ProjectFilterBarProps {
  projects: string[];
  selected: string;
  onSelect: (project: string) => void;
}

export const ProjectFilterBar: React.FC<ProjectFilterBarProps> = ({
  projects,
  selected,
  onSelect,
}) => {
  const ALL = "all";
  const all = [ALL, ...projects];

  return (
    <nav
      className="eva-project-filter-bar"
      aria-label="Filter by project"
      style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "12px 0" }}
    >
      {all.map((p) => {
        const isActive = p === selected;
        return (
          <button
            key={p}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(p)}
            style={{
              border: isActive ? "2px solid #1d70b8" : "2px solid #b1b4b6",
              borderRadius: "20px",
              padding: "4px 14px",
              background: isActive ? "#1d70b8" : "#fff",
              color: isActive ? "#fff" : "#0b0c0e",
              fontWeight: isActive ? 700 : 400,
              cursor: "pointer",
              fontSize: "0.85rem",
              textTransform: "capitalize",
            }}
          >
            {p === ALL ? "All projects" : p}
          </button>
        );
      })}
    </nav>
  );
};

export default ProjectFilterBar;
