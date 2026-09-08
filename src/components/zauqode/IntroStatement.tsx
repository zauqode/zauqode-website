import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = start + (1 / total);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [12, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-3">
      {word}
    </motion.span>
  );
}

export function IntroStatement() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const statement = "Good design isn't just how it looks. It's how it makes people feel.";
  const words = statement.split(" ");

  return (
    <section id="about" ref={containerRef} className="py-24 sm:py-36 px-6 max-w-5xl mx-auto select-none">
      <div className="space-y-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
          PHILOSOPHY & VISION
        </span>

        {/* Scroll word opacity reveal */}
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-[#FDFBF7] leading-[1.15] max-w-4xl mx-auto">
          {words.map((word, i) => (
            <Word key={i} word={word} index={i} total={words.length} progress={scrollYProgress} />
          ))}
        </h2>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#94A3B8] leading-relaxed pt-6">
          Zauqode is a creative digital studio crafting bespoke, high-performance websites for forward-thinking brands, visionary businesses, and personal celebrations.
        </p>
      </div>
    </section>
  );
}

