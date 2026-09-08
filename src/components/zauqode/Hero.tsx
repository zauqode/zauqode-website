import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

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
        <div className="space-y-2 flex flex-col items-center text-center w-full">
          {/* Headline Line 1 Mask */}
          <div className="overflow-hidden w-full flex justify-center text-center">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yParallaxSlow }}
              className="font-editorial text-4xl sm:text-7xl md:text-8xl tracking-tight text-[#FDFBF7] leading-[1.1] text-center w-full"
            >
              Solving problems,
            </motion.h1>
          </div>

          {/* Headline Line 2 Mask */}
          <div className="overflow-hidden w-full flex justify-center text-center">
            <motion.h1
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yParallaxFast }}
              className="font-editorial text-4xl sm:text-7xl md:text-8xl tracking-tight leading-[1.1] text-center w-full"
            >
              <span className="italic text-[#2DD4BF] inline-block text-center">with digital solutions.</span>
            </motion.h1>
          </div>
        </div>

        {/* 4. Subtext line-by-line stagger reveal */}
        <div className="max-w-2xl mx-auto text-sm sm:text-lg text-[#94A3B8] font-normal leading-relaxed pt-2 space-y-1.5 text-center flex flex-col items-center">
          <div className="overflow-hidden w-full text-center">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full"
            >
              Zauqode creates thoughtfully designed digital products
            </motion.p>
          </div>
          <div className="overflow-hidden w-full text-center">
            <motion.p
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full"
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
          <a
            href="#work"
            className="liquid-glass-dark px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            Explore My Work
          </a>

          <a
            href="#contact"
            className="liquid-glass px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#FDFBF7] shadow-lg hover:scale-[1.03] transition-all duration-300"
          >
            Start a Project
          </a>

        </motion.div>
      </div>
    </section>
  );
}
