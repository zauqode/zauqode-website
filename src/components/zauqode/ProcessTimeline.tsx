import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { Compass, Palette, Code2, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    name: "Discover",
    desc: "Unearthing your goals, audience, and visual aesthetic through focused consultation.",
    icon: Compass,
  },
  {
    num: "02",
    name: "Design",
    desc: "Crafting bespoke visual directions, editorial typography, and high-fidelity layouts.",
    icon: Palette,
  },
  {
    num: "03",
    name: "Build",
    desc: "Engineering clean, responsive code with fluid 60fps animations.",
    icon: Code2,
  },
  {
    num: "04",
    name: "Refine",
    desc: "Fine-tuning easing curves, micro-interactions, and cross-device performance.",
    icon: SlidersHorizontal,
  },
  {
    num: "05",
    name: "Launch",
    desc: "Seamless live deployment, domain setup, audit, and ongoing guidance.",
    icon: Rocket,
  },
];

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "center 45%"],
  });

  // Animated connector line draws from left to right as user scrolls into view
  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const orbLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Dynamically activate steps as the line draws across them
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (hoveredIdx === null) {
      const computed = Math.min(4, Math.max(0, Math.floor(progress * 5)));
      setActiveIdx(computed);
    }
  });

  const currentIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-8 sm:py-10 lg:py-12 px-6 max-w-7xl mx-auto overflow-hidden text-[#0D2626]"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-2 mb-8 sm:mb-12"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">
          Methodology
        </span>
        <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-[#0D2626]">
          From idea to experience<span className="text-[#0D9488]">.</span>
        </h2>
        <p className="max-w-md mx-auto text-xs sm:text-sm text-[#3D6060]">
          Connected by a clear, intentional flow. Hover or tap each step to explore.
        </p>
      </motion.div>

      {/* Animated Connector Line — NO CARDS AT ALL */}
      <div className="relative max-w-5xl mx-auto">
        {/* Continuous Horizontal Connector Line (running through center of circles) */}
        <div className="absolute top-5 sm:top-8 md:top-10 left-[8%] right-[8%] -translate-y-1/2 h-[2px] pointer-events-none z-0">
          {/* Subtle background track */}
          <div className="absolute inset-0 bg-[#0D9488]/20 rounded-full" />

          {/* Animated line that draws from left to right on scroll */}
          <motion.div
            style={{ scaleX: lineScaleX, transformOrigin: "left" }}
            className="absolute inset-0 bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#0D9488] rounded-full shadow-[0_0_8px_rgba(13,148,136,0.5)]"
          />

          {/* Traveling glowing pulse orb at the head of the drawn line */}
          <motion.div
            style={{ left: orbLeft }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white border-2 border-[#0D9488] shadow-[0_0_10px_rgba(13,148,136,0.9)]"
          />
        </div>

        {/* 5 Icons in Circles Grid (Fluid across all screen sizes, NO scrollbar) */}
        <div className="grid grid-cols-5 relative z-10 gap-0.5 sm:gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = currentIdx === idx;
            const isPassed = activeIdx >= idx;

            return (
              <div
                key={step.num}
                className="flex flex-col items-center text-center px-0.5 sm:px-2 group cursor-pointer min-w-0"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setActiveIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveIdx(idx);
                  }
                }}
                aria-label={`Step ${step.num}: ${step.name}`}
              >
                {/* Icon in Circle with Gradient Royal Glow */}
                <div className="relative mb-2 sm:mb-4">
                  {/* Ambient Royal Glow Aura behind node */}
                  <div
                    className={`absolute -inset-1.5 sm:-inset-3 rounded-full blur-lg sm:blur-xl transition-opacity duration-500 pointer-events-none ${
                      isCurrent
                        ? "opacity-100 bg-gradient-to-tr from-[#0D9488]/70 via-[#14B8A6]/60 to-[#2DD4BF]/70 scale-125"
                        : isPassed
                        ? "opacity-50 group-hover:opacity-85 bg-gradient-to-tr from-[#0D9488]/40 to-[#14B8A6]/30"
                        : "opacity-25 group-hover:opacity-60 bg-gradient-to-tr from-[#0D9488]/30 to-[#99F6E4]/40"
                    }`}
                  />

                  {/* Outer active animated ring */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeStepRing"
                      className="absolute -inset-1.5 sm:-inset-2.5 rounded-full border-2 border-[#2DD4BF]/80 bg-[#0D9488]/15 animate-pulse pointer-events-none shadow-[0_0_15px_rgba(45,212,191,0.6)]"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Circular Node with Royal Gradient Background */}
                  <motion.div
                    animate={{
                      scale: isCurrent ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                      isCurrent
                        ? "text-white border-2 border-[#5EEAD4] shadow-[0_0_20px_rgba(20,184,166,0.6),inset_0_2px_4px_rgba(255,255,255,0.6)]"
                        : isPassed
                        ? "text-white border-2 border-[#2DD4BF]/50 shadow-[0_4px_16px_rgba(9,38,34,0.3),inset_0_1px_2px_rgba(255,255,255,0.35)]"
                        : "text-[#0D2626] border-2 border-[#0D9488]/35 shadow-[0_3px_12px_rgba(13,148,136,0.15),inset_0_1px_3px_#ffffff]"
                    }`}
                    style={{
                      background: isCurrent
                        ? "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 55%), linear-gradient(135deg, #14B8A6 0%, #0D9488 40%, #0F766E 75%, #0A4D48 100%)"
                        : isPassed
                        ? "radial-gradient(circle at 35% 25%, rgba(45,212,191,0.3) 0%, transparent 60%), linear-gradient(135deg, #115E59 0%, #0F4C47 45%, #082F2C 100%)"
                        : "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.9) 0%, transparent 60%), linear-gradient(135deg, #FFFFFF 0%, #F0FDF9 50%, #CCFBF1 100%)",
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-7 sm:h-7 stroke-[2] filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]" />
                  </motion.div>

                  {/* Step Number Tag with Royal Jewel Styling */}
                  <span
                    className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 text-[8px] sm:text-[10px] font-mono font-extrabold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-full border shadow-xs transition-all duration-300 ${
                      isCurrent
                        ? "bg-gradient-to-r from-[#0D2626] to-[#0D9488] text-[#5EEAD4] border-[#5EEAD4]"
                        : isPassed
                        ? "bg-gradient-to-r from-[#0D2626] to-[#0F766E] text-white border-[#2DD4BF]/60"
                        : "bg-white text-[#0D9488] border-[#0D9488]/40"
                    }`}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Title Below Icon */}
                <h3
                  className={`text-[10px] sm:text-sm md:text-base font-bold uppercase tracking-wider transition-colors duration-200 truncate max-w-full ${
                    isCurrent ? "text-[#0D9488]" : "text-[#0D2626]"
                  }`}
                >
                  {step.name}
                </h3>

                {/* Desktop Description (hidden on mobile, shown on tablet/desktop) */}
                <div className="hidden sm:flex mt-1 sm:mt-2 min-h-[50px] sm:min-h-[60px] items-start justify-center">
                  <motion.p
                    initial={false}
                    animate={{
                      opacity: isCurrent ? 1 : 0,
                      y: isCurrent ? 0 : 4,
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[10px] sm:text-xs text-[#3D6060] leading-relaxed max-w-[170px]"
                  >
                    {step.desc}
                  </motion.p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dedicated Active Step Detail Card */}
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="sm:hidden mt-6 text-center p-4 rounded-2xl liquid-glass-card border border-[#0D9488]/20 min-h-[80px] flex flex-col justify-center items-center shadow-xs"
        >
          <span className="text-[11px] font-bold text-[#0D9488] uppercase tracking-widest mb-1">
            Step {steps[currentIdx].num} • {steps[currentIdx].name}
          </span>
          <p className="text-xs text-[#3D6060] leading-relaxed max-w-xs mx-auto">
            {steps[currentIdx].desc}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
