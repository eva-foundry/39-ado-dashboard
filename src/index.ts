// EVA-FEATURE: F39-01
// EVA-STORY: F39-01-001
// EVA-STORY: F39-01-002
// EVA-STORY: F39-01-003
// EVA-STORY: F39-01-004
// EVA-STORY: F39-01-005
// EVA-STORY: F39-02-001
// EVA-STORY: F39-02-002
// EVA-STORY: F39-02-003
// EVA-STORY: F39-02-004
// EVA-STORY: F39-02-005
// EVA-STORY: F39-02-006
// EVA-STORY: F39-02-007
// EVA-STORY: F39-04-001
// EVA-STORY: F39-04-002
// EVA-STORY: F39-04-003
// EVA-STORY: F39-04-004
// EVA-STORY: F39-04-005
// EVA-STORY: F39-04-006
// EVA-STORY: F39-DASHBOARD-001
// EVA-STORY: F39-SUMMARY-001
// EVA-STORY: F39-UI-001
// EVA-STORY: F39-UI-002
// ─── Package barrel — 39-ado-dashboard ───────────────────────────────────────
// 31-eva-faces imports from here.
// Generated: 2026-02-20 10:55 ET

// Pages
export { EVAHomePage } from "./pages/EVAHomePage";
export { SprintBoardPage } from "./pages/SprintBoardPage";

// Components
export { NavHeader } from "./components/NavHeader";
export type { Locale, UserRole } from "./components/NavHeader";
export { ProductTile } from "./components/ProductTile";
export { ProductTileGrid, EVA_PRODUCTS } from "./components/ProductTileGrid";
export { SprintBadge } from "./components/SprintBadge";
export { SprintSelector } from "./components/SprintSelector";
export { ProjectFilterBar } from "./components/ProjectFilterBar";
export { FeatureSection } from "./components/FeatureSection";
export { WICard } from "./components/WICard";
export { WIDetailDrawer } from "./components/WIDetailDrawer";
export { VelocityPanel } from "./components/VelocityPanel";
export { RecentSprintSummaryBar } from "./components/RecentSprintSummaryBar";

// API
export { fetchScrumDashboard, fetchSprintSummaries } from "./api/scrumApi";

// Types
export type {
  WorkItem,
  WIState,
  Feature,
  Epic,
  ScrumDashboardResponse,
  SprintSummary,
  SprintBadgeState,
  Product,
  ProductCategory,
  VelocityPoint,
} from "./types/scrum";
