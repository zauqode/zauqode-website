import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { MagneticButton } from "./MagneticButton";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms for headline lines as user scrolls down
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -35]);

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-36 pb-24 px-6 overflow-hidden select-none bg-[#050505] text-[#FDFBF7]"
    >

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl text-center space-y-8">
        
        {/* 1. Eyebrow badge stagger reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 backdrop-blur-md px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2DD4BF] shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          FREELANCE DIGITAL STUDIO
        </motion.div>

        {/* 2 & 3. Headline Mask/Clip Reveal with Scroll Parallax */}
        <div className="space-y-1">
          {/* Headline Line 1 Mask */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yParallaxSlow }}
              className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#FDFBF7] leading-[1.05]"
            >
              Solving problems,
            </motion.h1>
          </div>

          {/* Headline Line 2 Mask */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yParallaxFast }}
              className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05]"
            >
              <span className="italic text-[#2DD4BF]">with digital solutions.</span>
            </motion.h1>
          </div>
        </div>

        {/* 4. Subtext line-by-line stagger reveal */}
        <div className="max-w-2xl mx-auto text-base sm:text-lg text-[#94A3B8] font-normal leading-relaxed pt-2 space-y-1">
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Zauqode creates thoughtfully designed digital products
            </motion.p>
          </div>
          <div className="overflow-hidden">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            >
              and websites that solve real business challenges.
            </motion.p>
          </div>
        </div>

        {/* 5. Dual Magnetic CTA Buttons stagger reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <MagneticButton href="#work" variant="primary" className="px-8 py-4 text-xs">
            Explore My Work
          </MagneticButton>

          <MagneticButton href="#contact" variant="secondary" className="px-8 py-4 text-xs">
            Start a Project
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
