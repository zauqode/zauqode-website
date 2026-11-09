import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const principles = [
  {
    title: "Typography as Architecture",
    text: "We treat letterforms, scale, and negative space as the foundational pillars of visual emotion and clarity.",
  },
  {
    title: "Quiet Digital Luxury",
    text: "Avoiding decorative noise in favor of intentional composition, warm palettes, and tactile rhythm.",
  },
  {
    title: "Disciplined Craft",
    text: "A deliberate, limited commission schedule allowing dedicated care for each celebration and brand.",
  },
];

export function AboutMe() {
  return (
    <section id="about" className="py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-16 hairline-b">
        <div>
          <span className="text-xs text-[#0E8F91] font-semibold block mb-2">
            Studio &amp; philosophy
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#0E4847] leading-none">
            About Zauqode
          </h2>
        </div>

        <p className="text-sm sm:text-base text-[#0E4847]/70 font-sans max-w-md font-light">
          An independent creative studio working globally with discerning couples, founders, and cultural brands.
        </p>
      </div>

      {/* Main Philosophy Content */}
      <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Editorial Big Quote / Rationale (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <p className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#0E4847] leading-snug font-normal">
            "Design stripped of noise. Crafted with intention, warmth, and enduring taste."
          </p>

          <p className="text-sm sm:text-base text-[#0E4847]/80 font-sans leading-relaxed font-light">
            Zauqode was established on the conviction that digital experiences should feel as tactile, intimate, and memorable as fine physical stationery.
          </p>

          <p className="text-sm sm:text-base text-[#0E4847]/80 font-sans leading-relaxed font-light">
            Whether articulating a once-in-a-lifetime wedding weekend or elevating an architectural practice, we prioritize restraint, editorial proportion, and human connection over algorithmic trends.
          </p>

          <div className="pt-4">
            <span className="text-xs text-[#C9A66B] font-semibold block">
              Direct collaboration &bull; Worldwide service
            </span>
          </div>
        </div>

        {/* Studio Principles (5 cols) */}
        <div className="lg:col-span-5 space-y-8 lg:pl-6 lg:border-l lg:border-[#0E4847]/10">
          <span className="text-xs text-[#0E8F91] font-semibold block">
            Guiding principles
          </span>

          <div className="space-y-6">
            {principles.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E8F91]" />
                  <h3 className="font-editorial text-xl sm:text-2xl text-[#0E4847] font-normal">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light pl-3.5">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="pt-4">
            <a href="#contact" className="editorial-link">
              <span>Discuss a Commission</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
