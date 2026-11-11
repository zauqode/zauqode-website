import { useState, useEffect } from "react";
import type { ActiveMockupState } from "./portfolioData";

interface MobileMockupModalProps {
  activeMockup: ActiveMockupState;
  onClose: () => void;
}

/**
 * Lazy-loaded Android flagship frame modal for live iframe & video invitation previews.
 */
export function MobileMockupModal({ activeMockup, onClose }: MobileMockupModalProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [activeMockup.title, activeMockup.url, activeMockup.videoUrl]);

  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#041412]/94 sm:bg-[#041412]/85 sm:backdrop-blur-md flex items-center justify-center p-2 sm:p-3 overflow-y-auto transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-2 relative max-w-full my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-2 w-full max-w-[325px] sm:max-w-[365px] px-1.5 text-[#f3e3c0]">
          <span className="font-heading text-sm sm:text-base tracking-wide truncate">
            {activeMockup.title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 shrink-0 rounded-full border border-[#d4a55a] bg-white/10 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#ecd08b] flex items-center justify-center transition-all cursor-pointer text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Android Flagship Frame */}
        <div className="w-[325px] sm:w-[365px] max-w-[90vw] h-[640px] sm:h-[780px] max-h-[85dvh] sm:max-h-[89dvh] bg-[#09201e] rounded-[30px] sm:rounded-[36px] p-[8px] sm:p-[9px] shadow-[0_0_0_2.5px_#d4a55a,0_0_0_5px_#031412,0_30px_80px_-10px_rgba(0,0,0,0.85)] relative flex flex-col">
          <div className="flex-1 w-full h-full bg-white rounded-[23px] sm:rounded-[28px] overflow-hidden relative flex flex-col">
            {/* Android Status Bar with Center Punch-Hole Camera */}
            <div className="absolute top-0 inset-x-0 h-8 z-30 flex items-center justify-between px-4 sm:px-5 pointer-events-none text-[11px] font-medium text-neutral-900 bg-gradient-to-b from-white/95 via-white/80 to-transparent">
              <span>9:41</span>
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-35 border border-[#1a2c3f] flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#132437]" />
              </div>
              <span className="inline-flex items-center gap-1.5">
                <span>5G</span>
                <svg width="16" height="9" viewBox="0 0 18 10" fill="none" aria-hidden="true">
                  <rect
                    x="0.75"
                    y="1"
                    width="14.5"
                    height="8"
                    rx="1.8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <rect x="2.2" y="2.4" width="10.2" height="5.2" rx="0.8" fill="currentColor" />
                  <path
                    d="M16.5 3.3V6.7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            {/* Viewport */}
            <div
              className={`w-full h-full pt-8 pb-3 bg-[#041412] ${
                activeMockup.videoUrl || activeMockup.canIframe
                  ? "overflow-hidden flex items-center justify-center"
                  : "overflow-y-auto no-scrollbar block"
              }`}
            >
              {activeMockup.videoUrl ? (
                <video
                  src={activeMockup.videoUrl}
                  poster="/works/opt/vamsi-ritika-800.webp"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              ) : activeMockup.canIframe && activeMockup.url ? (
                <iframe
                  src={activeMockup.url}
                  className="w-full h-full border-0 bg-white"
                  allow="fullscreen"
                  loading="eager"
                  title={activeMockup.title}
                />
              ) : !imgFailed && activeMockup.mobileImg ? (
                <img
                  src={activeMockup.mobileImg}
                  alt={activeMockup.title}
                  loading="eager"
                  decoding="async"
                  onError={() => setImgFailed(true)}
                  className="w-full h-auto block"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-center text-[#f3e3c0] font-script text-3xl">
                  {activeMockup.title}
                </div>
              )}
            </div>

            {/* Android Gesture Navigation Pill */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-black/45 rounded-full z-35 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

