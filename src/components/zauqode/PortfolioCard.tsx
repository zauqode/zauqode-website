import React, { useRef, useState } from "react";
import { ArrowIcon } from "@/components/zauqode-home/ArrowIcon";
import { getOptimizedThumbSources, type WorkItem } from "./portfolioData";

interface PortfolioCardProps {
  item: WorkItem;
  variant: "home" | "catalogue";
  onSelect: (item: WorkItem) => void;
}

/**
 * Product-first Editorial Showcase Card:
 * Displays 100% unobstructed, full-color artwork above an ivory caption footer
 * so visitors immediately see every invitation and website at a glance.
 */
export function PortfolioCard({ item, variant, onSelect }: PortfolioCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const sources = item.thumb ? getOptimizedThumbSources(item.thumb) : null;

  const isHome = variant === "home";
  const sizes = isHome
    ? "(max-width: 639px) 228px, (max-width: 1023px) 46vw, 240px"
    : "(max-width: 639px) 46vw, (max-width: 1023px) 45vw, 320px";

  const isVideo = item.category === "videos" || !!item.videoUrl;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const card = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = window.requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      rafRef.current = null;
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    e.currentTarget.style.transform = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`Preview ${item.name} — ${item.label}`}
      className={
        isHome
          ? "w-[240px] sm:w-[280px] md:w-[310px] shrink-0 snap-start showcase-card group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]"
          : "showcase-card catalogue-card group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]"
      }
    >
      {/* Top Stage: 100% Bright, Unobstructed Product Artwork */}
      <div className="showcase-media relative w-full aspect-[4/4.2] shrink-0 overflow-hidden bg-[#eef8f3]">
        {item.thumb && !imgFailed ? (
          <picture className="block w-full h-full">
            {sources && (
              <>
                <source
                  type="image/avif"
                  srcSet={`${sources.avif400} 400w, ${sources.avif800} 800w`}
                  sizes={sizes}
                />
                <source
                  type="image/webp"
                  srcSet={`${sources.webp400} 400w, ${sources.webp800} 800w`}
                  sizes={sizes}
                />
              </>
            )}
            <img
              src={item.thumb}
              alt={`${item.name} — ${item.label}`}
              loading="lazy"
              decoding="async"
              width={600}
              height={630}
              onError={() => setImgFailed(true)}
              className="showcase-img w-full h-full object-cover object-top block"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#005a55] to-[#003430] flex items-center justify-center p-4 text-center">
            <span className="font-script text-2xl sm:text-3xl text-[#f3e3c0]">{item.name}</span>
          </div>
        )}

        {/* Multi-photo gallery indicator */}
        {item.galleryUrls && item.galleryUrls.length > 1 && !isVideo && (
          <span
            className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#021816]/80 backdrop-blur-xs border border-[#d4a55a]/60 text-[#f3e3c0] text-[10px] font-ui font-semibold flex items-center gap-1 shadow-md pointer-events-none"
            aria-label={`${item.galleryUrls.length} photos`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{item.galleryUrls.length}</span>
          </span>
        )}

        {/* Discreet corner play indicator only on video invitations */}
        {isVideo && (
          <span
            className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#021816]/80 border border-[#d4a55a]/80 text-[#f3e3c0] flex items-center justify-center shadow-md pointer-events-none"
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1.75L10.5 6L3 10.25V1.75Z" />
            </svg>
          </span>
        )}
      </div>

      {/* Minimal Caption Band: category eyebrow + name + arrow */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#d4a55a]/30 text-left flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block font-ui font-semibold text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase text-[#785212] truncate mb-0.5">
            {item.label}
          </span>
          <h3 className="font-heading text-[16px] sm:text-[19px] text-[#005a55] leading-snug line-clamp-1">
            {item.name}
          </h3>
        </div>
        <span
          className="shrink-0 mt-1 text-[#785212] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <ArrowIcon direction="up-right" />
        </span>
      </div>
    </article>
  );
}
