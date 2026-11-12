import React, { useRef, useState } from "react";
import { ArrowIcon } from "@/components/zauqode-home/ArrowIcon";
import { getOptimizedThumbSources, type WorkItem } from "./portfolioData";

interface PortfolioCardProps {
  item: WorkItem;
  variant: "home" | "catalogue";
  onSelect: (item: WorkItem) => void;
}

function getPreviewCue(item: WorkItem): string {
  if (item.category === "videos" || item.videoUrl) return "Motion Reel";
  if (item.category === "invitations") return "Full Suite";
  if (item.category === "stalls") return "Board View";
  if (item.canIframe) return "Live Preview";
  return "View Work";
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

  const previewCue = getPreviewCue(item);
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
          ? "w-[228px] shrink-0 snap-start sm:w-auto showcase-card group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]"
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

      {/* Bottom Editorial Ivory Caption Band */}
      <div className="flex-1 flex flex-col justify-between gap-2 p-3 sm:p-4 bg-white border-t border-[#d4a55a]/30 text-left">
        <div className="space-y-1">
          <span className="block font-ui font-semibold text-[10px] sm:text-[10.5px] tracking-[0.14em] uppercase text-[#785212] truncate">
            {item.label}
          </span>

          <h3 className="font-heading text-[16px] sm:text-[19px] text-[#005a55] leading-snug line-clamp-1">
            {item.name}
          </h3>

          <p className="font-body text-[11.5px] sm:text-[13px] text-[#0d3b38]/85 font-normal leading-snug line-clamp-2">
            {item.sub}
          </p>
        </div>

        <div className="pt-2 border-t border-[#d4a55a]/20 flex items-center justify-between text-[#005a55]">
          <span className="font-ui font-semibold text-[10.5px] sm:text-[11px] tracking-[0.14em] uppercase group-hover:text-[#785212] transition-colors">
            {previewCue}
          </span>
          <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#785212]">
            <ArrowIcon direction="up-right" />
          </span>
        </div>
      </div>
    </article>
  );
}
