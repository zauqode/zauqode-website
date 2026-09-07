import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

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
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F6B6B]">
          ABOUT ZAUQODE
        </span>

        {/* Scroll word opacity reveal */}
        <h2 className="font-editorial text-4xl sm:text-6xl md:text-7xl text-[#1C2524] leading-[1.15] max-w-4xl mx-auto">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

            return (
              <motion.span key={i} style={{ opacity }} className="inline-block mr-3">
                {word}
              </motion.span>
            );
          })}
        </h2>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#5F706C] leading-relaxed pt-6">
          Zauqode is a creative freelance practice focused on crafting beautiful, thoughtful, and functional digital experiences.
        </p>
      </div>
    </section>
  );
}
