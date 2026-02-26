// ─── SprintSelector ──────────────────────────────────────────────────────────
// Dropdown to switch between sprints on the Sprint Board page.
// Generated: 2026-02-20 10:55 ET

import React from "react";

interface SprintSelectorProps {
  sprints: string[];
  value: string;
  onChange: (sprint: string) => void;
}

export const SprintSelector: React.FC<SprintSelectorProps> = ({
  sprints,
  value,
  onChange,
}) => {
  return (
    <div className="eva-sprint-selector" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <label
        htmlFor="eva-sprint-select"
        style={{ fontWeight: 600, fontSize: "0.9rem" }}
      >
        Sprint:
      </label>
      <select
        id="eva-sprint-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "2px solid #0b0c0e",
          borderRadius: "0",
          padding: "4px 8px",
          fontSize: "0.9rem",
        }}
      >
        <option value="all">All sprints</option>
        {sprints.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SprintSelector;
