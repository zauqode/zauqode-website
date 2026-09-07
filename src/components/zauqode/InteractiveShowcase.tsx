import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

export function InteractiveShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Fragment scroll transforms
  const rotateLeft = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 0, 12]);
  const rotateRight = useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -14]);
  const translateXLeft = useTransform(scrollYProgress, [0, 0.5, 1], [-80, 0, 80]);
  const translateXRight = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80]);
  const scaleCenter = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.9, 1.05, 0.9]);

  return (
    <section ref={containerRef} className="py-24 sm:py-36 px-6 bg-[#E4F5EE]/40 relative overflow-hidden select-none border-y border-[#0F6B6B]/10">
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-16">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F6B6B]">
          INTERACTIVE SIGNATURE MOMENT
        </span>
        <h2 className="font-editorial text-4xl sm:text-6xl text-[#1C2524]">
          Designed to be experienced<span className="text-[#0F6B6B]">.</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#5F706C]">
          As you scroll, code, design, and liquid interaction align into visual harmony.
        </p>
      </div>

      {/* Floating Interactive Browser Fragments Composition */}
      <div className="relative max-w-5xl mx-auto h-[450px] sm:h-[550px] flex items-center justify-center">
        
        {/* Fragment 1: Left Design Spec Window */}
        <motion.div
          style={{
            x: translateXLeft,
            rotate: rotateLeft,
          }}
          className="absolute left-4 sm:left-12 top-12 w-64 sm:w-80 glass-card rounded-2xl p-5 shadow-2xl border-[#0F6B6B]/20 hidden sm:block z-10"
        >
          <div className="flex items-center gap-2 border-b border-[#0F6B6B]/10 pb-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#0F6B6B]/30" />
            <div className="w-3 h-3 rounded-full bg-[#BFE5D5]" />
            <div className="w-3 h-3 rounded-full bg-[#D9B36C]" />
            <span className="text-[10px] font-mono text-[#5F706C] ml-auto">design-system.ts</span>
          </div>
          <div className="space-y-3 font-mono text-[11px] text-[#0F6B6B]">
            <p><span className="text-[#D9B36C]">const</span> glassRefraction = 1.45;</p>
            <p><span className="text-[#D9B36C]">const</span> easingCurve = <span className="text-[#5F706C]">"cubic-bezier(0.16, 1, 0.3, 1)"</span>;</p>
            <div className="h-1.5 w-full bg-[#0F6B6B]/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#0F6B6B]" />
            </div>
          </div>
        </motion.div>

        {/* Fragment 2: Center Main Harmonized Canvas */}
        <motion.div
          style={{
            scale: scaleCenter,
          }}
          className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl border-[#D9B36C]/40 z-20 max-w-xl w-full text-center space-y-6 bg-[#FDFBF7]/90"
        >
          <img
            src={zauqodeLogo}
            alt="Zauqode Emblem"
            className="h-12 w-auto mx-auto drop-shadow-md"
          />

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-[#E4F5EE] border border-[#0F6B6B]/15 text-center">
              <span className="block text-xs font-bold text-[#0F6B6B]">DESIGN</span>
              <span className="text-[10px] text-[#5F706C]">Tasteful UI</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#D9B36C]/40 text-center shadow-sm">
              <span className="block text-xs font-bold text-[#D9B36C]">CODE</span>
              <span className="text-[10px] text-[#5F706C]">Fluid Motion</span>
            </div>
            <div className="p-3 rounded-xl bg-[#E4F5EE] border border-[#0F6B6B]/15 text-center">
              <span className="block text-xs font-bold text-[#0F6B6B]">EXPERIENCE</span>
              <span className="text-[10px] text-[#5F706C]">Liquid Glass</span>
            </div>
          </div>

          <p className="text-xs text-[#5F706C] italic font-editorial text-lg text-[#1C2524]">
            "Where taste meets digital."
          </p>
        </motion.div>

        {/* Fragment 3: Right UI Metric Panel */}
        <motion.div
          style={{
            x: translateXRight,
            rotate: rotateRight,
          }}
          className="absolute right-4 sm:right-12 bottom-12 w-64 sm:w-80 glass-card rounded-2xl p-5 shadow-2xl border-[#D9B36C]/30 hidden sm:block z-10"
        >
          <div className="flex items-center justify-between border-b border-[#0F6B6B]/10 pb-3 mb-3">
            <span className="text-xs font-bold text-[#1C2524]">PERFORMANCE</span>
            <span className="text-[10px] font-mono text-[#0F6B6B] bg-[#BFE5D5] px-2 py-0.5 rounded-full">60 FPS</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#5F706C]">
              <span>Responsiveness</span>
              <span className="font-bold text-[#0F6B6B]">100%</span>
            </div>
            <div className="flex justify-between text-xs text-[#5F706C]">
              <span>Aesthetic Fidelity</span>
              <span className="font-bold text-[#D9B36C]">Ultra-Premium</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
