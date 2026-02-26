// ─── VelocityPanel ───────────────────────────────────────────────────────────
// Tests-added and coverage-trend sparklines per sprint.
// Pure CSS/SVG — no charting library dependency for now.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { VelocityPoint } from "../types/scrum";

interface VelocityPanelProps {
  data: VelocityPoint[];
}

const SPARK_W = 120;
const SPARK_H = 40;

function sparklinePath(values: number[]): string {
  if (values.length < 2) return "";
  const max = Math.max(...values, 1);
  const step = SPARK_W / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = SPARK_H - (v / max) * SPARK_H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export const VelocityPanel: React.FC<VelocityPanelProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <aside className="eva-velocity-panel" aria-label="Velocity">
        <p style={{ fontSize: "0.85rem", color: "#505a5f" }}>
          No velocity data available yet.
        </p>
      </aside>
    );
  }

  const testsPath = sparklinePath(data.map((d) => d.tests_added));
  const coveragePath = sparklinePath(
    data.map((d) => d.coverage_pct ?? 0)
  );

  return (
    <aside
      className="eva-velocity-panel"
      aria-label="Sprint velocity"
      style={{
        border: "1px solid #b1b4b6",
        borderRadius: "4px",
        padding: "16px",
        background: "#f8f8f8",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Velocity</h3>

      {/* Sparklines */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Tests added */}
        <div>
          <div style={{ fontSize: "0.75rem", color: "#505a5f", marginBottom: "4px" }}>
            Tests added / sprint
          </div>
          <svg
            width={SPARK_W}
            height={SPARK_H}
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            <path
              d={testsPath}
              fill="none"
              stroke="#1d70b8"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Coverage trend */}
        <div>
          <div style={{ fontSize: "0.75rem", color: "#505a5f", marginBottom: "4px" }}>
            Coverage % trend
          </div>
          <svg
            width={SPARK_W}
            height={SPARK_H}
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            <path
              d={coveragePath}
              fill="none"
              stroke="#00703c"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Data table (accessible fallback) */}
      <table
        style={{ fontSize: "0.78rem", borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "2px 8px" }}>Sprint</th>
            <th style={{ textAlign: "right", padding: "2px 8px" }}>Tests+</th>
            <th style={{ textAlign: "right", padding: "2px 8px" }}>Coverage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.sprint}>
              <td style={{ padding: "2px 8px" }}>{d.sprint}</td>
              <td style={{ textAlign: "right", padding: "2px 8px" }}>{d.tests_added}</td>
              <td style={{ textAlign: "right", padding: "2px 8px" }}>
                {d.coverage_pct != null ? `${d.coverage_pct}%` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
};

export default VelocityPanel;
