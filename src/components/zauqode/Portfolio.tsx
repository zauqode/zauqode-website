import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import thriveMockup from "../../assets/thrive-mockup.png";
import zaraMockup from "../../assets/zara-mockup.png";
import bizMockup from "../../assets/biz-mockup.jpg";
import portfolioMockup from "../../assets/portfolio-mockup.jpg";

const WHATSAPP_RAW = "918946077234";

export interface Project {
  id: string;
  number: string;
  total: string;
  title: string;
  category: string;
  desc: string;
  image: string;
  client: string;
  link: string;
  isLive: boolean;
}

const projects: Project[] = [
  {
    id: "thrive-properties",
    number: "01",
    total: "04",
    title: "Thrive Properties",
    category: "REAL ESTATE & ARCHITECTURE",
    desc: "Interactive luxury property portal with high-speed search and frictionless lead capture.",
    image: thriveMockup,
    client: "Real Estate Business",
    link: "https://thriveproperties.vercel.app/",
    isLive: true,
  },
  {
    id: "zara-invitation",
    number: "02",
    total: "04",
    title: "Zara Celebration",
    category: "DIGITAL EVENT EXPERIENCE",
    desc: "Luxury celebration platform with bespoke background audio, animated RSVP, and mobile storytelling.",
    image: zaraMockup,
    client: "Celebration Client",
    link: "https://zara-invitation-website.vercel.app/",
    isLive: true,
  },
  {
    id: "business-studio",
    number: "03",
    total: "04",
    title: "Business Studio",
    category: "CORPORATE & WHOLESALE",
    desc: "Clean corporate showcase built for wholesale distributors and commercial enterprises.",
    image: bizMockup,
    client: "Commercial Client",
    link: `https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20inquire%20about%20a%20Business%20Website`,
    isLive: false,
  },
  {
    id: "creator-portfolio",
    number: "04",
    total: "04",
    title: "Creator Portfolio",
    category: "PERSONAL BRAND & AGENCY",
    desc: "High-impact visual platform designed for creative professionals to build digital authority.",
    image: portfolioMockup,
    client: "Creative Professional",
    link: `https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20inquire%20about%20a%20Portfolio%20Website`,
    isLive: false,
  },
];

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Touch Swipe State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Touch Handlers for Mobile Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
    setDragX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    // Rubber-band damping if swiping past bounds
    setDragX(diff);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const threshold = 60; // 60px swipe threshold
    if (dragX < -threshold) {
      nextCard();
    } else if (dragX > threshold) {
      prevCard();
    }
    setTouchStartX(null);
    setDragX(0);
    setIsDragging(false);
  };

  // Stack Positioning Algorithm
  const getCardStyle = (index: number) => {
    const offset = (index - activeIndex + projects.length) % projects.length;

    if (isMobile) {
      // Mobile: Show only 1 peeking card behind active card
      if (offset === 0) {
        const dragTranslate = isDragging ? dragX : 0;
        const dragScale = isDragging ? 0.98 : 1;
        return {
          transform: `translateX(${dragTranslate}px) scale(${dragScale})`,
          zIndex: 30,
          opacity: 1,
          pointerEvents: "auto" as const,
          boxShadow: "0 20px 40px -10px rgba(13, 38, 38, 0.18), 0 0 0 1px rgba(13, 148, 136, 0.25)",
          transition: isDragging ? "none" : "transform 0.35s ease-out, opacity 0.35s ease-out, box-shadow 0.35s ease-out",
        };
      } else if (offset === 1) {
        return {
          transform: "translateX(16px) scale(0.95)",
          zIndex: 20,
          opacity: 0.65,
          pointerEvents: "auto" as const,
          boxShadow: "0 10px 25px -8px rgba(13, 38, 38, 0.1)",
          transition: "transform 0.35s ease-out, opacity 0.35s ease-out, box-shadow 0.35s ease-out",
        };
      } else {
        return {
          transform: "translateX(24px) scale(0.90)",
          zIndex: 5,
          opacity: 0,
          pointerEvents: "none" as const,
          transition: "transform 0.35s ease-out, opacity 0.35s ease-out",
        };
      }
    }

    // Desktop: Layered stacked cards peeking to the right
    if (offset === 0) {
      return {
        transform: "translateX(0px) scale(1)",
        zIndex: 30,
        opacity: 1,
        pointerEvents: "auto" as const,
        boxShadow: "0 25px 50px -12px rgba(13, 38, 38, 0.18), 0 0 0 1px rgba(13, 148, 136, 0.3)",
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, box-shadow 0.45s ease",
      };
    } else if (offset === 1) {
      return {
        transform: "translateX(54px) scale(0.94)",
        zIndex: 20,
        opacity: 0.85,
        pointerEvents: "auto" as const,
        cursor: "pointer",
        boxShadow: "0 15px 30px -8px rgba(13, 38, 38, 0.12), 0 0 0 1px rgba(13, 148, 136, 0.15)",
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, box-shadow 0.45s ease",
      };
    } else if (offset === 2) {
      return {
        transform: "translateX(108px) scale(0.88)",
        zIndex: 10,
        opacity: 0.6,
        pointerEvents: "auto" as const,
        cursor: "pointer",
        boxShadow: "0 10px 20px -6px rgba(13, 38, 38, 0.08)",
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, box-shadow 0.45s ease",
      };
    } else {
      return {
        transform: "translateX(154px) scale(0.82)",
        zIndex: 5,
        opacity: 0.35,
        pointerEvents: "auto" as const,
        cursor: "pointer",
        transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease",
      };
    }
  };

  return (
    <section id="work" className="relative py-8 sm:py-10 lg:py-12 overflow-hidden text-[#0D2626]">
      {/* Ambient background blobs */}
      <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-24 w-[500px] h-[500px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 max-w-7xl mx-auto mb-6 sm:mb-8"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">Selected Portfolio</span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2 border-b border-[#0D9488]/15 pb-4">
          <div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#0D2626]">
              Selected work<span className="text-[#0D9488]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#3D6060] mt-1">
              Click any peeking card or swipe to cycle projects
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#0D9488] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Stacked Cards</span>
          </div>
        </div>
      </motion.div>

      {/* Stacked Cards Stage */}
      <div className="px-5 sm:px-8 max-w-5xl mx-auto">
        <div
          ref={cardContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full h-[470px] sm:h-[510px] md:h-[530px]"
        >
          {projects.map((proj, idx) => {
            const offset = (idx - activeIndex + projects.length) % projects.length;
            const isFront = offset === 0;
            const cardStyle = getCardStyle(idx);

            return (
              <div
                key={proj.id}
                onClick={() => {
                  if (!isFront) {
                    setActiveIndex(idx);
                  }
                }}
                style={cardStyle}
                className={`absolute top-0 left-0 rounded-3xl bg-white/95 backdrop-blur-xl border border-[#0D9488]/20 flex flex-col justify-between overflow-hidden select-none origin-left ${
                  isMobile
                    ? "w-[calc(100%-18px)]"
                    : "w-[calc(100%-165px)] max-w-[760px]"
                }`}
              >
                {/* Project Image Header */}
                <div className="relative w-full h-[240px] sm:h-[280px] md:h-[300px] overflow-hidden bg-[#0D2626]/5">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    draggable={false}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-102"
                  />

                  {/* Gradient sheen overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />

                  {/* Status Badge (Top-Left) */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#0D2626]/85 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {proj.isLive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>LIVE SITE</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                        <span>SHOWCASE</span>
                      </>
                    )}
                  </div>

                  {/* Numbered Badge (Top-Right e.g. 01/04) */}
                  <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md text-[#0D9488] font-numeric px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-tight shadow-sm">
                    {proj.number}/{proj.total}
                  </div>
                </div>

                {/* Card Content (Strictly Minimal) */}
                <div className="p-4 sm:p-6 flex flex-col justify-between flex-1 bg-white/95">
                  <div>
                    {/* Category Tag */}
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-1">
                      {proj.category}
                    </p>

                    {/* Project Title (One line) */}
                    <h3 className="font-editorial text-xl sm:text-2xl md:text-3xl font-bold text-[#0D2626] leading-tight truncate mb-1.5">
                      {proj.title}
                    </h3>

                    {/* One-Line Description */}
                    <p className="text-xs sm:text-sm text-[#3D6060] leading-relaxed line-clamp-1">
                      {proj.desc}
                    </p>
                  </div>

                  {/* Footer Row: Client Tag + VIEW LIVE PROJECT Button */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#0D9488]/10 mt-2">
                    <span className="text-[10px] sm:text-xs text-[#3D6060]/70 uppercase tracking-wider font-medium truncate">
                      Client: {proj.client}
                    </span>

                    {/* VIEW LIVE PROJECT Button (Min 44x44px touch target) */}
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        // Stop propagation so clicking the button doesn't trigger card selection handler
                        e.stopPropagation();
                      }}
                      className="inline-flex items-center justify-center gap-1.5 liquid-glass-dark text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 min-h-[44px] min-w-[44px] whitespace-nowrap"
                    >
                      <span>{proj.isLive ? "VIEW LIVE PROJECT" : "INQUIRE SIMILAR"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Controls & Dot Indicators */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 pt-2">
          {/* Previous Arrow Button (Min 44x44px target) */}
          <button
            type="button"
            onClick={prevCard}
            aria-label="Previous Project"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-[#0D9488]/20 bg-white/70 backdrop-blur-md text-[#0D2626] hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-2">
            {projects.map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to project ${i + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer h-2 ${
                    isActive
                      ? "w-6 bg-[#0D9488]"
                      : "w-2 bg-[#0D9488]/30 hover:bg-[#0D9488]/60"
                  }`}
                />
              );
            })}
          </div>

          {/* Next Arrow Button (Min 44x44px target) */}
          <button
            type="button"
            onClick={nextCard}
            aria-label="Next Project"
            className="flex items-center justify-center w-11 h-11 rounded-full border border-[#0D9488]/20 bg-white/70 backdrop-blur-md text-[#0D2626] hover:bg-[#0D9488] hover:text-white hover:border-[#0D9488] transition-all duration-200 shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
