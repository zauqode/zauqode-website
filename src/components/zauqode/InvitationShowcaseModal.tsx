import { useState, useEffect } from "react";
import { ArrowIcon } from "@/components/zauqode-home/ArrowIcon";
import { getOptimizedThumbSources, type WorkItem } from "./portfolioData";

interface InvitationShowcaseModalProps {
  activeInv: WorkItem;
  activeIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

/**
 * Lazy-loaded full-screen responsive modal for invitations & stall boards.
 */
export function InvitationShowcaseModal({
  activeInv,
  activeIndex,
  totalCount,
  onPrev,
  onNext,
  onClose,
}: InvitationShowcaseModalProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const gallery =
    activeInv.galleryUrls && activeInv.galleryUrls.length > 0
      ? activeInv.galleryUrls
      : activeInv.thumb || activeInv.mobileImg
      ? [activeInv.thumb || activeInv.mobileImg]
      : [];

  useEffect(() => {
    setActiveImageIndex(0);
    setImgFailed(false);
  }, [activeInv.id]);

  const rawSrc = gallery[activeImageIndex] || activeInv.thumb || activeInv.mobileImg || "";
  const sources = rawSrc ? getOptimizedThumbSources(rawSrc) : null;

  const handlePrevCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (gallery.length <= 1) return;
    setImgFailed(false);
    setActiveImageIndex((i) => (i > 0 ? i - 1 : gallery.length - 1));
  };

  const handleNextCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (gallery.length <= 1) return;
    setImgFailed(false);
    setActiveImageIndex((i) => (i < gallery.length - 1 ? i + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#021816]/94 sm:bg-[#021816]/85 sm:backdrop-blur-md flex items-center justify-center p-2.5 sm:p-6 lg:p-8 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92dvh] bg-gradient-to-br from-[#041c19] via-[#021816] to-[#01100f] border border-[#d4a55a]/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(205,238,227,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 px-4 sm:px-8 py-3 border-b border-[#d4a55a]/20 bg-[#011412]/80 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 min-w-0">
            <span className="font-ui font-semibold text-[11px] sm:text-xs tracking-[0.14em] sm:tracking-[0.24em] uppercase text-[#ecd08b] truncate">
              {activeInv.category === "stalls"
                ? "Wedding Event Stall Board"
                : "Bespoke Invitation Suite"}
            </span>
            <span className="hidden sm:inline font-ui text-xs text-[#cdeee3]/50" aria-hidden="true">
              •
            </span>
            <span className="font-ui font-medium text-[11px] sm:text-xs tracking-[0.16em] text-[#cdeee3]/90 whitespace-nowrap tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onPrev}
              className="w-11 h-11 shrink-0 rounded-full border border-[#d4a55a]/45 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#ecd08b] flex items-center justify-center transition-all cursor-pointer text-sm"
              aria-label="Previous Invitation"
              title="Previous"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-11 h-11 shrink-0 rounded-full border border-[#d4a55a]/45 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#ecd08b] flex items-center justify-center transition-all cursor-pointer text-sm"
              aria-label="Next Invitation"
              title="Next"
            >
              <ArrowIcon direction="right" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 shrink-0 rounded-full border border-[#d4a55a]/45 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#ecd08b] flex items-center justify-center transition-all cursor-pointer text-sm sm:ml-1"
              aria-label="Close"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto md:overflow-hidden overscroll-contain">
          {/* Left Side: Full Invitation Artwork & Gallery Carousel */}
          <div className="w-full md:w-[52%] lg:w-[55%] shrink-0 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-[#010f0e]/60 relative group">
            <div className="relative w-full flex items-center justify-center">
              {!imgFailed && rawSrc ? (
                <picture className="flex items-center justify-center">
                  {sources && (
                    <>
                      <source
                        type="image/avif"
                        srcSet={`${sources.avif400} 400w, ${sources.avif800} 800w`}
                        sizes="(max-width: 767px) 88vw, 480px"
                      />
                      <source
                        type="image/webp"
                        srcSet={`${sources.webp400} 400w, ${sources.webp800} 800w`}
                        sizes="(max-width: 767px) 88vw, 480px"
                      />
                    </>
                  )}
                  <img
                    key={rawSrc}
                    src={rawSrc}
                    alt={`${activeInv.name} — Card ${activeImageIndex + 1}`}
                    loading="eager"
                    decoding="async"
                    width={768}
                    height={1024}
                    onError={() => setImgFailed(true)}
                    className="max-h-[40dvh] sm:max-h-[50vh] md:max-h-[64vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-[#d4a55a]/30 transition-transform duration-500 ease-out md:group-hover:scale-[1.02] select-none bg-[#03221f]"
                  />
                </picture>
              ) : (
                <div className="w-full max-w-sm aspect-[3/4] rounded-2xl border border-[#d4a55a]/30 bg-[#03221f] flex items-center justify-center p-6 text-center text-[#f3e3c0] font-script text-3xl">
                  {activeInv.name}
                </div>
              )}

              {/* Prev / Next Card buttons on image if multiple images */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#021816]/85 hover:bg-[#d4a55a] text-[#ecd08b] hover:text-[#005a55] border border-[#d4a55a]/50 flex items-center justify-center shadow-lg transition-all cursor-pointer z-10 text-xl font-light"
                    aria-label="Previous card in suite"
                    title="Previous card"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextCard}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#021816]/85 hover:bg-[#d4a55a] text-[#ecd08b] hover:text-[#005a55] border border-[#d4a55a]/50 flex items-center justify-center shadow-lg transition-all cursor-pointer z-10 text-xl font-light"
                    aria-label="Next card in suite"
                    title="Next card"
                  >
                    ›
                  </button>

                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#021816]/85 border border-[#d4a55a]/50 text-[#f3e3c0] font-ui text-[10.5px] font-semibold tracking-wider pointer-events-none shadow-md">
                    Card {activeImageIndex + 1} of {gallery.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip if multiple images */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 mt-3 sm:mt-4 overflow-x-auto max-w-full py-1 px-1 scrollbar-none">
                {gallery.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImgFailed(false);
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-11 h-13 sm:w-13 sm:h-15 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#d4a55a] ring-2 ring-[#d4a55a] scale-105 shadow-[0_0_12px_rgba(212,165,90,0.4)]"
                        : "border-[#d4a55a]/30 opacity-60 hover:opacity-100"
                    }`}
                    title={`View Card ${idx + 1}`}
                  >
                    <img src={url} alt={`Card thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: 3-Part Description */}
          <div className="w-full md:w-[48%] lg:w-[45%] shrink-0 md:shrink md:overflow-y-auto p-5 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#d4a55a]/20 bg-[#031816]/75 space-y-5 sm:space-y-6">
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-1.5 border-b border-[#d4a55a]/20 pb-3.5 sm:pb-4">
                <span className="block font-ui font-semibold text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#ecd08b]">
                  {activeInv.sub}
                </span>
                <h3 className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#f3e3c0] leading-tight">
                  {activeInv.name}
                </h3>
              </div>

              <div className="space-y-1.5">
                <span className="block font-ui font-semibold text-[11px] uppercase tracking-[0.18em] text-[#ecd08b]">
                  Design Story
                </span>
                <p className="font-body text-sm sm:text-base text-[#f3e3c0]/95 font-normal leading-relaxed border-l-2 border-[#d4a55a]/65 pl-3.5 italic">
                  "{activeInv.story}"
                </p>
              </div>

              {/* Occasion */}
              <div className="space-y-1.5 pt-1">
                <span className="block font-ui font-semibold text-[11px] uppercase tracking-[0.18em] text-[#ecd08b]">
                  Occasion
                </span>
                <p className="font-body text-sm sm:text-base text-[#f3e3c0] font-normal pl-0.5">
                  {activeInv.occasion || "Celebration"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#d4a55a]/20 space-y-2">
              <a
                href={`https://wa.me/918946077234?text=${encodeURIComponent(
                  `Hi Zauqode, I saw your "${activeInv.name}" ${activeInv.category === "stalls" ? "wedding stall board" : "bespoke invitation"} and would love to design something similar for my upcoming event.`
                )}`}
                target="_blank"
                rel="noreferrer"
                data-pixel-source="invitation_modal_booking"
                data-pixel-label={activeInv.name}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#d4a55a] hover:bg-[#b8893c] text-[#021816] font-ui text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_4px_25px_rgba(212,165,90,0.35)] transition-all cursor-pointer"
              >
                Book a similar design
              </a>
              <p className="text-xs text-center text-[#cdeee3]/90 font-body">
                Direct consultation with me via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

