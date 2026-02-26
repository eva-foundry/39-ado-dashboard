// ─── WIDetailDrawer ──────────────────────────────────────────────────────────
// Slide-in panel showing full WI details: DoD, test count, coverage %, close date,
// and affected data model entities.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { WorkItem } from "../types/scrum";

interface WIDetailDrawerProps {
  wi: WorkItem | null;
  onClose: () => void;
}

export const WIDetailDrawer: React.FC<WIDetailDrawerProps> = ({ wi, onClose }) => {
  if (!wi) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="eva-drawer-backdrop"
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 100,
        }}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Work item ${wi.wi_tag} details`}
        className="eva-wi-drawer"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "min(480px, 95vw)",
          height: "100vh",
          background: "#fff",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.2)",
          zIndex: 101,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close work item details"
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div>
          <code style={{ color: "#505a5f", fontSize: "0.85rem" }}>{wi.wi_tag}</code>
          <h2 style={{ margin: "4px 0 0", fontSize: "1.1rem" }}>{wi.title}</h2>
        </div>

        {/* Meta row */}
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: "4px 16px",
            fontSize: "0.88rem",
          }}
        >
          <dt style={{ color: "#505a5f" }}>Sprint</dt>
          <dd style={{ margin: 0 }}>{wi.sprint}</dd>

          <dt style={{ color: "#505a5f" }}>State</dt>
          <dd style={{ margin: 0 }}>{wi.state}</dd>

          <dt style={{ color: "#505a5f" }}>Tests</dt>
          <dd style={{ margin: 0 }}>{wi.test_count ?? "—"}</dd>

          <dt style={{ color: "#505a5f" }}>Coverage</dt>
          <dd style={{ margin: 0 }}>
            {wi.coverage_pct != null ? `${wi.coverage_pct}%` : "—"}
          </dd>

          <dt style={{ color: "#505a5f" }}>Closed</dt>
          <dd style={{ margin: 0 }}>
            {wi.closed_at ? wi.closed_at.slice(0, 10) : "—"}
          </dd>
        </dl>

        {/* DoD */}
        <section>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>Definition of Done</h3>
          <p style={{ fontSize: "0.88rem", color: "#0b0c0e", margin: 0 }}>{wi.dod}</p>
        </section>

        {/* Entities affected */}
        {wi.entities_affected.length > 0 && (
          <section>
            <h3 style={{ fontSize: "0.9rem", marginBottom: "6px" }}>Entities Affected</h3>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.85rem" }}>
              {wi.entities_affected.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </>
  );
};

export default WIDetailDrawer;
