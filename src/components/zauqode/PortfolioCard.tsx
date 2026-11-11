import React, { useRef, useState } from "react";
import { getOptimizedThumbSources, type WorkItem } from "./portfolioData";

interface PortfolioCardProps {
  item: WorkItem;
  variant: "home" | "catalogue";
  onSelect: (item: WorkItem) => void;
}

/**
 * Shared Portfolio Card using responsive <picture> (AVIF -> WebP -> JPEG/PNG)
 * with lazy decoding, zero-CLS aspect ratio container, and pointer-only GPU tilt.
 */
export function PortfolioCard({ item, variant, onSelect }: PortfolioCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const rafRef = useRef<number | null>(null);
  const sources = item.thumb ? getOptimizedThumbSources(item.thumb) : null;

  const isHome = variant === "home";
  const sizes = isHome
    ? "(max-width: 639px) 215px, (max-width: 1023px) 46vw, 240px"
    : "(max-width: 639px) 46vw, (max-width: 1023px) 45vw, 320px";

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
      card.style.transform = `rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateZ(6px)`;
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
          ? `w-[215px] shrink-0 snap-start sm:w-auto tilt-card-container card-teal ${item.theme || ""} relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]`
          : `tilt-card-container catalogue-card card-teal ${item.theme || ""} relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]`
      }
    >
      {item.thumb && !imgFailed && (
        <picture className="absolute inset-0 z-0 pointer-events-none block bg-[#002d2a]">
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
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            width={600}
            height={800}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        </picture>
      )}

      {item.thumb && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#002d2a]/90 via-[#003430]/65 to-[#002320]/95 z-0 transition-opacity duration-300 group-hover:opacity-90 pointer-events-none"
          aria-hidden="true"
        />
      )}

      <div className="card-inner-gold" />

      <div
        className={
          isHome
            ? "relative z-10 flex justify-between items-center text-[11px] sm:text-xs font-ui font-semibold tracking-wider sm:tracking-widest uppercase"
            : "relative z-10 flex justify-between items-center gap-1 text-[10.5px] sm:text-xs font-ui font-semibold tracking-wider sm:tracking-widest uppercase"
        }
      >
        <span className={`${isHome ? "" : "truncate "}${item.thumb ? "text-[#fff3d6]" : ""}`}>
          {item.label}
        </span>
        <span className={`text-[#edd08b]${isHome ? "" : " shrink-0"}`} aria-hidden="true">
          ✦
        </span>
      </div>

      <div className={`relative z-10 text-center my-auto${isHome ? "" : " px-1"}`}>
        <div
          className={`font-script ${
            isHome ? "text-2xl sm:text-3xl lg:text-4xl" : "text-[21px] sm:text-3xl lg:text-4xl"
          } leading-tight ${item.thumb ? "text-white drop-shadow-md" : ""}`}
        >
          {item.name}
        </div>
        <div
          className={`font-heading text-xs sm:text-sm mt-1 leading-snug ${
            isHome ? "" : "line-clamp-2 "
          }${item.thumb ? "text-[#fff3d6]" : "opacity-90"}`}
        >
          {item.sub}
        </div>
        <div className="inline-flex items-center justify-center mt-2.5 sm:mt-3 px-3 sm:px-4 py-1 rounded-full border border-[#d4a55a] bg-[#002d2a]/60 text-[#fff3d6] font-ui font-semibold text-[10.5px] sm:text-[11px] tracking-widest uppercase transition-all duration-300 group-hover:bg-[#d4a55a] group-hover:text-[#005a55]">
          Preview
        </div>
      </div>
    </article>
  );
}

