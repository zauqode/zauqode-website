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
    <section className="py-24 sm:py-36 px-6 max-w-4xl mx-auto text-center">
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0F6B6B]">
        KIND WORDS
      </span>

      <div className="relative min-h-[220px] flex items-center justify-center my-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <p className="font-editorial text-2xl sm:text-4xl text-[#1C2524] italic leading-snug">
              "{quotes[current].quote}"
            </p>
            <div>
              <h4 className="text-sm font-bold text-[#0F6B6B] uppercase tracking-wider">
                {quotes[current].author}
              </h4>
              <p className="text-xs text-[#5F706C]">{quotes[current].role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glass Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          data-cursor="button"
          className="glass-button-secondary rounded-full p-3 text-[#0F6B6B] hover:text-[#1C2524]"
          aria-label="Previous quote"
        >
          ←
        </button>
        <span className="text-xs font-mono text-[#5F706C]">
          0{current + 1} / 0{quotes.length}
        </span>
        <button
          onClick={next}
          data-cursor="button"
          className="glass-button-secondary rounded-full p-3 text-[#0F6B6B] hover:text-[#1C2524]"
          aria-label="Next quote"
        >
          →
        </button>
      </div>
    </section>
  );
}
