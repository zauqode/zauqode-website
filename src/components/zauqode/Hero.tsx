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
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 backdrop-blur-md px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2DD4BF] shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          FREELANCE DIGITAL STUDIO
        </motion.div>

        {/* 2 & 3. Word-by-Word Stagger Reveal Headline with Scroll Parallax */}
        <motion.div style={{ y: yParallaxSlow }} className="space-y-2 text-center max-w-4xl mx-auto">
          <h1 className="font-editorial text-4xl sm:text-7xl md:text-8xl tracking-tight text-[#FDFBF7] leading-[1.15] text-center flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1">
            {["Solving", "problems,"].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.65 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div style={{ y: yParallaxFast }} className="space-y-2 text-center max-w-4xl mx-auto">
          <h1 className="font-editorial text-4xl sm:text-7xl md:text-8xl tracking-tight text-[#2DD4BF] leading-[1.15] italic text-center flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-1">
            {["with", "digital", "solutions."].map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </motion.div>

        {/* 4. Subtext Word Stagger Reveal */}
        <div className="max-w-2xl mx-auto text-sm sm:text-lg text-[#94A3B8] font-normal leading-relaxed pt-2 text-center flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
          {["Zauqode", "creates", "thoughtfully", "designed", "digital", "products", "and", "websites", "that", "solve", "real", "business", "challenges."].map((word, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.25 + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </div>

        {/* 5. Dual Magnetic CTA Buttons stagger reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
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
