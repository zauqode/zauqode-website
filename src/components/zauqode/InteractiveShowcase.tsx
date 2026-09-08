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
    <section ref={containerRef} className="py-24 sm:py-36 px-6 relative overflow-hidden select-none bg-[#050505] border-y border-[#14B8A6]/15">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#14B8A6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center space-y-4 mb-16 relative z-10">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
          INTERACTIVE SIGNATURE MOMENT
        </span>
        <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7]">
          Designed to be experienced<span className="text-[#2DD4BF]">.</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#94A3B8]">
          As you scroll, code, design, and liquid interaction align into visual harmony.
        </p>
      </div>

      {/* Floating Interactive Browser Fragments Composition */}
      <div className="relative max-w-5xl mx-auto h-[450px] sm:h-[550px] flex items-center justify-center relative z-10">
        
        {/* Fragment 1: Left Design Spec Window */}
        <motion.div
          style={{
            x: translateXLeft,
            rotate: rotateLeft,
          }}
          className="absolute left-4 sm:left-12 top-12 w-64 sm:w-80 rounded-2xl p-5 shadow-2xl border border-[#14B8A6]/20 bg-[#0F172A]/80 backdrop-blur-xl hidden sm:block z-10"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
            <span className="text-[10px] font-mono text-[#94A3B8] ml-auto">design-system.ts</span>
          </div>
          <div className="space-y-3 font-mono text-[11px] text-[#2DD4BF]">
            <p><span className="text-[#F59E0B]">const</span> glassRefraction = 1.45;</p>
            <p><span className="text-[#F59E0B]">const</span> easingCurve = <span className="text-[#94A3B8]">"cubic-bezier(0.16, 1, 0.3, 1)"</span>;</p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#2DD4BF]" />
            </div>
          </div>
        </motion.div>

        {/* Fragment 2: Center Main Harmonized Canvas */}
        <motion.div
          style={{
            scale: scaleCenter,
          }}
          className="rounded-3xl p-8 sm:p-12 shadow-[0_20px_50px_rgba(20,184,166,0.15)] border border-[#2DD4BF]/40 z-20 max-w-xl w-full text-center space-y-6 bg-[#0F172A]/90 backdrop-blur-2xl"
        >
          <img
            src={zauqodeLogo}
            alt="Zauqode Emblem"
            className="h-12 w-auto mx-auto drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]"
          />

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-center">
              <span className="block text-xs font-bold text-[#2DD4BF]">DESIGN</span>
              <span className="text-[10px] text-[#94A3B8]">Tasteful UI</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-[#2DD4BF]/40 text-center shadow-sm">
              <span className="block text-xs font-bold text-[#FDFBF7]">CODE</span>
              <span className="text-[10px] text-[#94A3B8]">Fluid Motion</span>
            </div>
            <div className="p-3 rounded-xl bg-[#14B8A6]/10 border border-[#14B8A6]/30 text-center">
              <span className="block text-xs font-bold text-[#2DD4BF]">EXPERIENCE</span>
              <span className="text-[10px] text-[#94A3B8]">Liquid Glass</span>
            </div>
          </div>

          <p className="text-[#94A3B8] italic font-editorial text-lg text-[#FDFBF7]">
            "Where taste meets digital."
          </p>
        </motion.div>

        {/* Fragment 3: Right UI Metric Panel */}
        <motion.div
          style={{
            x: translateXRight,
            rotate: rotateRight,
          }}
          className="absolute right-4 sm:right-12 bottom-12 w-64 sm:w-80 rounded-2xl p-5 shadow-2xl border border-[#2DD4BF]/30 bg-[#0F172A]/80 backdrop-blur-xl hidden sm:block z-10"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <span className="text-xs font-bold text-[#FDFBF7]">PERFORMANCE</span>
            <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#14B8A6]/20 px-2 py-0.5 rounded-full border border-[#14B8A6]/30">60 FPS</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#94A3B8]">
              <span>Responsiveness</span>
              <span className="font-bold text-[#2DD4BF]">100%</span>
            </div>
            <div className="flex justify-between text-xs text-[#94A3B8]">
              <span>Aesthetic Fidelity</span>
              <span className="font-bold text-[#FDFBF7]">Ultra-Premium</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

