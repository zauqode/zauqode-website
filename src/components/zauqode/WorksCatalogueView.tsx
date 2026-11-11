import { useMemo } from "react";
import { PortfolioCard } from "./PortfolioCard";
import { PORTFOLIO_WORKS, type WorkItem } from "./portfolioData";

interface WorksCatalogueViewProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSelectWork: (item: WorkItem) => void;
}

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "websites", label: "Occasion Websites" },
  { id: "invitations", label: "Invitations" },
  { id: "stalls", label: "Stall Boards" },
  { id: "videos", label: "Video Invites" },
  { id: "business", label: "Business Websites" },
] as const;

/**
 * Lazy-loaded Portfolio Catalogue (#works) route section.
 */
export function WorksCatalogueView({
  activeFilter,
  onFilterChange,
  onSelectWork,
}: WorksCatalogueViewProps) {
  const categoryCounts = useMemo(
    () => ({
      all: PORTFOLIO_WORKS.length,
      websites: PORTFOLIO_WORKS.filter((w) => w.category === "websites").length,
      invitations: PORTFOLIO_WORKS.filter((w) => w.category === "invitations").length,
      stalls: PORTFOLIO_WORKS.filter((w) => w.category === "stalls").length,
      videos: PORTFOLIO_WORKS.filter((w) => w.category === "videos").length,
      business: PORTFOLIO_WORKS.filter((w) => w.category === "business").length,
    }),
    []
  );

  const filteredWorks = useMemo(
    () => PORTFOLIO_WORKS.filter((w) => activeFilter === "all" || w.category === activeFilter),
    [activeFilter]
  );

  return (
    <section className="pt-24 sm:pt-32 pb-16 px-3 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-10 w-full">
      <div className="text-center space-y-2 sm:space-y-3">
        <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
          Portfolio Catalogue
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#00756e] leading-snug">
          A collection of meaningful creations.
        </h1>
      </div>

      {/* Catalogue Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-2.5 max-w-full px-1">
          {FILTER_TABS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilterChange(f.id)}
              className={`min-h-[44px] font-ui font-semibold text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase px-4 py-2 rounded-full border transition-all inline-flex items-center gap-1.5 ${
                activeFilter === f.id
                  ? "bg-[#005a55] text-white border-[#005a55] shadow-sm"
                  : "border-[#b8893c]/60 text-[#0d3b38] hover:border-[#005a55] bg-white/80"
              }`}
            >
              <span>{f.label}</span>
              <span className="opacity-85 text-[10px] sm:text-[11px]">
                ({categoryCounts[f.id] ?? 0})
              </span>
            </button>
          ))}
        </div>

        <div className="text-center font-ui font-semibold text-[11px] tracking-[0.2em] uppercase text-[#785212]">
          Showing {filteredWorks.length} {filteredWorks.length === 1 ? "creation" : "creations"}
        </div>
      </div>

      {/* 2-Column Mobile / 3-Column Desktop Catalogue Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 w-full">
        {filteredWorks.map((item) => (
          <PortfolioCard
            key={item.id}
            item={item}
            variant="catalogue"
            onSelect={onSelectWork}
          />
        ))}
      </div>
    </section>
  );
}

