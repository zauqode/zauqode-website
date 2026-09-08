import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const quotes = [
  {
    quote: "Working with Zauqode transformed our online brand entirely. The site doesn't just look expensive — our clients constantly compliment how effortless it feels.",
    author: "Elena Rostova",
    role: "Founder, Aria Architects",
  },
  {
    quote: "Our wedding website felt like a piece of art. Guests were blown away by the liquid glass details and how easy it was to RSVP.",
    author: "Marcus & Evelyn",
    role: "California Estate Wedding",
  },
  {
    quote: "Zauqode understood my creative vision immediately. The editorial typography and smooth scroll motion set my portfolio apart.",
    author: "Julian Vance",
    role: "Contemporary Artist & Curator",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % quotes.length);
  const prev = () => setCurrent((prev) => (prev - 1 + quotes.length) % quotes.length);

  return (
    <section className="py-24 sm:py-36 px-6 max-w-4xl mx-auto text-center bg-[#050505] text-[#FDFBF7]">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
        KIND WORDS & REVIEWS
      </span>

      <div className="relative min-h-[220px] flex items-center justify-center my-12 p-8 rounded-3xl bg-[#0F172A]/60 border border-[#2DD4BF]/20 backdrop-blur-xl shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-2xl"
          >
            <p className="font-editorial text-2xl sm:text-4xl text-[#FDFBF7] italic leading-snug">
              "{quotes[current].quote}"
            </p>
            <div>
              <h4 className="text-sm font-bold text-[#2DD4BF] uppercase tracking-wider">
                {quotes[current].author}
              </h4>
              <p className="text-xs text-[#94A3B8]">{quotes[current].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={prev}
          data-cursor="button"
          className="w-12 h-12 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#2DD4BF] hover:bg-[#14B8A6]/30 hover:scale-105 transition-all flex items-center justify-center font-bold text-lg"
          aria-label="Previous quote"
        >
          ←
        </button>
        <span className="text-xs font-mono text-[#94A3B8] tracking-widest">
          0{current + 1} / 0{quotes.length}
        </span>
        <button
          onClick={next}
          data-cursor="button"
          className="w-12 h-12 rounded-full border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#2DD4BF] hover:bg-[#14B8A6]/30 hover:scale-105 transition-all flex items-center justify-center font-bold text-lg"
          aria-label="Next quote"
        >
          →
        </button>
      </div>
    </section>
  );
}

