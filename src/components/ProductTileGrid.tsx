// ─── ProductTileGrid ─────────────────────────────────────────────────────────
// Responsive 3–5 column grid of all 23 EVA product tiles.
// Groups tiles by category.  Sprint summaries are overlaid when loaded.
// Generated: 2026-02-20 10:55 ET

import React from "react";
import type { Product, SprintSummary } from "../types/scrum";
import { ProductTile } from "./ProductTile";
import type { Locale } from "./NavHeader";

// ─── 23-product catalogue (static) ───────────────────────────────────────────
export const EVA_PRODUCTS: Product[] = [
  // User Products
  { id: "eva-chat",         name: ["EVA Chat",             "Conversation EVA"],        category: "User Products",    adoProject: "faces",        href: "/chat",                icon: "💬" },
  { id: "eva-da",           name: ["EVA Document Analyst", "Analyste doc. EVA"],       category: "User Products",    adoProject: "da",           href: "/da",                  icon: "📄" },
  { id: "eva-portal",       name: ["EVA Portal",           "Portail EVA"],             category: "User Products",    adoProject: "ado-dashboard",href: "/",                    icon: "🏠" },
  { id: "eva-jurisprudence",name: ["EVA Jurisprudence",    "Jurisprudence EVA"],       category: "User Products",    adoProject: null,           href: "/jurisprudence",       icon: "⚖️" },
  { id: "eva-translate",    name: ["EVA Translate",        "Traduction EVA"],          category: "User Products",    adoProject: null,           href: "/translate",           icon: "🌐" },
  // AI Intelligence
  { id: "eva-brain",        name: ["EVA Brain",            "Cerveau EVA"],             category: "AI Intelligence",  adoProject: "brain-v2",     href: "/devops/sprint",       icon: "🧠" },
  { id: "eva-embedder",     name: ["EVA Embedder",         "Intégrateur EVA"],         category: "AI Intelligence",  adoProject: null,           href: "/embedder",            icon: "🔢" },
  { id: "eva-rag",          name: ["EVA RAG",              "RAG EVA"],                 category: "AI Intelligence",  adoProject: null,           href: "/rag",                 icon: "🔍" },
  { id: "eva-eval",         name: ["EVA Eval",             "Évaluation EVA"],          category: "AI Intelligence",  adoProject: null,           href: "/eval",                icon: "📊" },
  { id: "eva-finops",       name: ["EVA FinOps",           "FinOps EVA"],              category: "AI Intelligence",  adoProject: "finops",       href: "/finops",              icon: "💰" },
  // Platform
  { id: "eva-faces",        name: ["EVA Faces",            "Faces EVA"],               category: "Platform",         adoProject: "faces",        href: "/faces",               icon: "🖥️" },
  { id: "eva-apim",         name: ["EVA APIM",             "APIM EVA"],                category: "Platform",         adoProject: "apim",         href: "/apim",                icon: "🔀" },
  { id: "eva-auth",         name: ["EVA Auth",             "Auth EVA"],                category: "Platform",         adoProject: null,           href: "/auth",                icon: "🔐" },
  { id: "eva-infra",        name: ["EVA Infrastructure",   "Infrastructure EVA"],      category: "Platform",         adoProject: null,           href: "/infra",               icon: "☁️" },
  { id: "eva-cosmos",       name: ["EVA Cosmos",           "Cosmos EVA"],              category: "Platform",         adoProject: null,           href: "/cosmos",              icon: "🗄️" },
  // Developer
  { id: "eva-data-model",   name: ["EVA Data Model",       "Modèle de données EVA"],   category: "Developer",        adoProject: "data-model",   href: "/data-model",          icon: "📐" },
  { id: "eva-ado-poc",      name: ["EVA ADO PoC",          "Preuv. ADO EVA"],          category: "Developer",        adoProject: "ado-poc",      href: "/devops/sprint",       icon: "📋" },
  { id: "eva-sdk",          name: ["EVA SDK",              "SDK EVA"],                 category: "Developer",        adoProject: null,           href: "/sdk",                 icon: "🛠️" },
  { id: "eva-cli",          name: ["EVA CLI",              "ILC EVA"],                 category: "Developer",        adoProject: null,           href: "/cli",                 icon: "⌨️" },
  { id: "eva-devcontainer", name: ["EVA DevContainer",     "DevContainer EVA"],        category: "Developer",        adoProject: null,           href: "/devcontainer",        icon: "📦" },
  // Moonshot
  { id: "eva-agents",       name: ["EVA Agents",           "Agents EVA"],              category: "Moonshot",         adoProject: "agents",       href: "/agents",              icon: "🤖" },
  { id: "eva-foundry",      name: ["EVA Foundry",          "Fonderie EVA"],            category: "Moonshot",         adoProject: "foundry",      href: "/foundry",             icon: "🏭" },
  { id: "eva-copilot",      name: ["EVA Copilot",          "Copilote EVA"],            category: "Moonshot",         adoProject: null,           href: "/copilot",             icon: "🚀" },
];

const CATEGORIES = [
  "User Products",
  "AI Intelligence",
  "Platform",
  "Developer",
  "Moonshot",
] as const;

interface ProductTileGridProps {
  locale: Locale;
  sprintSummaries?: SprintSummary[];
  onProductClick?: (product: Product) => void;
}

export const ProductTileGrid: React.FC<ProductTileGridProps> = ({
  locale,
  sprintSummaries = [],
  onProductClick,
}) => {
  const summaryByProject = React.useMemo(() => {
    const map = new Map<string, SprintSummary>();
    for (const s of sprintSummaries) {
      map.set(s.project, s);
    }
    return map;
  }, [sprintSummaries]);

  return (
    <section className="eva-product-tile-grid" aria-label="EVA Products">
      {CATEGORIES.map((cat) => {
        const products = EVA_PRODUCTS.filter((p) => p.category === cat);
        return (
          <div key={cat} className="eva-category-section">
            <h2 className="eva-category-heading" style={{ fontSize: "1.1rem", margin: "24px 0 12px" }}>
              {cat}
            </h2>
            <div
              className="eva-tile-row"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              {products.map((p) => (
                <ProductTile
                  key={p.id}
                  product={p}
                  locale={locale}
                  sprintSummary={p.adoProject ? summaryByProject.get(p.adoProject) : undefined}
                  onClick={onProductClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ProductTileGrid;
