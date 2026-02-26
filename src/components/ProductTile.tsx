// ─── ProductTile ─────────────────────────────────────────────────────────────
// Single EVA product tile for the home page grid.
// Shows: icon, name (bilingual), category chip, optional sprint badge.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { Product, SprintSummary } from "../types/scrum";
import { SprintBadge } from "./SprintBadge";
import type { Locale } from "./NavHeader";

interface ProductTileProps {
  product: Product;
  locale: Locale;
  sprintSummary?: SprintSummary;
  onClick?: (product: Product) => void;
}

export const ProductTile: React.FC<ProductTileProps> = ({
  product,
  locale,
  sprintSummary,
  onClick,
}) => {
  const name = locale === "fr" ? product.name[1] : product.name[0];

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else {
      window.location.href = product.href;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="eva-product-tile"
      role="button"
      tabIndex={0}
      aria-label={`${name}${sprintSummary ? ` — sprint ${sprintSummary.badge}` : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        cursor: "pointer",
        border: "1px solid #b1b4b6",
        borderRadius: "4px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        background: "#fff",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* Icon */}
      <span className="eva-tile-icon" aria-hidden="true" style={{ fontSize: "2rem" }}>
        {product.icon}
      </span>

      {/* Product name */}
      <strong className="eva-tile-name" style={{ fontSize: "1rem", color: "#0b0c0e" }}>
        {name}
      </strong>

      {/* Category chip */}
      <span
        className="eva-tile-category"
        style={{
          fontSize: "0.7rem",
          color: "#505a5f",
          fontStyle: "italic",
        }}
      >
        {product.category}
      </span>

      {/* Sprint badge (live from ADO) */}
      {sprintSummary ? (
        <SprintBadge state={sprintSummary.badge} count={sprintSummary.active_count} />
      ) : (
        product.adoProject === null && (
          <span style={{ fontSize: "0.7rem", color: "#505a5f" }}>No ADO project</span>
        )
      )}
    </div>
  );
};

export default ProductTile;
