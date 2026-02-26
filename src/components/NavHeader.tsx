// ─── NavHeader ───────────────────────────────────────────────────────────────
// Bilingual EN/FR GC Design System top navigation bar.
// Displays: GC signature, product name, language toggle, user role badge.
// WCAG 2.1 AA compliant.
// Generated: 2026-02-20 10:55 ET

import React from "react";

export type Locale = "en" | "fr";
export type UserRole = "viewer" | "developer" | "admin";

interface NavHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  userRole?: UserRole;
  userName?: string;
}

const labels = {
  en: {
    productName: "EVA Portal",
    skipLink: "Skip to main content",
    langToggle: "Français",
    langToggleCode: "fr" as Locale,
    roleLabel: (r: UserRole) => r.charAt(0).toUpperCase() + r.slice(1),
  },
  fr: {
    productName: "Portail EVA",
    skipLink: "Passer au contenu principal",
    langToggle: "English",
    langToggleCode: "en" as Locale,
    roleLabel: (r: UserRole) => {
      const map: Record<UserRole, string> = {
        viewer: "Observateur",
        developer: "Développeur",
        admin: "Administrateur",
      };
      return map[r];
    },
  },
};

export const NavHeader: React.FC<NavHeaderProps> = ({
  locale,
  onLocaleChange,
  userRole,
  userName,
}) => {
  const t = labels[locale];

  return (
    <header
      role="banner"
      className="eva-nav-header"
      aria-label={t.productName}
    >
      {/* GC Skip navigation — WCAG 2.4.1 */}
      <a href="#main-content" className="eva-skip-link">
        {t.skipLink}
      </a>

      {/* GC Signature */}
      <div className="eva-nav-signature">
        <span className="eva-nav-logo" aria-hidden="true">🍁</span>
        <span className="eva-nav-gc-wordmark">Government of Canada</span>
        <span className="eva-nav-separator" aria-hidden="true"> / </span>
        <span className="eva-nav-product-name">{t.productName}</span>
      </div>

      {/* Right controls */}
      <div className="eva-nav-controls">
        {/* User role badge */}
        {userRole && (
          <span
            className={`eva-role-badge eva-role-${userRole}`}
            aria-label={`Role: ${t.roleLabel(userRole)}`}
          >
            {userName ? `${userName} · ` : ""}
            {t.roleLabel(userRole)}
          </span>
        )}

        {/* Language toggle */}
        <button
          type="button"
          className="eva-lang-toggle"
          lang={t.langToggleCode}
          aria-label={`Switch language to ${t.langToggle}`}
          onClick={() => onLocaleChange(t.langToggleCode)}
        >
          {t.langToggle}
        </button>
      </div>
    </header>
  );
};

export default NavHeader;
